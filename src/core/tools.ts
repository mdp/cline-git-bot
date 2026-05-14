import { createTool } from "@clinebot/sdk";
import type { Question, ReviewResult } from "../types.js";

export interface ClarificationCapture {
  questions: Question[] | null;
}

export function createClarificationTool(capture: ClarificationCapture, stopFn: () => void) {
  return createTool({
    name: "request_clarification",
    description:
      "Call this when you cannot proceed without answers to specific questions. " +
      "Provide a list of questions with unique IDs. The session will exit and the caller " +
      "will provide answers before re-invoking. Do NOT call this for optional information — " +
      "only when the task is truly ambiguous.",
    inputSchema: {
      type: "object",
      properties: {
        questions: {
          type: "array",
          description: "List of questions that need answers before proceeding",
          items: {
            type: "object",
            properties: {
              id: { type: "string", description: "Short unique identifier, e.g. 'target_env'" },
              question: { type: "string", description: "The question to ask" },
            },
            required: ["id", "question"],
          },
          minItems: 1,
        },
      },
      required: ["questions"],
    },
    execute: async (input: { questions: Question[] }) => {
      capture.questions = input.questions;
      setImmediate(stopFn);
      return "Clarification requested. The session will exit with your questions.";
    },
  });
}

export function createSubmitReviewTool(
  capture: { result: Omit<ReviewResult, "status" | "error"> | null },
  stopFn: () => void,
) {
  return createTool({
    name: "submit_review",
    description:
      "Call this when you have completed your review. " +
      "Provide your verdict, a 2-3 sentence summary, and any inline comments on specific lines.",
    inputSchema: {
      type: "object",
      properties: {
        verdict: {
          type: "string",
          enum: ["approve", "request_changes", "comment"],
          description:
            "approve = all changed code is correct and production-ready; " +
            "request_changes = errors or security issues that must be fixed before merge; " +
            "comment = suggestions, questions, or mixed findings",
        },
        summary: {
          type: "string",
          description:
            "2-3 sentences: what the PR does, one key strength or concern, and your overall recommendation. No filler.",
        },
        comments: {
          type: "array",
          description: "Inline comments on specific lines of changed files",
          items: {
            type: "object",
            properties: {
              file: { type: "string", description: "File path relative to repo root" },
              line: {
                type: ["number", "null"],
                description: "Line number in the new file, or null for file-level or cross-cutting comments",
              },
              severity: {
                type: "string",
                enum: ["error", "warning", "suggestion"],
              },
              message: {
                type: "string",
                description: "Concise explanation of the issue. State problems directly.",
              },
            },
            required: ["file", "line", "severity", "message"],
          },
        },
      },
      required: ["verdict", "summary", "comments"],
    },
    execute: async (input: Omit<ReviewResult, "status" | "error">) => {
      capture.result = input;
      setImmediate(stopFn);
      return "Review submitted. Session will exit.";
    },
  });
}
