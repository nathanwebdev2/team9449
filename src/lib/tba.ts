import { z } from "zod";

/**
 * Server-side client for The Blue Alliance API v3.
 * Spec: docs/specs/0009-tba-integration.md
 *
 * TBA_API_KEY must never reach the client — this module is only ever
 * imported from Server Components / server-side data loading.
 */

const TBA_BASE_URL = "https://www.thebluealliance.com/api/v3";

/** TBA data doesn't change outside competition weeks; revalidate hourly
 * rather than refetching on every request. */
const REVALIDATE_SECONDS = 60 * 60;

const recordSchema = z.object({
  wins: z.number(),
  losses: z.number(),
  ties: z.number(),
});

const eventSchema = z.object({
  key: z.string(),
  name: z.string(),
  event_type_string: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  city: z.string().nullable(),
  state_prov: z.string().nullable(),
  country: z.string().nullable(),
});
type TbaEvent = z.infer<typeof eventSchema>;

const eventStatusSchema = z.object({
  qual: z
    .object({
      num_teams: z.number().nullable(),
      ranking: z
        .object({
          rank: z.number().nullable(),
          record: recordSchema.nullable(),
        })
        .nullable(),
    })
    .nullable()
    .optional(),
  playoff: z
    .object({
      status: z.string().nullable(),
      record: recordSchema.nullable(),
    })
    .nullable()
    .optional(),
});
type TbaEventStatus = z.infer<typeof eventStatusSchema>;

// Keyed by event key; TBA omits/nulls this per-event when a team hasn't
// played there yet, so entries are optional and nullable throughout.
const eventStatusesSchema = z.record(z.string(), eventStatusSchema.nullable());

const awardSchema = z.object({
  name: z.string(),
  event_key: z.string(),
  year: z.number(),
});

const awardsSchema = z.array(awardSchema);

export interface CompetitionRecordEvent {
  key: string;
  name: string;
  eventTypeString: string;
  startDate: string;
  endDate: string;
  location: string | null;
  rank: number | null;
  numTeams: number | null;
  qualRecord: { wins: number; losses: number; ties: number } | null;
  playoffStatus: string | null;
}

export interface CompetitionRecordAward {
  name: string;
  eventKey: string;
}

export interface CompetitionRecord {
  events: CompetitionRecordEvent[];
  awards: CompetitionRecordAward[];
}

async function tbaFetch<T>(path: string, schema: z.ZodType<T>, apiKey: string): Promise<T> {
  const res = await fetch(`${TBA_BASE_URL}${path}`, {
    headers: { "X-TBA-Auth-Key": apiKey },
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    throw new Error(`TBA request failed: ${path} (${res.status})`);
  }

  const json: unknown = await res.json();
  const result = schema.safeParse(json);
  if (!result.success) {
    throw new Error(`TBA response failed validation: ${path} — ${result.error.message}`);
  }

  return result.data;
}

function locationFromEvent(event: TbaEvent): string | null {
  const parts = [event.city, event.state_prov, event.country].filter(
    (part): part is string => Boolean(part)
  );
  return parts.length > 0 ? parts.join(", ") : null;
}

function toCompetitionEvent(event: TbaEvent, status: TbaEventStatus | null): CompetitionRecordEvent {
  return {
    key: event.key,
    name: event.name,
    eventTypeString: event.event_type_string,
    startDate: event.start_date,
    endDate: event.end_date,
    location: locationFromEvent(event),
    rank: status?.qual?.ranking?.rank ?? null,
    numTeams: status?.qual?.num_teams ?? null,
    qualRecord: status?.qual?.ranking?.record ?? null,
    playoffStatus: status?.playoff?.status ?? null,
  };
}

/**
 * Fetches events, results, and awards for a team's season. Returns null
 * on any failure (missing key, network error, TBA outage, bad response
 * shape) — callers must render the page normally without a Competition
 * Record section in that case. Never throws.
 */
export async function getTeamCompetitionRecord(
  teamKey: string,
  year: number
): Promise<CompetitionRecord | null> {
  const apiKey = process.env.TBA_API_KEY;
  if (!apiKey) {
    console.warn(
      "[lib/tba] TBA_API_KEY is not set — skipping Competition Record fetch. " +
        "Set it in .env.local to enable this section."
    );
    return null;
  }

  if (!teamKey) return null;

  try {
    const [events, statuses, awards] = await Promise.all([
      tbaFetch(`/team/${teamKey}/events/${year}`, z.array(eventSchema), apiKey),
      tbaFetch(`/team/${teamKey}/events/${year}/statuses`, eventStatusesSchema, apiKey),
      tbaFetch(`/team/${teamKey}/awards/${year}`, awardsSchema, apiKey),
    ]);

    return {
      events: events
        .map((event) => toCompetitionEvent(event, statuses[event.key] ?? null))
        .sort((a, b) => a.startDate.localeCompare(b.startDate)),
      awards: awards.map((award) => ({ name: award.name, eventKey: award.event_key })),
    };
  } catch (error) {
    console.warn(
      `[lib/tba] Failed to fetch competition record for ${teamKey} / ${year}:`,
      error instanceof Error ? error.message : error
    );
    return null;
  }
}
