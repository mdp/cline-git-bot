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

// Phase 1: exploration system prompt — minimal, just satisfies the SDK requirement.
export function buildReviewSystemPrompt(): string {
  return "You are a code reviewer. Explore the repository and write your review.";
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

Review for correctness, security, test coverage, clarity, and style consistency. Only flag issues where you can state a concrete problem. Do not modify any files.${focusPart}${extraPart}`;
}

// Phase 2: extraction system prompt — overrides Cline defaults, one job only.
export function buildExtractionSystemPrompt(): string {
  return "You are a structured data extractor. Your only valid action is to call the submit_review tool with the data extracted from the review text provided. Do not write any prose. Do not call any other tool.";
}

export function buildExtractionPrompt(reviewText: string): string {
  return `Below is a code review written in prose. Convert it into a call to the \`submit_review\` tool.

Extraction rules:
- verdict: "approve" only if the review is clearly positive with no blocking issues. "request_changes" if there are bugs, security issues, or must-fix items. "comment" for everything else.
- summary: 2-3 sentences — what the PR does, the key finding, and the overall recommendation. Use the reviewer's own words where possible.
- comments: extract specific issues as inline comments. For each:
  - file: the file path exactly as the reviewer stated it. If no specific file was mentioned, use the closest implied file.
  - line: the exact line number ONLY when the reviewer states it explicitly (e.g. "line 42", "line 28"). For "around line X", "near line X", or general file-level observations — use null.
  - severity: "error" for bugs, security issues, crashes, or anything described as must-fix. "warning" for correctness concerns or potential problems. "suggestion" for style, clarity, naming, or optional improvements.
  - message: the reviewer's finding, stated concisely and directly.

Call submit_review now with these fields extracted from the review below.

---
${reviewText}`;
}
