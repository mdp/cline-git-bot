import { createTool } from "@clinebot/sdk";
import type { Question } from "../types.js";

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
