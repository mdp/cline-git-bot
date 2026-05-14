import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { resolveReviewInput } from "../core/review-input.js";
import { runReviewer } from "../core/reviewer.js";
import { buildReviewPrompt } from "../core/prompts.js";
import type { Verbosity } from "../core/output.js";
import { loadConfig } from "../types.js";

export interface ReviewOptions {
  repo: string;
  branch?: string;
  pr?: string;
  baseBranch: string;
  focus: string[];
  cloneDepth: number;
  model?: string;
  verbosity: Verbosity;
}

export async function reviewCommand(opts: ReviewOptions): Promise<void> {
  const config = loadConfig(opts.model);

  let result;
  try {
    const { workDir, prBranch, baseBranch, prMeta } = await resolveReviewInput({
      repo: opts.repo,
      branch: opts.branch,
      pr: opts.pr,
      baseBranch: opts.baseBranch,
      cloneDepth: opts.cloneDepth,
    });

    let extraInstructions = "";
    const reviewPromptPath = join(workDir, ".git-bot", "review.md");
    if (existsSync(reviewPromptPath)) {
      extraInstructions = readFileSync(reviewPromptPath, "utf-8");
    }

    const prompt = buildReviewPrompt({
      workDir,
      prBranch,
      baseBranch,
      prMeta,
      focus: opts.focus,
      extraInstructions,
    });

    result = await runReviewer({ workDir, prompt, config, verbosity: opts.verbosity });
  } catch (err) {
    result = {
      status: "failed" as const,
      verdict: "comment" as const,
      summary: "",
      comments: [],
      error: err instanceof Error ? err.message : String(err),
    };
  }

  process.stdout.write(JSON.stringify(result) + "\n");
  process.exitCode = result.status === "failed" ? 1 : 0;
}
