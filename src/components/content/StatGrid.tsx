import { isPlaceholder } from "@/lib/content/is-placeholder";

export interface Stat {
  label: string;
  value: string | number | null;
}

export function StatGrid({ stats }: { stats: Stat[] }) {
  const visibleStats = stats.filter(
    (stat) => stat.value !== null && stat.value !== "" && !isPlaceholder(stat.value)
  );
  if (visibleStats.length === 0) return null;

  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-ink-600 bg-ink-600 sm:grid-cols-3">
      {visibleStats.map((stat) => (
        <div key={stat.label} className="bg-ink-800 px-5 py-6">
          <dd className="font-mono text-h2 text-jacket-500">{stat.value}</dd>
          <dt className="mt-1 font-mono text-label uppercase tracking-widest text-steel-400">
            {stat.label}
          </dt>
        </div>
      ))}
    </dl>
  );
}
