
import Link from "next/link";
import type { SacramentMeeting } from "@/lib/types";

interface MeetingCardProps {
  meeting: SacramentMeeting;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
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
    <article className="neon-panel rounded-card p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <span className="neon-chip rounded-full px-3 py-1 text-xs font-semibold">
          {meetingType} Meeting
        </span>

        <span className="text-sm text-muted">
          {meetingDate}
        </span>
      </div>

      <h2 className="mb-2 text-xl font-bold text-foreground">
        {meetingDate}
      </h2>

      <div className="mb-5 space-y-2 text-sm text-muted">
        <p>
          <span className="neon-text font-semibold">
            Presiding:
          </span>{" "}
          {meeting.presiding}
        </p>

        <p>
          <span className="neon-text font-semibold">
            Conducting:
          </span>{" "}
          {meeting.conducting}
        </p>

        <p>
          <span className="neon-text font-semibold">
            Speakers:
          </span>{" "}
          {meeting.speakers.length}
        </p>
      </div>

      <Link
        href={`/meetings/${meeting.id}`}
        className="neon-button inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold"
      >
        View Meeting Agenda
        <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
