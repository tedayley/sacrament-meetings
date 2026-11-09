import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getMeetings } from "@/lib/meetings-db";

export default function CurrentMeetingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-64 items-center justify-center">
          <p className="animate-pulse text-neon-blue">
            Finding current meeting...
          </p>
        </div>
      }
    >
      <CurrentMeetingContent />
    </Suspense>
  );
}

async function CurrentMeetingContent() {
  // Wait until the page is requested
  await connection();

  // Get today's date
  const today = new Date();

  // Calculate the next Sunday
  const daysUntilSunday = (7 - today.getDay()) % 7;

  const sunday = new Date(today);
  sunday.setDate(today.getDate() + daysUntilSunday);

  // Format date as YYYY-MM-DD
  const sundayDate = [
    sunday.getFullYear(),
    String(sunday.getMonth() + 1).padStart(2, "0"),
    String(sunday.getDate()).padStart(2, "0"),
  ].join("-");

  // Retrieve meetings
  const meetings = await getMeetings();

  // Find Sunday's meeting
  const currentMeeting = meetings.find(
    (meeting) => meeting.date === sundayDate
  );

  // Redirect to the meeting agenda
  if (currentMeeting) {
    redirect(`/meetings/${currentMeeting.id}`);
  }

  // No meeting found
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-3xl font-bold">
        No Upcoming Meeting Found
      </h1>

      <p className="text-muted">
        There is no sacrament meeting scheduled for this Sunday.
      </p>
    </div>
  );
}
