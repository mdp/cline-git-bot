import { buildClineSystemPrompt } from "@clinebot/shared";
import { platform } from "node:os";

export function buildRunSystemPrompt(opts: {
  workDir: string;
  repoContext: string;
  priorContext: string;
}): string {
  return `You are an autonomous software development agent. Your job is to implement the task described in the user's prompt.

Working directory: ${opts.workDir}
All file operations are relative to this path.

## Tools
You have access to tools for reading files, searching code, running shell commands, and editing files.
Use them freely — no approval is required.

## Exit protocol
You have TWO exit tools:
1. \`submit_and_exit\` — call this when you have COMPLETED the task. Before calling it:
   - Run the test suite (if one exists) and fix any failures you introduced
   - Commit your changes: \`git add -A && git commit -m "<brief description>"\`
   - Set \`verified: true\` if tests pass, \`false\` if there are no tests
   - Write a clear summary of what you did

2. \`request_clarification\` — call this ONLY if the task is genuinely ambiguous and you cannot make a reasonable assumption. Provide specific, answerable questions. Do NOT use this for optional information.

Never stop without calling one of these two tools.

## Repository context
${opts.repoContext}${opts.priorContext}`;
}

export function buildReviewSystemPrompt(workDir: string): string {
  const os = platform();
  const platformName = os === "darwin" ? "macOS" : os === "win32" ? "Windows" : "Linux";
  return buildClineSystemPrompt({
    ide: "git-bot",
    mode: "plan",
    platform: platformName,
    workspaceRoot: workDir,
  });
}

export function buildReviewPrompt(opts: {
  workDir: string;
  prBranch: string;
  baseBranch: string;
  prMeta?: { title: string; body: string };
  focus: string[];
  extraInstructions: string;
}): string {
  const prTitle = opts.prMeta?.title ? `"${opts.prMeta.title}"` : "this PR";
  const prBody = opts.prMeta?.body ? `\n\nPR description:\n${opts.prMeta.body}` : "";
  const focusPart = opts.focus.length ? ` Focus especially on: ${opts.focus.join(", ")}.` : "";
  const extraPart = opts.extraInstructions
    ? `\n\nProject-specific review notes:\n${opts.extraInstructions}`
    : "";

  return `Please review ${prTitle} — the changes in branch \`${opts.prBranch}\` compared to \`${opts.baseBranch}\`. The repo is checked out at: ${opts.workDir}.${prBody}

Note: run_commands does not accept a timeout parameter — omit it.

Write a thorough prose review covering:
- What the PR does (a one-sentence walkthrough)
- Correctness and bugs
- Security concerns — explicitly state whether any exist
- Test coverage — does the PR include tests?
- Style, clarity, and consistency

Only flag issues where you can state a concrete problem. Do not modify any files.${focusPart}${extraPart}`;
}

export function buildExtractionSystemPrompt(): string {
  return "You are a structured data extractor. Your only valid action is to call the submit_review tool with data extracted from the review text. Do not write prose. Do not call any other tool.";
}

export function buildExtractionPrompt(reviewText: string): string {
  return `Below is a code review written in prose. Convert it into a call to the \`submit_review\` tool.

Extraction rules:
- verdict: "approve" only if clearly positive with no blocking issues. "request_changes" for bugs, security issues, or must-fix items. "comment" for everything else.
- effort: 1-5 scale. 1 = trivial (typo fix, single-line change). 2 = small (few files, clear change). 3 = moderate (multi-file, some complexity). 4 = complex (large diff, architectural changes). 5 = very complex (deep understanding required, risky changes).
- security: true if the reviewer identified any security concerns, false otherwise.
- has_tests: true if the PR includes new or updated tests, false if no tests were added.
- walkthrough: one sentence describing what the PR does.
- summary: 2-3 sentences — the key finding and overall recommendation.
- comments: each specific issue as an inline comment:
  - file: the file path exactly as stated. Use closest implied file if not explicit.
  - line: exact line number ONLY when explicitly stated (e.g. "line 42"). Use null for general observations.
  - severity: "error" for bugs/security/must-fix. "warning" for correctness concerns. "suggestion" for style/clarity/optional.
  - title: 2-4 word header for this issue (e.g. "Missing null check", "Credential leak risk", "Unused import").
  - message: the reviewer's finding, stated concisely and directly.

Call submit_review now with these fields extracted from the review below.

---
${reviewText}`;
}
