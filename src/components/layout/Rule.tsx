export function Rule({ className = "" }: { className?: string }) {
  return (
    <hr aria-hidden="true" className={`h-px w-full border-0 bg-ink-600 ${className}`} />
  );
}
