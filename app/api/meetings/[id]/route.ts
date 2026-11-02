
import { NextResponse } from "next/server";
import { getMeetingById } from "@/lib/meetings-db";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    // Retrieve the ID from the URL
    const { id } = await params;

    // Validate the ID
    const meetingId = Number(id);

    if (!Number.isInteger(meetingId) || meetingId <= 0) {
      return NextResponse.json(
        { error: "Invalid meeting ID." },
        { status: 400 }
      );
    }

    // Retrieve the meeting
    const meeting = await getMeetingById(meetingId);

    // Check whether the meeting exists
    if (!meeting) {
      return NextResponse.json(
        { error: "Meeting not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(meeting, { status: 200 });

  } catch (error) {
    console.error("Error retrieving meeting:", error);

    return NextResponse.json(
      { error: "Unable to retrieve meeting." },
      { status: 500 }
    );
  }
}
