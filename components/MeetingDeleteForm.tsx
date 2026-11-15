'use client';

import { useActionState } from 'react';
import { deleteMeeting } from '@/lib/actions';

const initialState = { message: null, errors: {} };

export default function MeetingDeleteForm({ id }: { id: number }) {
  const [state, formAction, isPending] = useActionState(
    deleteMeeting.bind(null, id),
    initialState
  );

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm('Delete this meeting? This cannot be undone.')) {
          event.preventDefault();
        }
      }}
      className="flex flex-col items-start gap-1"
    >
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md border border-neon-blue px-4 py-2 text-sm font-semibold text-neon-blue transition hover:bg-neon-blue hover:text-background disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Deleting...' : 'Delete'}
      </button>
      {state.message && (
        <p role="alert" className="max-w-40 text-xs text-red-300" aria-live="polite">
          {state.message}
        </p>
      )}
    </form>
  );
}
