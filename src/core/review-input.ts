import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { checkout } from "./checkout.js";
import { transformDiff } from "./diff-transform.js";

export interface ReviewInput {
  diff: string;
  workDir: string | null;
}

export async function resolveReviewInput(opts: {
  repo?: string;
  branch?: string;
  pr?: string;
  diff?: string;
  baseBranch: string;
  cloneDepth: number;
}): Promise<ReviewInput> {
  if (opts.diff) {
    return { diff: transformDiff(readFileSync(opts.diff, "utf-8")), workDir: null };
  }

  if (!opts.repo) {
    throw new Error("--repo is required unless --diff is provided");
  }

  if (opts.pr) {
    // Clone and fetch the PR branch
    const info = await checkout({ repo: opts.repo, baseBranch: opts.baseBranch, cloneDepth: opts.cloneDepth, keep: true });
    execSync(`git fetch origin pull/${opts.pr}/head:pr-${opts.pr}`, { cwd: info.workDir, stdio: "pipe" });
    execSync(`git checkout pr-${opts.pr}`, { cwd: info.workDir, stdio: "pipe" });
    const raw = execSync(`git diff ${opts.baseBranch}...pr-${opts.pr}`, { cwd: info.workDir }).toString();
    return { diff: transformDiff(raw), workDir: info.workDir };
  }

  if (opts.branch) {
    const info = await checkout({ repo: opts.repo, baseBranch: opts.baseBranch, cloneDepth: opts.cloneDepth, keep: true });
    execSync(`git fetch origin ${opts.branch}`, { cwd: info.workDir, stdio: "pipe" });
    execSync(`git checkout ${opts.branch}`, { cwd: info.workDir, stdio: "pipe" });
    const raw = execSync(`git diff ${opts.baseBranch}...${opts.branch}`, { cwd: info.workDir }).toString();
    return { diff: transformDiff(raw), workDir: info.workDir };
  }

  throw new Error("One of --branch, --pr, or --diff is required");
}
