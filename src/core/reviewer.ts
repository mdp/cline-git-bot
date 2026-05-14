import { ClineCore } from "@clinebot/sdk";
import type { ClineCoreStartInput } from "@clinebot/sdk";
import type { CoreSessionEvent } from "@clinebot/sdk";
import type { Config, ReviewResult } from "../types.js";
import type { Verbosity } from "./output.js";
import { printProgress } from "./output.js";
import { createSubmitReviewTool } from "./tools.js";

export interface ReviewerOptions {
  workDir: string;
  systemPrompt: string;
  config: Config;
  verbosity: Verbosity;
}

export async function runReviewer(opts: ReviewerOptions): Promise<ReviewResult> {
  const { workDir, systemPrompt, config, verbosity } = opts;

  const cline = await ClineCore.create({ clientName: "git-bot-review", backendMode: "local" });

  const reviewCapture: { result: Omit<ReviewResult, "status" | "error"> | null } = { result: null };
  let capturedSessionId = "";

  const submitReviewTool = createSubmitReviewTool(reviewCapture, () => {
    if (capturedSessionId) cline.stop(capturedSessionId).catch(() => {});
  });

  let finishReason = "";
  let endedReason = "";
  let agentError: string | null = null;

  // Subscribe BEFORE cline.start() — all events fire during the start() call.
  const sessionEnded = new Promise<void>((resolve) => {
    const unsubscribe = cline.subscribe((event: CoreSessionEvent) => {
      printProgress(event, verbosity);

      if (event.type === "agent_event") {
        const agentEvent = event.payload.event;
        if (agentEvent.type === "done") {
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
  });

  const input: ClineCoreStartInput = {
    config: {
      ...config,
      systemPrompt,
      workspaceRoot: workDir,
      cwd: workDir,
      mode: "act",
      enableTools: true,
      enableSpawnAgent: false,
      enableAgentTeams: false,
      yolo: true,
      extraTools: [submitReviewTool],
      checkpoint: { enabled: false },
      compaction: { enabled: true, strategy: "agentic", contextWindowTokens: 180000 },
    },
    prompt: "Review this PR. When you have a complete picture, call submit_review.",
  };

  const sessionResult = await cline.start(input);
  capturedSessionId = sessionResult.sessionId;

  await sessionEnded;
  await cline.dispose();

  if (reviewCapture.result) {
    return {
      status: "complete",
      verdict: reviewCapture.result.verdict,
      summary: reviewCapture.result.summary,
      comments: reviewCapture.result.comments ?? [],
      error: null,
    };
  }

  const effectiveReason = finishReason || endedReason;
  const detail = agentError
    ? `${effectiveReason || "unknown"}: ${agentError}`
    : (effectiveReason || "unknown");

  return {
    status: "failed",
    verdict: "comment",
    summary: "",
    comments: [],
    error: `Reviewer finished without submitting a review. Reason: ${detail}`,
  };
}
