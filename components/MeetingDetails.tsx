
import type { SacramentMeeting } from "@/lib/types";

interface MeetingDetailsProps {
  meeting: SacramentMeeting;
}

export default function MeetingDetails({
  meeting,
}: MeetingDetailsProps) {
  const meetingDate = new Date(`${meeting.date}T00:00:00`).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  const meetingType = meeting.meetingType
    .charAt(0)
    .toUpperCase() + meeting.meetingType.slice(1);

  return (
    <article className="space-y-8">

      <header className="neon-divider border-b pb-6">
        <p className="neon-text mb-2 text-sm font-semibold uppercase tracking-widest">
          {meetingType} Meeting
        </p>

        <h1 className="neon-text text-3xl font-bold">
          Sacrament Meeting
        </h1>

        <p className="mt-2 text-muted">
          {meetingDate}
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="neon-panel rounded-card p-5">
          <h2 className="neon-text mb-2 text-sm font-semibold">
            Presiding
          </h2>
          <p className="text-foreground">{meeting.presiding}</p>
        </div>

        <div className="neon-panel rounded-card p-5">
          <h2 className="neon-text mb-2 text-sm font-semibold">
            Conducting
          </h2>
          <p className="text-foreground">{meeting.conducting}</p>
        </div>
      </section>

      {meeting.announcements && meeting.announcements.length > 0 && (
        <section>
          <h2 className="neon-text mb-3 text-xl font-bold">
            Announcements
          </h2>

          <ul className="list-inside list-disc space-y-2 text-foreground">
            {meeting.announcements.map((announcement, index) => (
              <li key={index}>{announcement}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="neon-panel rounded-card p-5">
        <h2 className="neon-text mb-4 text-xl font-bold">
          Opening
        </h2>

        <div className="space-y-3">
          <p>
            <span className="font-semibold text-muted">
              Opening Hymn:
            </span>{" "}
            {meeting.openingHymn.number} – {meeting.openingHymn.title}
          </p>

          <p>
            <span className="font-semibold text-muted">
              Opening Prayer:
            </span>{" "}
            {meeting.openingPrayer}
          </p>
        </div>
      </section>

      <section>
        <h2 className="neon-text mb-3 text-xl font-bold">
          Ward Business
        </h2>

        {meeting.wardBusiness.length > 0 ? (
          <ul className="space-y-2">
            {meeting.wardBusiness.map((item, index) => (
              <li
                key={index}
                className="neon-panel rounded-md p-3"
              >
                {item.description}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No ward business scheduled.</p>
        )}
      </section>

      <section>
        <h2 className="neon-text mb-3 text-xl font-bold">
          Stake Business
        </h2>

        <p className="text-foreground">
          {meeting.stakeBusiness
            ? "Stake business is scheduled for this meeting."
            : "No stake business scheduled."}
        </p>
      </section>

      <section className="neon-panel rounded-card p-5">
        <h2 className="neon-text mb-3 text-xl font-bold">
          Sacrament
        </h2>

        <p>
          <span className="font-semibold text-muted">
            Sacrament Hymn:
          </span>{" "}
          {meeting.sacramentHymn.number} – {meeting.sacramentHymn.title}
        </p>
      </section>

      <section>
        <h2 className="neon-text mb-4 text-xl font-bold">
          Speakers and Musical Numbers
        </h2>

        {meeting.speakers.length > 0 ? (
          <div className="space-y-3">
            {meeting.speakers.map((item, index) => (
              <div
                key={index}
                className="neon-panel rounded-card p-4"
              >
                <p className="neon-text mb-1 text-xs font-semibold uppercase tracking-wider">
                  {item.type === "speaker" ? "Speaker" : "Musical Number"}
                </p>

                <h3 className="font-semibold text-foreground">
                  {item.name}
                </h3>

                <p className="text-sm text-muted">
                  {item.topic}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No speakers or musical numbers scheduled.</p>
        )}
      </section>

      <section className="neon-panel rounded-card p-5">
        <h2 className="neon-text mb-4 text-xl font-bold">
          Closing
        </h2>

        <div className="space-y-3">
          <p>
            <span className="font-semibold text-muted">
              Closing Hymn:
            </span>{" "}
            {meeting.closingHymn.number} – {meeting.closingHymn.title}
          </p>

          <p>
            <span className="font-semibold text-muted">
              Closing Prayer:
            </span>{" "}
            {meeting.closingPrayer}
          </p>
        </div>
      </section>

    </article>
  );
}
