import * as core from "@actions/core";
import * as github from "@actions/github";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { loadConfig } from "./types.js";
import { resolveReviewInput } from "./core/review-input.js";
import { runReviewer } from "./core/reviewer.js";
import { buildReviewPrompt, buildReviewSystemPrompt } from "./core/prompts.js";
import type { ReviewResult, ReviewComment } from "./types.js";

async function run() {
  try {
    const apiKey = core.getInput("api-key", { required: true });
    const model = core.getInput("model") || undefined;
    const focusRaw = core.getInput("focus");
    const focus = focusRaw ? focusRaw.split(",").map((s) => s.trim()) : [];
    const baseBranch = core.getInput("base-branch") || "main";
    const blocking = core.getInput("blocking") === "true";
    const token = process.env.GITHUB_TOKEN ?? "";

    const prNumberRaw =
      core.getInput("pr-number") ||
      String(github.context.payload.pull_request?.number ?? "");
    const repoInput =
      core.getInput("repo") ||
      `${github.context.repo.owner}/${github.context.repo.repo}`;

    if (!prNumberRaw) {
      core.setFailed("Could not determine PR number. Set the pr-number input.");
      return;
    }

    process.env.GIT_BOT_API_KEY = apiKey;
    const config = loadConfig(model);
    const repoUrl = `https://x-access-token:${token}@github.com/${repoInput}.git`;

    let result: ReviewResult;
    try {
      const { workDir, prBranch, baseBranch: resolvedBase, prMeta } = await resolveReviewInput({
        repo: repoUrl,
        pr: prNumberRaw,
        baseBranch,
        cloneDepth: 1,
      });

      let extraInstructions = "";
      const reviewPromptPath = join(workDir, ".git-bot", "review.md");
      if (existsSync(reviewPromptPath)) {
        extraInstructions = readFileSync(reviewPromptPath, "utf-8");
      }

      const prompt = buildReviewPrompt({
        workDir,
        prBranch,
        baseBranch: resolvedBase,
        prMeta,
        focus,
        extraInstructions,
      });
      result = await runReviewer({ workDir, systemPrompt: buildReviewSystemPrompt({ workDir }), prompt, config, verbosity: "normal" });
    } catch (err) {
      result = {
        status: "failed",
        verdict: "comment",
        summary: "",
        comments: [],
        error: err instanceof Error ? err.message : String(err),
      };
    }

    const [owner, repo] = repoInput.split("/");
    const prNumber = parseInt(prNumberRaw, 10);
    const octokit = github.getOctokit(token);

    await dismissPreviousBotReviews(octokit, owner, repo, prNumber);

    if (result.status === "failed") {
      await postFailureComment(octokit, owner, repo, prNumber, result.error ?? "Unknown error");
      return;
    }

    const event = toReviewEvent(result.verdict, blocking);
    const inlineComments = (result.comments ?? [])
      .filter((c) => c.line != null)
      .map((c) => ({
        path: c.file,
        line: c.line as number,
        side: "RIGHT" as const,
        body: formatComment(c),
      }));
    const bodyOnly = (result.comments ?? []).filter((c) => c.line == null);
    const body = buildBody(result.summary, bodyOnly);

    try {
      await octokit.rest.pulls.createReview({
        owner, repo, pull_number: prNumber, event, body,
        comments: inlineComments,
      });
      core.info(`Posted ${event} review with ${inlineComments.length} inline comment(s)`);
    } catch {
      // Lines outside diff — retry body-only
      core.warning("Inline comments rejected, retrying without them");
      const fallbackBody = buildBody(result.summary, [
        ...bodyOnly,
        ...inlineComments.map((c) => ({
          file: c.path,
          line: c.line,
          severity: "suggestion" as const,
          message: c.body,
        })),
      ]);
      await octokit.rest.pulls.createReview({
        owner, repo, pull_number: prNumber, event, body: fallbackBody, comments: [],
      });
      core.info(`Posted ${event} review (body-only fallback)`);
    }
  } catch (err) {
    core.setFailed(err instanceof Error ? err.message : String(err));
  }
}

type Octokit = ReturnType<typeof github.getOctokit>;

async function dismissPreviousBotReviews(octokit: Octokit, owner: string, repo: string, prNumber: number) {
  const { data: reviews } = await octokit.rest.pulls.listReviews({
    owner, repo, pull_number: prNumber, per_page: 100,
  });
  for (const review of reviews.filter((r) => r.user?.login === "github-actions[bot]" && r.state !== "DISMISSED")) {
    try {
      await octokit.rest.pulls.dismissReview({
        owner, repo, pull_number: prNumber,
        review_id: review.id,
        message: "Superseded by updated review",
      });
    } catch { /* non-fatal */ }
  }
}

async function postFailureComment(octokit: Octokit, owner: string, repo: string, prNumber: number, reason: string) {
  await octokit.rest.issues.createComment({
    owner, repo, issue_number: prNumber,
    body: `⚠️ **git-bot review failed**\n\n\`\`\`\n${reason}\n\`\`\`\n\nCheck the [workflow run](${process.env.GITHUB_SERVER_URL}/${owner}/${repo}/actions/runs/${process.env.GITHUB_RUN_ID}) for details.`,
  });
}

function toReviewEvent(verdict: string, blocking: boolean) {
  if (!blocking) return "COMMENT" as const;
  if (verdict === "approve") return "APPROVE" as const;
  if (verdict === "request_changes") return "REQUEST_CHANGES" as const;
  return "COMMENT" as const;
}

function formatComment(c: ReviewComment) {
  const icon = ({ error: "🔴", warning: "🟡", suggestion: "🔵" } as Record<string, string>)[c.severity] ?? "•";
  return `${icon} **${c.severity}**: ${c.message}`;
}

function buildBody(summary: string, comments: ReviewComment[]) {
  const lines = ["**git-bot review**\n", summary];
  if (comments.length > 0) {
    lines.push("\n---\n**Additional comments:**");
    for (const c of comments) {
      const loc = c.file + (c.line ? `:${c.line}` : "");
      lines.push(`- ${formatComment(c)} (\`${loc}\`)`);
    }
  }
  return lines.join("\n");
}

run();
