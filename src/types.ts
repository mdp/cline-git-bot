export interface Question {
  id: string;
  question: string;
  answer?: string;
}

export interface RunResult {
  status: "complete" | "needs_clarification" | "failed";
  branch: string | null;
  repoPath: string;
  summary: string;
  filesChanged: string[];
  questions: Question[];
  error: string | null;
}

export interface ReviewComment {
  file: string;
  line: number | null;
  severity: "error" | "warning" | "suggestion";
  message: string;
}

export interface ReviewResult {
  status: "complete" | "failed";
  verdict: "approve" | "request_changes" | "comment";
  summary: string;
  comments: ReviewComment[];
  error: string | null;
}

export interface CheckoutInfo {
  workDir: string;
  branch: string;
  checkoutId: string;
  initialCommit: string;
}

export interface Config {
  providerId: string;
  modelId: string;
  apiKey: string;
  extractModelId: string;
}

export function loadConfig(modelOverride?: string): Config {
  const providerId = process.env.GIT_BOT_PROVIDER || "openrouter";
  const apiKey =
    process.env.GIT_BOT_API_KEY ||
    process.env.OPENROUTER_API_KEY ||
    process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "No API key found. Set GIT_BOT_API_KEY, OPENROUTER_API_KEY, or ANTHROPIC_API_KEY."
    );
  }
  const modelId = modelOverride || process.env.GIT_BOT_MODEL || "moonshotai/kimi-k2.6";
  const extractModelId = process.env.GIT_BOT_EXTRACT_MODEL || "openai/gpt-oss-120b:nitro";
  return { providerId, modelId, apiKey, extractModelId };
}
