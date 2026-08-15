import type { CompetitionRecord as CompetitionRecordData } from "@/lib/tba";

const PLAYOFF_LABEL: Record<string, string> = {
  won: "Won event",
  eliminated: "Eliminated in playoffs",
  playing: "Playoffs in progress",
};

function formatDateRange(startDate: string, endDate: string): string {
  const format = (iso: string) =>
    new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(
      new Date(iso)
    );

  return startDate === endDate ? format(startDate) : `${format(startDate)}–${format(endDate)}`;
}

function formatResult(event: CompetitionRecordData["events"][number]): string | null {
  const parts: string[] = [];

  if (event.rank !== null) {
    parts.push(event.numTeams !== null ? `Rank ${event.rank} of ${event.numTeams}` : `Rank ${event.rank}`);
  }
  if (event.qualRecord) {
    const { wins, losses, ties } = event.qualRecord;
    parts.push(`${wins}-${losses}-${ties}`);
  }
  const playoffLabel = event.playoffStatus ? PLAYOFF_LABEL[event.playoffStatus] : null;
  if (playoffLabel) parts.push(playoffLabel);

  return parts.length > 0 ? parts.join(" · ") : null;
}

/**
 * Displays TBA-sourced events, results, and awards for a robot's season.
 * Data comes from lib/tba.ts, cached per docs/specs/0009-tba-integration.md.
 * Renders nothing if there are no events and no awards — callers should
 * still guard on the fetch itself returning null.
 */
export function CompetitionRecord({ record }: { record: CompetitionRecordData }) {
  const { events, awards } = record;
  if (events.length === 0 && awards.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="font-display text-h3 text-aluminum">Competition Record</h2>

      {events.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <caption className="sr-only">Events attended and results</caption>
            <thead>
              <tr className="border-b border-ink-600">
                <th scope="col" className="py-3 pr-6 text-small font-medium text-steel-200">
                  Event
                </th>
                <th scope="col" className="py-3 pr-6 text-small font-medium text-steel-200">
                  Dates
                </th>
                <th scope="col" className="py-3 text-small font-medium text-steel-200">
                  Result
                </th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => {
                const result = formatResult(event);
                return (
                  <tr key={event.key} className="border-b border-ink-600">
                    <th scope="row" className="py-3 pr-6 align-top font-medium text-aluminum">
                      {event.name}
                      {event.location && (
                        <span className="block text-small font-normal text-steel-400">
                          {event.location}
                        </span>
                      )}
                    </th>
                    <td className="py-3 pr-6 align-top font-mono text-small text-steel-200">
                      {formatDateRange(event.startDate, event.endDate)}
                    </td>
                    <td className="py-3 align-top font-mono text-small text-aluminum">
                      {result ?? "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {awards.length > 0 && (
        <ul className="mt-6 flex flex-col gap-2">
          {awards.map((award, index) => (
            <li
              key={`${award.eventKey}-${award.name}-${index}`}
              className="text-body text-aluminum"
            >
              {award.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
