import { readFileSync, existsSync } from "node:fs";
import { checkout, cleanup } from "../core/checkout.js";
import { buildRepoContext, buildPriorContext } from "../core/context.js";
import { runAgent } from "../core/agent.js";
import { buildRunSystemPrompt } from "../core/prompts.js";
import { printResult } from "../core/output.js";
import type { Verbosity } from "../core/output.js";
import { loadConfig } from "../types.js";

export interface RunOptions {
  repo: string;
  task?: string;
  context?: string;
  baseBranch?: string;
  cloneDepth: number;
  model?: string;
  keep: boolean;
  verbosity: Verbosity;
}

async function resolveTask(task?: string): Promise<string> {
  if (task) {
    if (existsSync(task)) {
      return readFileSync(task, "utf-8");
    }
    return task;
  }
  if (!process.stdin.isTTY) {
    return new Promise((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      process.stdin.on("data", (c: Uint8Array) => chunks.push(c));
      process.stdin.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
      process.stdin.on("error", reject);
    });
  }
  throw new Error("No task provided. Use --task or pipe via stdin.");
}

export async function runCommand(opts: RunOptions): Promise<void> {
  const config = loadConfig(opts.model);
  const taskText = await resolveTask(opts.task);
  const priorContext = opts.context ? buildPriorContext(opts.context) : "";

  const checkoutInfo = await checkout({
    repo: opts.repo,
    baseBranch: opts.baseBranch,
    cloneDepth: opts.cloneDepth,
    keep: opts.keep,
  });

  const repoContext = buildRepoContext(checkoutInfo.workDir);
  const systemPrompt = buildRunSystemPrompt({
    workDir: checkoutInfo.workDir,
    repoContext,
    priorContext,
  });

  let result;
  try {
    result = await runAgent({
      task: taskText,
      checkoutInfo,
      config,
      systemPrompt,
      verbosity: opts.verbosity,
    });
  } catch (err) {
    result = {
      status: "failed" as const,
      branch: null,
      repoPath: checkoutInfo.workDir,
      summary: "",
      filesChanged: [],
      questions: [],
      error: err instanceof Error ? err.message : String(err),
    };
  }

  if (result.status === "complete" && !opts.keep) {
    cleanup(checkoutInfo.workDir);
  }

  printResult(result);
  process.exit(result.status === "failed" ? 1 : 0);
}
