export function SubteamCard({ name, description }: { name: string; description: string }) {
  return (
    <div className="rounded-md border border-ink-600 bg-ink-800 p-5 transition-colors duration-[var(--dur-2)] ease-[var(--ease-standard)] hover:border-steel-400">
      <h3 className="font-display text-h3 text-aluminum">{name}</h3>
      <p className="mt-2 text-small text-steel-200">{description}</p>
    </div>
  );
}
