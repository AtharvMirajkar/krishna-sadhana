import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import type { PushSubscription } from "@/lib/models/NotificationSettings";

export const dynamic = "force-dynamic";

// POST register FCM token
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fcm_token, device_info } = body;

    if (!fcm_token) {
      return NextResponse.json(
        { error: "FCM token is required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const now = new Date();

    const subscription: Partial<PushSubscription> = {
      user_id: user.id,
      fcm_token,
      device_info: device_info || {},
      updated_at: now,
    };

    // Remove old subscriptions for this user and add new one
    await db
      .collection<PushSubscription>("push_subscriptions")
      .deleteMany({ user_id: user.id });

    await db
      .collection<PushSubscription>("push_subscriptions")
      .insertOne({
        ...subscription,
        created_at: now,
      } as PushSubscription);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error registering FCM token:", error);
    return NextResponse.json(
      { error: "Failed to register FCM token" },
      { status: 500 }
    );
  }
}

// DELETE remove push subscription
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    await db
      .collection<PushSubscription>("push_subscriptions")
      .deleteMany({ user_id: user.id });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing push subscription:", error);
    return NextResponse.json(
      { error: "Failed to remove push subscription" },
      { status: 500 }
    );
  }
}

