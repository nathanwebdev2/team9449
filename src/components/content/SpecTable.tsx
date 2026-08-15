import { isPlaceholder } from "@/lib/content/is-placeholder";

type SpecValue = string | number | string[] | null;

export interface SpecRow {
  label: string;
  value: SpecValue;
}

function normalize(value: SpecValue): string | number | string[] | null {
  if (value === null) return null;
  if (typeof value === "string") {
    return value.trim() === "" || isPlaceholder(value) ? null : value;
  }
  if (Array.isArray(value)) {
    const real = value.filter((item) => item.trim() !== "" && !isPlaceholder(item));
    return real.length > 0 ? real : null;
  }
  return value;
}

export function SpecTable({ rows, caption }: { rows: SpecRow[]; caption?: string }) {
  const visibleRows = rows
    .map((row) => ({ label: row.label, value: normalize(row.value) }))
    .filter((row): row is { label: string; value: string | number | string[] } => row.value !== null);
  if (visibleRows.length === 0) return null;

  return (
    <table className="w-full border-collapse text-left">
      {caption && <caption className="sr-only">{caption}</caption>}
      <tbody>
        {visibleRows.map((row) => (
          <tr key={row.label} className="border-b border-ink-600">
            <th
              scope="row"
              className="w-1/3 py-3 pr-6 align-top text-small font-medium text-steel-200"
            >
              {row.label}
            </th>
            <td className="py-3 font-mono text-body text-aluminum">
              {Array.isArray(row.value) ? row.value.join(", ") : row.value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
