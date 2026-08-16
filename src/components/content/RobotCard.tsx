import Link from "next/link";
import Image from "next/image";
import type { Robot } from "@/lib/content/robot-schema";
import { isPlaceholder } from "@/lib/content/is-placeholder";

export const STATUS_LABEL: Record<Robot["status"], string> = {
  competed: "Competed",
  retired: "Retired",
  demo: "Demo",
};

export function RobotCard({ robot, hero }: { robot: Robot; hero: string | null }) {
  return (
    <Link
      href={`/robots/${robot.slug}`}
      className="group block overflow-hidden rounded-md border border-ink-600 bg-ink-800 transition-colors duration-interface ease-standard hover:border-steel-400"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink-700">
        {hero ? (
          <Image
            src={hero}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-section ease-standard group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
            <span className="font-display text-h1 text-steel-400">
              {robot.name.charAt(0) || "?"}
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-h3 text-aluminum">{robot.name}</h2>
          <span className="font-mono text-label uppercase tracking-widest text-steel-400">
            {robot.year}
          </span>
        </div>

        {robot.tagline && !isPlaceholder(robot.tagline) && (
          <p className="mt-2 text-small text-steel-200">{robot.tagline}</p>
        )}

        <span className="mt-4 inline-flex items-center rounded-sm border border-ink-600 px-2 py-1 font-mono text-label uppercase tracking-widest text-steel-400">
          {STATUS_LABEL[robot.status]}
        </span>
      </div>
    </Link>
  );
}
