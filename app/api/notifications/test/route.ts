import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { sendFCMNotification } from "@/lib/firebase";
import type { PushSubscription } from "@/lib/models/NotificationSettings";

export const dynamic = "force-dynamic";

// POST send test notification to current user
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const subscription = await db
      .collection<PushSubscription>("push_subscriptions")
      .findOne({ user_id: user.id });

    if (!subscription || !subscription.fcm_token) {
      return NextResponse.json(
        { error: "No FCM token registered for this user" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, message } = body;

    const result = await sendFCMNotification(
      subscription.fcm_token,
      {
        title: title || "🕉️ Test Notification",
        body:
          message ||
          "This is a test notification from Krishna Bhakti app! 🙏",
      }
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Test notification sent successfully",
      });
    } else if (result.invalidToken) {
      // Remove invalid token
      await db
        .collection("push_subscriptions")
        .deleteOne({ user_id: user.id });

      return NextResponse.json(
        { error: "Invalid FCM token. Please re-enable notifications." },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to send test notification" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error sending test notification:", error);
    return NextResponse.json(
      { error: "Failed to send test notification" },
      { status: 500 }
    );
  }
}

