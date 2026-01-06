import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import type { NotificationSettings } from "@/lib/models/NotificationSettings";

export const dynamic = "force-dynamic";

// GET user notification settings
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const settings = await db
      .collection<NotificationSettings>("notification_settings")
      .findOne({ user_id: user.id });

    if (!settings) {
      // Return default settings
      return NextResponse.json({
        enabled: false,
        dailyReminders: {
          enabled: false,
          times: ["09:00", "18:00"],
        },
        streakProtection: {
          enabled: false,
          alertTime: "20:00",
        },
        weeklySummary: {
          enabled: false,
          day: 0,
          time: "09:00",
        },
      });
    }

    return NextResponse.json({
      enabled: settings.enabled,
      dailyReminders: settings.dailyReminders,
      streakProtection: settings.streakProtection,
      weeklySummary: settings.weeklySummary,
      customMessage: settings.customMessage,
    });
  } catch (error) {
    console.error("Error fetching notification settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch notification settings" },
      { status: 500 }
    );
  }
}

// POST/PUT update notification settings
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      enabled,
      dailyReminders,
      streakProtection,
      weeklySummary,
      customMessage,
    } = body;

    const db = await getDb();
    const now = new Date();

    const settings: Partial<NotificationSettings> = {
      user_id: user.id,
      enabled: enabled ?? false,
      dailyReminders: dailyReminders || {
        enabled: false,
        times: ["09:00", "18:00"],
      },
      streakProtection: streakProtection || {
        enabled: false,
        alertTime: "20:00",
      },
      weeklySummary: weeklySummary || {
        enabled: false,
        day: 0,
        time: "09:00",
      },
      customMessage,
      updated_at: now,
    };

    await db
      .collection<NotificationSettings>("notification_settings")
      .updateOne(
        { user_id: user.id },
        {
          $set: settings,
          $setOnInsert: {
            created_at: now,
          },
        },
        { upsert: true }
      );

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Error updating notification settings:", error);
    return NextResponse.json(
      { error: "Failed to update notification settings" },
      { status: 500 }
    );
  }
}

