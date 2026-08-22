import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getRobotBody, getRobotBySlug, getRobotImages, getRobots } from "@/lib/content/robots";
import { isPlaceholder } from "@/lib/content/is-placeholder";
import { getTeamCompetitionRecord } from "@/lib/tba";
import { buildRobotCreativeWorkJsonLd } from "@/lib/json-ld";
import { STATUS_LABEL } from "@/components/content/RobotCard";
import { SpecTable } from "@/components/content/SpecTable";
import { StatGrid } from "@/components/content/StatGrid";
import { CompetitionRecord } from "@/components/content/CompetitionRecord";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";

export function generateStaticParams() {
  return getRobots().map((robot) => ({ slug: robot.slug }));
}

export async function generateMetadata(
  props: PageProps<"/robots/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const robot = getRobotBySlug(slug);
  if (!robot) return {};

  const hasGame = robot.game && !isPlaceholder(robot.game);
  const hasTagline = robot.tagline && !isPlaceholder(robot.tagline);

  const description = [
    `${robot.name} — Yellowjackets 9449's ${robot.year} competition robot${hasGame ? ` for ${robot.game}` : ""}.`,
    hasTagline ? robot.tagline : null,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    title: robot.name,
    description,
    alternates: {
      canonical: `/robots/${robot.slug}`,
    },
  };
}

export default async function RobotDetailPage(props: PageProps<"/robots/[slug]">) {
  const { slug } = await props.params;
  const robot = getRobotBySlug(slug);
  if (!robot) notFound();

  const { hero, gallery } = getRobotImages(robot.slug, robot.name);
  const body = getRobotBody(robot.slug);
  const competitionRecord = robot.tbaTeamKey
    ? await getTeamCompetitionRecord(robot.tbaTeamKey, robot.year)
    : null;
  const creativeWorkJsonLd = buildRobotCreativeWorkJsonLd(robot, body);

  const links = [
    robot.cadUrl ? { label: "View CAD (work in progress)", href: robot.cadUrl } : null,
    robot.codeUrl ? { label: "Code", href: robot.codeUrl } : null,
    robot.binderUrl ? { label: "Binder", href: robot.binderUrl } : null,
  ].filter((link): link is { label: string; href: string } => link !== null);

  return (
    <>
      {creativeWorkJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkJsonLd) }}
        />
      )}

      <Section className="pb-0 md:pb-0">
        <Container>
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md border border-ink-600 bg-ink-700">
            {hero ? (
              <Image
                src={hero.src}
                alt={hero.alt}
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

          {competitionRecord && <CompetitionRecord record={competitionRecord} />}

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
                {gallery.map((photo) => (
                  <div
                    key={photo.src}
                    className="relative aspect-square overflow-hidden rounded-md border border-ink-600 bg-ink-700"
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
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
            <div className="mt-12 measure">
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
