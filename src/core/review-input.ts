import { execSync } from "node:child_process";
import { checkout } from "./checkout.js";

export interface ReviewInput {
  workDir: string;
  prBranch: string;
  baseBranch: string;
  prMeta?: { title: string; body: string };
}

function extractToken(repoUrl: string): string | undefined {
  const match = repoUrl.match(/https:\/\/x-access-token:([^@]+)@/);
  return match?.[1] ?? process.env.GITHUB_TOKEN ?? undefined;
}

function extractOwnerRepo(repoUrl: string): [string, string] | undefined {
  const match = repoUrl.match(/github\.com[/:]([\w.-]+)\/([\w.-]+?)(?:\.git)?$/);
  return match ? [match[1], match[2]] : undefined;
}

async function fetchPrMeta(
  token: string,
  owner: string,
  repo: string,
  pr: string,
): Promise<{ title: string; body: string } | undefined> {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${pr}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
    });
    if (!res.ok) return undefined;
    const data = (await res.json()) as { title: string; body?: string };
    return { title: data.title, body: data.body ?? "" };
  } catch {
    return undefined;
  }
}

export async function resolveReviewInput(opts: {
  repo: string;
  branch?: string;
  pr?: string;
  baseBranch: string;
  cloneDepth: number;
}): Promise<ReviewInput> {
  if (opts.pr) {
    const info = await checkout({
      repo: opts.repo,
      baseBranch: opts.baseBranch,
      cloneDepth: opts.cloneDepth,
      keep: true,
    });

    execSync(`git fetch origin pull/${opts.pr}/head:pr-${opts.pr}`, {
      cwd: info.workDir,
      stdio: "pipe",
    });
    execSync(`git checkout pr-${opts.pr}`, { cwd: info.workDir, stdio: "pipe" });

    const prBranch = `pr-${opts.pr}`;

    // Best-effort: fetch PR title + body for context
    const token = extractToken(opts.repo);
    const ownerRepo = extractOwnerRepo(opts.repo);
    const prMeta =
      token && ownerRepo
        ? await fetchPrMeta(token, ownerRepo[0], ownerRepo[1], opts.pr)
        : undefined;

    return { workDir: info.workDir, prBranch, baseBranch: opts.baseBranch, prMeta };
  }

  if (opts.branch) {
    const info = await checkout({
      repo: opts.repo,
      baseBranch: opts.baseBranch,
      cloneDepth: opts.cloneDepth,
      keep: true,
    });
    execSync(`git fetch origin ${opts.branch}`, { cwd: info.workDir, stdio: "pipe" });
    execSync(`git checkout ${opts.branch}`, { cwd: info.workDir, stdio: "pipe" });
    return { workDir: info.workDir, prBranch: opts.branch, baseBranch: opts.baseBranch };
  }

  throw new Error("One of --branch or --pr is required");
}
