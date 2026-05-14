import chalk from "chalk";
import type { CoreSessionEvent } from "@clinebot/sdk";
import type { RunResult, ReviewResult } from "../types.js";

export type Verbosity = "quiet" | "normal" | "verbose" | "debug";

export function printProgress(event: CoreSessionEvent, verbosity: Verbosity): void {
  if (verbosity === "quiet") return;

  if (event.type === "agent_event") {
    const { event: agentEvent } = event.payload;

    if (verbosity === "debug") {
      process.stderr.write(JSON.stringify(event) + "\n");
      return;
    }
    if (verbosity === "verbose") {
      process.stderr.write(JSON.stringify(agentEvent) + "\n");
      return;
    }

    if (agentEvent.type === "content_start" && agentEvent.toolName) {
      const input = agentEvent.input;
      let detail = "";
      if (input && typeof input === "object") {
        const inp = input as Record<string, unknown>;
        detail = (inp["path"] ?? inp["command"] ?? inp["url"] ?? inp["query"] ?? "") as string;
        if (typeof detail === "string" && detail.length > 60) {
          detail = detail.slice(0, 57) + "...";
        }
      }
      const line = detail
        ? chalk.dim(`[${agentEvent.toolName}] ${detail}`)
        : chalk.dim(`[${agentEvent.toolName}]`);
      process.stderr.write(line + "\n");
    }
  }
}

export function printResult(result: RunResult | ReviewResult): void {
  const isTTY = process.stdout.isTTY;
  if (isTTY) {
    process.stdout.write(chalk.cyan(JSON.stringify(result, null, 2)) + "\n");
  } else {
    process.stdout.write(JSON.stringify(result) + "\n");
  }
}
