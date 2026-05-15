import { ClineCore } from "@clinebot/sdk";
import type { ClineCoreStartInput } from "@clinebot/sdk";
import type { CoreSessionEvent } from "@clinebot/sdk";
import type { Config, ReviewResult } from "../types.js";
import type { Verbosity } from "./output.js";
import { printProgress } from "./output.js";
import { createSubmitReviewTool } from "./tools.js";
import { buildReviewSystemPrompt, buildExtractionSystemPrompt, buildExtractionPrompt } from "./prompts.js";

export interface ReviewerOptions {
  workDir: string;
  prompt: string;
  config: Config;
  verbosity: Verbosity;
}

interface TurnResult {
  endedReason: string;
  finishReason: string;
  agentError: string | null;
  capturedText: string;
  capturedReasoning: string;
}

const TURN_TIMEOUT_MS = 12 * 60 * 1000;

function runTurn(
  cline: ClineCore,
  verbosity: Verbosity,
  action: () => Promise<void>,
  stopFn?: () => void,
): Promise<TurnResult> {
  let finishReason = "";
  let agentError: string | null = null;
  let capturedText = "";
  let capturedReasoning = "";
  let endedResolve!: (reason: string) => void;

  const ended = new Promise<string>((resolve) => { endedResolve = resolve; });

  const unsubscribe = cline.subscribe((event: CoreSessionEvent) => {
    printProgress(event, verbosity);
    if (event.type === "agent_event") {
      const e = event.payload.event as Record<string, unknown>;
      const t = e.type as string;
      if (t === "done") finishReason = e.reason as string;
      if (t === "error") {
        const err = e.error as Record<string, unknown> | Error | null;
        agentError = err instanceof Error ? err.message : (err && typeof err === "object" && "message" in err ? String(err.message) : JSON.stringify(err));
        if (e.recoverable === false) {
          unsubscribe();
          endedResolve("error");
          stopFn?.();
        }
      }
      if (t === "content_end" && e.contentType === "text" && typeof e.text === "string") {
        capturedText += e.text as string;
      }
      if (t === "content_end" && e.contentType === "reasoning" && typeof e.reasoning === "string") {
        capturedReasoning = e.reasoning as string;
      }
    }
    if (event.type === "ended") {
      unsubscribe();
      endedResolve((event.payload as Record<string, unknown>).reason as string ?? "");
    }
  });

  let timeoutId: ReturnType<typeof setTimeout>;

  const timeout = new Promise<TurnResult>((resolve) => {
    timeoutId = setTimeout(() => {
      unsubscribe();
      resolve({ endedReason: "timeout", finishReason, agentError: agentError ?? "Turn timed out", capturedText, capturedReasoning });
    }, TURN_TIMEOUT_MS);
  });

  const turn = action().then(async () => ({
    endedReason: await ended,
    finishReason,
    agentError,
    capturedText,
    capturedReasoning,
  }));

  return Promise.race([turn, timeout]).finally(() => { clearTimeout(timeoutId); unsubscribe(); });
}

export async function runReviewer(opts: ReviewerOptions): Promise<ReviewResult> {
  const { workDir, prompt, config, verbosity } = opts;

  const cline = await ClineCore.create({ clientName: "git-bot-review", backendMode: "local" });

  const reviewCapture: { result: Omit<ReviewResult, "status" | "error"> | null } = { result: null };
  let capturedSessionId = "";

  const submitReviewTool = createSubmitReviewTool(reviewCapture, () => {
    if (capturedSessionId) cline.stop(capturedSessionId).catch(() => {});
  });

  // ── Phase 1: exploration ──────────────────────────────────────────────────
  const phase1 = await runTurn(cline, verbosity, async () => {
    const session = await cline.start({
      config: {
        providerId: config.providerId,
        modelId: config.modelId,
        apiKey: config.apiKey,
        systemPrompt: buildReviewSystemPrompt(workDir),
        workspaceRoot: workDir,
        cwd: workDir,
        mode: "plan",
        enableTools: true,
        enableSpawnAgent: false,
        enableAgentTeams: false,
        yolo: true,
        reasoningEffort: "medium",
        maxIterations: 25,
        checkpoint: { enabled: false },
        compaction: { enabled: true, strategy: "agentic", contextWindowTokens: 262144 },
      } as Parameters<typeof cline.start>[0]["config"],
      prompt,
    } as ClineCoreStartInput);
    capturedSessionId = session.sessionId;
  });

  // Fall back to reasoning tokens if the model wrote its review there
  const reviewText = phase1.capturedText.trim() || phase1.capturedReasoning.trim();

  process.stderr.write(`[git-bot] phase1 done: endedReason=${phase1.endedReason} finishReason=${phase1.finishReason} error=${phase1.agentError} textLen=${phase1.capturedText.trim().length} reasoningLen=${phase1.capturedReasoning.trim().length}\n`);

  if (phase1.agentError || !reviewText) {
    await cline.dispose();
    const detail = phase1.agentError
      ? `${phase1.finishReason || phase1.endedReason || "unknown"}: ${phase1.agentError}`
      : "Agent completed without producing a review";
    return { status: "failed", verdict: "comment", effort: 3, security: false, has_tests: false, walkthrough: "", summary: "", comments: [], error: detail };
  }

  // ── Phase 2: extraction ───────────────────────────────────────────────────
  capturedSessionId = "";
  process.stderr.write(`[git-bot] starting phase2 extraction (reviewText length: ${reviewText.length})\n`);

  const phase2 = await runTurn(cline, verbosity, async () => {
    const session = await cline.start({
      config: {
        providerId: config.providerId,
        modelId: config.extractModelId,
        apiKey: config.apiKey,
        systemPrompt: buildExtractionSystemPrompt(),
        workspaceRoot: workDir,
        cwd: workDir,
        mode: "act",
        enableTools: false,
        enableSpawnAgent: false,
        enableAgentTeams: false,
        yolo: true,
        maxIterations: 2,
        extraTools: [submitReviewTool],
        checkpoint: { enabled: false },
      } as Parameters<typeof cline.start>[0]["config"],
      prompt: buildExtractionPrompt(reviewText),
    } as ClineCoreStartInput);
    capturedSessionId = session.sessionId;
  });

  process.stderr.write(`[git-bot] phase2 done: endedReason=${phase2.endedReason} finishReason=${phase2.finishReason} error=${phase2.agentError} captured=${reviewCapture.result !== null}\n`);

  await cline.dispose();

  if (reviewCapture.result) {
    return {
      status: "complete",
      verdict: reviewCapture.result.verdict,
      effort: reviewCapture.result.effort ?? 3,
      security: reviewCapture.result.security ?? false,
      has_tests: reviewCapture.result.has_tests ?? false,
      walkthrough: reviewCapture.result.walkthrough ?? "",
      summary: reviewCapture.result.summary,
      comments: reviewCapture.result.comments ?? [],
      error: null,
    };
  }

  const detail = phase2.agentError
    ? `${phase2.finishReason || phase2.endedReason || "unknown"}: ${phase2.agentError}`
    : (phase2.finishReason || phase2.endedReason || "Extraction phase did not call submit_review");

  return { status: "failed", verdict: "comment", effort: 3, security: false, has_tests: false, walkthrough: "", summary: "", comments: [], error: detail };
}
