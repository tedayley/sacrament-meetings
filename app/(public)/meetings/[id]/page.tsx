import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getMeetingById } from "@/lib/meetings-db";
import MeetingDetail from "@/components/MeetingDetails";

interface MeetingPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function MeetingPage({
  params,
}: MeetingPageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-64 items-center justify-center">
          <p className="animate-pulse text-neon-blue">
            Loading meeting details...
          </p>
        </div>
      }
    >
      <MeetingContent params={params} />
    </Suspense>
  );
}

async function MeetingContent({ params }: MeetingPageProps) {
  const { id } = await params;
  const meetingId = Number(id);

  if (!Number.isInteger(meetingId) || meetingId <= 0) {
    notFound();
  }

  const meeting = await getMeetingById(meetingId);

  if (!meeting) {
    notFound();
  }

  return <MeetingDetail meeting={meeting} />;
}
