// @ts-check
"use strict";

/**
 * Reads review-result.json, dismisses previous bot reviews, and posts
 * the new review (inline comments + verdict) via the GitHub PR Review API.
 *
 * Called from actions/github-script — receives { github, context, core }.
 */
module.exports = async function postReview({ github, context, core }) {
  const fs = require("fs");

  const prNumber =
    context.payload.pull_request?.number ||
    parseInt(process.env.PR_NUMBER || "0", 10) ||
    null;

  if (!prNumber) {
    core.setFailed("Could not determine PR number");
    return;
  }

  const targetRepo = process.env.TARGET_REPO || context.repo.owner + "/" + context.repo.repo;
  const [owner, repo] = targetRepo.split("/");
  const blocking = process.env.BLOCKING === "true";

  // --- Parse git-bot output ---
  let result;
  try {
    const raw = fs.readFileSync("review-result.json", "utf8");
    result = JSON.parse(raw);
  } catch (err) {
    await postFailureComment(github, owner, repo, prNumber, `Could not parse review output: ${err.message}`);
    return;
  }

  // --- Dismiss previous bot reviews ---
  await dismissPreviousBotReviews(github, owner, repo, prNumber);

  // --- Handle tool failure ---
  if (result.status === "failed") {
    await postFailureComment(github, owner, repo, prNumber, result.error || "Unknown error");
    return;
  }

  // --- Map verdict ---
  let event = verdictToEvent(result.verdict, blocking);

  // --- Build inline comments ---
  const inlineComments = [];
  const bodyOnlyComments = [];

  for (const comment of result.comments ?? []) {
    if (comment.line != null) {
      inlineComments.push({
        path: comment.file,
        line: comment.line,
        side: "RIGHT",
        body: formatComment(comment),
      });
    } else {
      bodyOnlyComments.push(comment);
    }
  }

  // --- Build review body ---
  const body = buildReviewBody(result, bodyOnlyComments);

  // --- Post review, with inline comment fallback ---
  let postedComments = inlineComments;
  try {
    await github.rest.pulls.createReview({
      owner,
      repo,
      pull_number: prNumber,
      event,
      body,
      comments: inlineComments,
    });
  } catch (err) {
    core.warning(`Inline comments failed (${err.message}), retrying without them`);
    postedComments = [];
    const fallbackBody = buildReviewBody(result, [
      ...bodyOnlyComments,
      ...inlineComments.map((c) => ({
        file: c.path,
        line: c.line,
        severity: "suggestion",
        title: "",
        message: c.body,
      })),
    ]);
    await github.rest.pulls.createReview({
      owner,
      repo,
      pull_number: prNumber,
      event,
      body: fallbackBody,
      comments: [],
    });
  }

  core.info(`Posted ${event} review with ${postedComments.length} inline comment(s)`);
};

// ---------------------------------------------------------------------------

async function dismissPreviousBotReviews(github, owner, repo, prNumber) {
  const { data: reviews } = await github.rest.pulls.listReviews({
    owner,
    repo,
    pull_number: prNumber,
    per_page: 100,
  });

  for (const review of reviews.filter(
    (r) => r.user?.login === "github-actions[bot]" && r.state !== "DISMISSED"
  )) {
    try {
      await github.rest.pulls.dismissReview({
        owner,
        repo,
        pull_number: prNumber,
        review_id: review.id,
        message: "Superseded by updated review",
      });
    } catch (err) { /* non-fatal */ }
  }

  const { data: comments } = await github.rest.issues.listComments({
    owner,
    repo,
    issue_number: prNumber,
    per_page: 100,
  });

  for (const comment of comments.filter(
    (c) => c.user?.login === "github-actions[bot]" && c.body?.includes("git-bot")
  )) {
    try {
      await github.rest.issues.deleteComment({
        owner,
        repo,
        comment_id: comment.id,
      });
    } catch (err) { /* non-fatal */ }
  }
}

async function postFailureComment(github, owner, repo, prNumber, reason) {
  await github.rest.issues.createComment({
    owner,
    repo,
    issue_number: prNumber,
    body: `⚠️ **git-bot review failed**\n\n\`\`\`\n${reason}\n\`\`\`\n\nCheck the [workflow run](${process.env.GITHUB_SERVER_URL}/${owner}/${repo}/actions/runs/${process.env.GITHUB_RUN_ID}) for details.`,
  });
}

function verdictToEvent(verdict, blocking) {
  if (!blocking) return "COMMENT";
  if (verdict === "approve") return "APPROVE";
  if (verdict === "request_changes") return "REQUEST_CHANGES";
  return "COMMENT";
}

function effortBar(effort) {
  const n = Math.max(1, Math.min(5, effort || 3));
  return "🔵".repeat(n) + "⚪".repeat(5 - n);
}

function formatComment(comment) {
  const icon = { error: "🔴", warning: "🟡", suggestion: "🔵" }[comment.severity] ?? "•";
  const title = comment.title ? ` **${comment.title}**` :  "";
  return `${icon}${title}\n\n${comment.message}`;
}

function buildReviewBody(result, bodyOnlyComments) {
  const lines = [];

  lines.push("## 🤖 git-bot Review\n");

  if (result.walkthrough) {
    lines.push(`> ${result.walkthrough}\n`);
  }

  // Stats table
  lines.push("| | |");
  lines.push("|---|---|");
  lines.push(`| ⏱️ **Review effort** | ${result.effort ?? 3}/5 ${effortBar(result.effort)} |`);
  lines.push(`| 🔒 **Security** | ${result.security ? "⚠️ Concerns identified" : "No concerns"} |`);
  lines.push(`| 🧪 **Tests** | ${result.has_tests ? "✅ Tests included" : "❌ No tests"} |`);
  lines.push("");

  lines.push(result.summary);

  if (bodyOnlyComments.length > 0) {
    lines.push("\n---\n### ⚡ Key Issues\n");
    for (const c of bodyOnlyComments) {
      const icon = { error: "🔴", warning: "🟡", suggestion: "🔵" }[c.severity] ?? "•";
      const loc = c.file + (c.line ? `:${c.line}` : "");
      const title = c.title ? ` **${c.title}**` : "";
      lines.push(`${icon}${title} — \`${loc}\`\n\n${c.message}\n`);
    }
  }

  return lines.join("\n");
}
