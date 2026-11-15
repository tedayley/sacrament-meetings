import Link from 'next/link';

export default function EditMeetingNotFound() {
  return (
    <main className="neon-panel mx-auto max-w-xl space-y-4 rounded-card p-8 text-center">
      <h1 className="text-3xl font-bold">Meeting not found</h1>
      <p className="text-muted">
        The meeting you are looking for does not exist or is no longer available.
      </p>
      <Link
        href="/meetings"
        className="neon-button inline-flex rounded-md px-4 py-2 text-sm font-semibold"
      >
        Back to meetings
      </Link>
    </main>
  );
}
