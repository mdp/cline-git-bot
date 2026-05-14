import { ClineCore } from "@clinebot/sdk";
import type { ClineCoreStartInput } from "@clinebot/sdk";
import type { CoreSessionEvent } from "@clinebot/sdk";
import type { Config, ReviewResult } from "../types.js";
import type { Verbosity } from "./output.js";
import { printProgress } from "./output.js";

export interface ReviewerOptions {
  diff: string;
  systemPrompt: string;
  workDir: string | null;
  config: Config;
  verbosity: Verbosity;
}

export async function runReviewer(opts: ReviewerOptions): Promise<ReviewResult> {
  const { diff, systemPrompt, workDir, config, verbosity } = opts;

  const cline = await ClineCore.create({ clientName: "git-bot-review", backendMode: "local" });

  let capturedSessionId = "";
  let completionText = "";
  let finishReason = "";
  let endedReason = "";
  let agentError: string | null = null;

  // Subscribe BEFORE cline.start() — startSession() internally awaits executeTurn(),
  // so all events (including "ended") fire during the start() call. Subscribing after
  // start() returns means we miss every event and the promise never resolves.
  const sessionEnded = new Promise<void>((resolve) => {
    const unsubscribe = cline.subscribe((event: CoreSessionEvent) => {
      printProgress(event, verbosity);

      if (event.type === "agent_event") {
        const agentEvent = event.payload.event;
        if (agentEvent.type === "done") {
          completionText = agentEvent.text;
          finishReason = agentEvent.reason;
        } else if (agentEvent.type === "error") {
          agentError = agentEvent.error?.message ?? String(agentEvent.error);
        }
      }

      if (event.type === "ended") {
        endedReason = event.payload.reason ?? "";
        unsubscribe();
        resolve();
      }
    });
    // No sessionId filter: we own this ClineCore instance and start exactly one session.
  });

  const input: ClineCoreStartInput = {
    config: {
      ...config,
      systemPrompt,
      workspaceRoot: workDir ?? process.cwd(),
      cwd: workDir ?? process.cwd(),
      mode: "plan",
      enableTools: false,
      enableSpawnAgent: false,
      enableAgentTeams: false,
      yolo: true,
      checkpoint: { enabled: false },
    },
    // System prompt ends with an open ```json fence; the model continues from there.
    // Send the diff without any output-format instructions — those are in the system prompt.
    prompt: `Review the following diff:\n\n${diff}`,
  };

  const sessionResult = await cline.start(input);
  capturedSessionId = sessionResult.sessionId;

  // sessionEnded is already resolved because all events fired during cline.start()
  await sessionEnded;
  await cline.dispose();

  // finishReason comes from the agent_event "done"; endedReason comes from the session
  // "ended" event. On API/model errors the done event may not fire, so fall back to
  // endedReason. Surface agentError when present for actionable diagnostics.
  const effectiveReason = finishReason || endedReason;
  if (effectiveReason !== "completed") {
    const detail = agentError
      ? `${effectiveReason || "unknown"}: ${agentError}`
      : (effectiveReason || "unknown");
    return {
      status: "failed",
      verdict: "comment",
      summary: "",
      comments: [],
      error: `Reviewer finished with reason: ${detail}`,
    };
  }

  return parseReviewOutput(completionText);
}

function parseReviewOutput(text: string): ReviewResult {
  // The system prompt ends with an open ```json fence, so the model's response
  // may start directly with the JSON object (no opening fence). Try candidates
  // in order of specificity.
  const candidates: string[] = [];

  // 1. Fenced block: ```json ... ```
  const fenced = text.match(/```json\s*([\s\S]*?)```/);
  if (fenced) candidates.push(fenced[1].trim());

  // 2. Bare JSON object containing "verdict" anywhere in the text
  const bare = text.match(/\{[\s\S]*"verdict"[\s\S]*\}/);
  if (bare) candidates.push(bare[0]);

  // 3. The whole text (model continued directly from the open fence)
  candidates.push(text.trim());

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      if (parsed.verdict && parsed.summary !== undefined) {
        return {
          status: "complete",
          verdict: parsed.verdict,
          summary: parsed.summary,
          comments: parsed.comments ?? [],
          error: null,
        };
      }
    } catch {
      // try next candidate
    }
  }

  // Heuristic fallback from plain text
  const lower = text.toLowerCase();
  let verdict: ReviewResult["verdict"] = "comment";
  if (lower.includes("approve") && !lower.includes("not approve") && !lower.includes("don't approve")) {
    verdict = "approve";
  } else if (lower.includes("request changes") || lower.includes("changes required")) {
    verdict = "request_changes";
  }

  return {
    status: "complete",
    verdict,
    summary: text.slice(0, 500),
    comments: [],
    error: null,
  };
}
