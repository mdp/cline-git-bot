import { ClineCore } from "@clinebot/sdk";
import type { ClineCoreStartInput } from "@clinebot/sdk";
import type { CoreSessionEvent } from "@clinebot/sdk";
import type { Config, ReviewResult } from "../types.js";
import type { Verbosity } from "./output.js";
import { printProgress } from "./output.js";
import { createClarificationTool } from "./tools.js";

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

  const clarificationCapture: { questions: import("../types.js").Question[] | null } = { questions: null };
  let capturedSessionId = "";

  const clarificationTool = createClarificationTool(clarificationCapture, () => {
    if (capturedSessionId) cline.stop(capturedSessionId).catch(() => {});
  });

  let completionText = "";
  let finishReason = "";

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
        }
      }

      if (event.type === "ended") {
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
      enableTools: true,
      enableSpawnAgent: false,
      enableAgentTeams: false,
      yolo: true,
      extraTools: [clarificationTool],
      checkpoint: { enabled: false },
    },
    prompt: `Review the following diff:\n\n\`\`\`diff\n${diff}\n\`\`\``,
  };

  const sessionResult = await cline.start(input);
  capturedSessionId = sessionResult.sessionId;

  // sessionEnded is already resolved because all events fired during cline.start()
  await sessionEnded;
  await cline.dispose();

  if (finishReason !== "completed") {
    return {
      status: "failed",
      verdict: "comment",
      summary: "",
      comments: [],
      error: `Reviewer finished with reason: ${finishReason || "unknown"}`,
    };
  }

  return parseReviewOutput(completionText);
}

function parseReviewOutput(text: string): ReviewResult {
  // Try to parse a JSON block from the agent's output
  const jsonMatch = text.match(/```json\s*([\s\S]*?)```/) ?? text.match(/\{[\s\S]*"verdict"[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[1] ?? jsonMatch[0]);
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
      // fall through to text parsing
    }
  }

  // Heuristic verdict from text
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
