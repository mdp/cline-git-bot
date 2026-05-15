#!/usr/bin/env node
import { Command } from "commander";
import { runCommand } from "./commands/run.js";
import { reviewCommand } from "./commands/review.js";
import type { Verbosity } from "./core/output.js";

function verbosity(opts: { verbose?: boolean; quiet?: boolean; debug?: boolean }): Verbosity {
  if (opts.debug) return "debug";
  if (opts.quiet) return "quiet";
  if (opts.verbose) return "verbose";
  return "normal";
}

function handleError(err: unknown): never {
  const msg = err instanceof Error ? err.message : String(err);
  process.stderr.write(`Error: ${msg}\n`);
  try {
    process.stdout.write(JSON.stringify({ status: "failed", error: msg, verdict: "comment", summary: "", comments: [] }) + "\n");
  } catch {}
  process.exit(1);
}

// Hard exit after 20 minutes — catches any case where cline.dispose() or SDK handles hang.
setTimeout(() => {
  process.stderr.write("[git-bot] HARD TIMEOUT: process exceeded 20 minutes, force exiting\n");
  process.exit(2);
}, 20 * 60 * 1000);

// Catch any unhandled rejections or exceptions so we always write a result to stdout
process.on("unhandledRejection", (reason) => {
  const msg = reason instanceof Error ? reason.message : String(reason);
  process.stderr.write(`UnhandledRejection: ${msg}\n`);
  try {
    process.stdout.write(JSON.stringify({ status: "failed", error: `UnhandledRejection: ${msg}`, verdict: "comment", summary: "", comments: [] }) + "\n");
  } catch {}
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  const msg = err instanceof Error ? err.message : String(err);
  process.stderr.write(`UncaughtException: ${msg}\n`);
  try {
    process.stdout.write(JSON.stringify({ status: "failed", error: `UncaughtException: ${msg}`, verdict: "comment", summary: "", comments: [] }) + "\n");
  } catch {}
  process.exit(1);
});

const program = new Command()
  .name("git-bot")
  .description("Autonomous software development agent")
  .version("1.0.0");

program
  .command("run")
  .description("Execute a development task in a git repository")
  .requiredOption("--repo <url|path>", "Git repository URL or local path")
  .option("--task <file|string>", "Task description (file path or inline string)")
  .option("--context <file>", "Prior result JSON with answers filled in")
  .option("--base-branch <branch>", "Branch to clone from (default: repo default)")
  .option("--clone-depth <n>", "Git clone depth", (v) => parseInt(v, 10), 1)
  .option("--model <id>", "AI model ID override")
  .option("--keep", "Keep checkout directory on success")
  .option("--verbose", "Stream full agent events to stderr")
  .option("--quiet", "Suppress all stderr progress output")
  .action(async (opts) => {
    await runCommand({
      repo: opts.repo,
      task: opts.task,
      context: opts.context,
      baseBranch: opts.baseBranch,
      cloneDepth: opts.cloneDepth,
      model: opts.model,
      keep: Boolean(opts.keep),
      verbosity: verbosity(opts),
    }).catch(handleError);
  });

program
  .command("review")
  .description("Review code changes in a git repository")
  .requiredOption("--repo <url|path>", "Git repository URL or local path")
  .option("--branch <name>", "Branch to review against base branch")
  .option("--pr <number>", "Pull request number to review")
  .option("--base-branch <branch>", "Base branch for diff comparison", "main")
  .option("--focus <categories>", "Comma-separated focus areas (e.g. security,style)", (v) => v.split(",").map((s: string) => s.trim()), [])
  .option("--clone-depth <n>", "Git clone depth", (v) => parseInt(v, 10), 1)
  .option("--model <id>", "AI model ID override")
  .option("--verbose", "Stream agent events to stderr")
  .option("--debug", "Stream full event JSON to stderr for CI debugging")
  .option("--quiet", "Suppress all stderr progress output")
  .action(async (opts) => {
    await reviewCommand({
      repo: opts.repo,
      branch: opts.branch,
      pr: opts.pr,
      baseBranch: opts.baseBranch,
      focus: opts.focus,
      cloneDepth: opts.cloneDepth,
      model: opts.model,
      verbosity: verbosity(opts),
    }).catch(handleError);
  });

program.parse();
