import { getMeetings } from "@/lib/meetings-db";
import MeetingCard from "@/components/MeetingCard";

export default async function MeetingsPage() {
  const meetings = await getMeetings();

  // Sort meetings from newest to oldest
  const sortedMeetings = [...meetings].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  return (
    <div className="space-y-10">

      {/* Page heading */}
      <section className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-widest text-neon-blue">
          Crosswinds 3rd Ward
        </p>

        <h1 className="text-4xl font-bold">
          Sacrament Meetings
        </h1>

        <p className="max-w-2xl text-muted">
          Browse scheduled meetings and review their agendas,
          speakers, hymns, and other meeting details.
        </p>
      </section>

      {/* Meeting list heading */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold">
            Meeting History
          </h2>

          <span className="text-sm text-muted">
            {meetings.length} meetings
          </span>
        </div>

        {sortedMeetings.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {sortedMeetings.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-card border border-border bg-surface p-10 text-center">
            <h3 className="mb-2 text-xl font-semibold">
              No Meetings Found
            </h3>

            <p className="text-muted">
              There are currently no sacrament meetings available.
            </p>
          </div>
        )}
      </section>

    </div>
  );
}
