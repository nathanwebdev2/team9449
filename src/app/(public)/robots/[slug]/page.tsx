import { notFound } from "next/navigation";
import Image from "next/image";
import { getRobotBody, getRobotBySlug, getRobotImages, getRobots } from "@/lib/content/robots";
import { isPlaceholder } from "@/lib/content/is-placeholder";
import { STATUS_LABEL } from "@/components/content/RobotCard";
import { SpecTable } from "@/components/content/SpecTable";
import { StatGrid } from "@/components/content/StatGrid";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";

export function generateStaticParams() {
  return getRobots().map((robot) => ({ slug: robot.slug }));
}

function altFromFilename(src: string, robotName: string, index: number): string {
  const filename = src.split("/").pop() ?? "";
  const base = filename.replace(/\.[^.]+$/, "");
  const words = base
    .replace(/^img[_-]?/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\d+\b/g, "")
    .trim();

  if (!words) return `${robotName} photo ${index + 1}`;
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export default async function RobotDetailPage(props: PageProps<"/robots/[slug]">) {
  const { slug } = await props.params;
  const robot = getRobotBySlug(slug);
  if (!robot) notFound();

  const { hero, gallery } = getRobotImages(robot.slug);
  const body = getRobotBody(robot.slug);

  const links = [
    robot.cadUrl ? { label: "View CAD (work in progress)", href: robot.cadUrl } : null,
    robot.codeUrl ? { label: "Code", href: robot.codeUrl } : null,
    robot.binderUrl ? { label: "Binder", href: robot.binderUrl } : null,
  ].filter((link): link is { label: string; href: string } => link !== null);

  return (
    <>
      <Section className="pb-0 md:pb-0">
        <Container>
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md border border-ink-600 bg-ink-700">
            {hero ? (
              <Image
                src={hero}
                alt={`${robot.name} robot`}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
                <span className="font-display text-display text-steel-400">
                  {robot.name.charAt(0) || "?"}
                </span>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <h1 className="font-display text-h1 text-aluminum">{robot.name}</h1>
              {robot.tagline && !isPlaceholder(robot.tagline) && (
                <p className="mt-2 text-body text-steel-200">{robot.tagline}</p>
              )}
            </div>
            <div className="flex items-center gap-4 font-mono text-label uppercase tracking-widest text-steel-400">
              <span>{robot.year}</span>
              <span className="rounded-sm border border-ink-600 px-2 py-1">
                {STATUS_LABEL[robot.status]}
              </span>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="pt-12 md:pt-16">
        <Container>
          <StatGrid
            stats={[
              { label: "Weight", value: robot.weightLb ? `${robot.weightLb} lb` : null },
              { label: "Drivetrain", value: robot.drivetrain },
              { label: "Motors", value: robot.motorCount },
            ]}
          />

          <div className="mt-12">
            <SpecTable
              caption={`${robot.name} specifications`}
              rows={[
                { label: "Weight", value: robot.weightLb ? `${robot.weightLb} lb` : null },
                { label: "Drivetrain", value: robot.drivetrain },
                { label: "Motor count", value: robot.motorCount },
                { label: "Notable mechanisms", value: robot.notableMechanisms },
              ]}
            />
          </div>

          {links.length > 0 && (
            <div className="mt-12">
              <h2 className="font-display text-h3 text-aluminum">Links</h2>
              <ul className="mt-4 flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-body text-link-500 underline underline-offset-4 transition-opacity hover:opacity-80"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {gallery.length > 0 && (
            <div className="mt-12">
              <h2 className="font-display text-h3 text-aluminum">Gallery</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {gallery.map((src, index) => (
                  <div
                    key={src}
                    className="relative aspect-square overflow-hidden rounded-md border border-ink-600 bg-ink-700"
                  >
                    <Image
                      src={src}
                      alt={altFromFilename(src, robot.name, index)}
                      fill
                      sizes="(min-width: 640px) 33vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {body && (
            <div className="mt-12 max-w-[var(--measure)]">
              {body.split(/\n\s*\n/).map((paragraph, i) => (
                <p key={i} className="mt-4 text-body text-aluminum first:mt-0">
                  {paragraph.trim()}
                </p>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
