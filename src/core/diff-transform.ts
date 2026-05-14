/**
 * Transforms a raw unified diff into a structured format that gives the model
 * precise, citable line numbers and separates new content from old content.
 *
 * Format per hunk:
 *
 *   ## File: 'src/foo.ts'
 *
 *   @@ -10,7 +10,8 @@ function bar()
 *   __new hunk__
 *   10  context line          ← space prefix = unchanged
 *   11 +added line            ← + prefix = new code
 *   12  context line
 *   __old hunk__              ← only emitted when lines were removed
 *    context line
 *   -removed line
 *    context line
 *
 * Rules:
 * - New hunk: all lines present in the new file (context + additions) with
 *   their absolute new-file line numbers. These are the numbers the model
 *   should cite in inline comments.
 * - Old hunk: context + removed lines, no numbers. Purpose is to show *what*
 *   was changed, not to be cited.
 * - Old hunk is omitted entirely when the hunk has no removals.
 */
export function transformDiff(rawDiff: string): string {
  const output: string[] = [];
  const lines = rawDiff.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // File header
    if (line.startsWith("diff --git ")) {
      const match = line.match(/diff --git a\/.+ b\/(.+)/);
      if (match) {
        output.push("");
        output.push(`## File: '${match[1]}'`);
      }
      i++;
      continue;
    }

    // Skip git metadata (index, mode, rename, binary notices, --- / +++ paths)
    if (
      line.startsWith("index ") ||
      line.startsWith("--- ") ||
      line.startsWith("+++ ") ||
      line.startsWith("new file mode") ||
      line.startsWith("deleted file mode") ||
      line.startsWith("old mode") ||
      line.startsWith("new mode") ||
      line.startsWith("rename ") ||
      line.startsWith("similarity ") ||
      line.startsWith("Binary files")
    ) {
      i++;
      continue;
    }

    // Hunk header: @@ -oldStart[,oldCount] +newStart[,newCount] @@ [context]
    if (line.startsWith("@@ ")) {
      const match = line.match(/@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@(.*)/);
      if (!match) {
        i++;
        continue;
      }

      output.push("");
      output.push(line.trim()); // preserve @@ header (often contains function name)

      i++;
      const newLines: string[] = [];
      const oldLines: string[] = [];
      let newLineNum = parseInt(match[2], 10);
      let hasRemovals = false;

      while (
        i < lines.length &&
        !lines[i].startsWith("@@ ") &&
        !lines[i].startsWith("diff --git ")
      ) {
        const hunkLine = lines[i];

        if (hunkLine.startsWith("+")) {
          newLines.push(`${newLineNum} +${hunkLine.slice(1)}`);
          newLineNum++;
        } else if (hunkLine.startsWith("-")) {
          oldLines.push(`-${hunkLine.slice(1)}`);
          hasRemovals = true;
        } else if (hunkLine.startsWith(" ")) {
          // Context line: appears in both new (numbered) and old (unnumbered)
          const content = hunkLine.slice(1);
          newLines.push(`${newLineNum}  ${content}`);
          oldLines.push(` ${content}`);
          newLineNum++;
        }
        // Skip "\ No newline at end of file" and blank trailing lines
        i++;
      }

      output.push("__new hunk__");
      output.push(...newLines);

      if (hasRemovals) {
        output.push("__old hunk__");
        output.push(...oldLines);
      }

      continue;
    }

    i++;
  }

  return output.join("\n").trim();
}
