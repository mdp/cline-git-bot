import { execSync, execFileSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, basename } from "node:path";
import { v4 as uuidv4 } from "uuid";
import type { CheckoutInfo } from "../types.js";

export interface CheckoutOptions {
  repo: string;
  baseBranch?: string;
  cloneDepth: number;
  keep: boolean;
}

function repoName(repo: string): string {
  const base = basename(repo.replace(/\.git$/, ""));
  return base.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 40);
}

function isRemote(repo: string): boolean {
  return repo.startsWith("http://") || repo.startsWith("https://") || repo.startsWith("git@");
}

export async function checkout(opts: CheckoutOptions): Promise<CheckoutInfo> {
  const baseDir = process.env.GIT_BOT_TMP_DIR ?? join(tmpdir(), "git-bot");
  mkdirSync(baseDir, { recursive: true });

  const checkoutId = `${repoName(opts.repo)}-${uuidv4().slice(0, 8)}`;
  const workDir = join(baseDir, checkoutId);
  const branch = `git-bot/task-${uuidv4().slice(0, 8)}`;

  if (isRemote(opts.repo)) {
    const cloneArgs = [
      "clone",
      "--depth",
      String(opts.cloneDepth),
      ...(opts.baseBranch ? ["--branch", opts.baseBranch] : []),
      opts.repo,
      workDir,
    ];
    execFileSync("git", cloneArgs, { stdio: "pipe" });
  } else {
    if (!existsSync(opts.repo)) {
      throw new Error(`Local repo path does not exist: ${opts.repo}`);
    }
    const src = opts.repo;
    execFileSync("git", [
      "clone",
      "--local",
      "--depth",
      String(opts.cloneDepth),
      ...(opts.baseBranch ? ["--branch", opts.baseBranch] : []),
      src,
      workDir,
    ], { stdio: "pipe" });
  }

  execFileSync("git", ["checkout", "-b", branch], { cwd: workDir, stdio: "pipe" });

  const initialCommit = execSync("git rev-parse HEAD", { cwd: workDir }).toString().trim();

  return { workDir, branch, checkoutId, initialCommit };
}

export function getChangedFiles(workDir: string, initialCommit: string): string[] {
  try {
    const output = execSync(
      `git diff --name-only ${initialCommit} HEAD`,
      { cwd: workDir }
    ).toString().trim();
    if (!output) return [];
    return output.split("\n").filter(Boolean);
  } catch {
    return [];
  }
}

export function cleanup(workDir: string): void {
  try {
    rmSync(workDir, { recursive: true, force: true });
  } catch {
    // best-effort
  }
}
