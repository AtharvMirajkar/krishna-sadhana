import { NextRequest, NextResponse } from "next/server";
import { initializeFirebaseAdmin } from "@/lib/firebase";
import { sendNotificationsForTime } from "@/lib/notification-scheduler";

export const dynamic = "force-dynamic";

/**
 * POST /api/notifications/send
 * Send notifications for a specific time
 *
 * This endpoint should be called by a smart scheduler at specific times
 * instead of every minute. The scheduler should call this at the exact
 * times when notifications are scheduled (e.g., 8:00 AM, 12:00 PM, etc.)
 *
 * Query params:
 * - time: HH:mm format (e.g., "08:00") - optional, defaults to current time
 */
export async function POST(request: NextRequest) {
  try {
    // Verify this is called from a trusted source (scheduler, cron job)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || "your-secret-key";

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Initialize Firebase Admin
    const firebaseApp = initializeFirebaseAdmin();
    if (!firebaseApp) {
      return NextResponse.json(
        { error: "Firebase not configured" },
        { status: 500 }
      );
    }

    // Get time from query params or use current time
    const { searchParams } = new URL(request.url);
    const timeParam = searchParams.get("time");

    let time: string;
    if (timeParam) {
      time = timeParam;
    } else {
      const now = new Date();
      time = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;
    }

    // Send notifications for this specific time
    const result = await sendNotificationsForTime(time);

    return NextResponse.json({
      success: true,
      time,
      ...result,
    });
  } catch (error) {
    console.error("Error sending notifications:", error);
    return NextResponse.json(
      { error: "Failed to send notifications" },
      { status: 500 }
    );
  }
}
