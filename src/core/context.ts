import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { Question } from "../types.js";

export function buildRepoContext(workDir: string): string {
  const customPromptPath = join(workDir, ".git-bot", "task-prompt.md");
  if (existsSync(customPromptPath)) {
    return readFileSync(customPromptPath, "utf-8");
  }

  const repoName = workDir.split("/").pop()?.replace(/-[a-f0-9]{8}$/, "") ?? "unknown";

  let tree = "";
  try {
    const entries = readdirSync(workDir, { withFileTypes: true })
      .filter((e) => e.name !== ".git" && e.name !== "node_modules")
      .map((e) => (e.isDirectory() ? `${e.name}/` : e.name))
      .join("\n");
    tree = entries;
  } catch {
    tree = "(unable to read directory)";
  }

  let readme = "";
  for (const name of ["README.md", "README.txt", "README"]) {
    const p = join(workDir, name);
    if (existsSync(p)) {
      const content = readFileSync(p, "utf-8");
      readme = content.slice(0, 2000);
      if (content.length > 2000) readme += "\n...(truncated)";
      break;
    }
  }

  const parts = [`Repository: ${repoName}`, `\nTop-level files:\n${tree}`];
  if (readme) parts.push(`\nREADME:\n${readme}`);
  return parts.join("\n");
}

export function buildPriorContext(contextPath: string): string {
  try {
    const raw = readFileSync(contextPath, "utf-8");
    const prior = JSON.parse(raw);
    if (!prior.questions?.length) return "";

    const answered = (prior.questions as Question[])
      .map((q) => `Q: ${q.question}\nA: ${q.answer ?? "(no answer provided)"}`)
      .join("\n\n");

    return `\n\nPrior clarification:\n${answered}`;
  } catch {
    throw new Error(`Failed to read context file: ${contextPath}`);
  }
}
