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

  // For workflow_call, github.repository is the caller's repo (correct).
  // TARGET_REPO env var makes it explicit when needed.
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
  const body = buildReviewBody(result.summary, bodyOnlyComments);

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
    // Inline comments rejected (lines outside diff) — retry without them
    core.warning(`Inline comments failed (${err.message}), retrying without them`);
    postedComments = [];
    const fallbackBody = buildReviewBody(result.summary, [
      ...bodyOnlyComments,
      ...inlineComments.map((c) => ({
        file: c.path,
        line: c.line,
        severity: "suggestion",
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

  const botReviews = reviews.filter(
    (r) =>
      r.user?.login === "github-actions[bot]" &&
      r.state !== "DISMISSED"
  );

  for (const review of botReviews) {
    try {
      await github.rest.pulls.dismissReview({
        owner,
        repo,
        pull_number: prNumber,
        review_id: review.id,
        message: "Superseded by updated review",
      });
    } catch (err) {
      // Non-fatal — old review stays but new one still gets posted
    }
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

function formatComment(comment) {
  const icon = { error: "🔴", warning: "🟡", suggestion: "🔵" }[comment.severity] ?? "•";
  return `${icon} **${comment.severity}**: ${comment.message}`;
}

function buildReviewBody(summary, bodyOnlyComments) {
  const lines = ["**git-bot review**\n", summary];

  if (bodyOnlyComments.length > 0) {
    lines.push("\n---\n**Additional comments:**");
    for (const c of bodyOnlyComments) {
      const loc = c.file + (c.line ? `:${c.line}` : "");
      lines.push(`- ${formatComment(c)} (\`${loc}\`)`);
    }
  }

  return lines.join("\n");
}
