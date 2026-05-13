import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { resolveReviewInput } from "../core/review-input.js";
import { runReviewer } from "../core/reviewer.js";
import { buildReviewSystemPrompt } from "../core/prompts.js";
import { printResult } from "../core/output.js";
import type { Verbosity } from "../core/output.js";
import { loadConfig } from "../types.js";

export interface ReviewOptions {
  repo?: string;
  branch?: string;
  pr?: string;
  diff?: string;
  baseBranch: string;
  focus: string[];
  cloneDepth: number;
  model?: string;
  verbosity: Verbosity;
}

export async function reviewCommand(opts: ReviewOptions): Promise<void> {
  const config = loadConfig(opts.model);

  const { diff, workDir } = await resolveReviewInput({
    repo: opts.repo,
    branch: opts.branch,
    pr: opts.pr,
    diff: opts.diff,
    baseBranch: opts.baseBranch,
    cloneDepth: opts.cloneDepth,
  });

  let extraInstructions = "";
  if (workDir) {
    const reviewPromptPath = join(workDir, ".git-bot", "review.md");
    if (existsSync(reviewPromptPath)) {
      extraInstructions = readFileSync(reviewPromptPath, "utf-8");
    }
  }

  const systemPrompt = buildReviewSystemPrompt({ focus: opts.focus, extraInstructions });

  let result;
  try {
    result = await runReviewer({ diff, systemPrompt, workDir, config, verbosity: opts.verbosity });
  } catch (err) {
    result = {
      status: "failed" as const,
      verdict: "comment" as const,
      summary: "",
      comments: [],
      error: err instanceof Error ? err.message : String(err),
    };
  }

  printResult(result);
  process.exit(result.status === "failed" ? 1 : 0);
}
