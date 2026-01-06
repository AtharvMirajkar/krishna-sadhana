import { NextRequest, NextResponse } from "next/server";
import { getNotificationScheduleTimes } from "@/lib/notification-scheduler";

export const dynamic = "force-dynamic";

/**
 * GET /api/notifications/schedule
 * Returns the next scheduled notification times
 * Useful for debugging and monitoring
 */
export async function GET() {
  try {
    const scheduledTimes = await getNotificationScheduleTimes();

    return NextResponse.json({
      scheduledTimes: scheduledTimes.map((date) => ({
        time: date.toISOString(),
        localTime: date.toLocaleString(),
        minutesFromNow: Math.round((date.getTime() - Date.now()) / 60000),
      })),
      count: scheduledTimes.length,
    });
  } catch (error) {
    console.error("Error getting notification schedule:", error);
    return NextResponse.json(
      { error: "Failed to get notification schedule" },
      { status: 500 }
    );
  }
}
