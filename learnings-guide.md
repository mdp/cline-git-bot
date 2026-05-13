# PR Review Prompt Engineering: Learnings Guide

Research from studying state-of-the-art open-source PR review systems. These are the ideas worth adopting — not the code, but the thinking.

---

## 1. Transform the Diff Before Sending It

Raw unified diffs are noisy. The best approach decouples old and new hunks, and adds **absolute line numbers on the new file side only**:

```
## File: 'src/auth.ts'

@@ ... @@ function login():
__new hunk__
42  unchanged line
43  unchanged line
44 +new line added
45  unchanged line
__old hunk__
 unchanged line
 unchanged line
-old line removed
 unchanged line
```

Key rules:
- New hunk: all lines (context + additions) with real post-merge line numbers the model can cite precisely
- Old hunk: only deleted lines, no numbers — context only, not citable
- If nothing was deleted, omit `__old hunk__` entirely
- Hammer in the system prompt: "focus only on lines starting with `+`"

This is the single biggest lever for getting accurate inline comment line numbers.

---

## 2. Extend Context Beyond the Default 3 Lines

Default unified diff context (3 lines) is often not enough to understand *why* code changed. Extend to 5 lines before the hunk and 1 after. More importantly, scan backwards to find the **enclosing function or class header** and extend context to include it. When the model sees:

```
+44  someNewCall()
```

…inside a function definition it can't see, it has no idea what invariants apply. Expand dynamically until the function/class declaration is visible.

---

## 3. Token Budget With Graceful Degradation

Never silently drop files. When the diff is too large:

1. Remove delete-only hunks first (no additions = nothing to review)
2. Sort remaining files: main language first, then largest diff first
3. Fill the budget file by file; files that don't fit are listed explicitly as "Additional modified files (not shown)"

The model needs to know what it *didn't* see. Surprise omissions cause hallucinated false positives about missing imports, undefined symbols, etc.

---

## 4. Use Schema Definitions as Output Instructions

Instead of prose ("please return JSON with these fields"), embed the schema directly as a type definition and a concrete example. The field description IS the instruction:

```
relevant_file: str  # "The full file path of the relevant file"
start_line: int     # "The first line of the relevant code in the new file"
end_line: int       # "The last line (inclusive). Same as start_line for single-line issues."
severity: str       # "error | warning | suggestion"
message: str        # "Concise description of the issue. No line numbers in this field."
```

End both the system prompt and the user prompt with an open code fence that the model must continue:

```
Response (valid JSON only):
```json
```

This prevents preamble text ("Sure! Here is my review...") far more reliably than asking "respond with only JSON."

---

## 5. Asymmetric Confidence Rules (The Noise Filter)

This is the most under-appreciated prompt engineering technique. State explicitly:

**High-severity (security, data loss, likely crash)**:
> "Report these even at moderate confidence. Add an explicit note about what remains uncertain rather than omitting."

**Low-severity (style, naming, minor perf)**:
> "Only flag if you can state a concrete scenario where this causes a problem. If you cannot, do not flag it."

**Never flag** (name these explicitly — models hallucinate them constantly):
- Missing imports (may be defined outside the diff)
- Undefined variables (same)
- Unused variables (might be used elsewhere)
- Missing type hints or docstrings
- Package version differences
- Changes that are already present in the diff

The model needs to be told what *not* to do as clearly as what to do.

---

## 6. Partial Codebase Acknowledgment

The model sees a slice of the codebase. Include this in every system prompt:

> "You are reviewing a diff, not the full codebase. Functions, imports, types, and variables referenced but not defined in the diff may exist in other files. Do not flag missing definitions unless you can confirm from context they are genuinely absent."

This eliminates a large class of false positives.

---

## 7. Two-Pass Self-Reflection for Comments

For each candidate inline comment, run a second model pass that:

1. Verifies the cited code actually exists in the diff (not hallucinated)
2. Assigns a score (0–10) with explicit scoring rules:
   - 0: The cited code isn't in the diff
   - 0: Docstrings, type hints, removing unused imports
   - 8–10: Security issues or likely crashes only
   - 3–7: Everything else
3. Filters out comments below a score threshold

This dramatically reduces false positives and hallucinated code references. The reflection pass can use a stronger/reasoning model than the generation pass.

---

## 8. Enumerate the Label Taxonomy

Don't let the model invent arbitrary severity or category labels. Provide an explicit canonical list in the prompt:

```
severity: "error" | "warning" | "suggestion"
category: "security" | "possible-bug" | "performance" | "correctness" | 
          "maintainability" | "best-practice" | "typo"
```

Without this, you get "Critical Issue", "Minor Concern", "Potential Problem" — inconsistent and unprocessable.

---

## 9. Don't Make the Approve/Request-Changes Decision

The model cannot know:
- Code ownership and who is responsible for sign-off
- Rollout risk and deployment context
- Team conventions not visible in the diff
- Whether failing tests are pre-existing

The most defensible design: always post a `COMMENT` review (never approve or request_changes) unless the caller explicitly opts into blocking mode AND the model flags errors. Even then, communicate uncertainty.

What the model *can* reliably do:
- Estimate reviewer effort (1–5 scale)
- Flag security concerns
- Identify likely bugs with cited evidence
- Note whether tests were added

---

## 10. Rich Context Envelope

Every review prompt should include:

- PR title, description, and branch name
- Commit messages (capped to avoid bloat)
- Main language of the PR
- Number of changed files (helps calibrate effort estimates)
- Linked ticket titles/bodies if available (GitHub Issues, Linear, etc.)
- Any user-supplied extra instructions, marked as **high priority**
- Today's date (for time-sensitive reasoning)

Mark the PR description as potentially stale: *"This description may not accurately reflect the code changes — compare against the diff rather than trusting it."*

---

## 11. Ticket Compliance via Restatement

When a ticket is linked, ask the model to restate the requirements in its own words before assessing compliance. This chain-of-thought step prevents the model from skimming. Then ask for three explicit lists:

1. Requirements that are fully met
2. Requirements that are not met or unclear
3. Requirements that require human verification (UI behavior, load testing, production data)

The third category is important — give the model an escape hatch instead of forcing it to guess about runtime behavior.

---

## 12. Tone and Framing Rules

State explicitly in the system prompt:

> "Use a matter-of-fact, helpful tone. Do not use accusatory language. Avoid filler phrases like 'Great job!', 'Thanks for your contribution', 'Overall, this looks good'. Do not speculate that a change *might* break something unless you can identify the specific code path from the diff."

Soften security headers in the output: "Possible Issue" reads better than "BUG" even when the model is confident. Confidence level can be conveyed in the body.

---

## 13. Persistent Comment Strategy

Update the same review comment on each re-run rather than creating new ones. This prevents flooding the PR with stale reviews and makes the bot feel more like a collaborator than a spammer.

Dismiss or replace previous reviews from the bot identity when a new review is posted — never leave outdated reviews visible alongside the new one.

---

## What to Apply to git-bot

In rough priority order:

1. **New diff format** (`__new hunk__` / `__old hunk__` with line numbers) — biggest accuracy win
2. **Explicit noise-filter rules** (what not to flag, named explicitly) — reduces false positives
3. **Partial codebase acknowledgment** — eliminates undefined-symbol false positives
4. **Schema-as-instructions with open code fence** — more reliable JSON output
5. **Asymmetric confidence rules** — better signal/noise on severity
6. **Rich context envelope** — PR title, commit messages, language, file count
7. **Label taxonomy** — canonical categories and severity levels
8. **Two-pass reflection** — post-MVP, adds a second model call
9. **Ticket compliance** — post-MVP, requires issue fetching infrastructure
