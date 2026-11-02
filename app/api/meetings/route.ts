import { NextRequest, NextResponse } from "next/server";
import { getMeetings } from "@/lib/meetings-db";

export async function GET(request: NextRequest) {
  try {
    // Retrieve all meetings
    let meetings = await getMeetings();

    // Check for an optional date filter
    const date = request.nextUrl.searchParams.get("date");

    if (date) {
      // Validate the date format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return NextResponse.json(
          { error: "Invalid date format. Use YYYY-MM-DD." },
          { status: 400 }
        );
      }

      // Filter meetings by date
      meetings = meetings.filter(
        (meeting) => meeting.date === date
      );
    }

    return NextResponse.json(meetings, { status: 200 });

  } catch (error) {
    console.error("Error retrieving meetings:", error);

    return NextResponse.json(
      { error: "Unable to retrieve meetings." },
      { status: 500 }
    );
  }
}
