// TODO(spec-future): wire up GSAP ScrollTrigger scrub once CAD frame export exists

/**
 * Stub only — homepage hero image sequence. Renders the first frame
 * (or a placeholder if no frames exist yet). Exists so other code can
 * import the component name without breaking later.
 */
export function ScrubSequence({
  frames,
  className = "",
}: {
  frames: string[];
  className?: string;
}) {
  if (frames.length === 0) {
    return (
      <div
        className={`flex aspect-video w-full items-center justify-center border border-ink-600 bg-ink-800 ${className}`}
      >
        <span className="font-mono text-label uppercase tracking-widest text-steel-400">
          Sequence coming soon
        </span>
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element -- frame count/dimensions vary; not next/image until real usage lands
  return <img src={frames[0]} alt="" className={className} />;
}
