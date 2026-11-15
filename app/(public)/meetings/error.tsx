'use client';

import Link from 'next/link';
import { useEffect } from 'react';

interface MeetingsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function MeetingsError({ error, reset }: MeetingsErrorProps) {
  useEffect(() => {
    console.error('Meetings page error:', error);
  }, [error]);

  return (
    <main className="neon-panel mx-auto max-w-xl space-y-5 rounded-card p-8 text-center">
      <h1 className="text-3xl font-bold">We couldn&apos;t load the meetings</h1>
      <p className="text-muted">
        Something went wrong while loading this page. Please try again.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="neon-button rounded-md px-4 py-2 text-sm font-semibold"
        >
          Try Again
        </button>
        <Link
          href="/meetings"
          className="neon-link rounded-md border border-neon-blue px-4 py-2 text-sm font-semibold"
        >
          Back to meetings
        </Link>
      </div>
    </main>
  );
}
