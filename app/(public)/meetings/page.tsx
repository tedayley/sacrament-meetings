import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { connection } from "next/server";
import { getPaginatedMeetings } from "@/lib/meetings-db";
import MeetingCard from "@/components/MeetingCard";
import MeetingSearch from "@/components/MeetingSearch";
import Pagination from "@/components/Pagination";

export const metadata: Metadata = {
  title: "Meetings",
  description:
    "Browse scheduled sacrament meetings and review their agendas, speakers, hymns, and ward business.",
};

interface MeetingsPageProps {
  searchParams: Promise<{
    query?: string | string[];
    page?: string | string[];
  }>;
}

export default async function MeetingsPage({
  searchParams,
}: MeetingsPageProps) {
  const params = await searchParams;
  const query = Array.isArray(params.query) ? params.query[0] : params.query;
  const page = Array.isArray(params.page) ? params.page[0] : params.page;
  await connection();
  const [session, meetingResults] = await Promise.all([
    auth(),
    getPaginatedMeetings(query, page),
  ]);
  const {
    meetings,
    totalCount,
    totalPages,
    currentPage,
  } = meetingResults;
  const canManageMeetings = Boolean(session?.user);

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
        <Suspense
          fallback={
            <div className="h-12 w-full max-w-xl animate-pulse rounded-md bg-surface" />
          }
        >
          <MeetingSearch />
        </Suspense>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold">
            Meeting History
          </h2>

          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm text-muted">
              {totalCount} {totalCount === 1 ? "meeting" : "meetings"}
            </span>
            {canManageMeetings && (
              <Link
                href="/meetings/new"
                className="neon-button rounded-md px-4 py-2 text-sm font-semibold"
              >
                Create meeting
              </Link>
            )}
          </div>
        </div>

        {meetings.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {meetings.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                canManage={canManageMeetings}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-card border border-border bg-surface p-10 text-center">
            <h3 className="mb-2 text-xl font-semibold">
              No Meetings Found
            </h3>

            <p className="text-muted">
              {query
                ? `No meetings match “${query}”. Try a different search.`
                : "There are currently no sacrament meetings available."}
            </p>
          </div>
        )}

        <Suspense fallback={null}>
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </Suspense>
      </section>

    </div>
  );
}
