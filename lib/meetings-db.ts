
import { neon } from '@neondatabase/serverless';
import type { SacramentMeeting, Hymn, SpeakerItem } from './types';

// Connect to the Neon PostgreSQL database.
const sql = neon(process.env.DATABASE_URL!);

// Represents the structure returned by PostgreSQL.
interface MeetingRow {
  id: number;
  date: string | Date;
  meeting_type: string;
  presiding: string;
  conducting: string;
  announcements: string[] | null;
  opening_hymn: { number: number; name?: string; title?: string };
  opening_prayer: string;
  ward_business: { description: string }[] | null;
  stake_business: boolean;
  sacrament_hymn: { number: number; name?: string; title?: string };
  speakers: { name: string; topic: string; type?: string }[] | null;
  closing_hymn: { number: number; name?: string; title?: string };
  closing_prayer: string;
}

// Converts a database hymn into the TypeScript format.
function formatHymn(hymn: MeetingRow['opening_hymn']): Hymn {
  return {
    number: hymn.number,
    title: hymn.title ?? hymn.name ?? '',
  };
}

// Converts a database record into a SacramentMeeting.
function formatMeeting(row: MeetingRow): SacramentMeeting {
  return {
    id: row.id,
    date: row.date instanceof Date
      ? row.date.toISOString().slice(0, 10)
      : row.date.slice(0, 10),
    meetingType: row.meeting_type as SacramentMeeting['meetingType'],
    presiding: row.presiding,
    conducting: row.conducting,
    announcements: row.announcements ?? [],
    openingHymn: formatHymn(row.opening_hymn),
    openingPrayer: row.opening_prayer,
    wardBusiness: row.ward_business ?? [],
    stakeBusiness: row.stake_business,
    sacramentHymn: formatHymn(row.sacrament_hymn),
    speakers: (row.speakers ?? []).map((speaker): SpeakerItem => ({
      name: speaker.name,
      topic: speaker.topic,
      type: speaker.type === 'musical-number'
        ? 'musical-number'
        : 'speaker',
    })),
    closingHymn: formatHymn(row.closing_hymn),
    closingPrayer: row.closing_prayer,
  };
}

// Retrieves all meetings, or meetings for a specific date.
export async function getMeetings(
  date?: string | null
): Promise<SacramentMeeting[]> {
  let rows: MeetingRow[];

  if (date) {
    rows = await sql`
      SELECT *
      FROM meetings
      WHERE date = ${date}::date
      ORDER BY date ASC
    ` as unknown as MeetingRow[];
  } else {
    rows = await sql`
      SELECT *
      FROM meetings
      ORDER BY date ASC
    ` as unknown as MeetingRow[];
  }

  return rows.map(formatMeeting);
}

export interface PaginatedMeetings {
  meetings: SacramentMeeting[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

const MEETINGS_PAGE_SIZE = 6;

// Retrieves matching meetings and their count using database-side search and pagination.
export async function getPaginatedMeetings(
  query?: string | null,
  requestedPage?: string | number | null
): Promise<PaginatedMeetings> {
  const searchQuery = query?.trim() ?? '';
  const searchPattern = `%${searchQuery}%`;
  const parsedPage = Number(requestedPage);
  const page = Number.isSafeInteger(parsedPage) && parsedPage > 0
    ? parsedPage
    : 1;

  const countRows = await sql`
    SELECT COUNT(*)::int AS total_count
    FROM meetings
    WHERE ${searchQuery} = ''
      OR meeting_type ILIKE ${searchPattern}
      OR presiding ILIKE ${searchPattern}
      OR conducting ILIKE ${searchPattern}
      OR opening_prayer ILIKE ${searchPattern}
      OR closing_prayer ILIKE ${searchPattern}
      OR EXISTS (
        SELECT 1
        FROM jsonb_array_elements(COALESCE(meetings.speakers, '[]'::jsonb))
          AS speaker(value)
        WHERE speaker.value->>'name' ILIKE ${searchPattern}
          OR speaker.value->>'topic' ILIKE ${searchPattern}
      )
  ` as unknown as { total_count: number }[];

  const totalCount = countRows[0]?.total_count ?? 0;
  const totalPages = Math.ceil(totalCount / MEETINGS_PAGE_SIZE);
  const currentPage = totalPages === 0 ? 1 : Math.min(page, totalPages);
  const offset = (currentPage - 1) * MEETINGS_PAGE_SIZE;

  const rows = await sql`
    SELECT *
    FROM meetings
    WHERE ${searchQuery} = ''
      OR meeting_type ILIKE ${searchPattern}
      OR presiding ILIKE ${searchPattern}
      OR conducting ILIKE ${searchPattern}
      OR opening_prayer ILIKE ${searchPattern}
      OR closing_prayer ILIKE ${searchPattern}
      OR EXISTS (
        SELECT 1
        FROM jsonb_array_elements(COALESCE(meetings.speakers, '[]'::jsonb))
          AS speaker(value)
        WHERE speaker.value->>'name' ILIKE ${searchPattern}
          OR speaker.value->>'topic' ILIKE ${searchPattern}
      )
    ORDER BY date DESC
    LIMIT ${MEETINGS_PAGE_SIZE}
    OFFSET ${offset}
  ` as unknown as MeetingRow[];

  return {
    meetings: rows.map(formatMeeting),
    totalCount,
    totalPages,
    currentPage,
    pageSize: MEETINGS_PAGE_SIZE,
  };
}

// Retrieves a single meeting by its ID.
export async function getMeetingById(
  id: number
): Promise<SacramentMeeting | null> {
  const rows = await sql`
    SELECT *
    FROM meetings
    WHERE id = ${id}
  ` as unknown as MeetingRow[];

  return rows.length > 0 ? formatMeeting(rows[0]) : null;
}

// Mutation functions will be implemented in Week 04.
