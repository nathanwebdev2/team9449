/**
 * Content owners mark unwritten fields with the literal string "[TK]"
 * (see CLAUDE.md §3). Fields, and array items, matching that exact
 * marker must be treated as empty everywhere they're displayed.
 */
export function isPlaceholder(value: unknown): boolean {
  return typeof value === "string" && value.trim() === "[TK]";
}
