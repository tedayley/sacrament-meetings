import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MeetingForm from '@/components/MeetingForm';
import { updateMeeting } from '@/lib/actions';
import { getMeetingById } from '@/lib/meetings-db';

interface EditMeetingPageProps {
  params: Promise<{ id: string }>;
}

export default function EditMeetingPage({ params }: EditMeetingPageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-64 items-center justify-center">
          <p className="animate-pulse text-neon-blue">Loading meeting...</p>
        </div>
      }
    >
      <EditMeetingContent params={params} />
    </Suspense>
  );
}

async function EditMeetingContent({ params }: EditMeetingPageProps) {
  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id)) {
    notFound();
  }

  const meetingId = Number(id);
  if (!Number.isSafeInteger(meetingId)) {
    notFound();
  }

  const meeting = await getMeetingById(meetingId);
  if (!meeting) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6">
      <div className="space-y-2">
        <Link href="/meetings" className="neon-link text-sm font-semibold">
          ← Back to meetings
        </Link>
        <h1 className="text-3xl font-bold">Edit Meeting</h1>
        <p className="text-muted">Update this meeting&apos;s agenda and assignments.</p>
      </div>
      <MeetingForm meeting={meeting} action={updateMeeting.bind(null, id)} />
    </main>
  );
}
