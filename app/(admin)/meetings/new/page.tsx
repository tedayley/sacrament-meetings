import Link from 'next/link';
import MeetingForm from '@/components/MeetingForm';
import { createMeeting } from '@/lib/actions';

export default function NewMeetingPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-6">
      <div className="space-y-2">
        <Link href="/meetings" className="neon-link text-sm font-semibold">
          ← Back to meetings
        </Link>
        <h1 className="text-3xl font-bold">Create Meeting</h1>
        <p className="text-muted">Add the agenda and assignments for a sacrament meeting.</p>
      </div>
      <MeetingForm action={createMeeting} />
    </main>
  );
}
