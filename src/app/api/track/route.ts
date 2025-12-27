import { NextResponse } from "next/server";
import { trackFunnelEvent, type FunnelEventKey } from "@/lib/stats";

const VALID_EVENTS: FunnelEventKey[] = [
  "signup_page_view",
  "signup_form_start",
  "signup_submit",
  "signup_success",
  "signup_error",
  "signup_github_click",
];

export async function POST(request: Request) {
  try {
    const { event } = await request.json();

    if (!event || !VALID_EVENTS.includes(event)) {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });
    }

    await trackFunnelEvent(event);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to track event:", error);
    return NextResponse.json(
      { error: "Failed to track event" },
      { status: 500 }
    );
  }
}
