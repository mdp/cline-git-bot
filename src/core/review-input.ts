import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { checkout } from "./checkout.js";
import { transformDiff } from "./diff-transform.js";

export interface ReviewInput {
  diff: string;
  workDir: string | null;
}

// Patterns that identify generated/vendored files not worth reviewing.
const GENERATED_PATTERNS = [
  /^pnpm-lock\.yaml$/,
  /^package-lock\.json$/,
  /^yarn\.lock$/,
  /^Gemfile\.lock$/,
  /^composer\.lock$/,
  /^poetry\.lock$/,
  /\.min\.(js|css)$/,
  /^(dist|build|out|action|vendor|\.next|\.nuxt)\//,
  /\.(pb\.go|pb\.ts|generated\.(ts|js|go|py))$/,
];

function isGenerated(filePath: string): boolean {
  return GENERATED_PATTERNS.some((re) => re.test(filePath));
}

function reviewableDiff(range: string, cwd: string): string {
  // 1. Get the list of changed files cheaply — no content yet.
  const nameOnly = execSync(`git diff ${range} --name-only`, { cwd, stdio: "pipe" })
    .toString()
    .trim();
  if (!nameOnly) return "";

  const allFiles = nameOnly.split("\n").map((f) => f.trim()).filter(Boolean);
  const reviewable = allFiles.filter((f) => !isGenerated(f));
  const skipped = allFiles.length - reviewable.length;

  if (reviewable.length === 0) {
    return skipped > 0
      ? `[All ${skipped} changed file(s) are generated/vendored and were omitted from review]`
      : "";
  }

  // 2. Fetch diff content only for the files we actually want.
  const pathArgs = reviewable.map((f) => `-- "${f}"`).join(" ");
  const raw = execSync(`git diff ${range} ${pathArgs}`, { cwd, stdio: "pipe" }).toString();

  const transformed = transformDiff(raw);
  if (skipped === 0) return transformed;
  return `[${skipped} generated/vendored file(s) omitted from review]\n\n${transformed}`;
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
    const info = await checkout({ repo: opts.repo, baseBranch: opts.baseBranch, cloneDepth: opts.cloneDepth, keep: true });
    execSync(`git fetch origin pull/${opts.pr}/head:pr-${opts.pr}`, { cwd: info.workDir, stdio: "pipe" });
    execSync(`git checkout pr-${opts.pr}`, { cwd: info.workDir, stdio: "pipe" });
    const diff = reviewableDiff(`${opts.baseBranch}...pr-${opts.pr}`, info.workDir);
    return { diff, workDir: info.workDir };
  }

  if (opts.branch) {
    const info = await checkout({ repo: opts.repo, baseBranch: opts.baseBranch, cloneDepth: opts.cloneDepth, keep: true });
    execSync(`git fetch origin ${opts.branch}`, { cwd: info.workDir, stdio: "pipe" });
    execSync(`git checkout ${opts.branch}`, { cwd: info.workDir, stdio: "pipe" });
    const diff = reviewableDiff(`${opts.baseBranch}...${opts.branch}`, info.workDir);
    return { diff, workDir: info.workDir };
  }

  throw new Error("One of --branch, --pr, or --diff is required");
}
