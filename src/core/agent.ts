import { ClineCore } from "@clinebot/sdk";
import type { ClineCoreStartInput } from "@clinebot/sdk";
import type { CoreSessionEvent } from "@clinebot/sdk";
import type { Config, RunResult, CheckoutInfo } from "../types.js";
import type { Verbosity } from "./output.js";
import { printProgress } from "./output.js";
import { getChangedFiles } from "./checkout.js";
import { createClarificationTool } from "./tools.js";

export interface AgentOptions {
  task: string;
  checkoutInfo: CheckoutInfo;
  config: Config;
  systemPrompt: string;
  verbosity: Verbosity;
}

export async function runAgent(opts: AgentOptions): Promise<RunResult> {
  const { task, checkoutInfo, config, systemPrompt, verbosity } = opts;
  const { workDir, branch, initialCommit } = checkoutInfo;

  const cline = await ClineCore.create({ clientName: "git-bot", backendMode: "local" });

  const clarificationCapture = { questions: null as RunResult["questions"] | null };
  let sessionId = "";

  const clarificationTool = createClarificationTool(clarificationCapture, () => {
    if (sessionId) cline.stop(sessionId).catch(() => {});
  });

  let completionText = "";
  let finishReason = "";

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
      extraTools: [clarificationTool],
      checkpoint: { enabled: false },
    },
    prompt: task,
  };

  const sessionResult = await cline.start(input);
  sessionId = sessionResult.sessionId;

  await new Promise<void>((resolve) => {
    const unsubscribe = cline.subscribe(
      (event: CoreSessionEvent) => {
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
      },
      { sessionId }
    );
  });

  await cline.dispose();

  if (clarificationCapture.questions) {
    return {
      status: "needs_clarification",
      branch: null,
      repoPath: workDir,
      summary: "",
      filesChanged: [],
      questions: clarificationCapture.questions,
      error: null,
    };
  }

  if (finishReason === "completed") {
    const filesChanged = getChangedFiles(workDir, initialCommit);
    return {
      status: "complete",
      branch,
      repoPath: workDir,
      summary: completionText,
      filesChanged,
      questions: [],
      error: null,
    };
  }

  return {
    status: "failed",
    branch: null,
    repoPath: workDir,
    summary: "",
    filesChanged: [],
    questions: [],
    error: `Agent finished with reason: ${finishReason || "unknown"}`,
  };
}
