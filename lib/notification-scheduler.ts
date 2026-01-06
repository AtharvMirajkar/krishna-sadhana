/**
 * Smart Notification Scheduler
 * Schedules notifications at specific times instead of checking every minute
 */

import { getDb } from "./mongodb";
import type { NotificationSettings } from "./models/NotificationSettings";
import { sendFCMNotification, sendFCMNotificationToMultiple } from "./firebase";

interface ScheduledNotification {
  userId: string;
  type: "daily" | "streak" | "weekly";
  scheduledTime: Date;
  title: string;
  body: string;
}

/**
 * Get all notification times that need to be scheduled
 * Returns unique times when notifications should be sent
 */
export async function getNotificationScheduleTimes(): Promise<Date[]> {
  const db = await getDb();
  const settings = await db
    .collection<NotificationSettings>("notification_settings")
    .find({ enabled: true })
    .toArray();

  const times = new Set<string>();

  for (const setting of settings) {
    // Daily reminders
    if (setting.dailyReminders?.enabled && setting.dailyReminders?.times) {
      setting.dailyReminders.times.forEach((time) => {
        times.add(time);
      });
    }

    // Streak protection
    if (
      setting.streakProtection?.enabled &&
      setting.streakProtection?.alertTime
    ) {
      times.add(setting.streakProtection.alertTime);
    }

    // Weekly summary
    if (setting.weeklySummary?.enabled && setting.weeklySummary?.time) {
      times.add(setting.weeklySummary.time);
    }
  }

  // Convert to Date objects for today
  const now = new Date();
  const scheduledDates: Date[] = [];

  times.forEach((timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const scheduledDate = new Date(now);
    scheduledDate.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (scheduledDate < now) {
      scheduledDate.setDate(scheduledDate.getDate() + 1);
    }

    scheduledDates.push(scheduledDate);
  });

  return scheduledDates.sort((a, b) => a.getTime() - b.getTime());
}

/**
 * Send notifications for a specific time
 * This is called by the scheduler at the exact notification time
 */
export async function sendNotificationsForTime(time: string): Promise<{
  successCount: number;
  totalAttempted: number;
  invalidTokensRemoved: number;
}> {
  const db = await getDb();
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;
  const currentDay = now.getDay();

  // Only process if we're at the right time (within 1 minute window)
  const [targetHours, targetMinutes] = time.split(":").map(Number);
  const targetTime = new Date(now);
  targetTime.setHours(targetHours, targetMinutes, 0, 0);

  const timeDiff = Math.abs(now.getTime() - targetTime.getTime());
  if (timeDiff > 60000) {
    // More than 1 minute difference, skip
    return { successCount: 0, totalAttempted: 0, invalidTokensRemoved: 0 };
  }

  // Get all users with enabled notifications
  const settings = await db
    .collection<NotificationSettings>("notification_settings")
    .find({ enabled: true })
    .toArray();

  // Get FCM tokens
  const subscriptions = await db
    .collection("push_subscriptions")
    .find({})
    .toArray();

  const subscriptionMap = new Map(
    subscriptions.map((sub: any) => [sub.user_id, sub])
  );

  const notificationsToSend: Array<{
    token: string;
    title: string;
    body: string;
    userId: string;
  }> = [];
  const invalidTokens: string[] = [];

  for (const setting of settings) {
    const subscription = subscriptionMap.get(setting.user_id);
    if (!subscription || !subscription.fcm_token) continue;

    let shouldNotify = false;
    let notificationTitle = "";
    let notificationBody = "";

    // Check daily reminders
    if (
      setting.dailyReminders?.enabled &&
      setting.dailyReminders?.times?.includes(currentTime)
    ) {
      shouldNotify = true;
      notificationTitle = "🕉️ Chanting Reminder";
      notificationBody =
        setting.customMessage ||
        "It's time for your daily chanting practice! 🙏 Let's continue your spiritual journey.";
    }

    // Check streak protection
    if (
      setting.streakProtection?.enabled &&
      setting.streakProtection?.alertTime === currentTime
    ) {
      // Check if user has chanted today
      const today = now.toISOString().split("T")[0];
      const records = await db
        .collection("chanting_records")
        .find({
          user_id: setting.user_id,
          chant_date: today,
        })
        .toArray();

      const hasChantedToday =
        records.length > 0 && records.some((r: any) => r.chant_count > 0);

      if (!hasChantedToday) {
        shouldNotify = true;
        notificationTitle = "🔥 Streak Protection Alert";
        notificationBody =
          "Your streak is about to end! Chant now to keep it going! 🙏";
      }
    }

    // Check weekly summary
    if (
      setting.weeklySummary?.enabled &&
      setting.weeklySummary?.day === currentDay &&
      setting.weeklySummary?.time === currentTime
    ) {
      // Get stats for weekly summary
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      const weekStartStr = weekStart.toISOString().split("T")[0];

      const records = await db
        .collection("chanting_records")
        .find({
          user_id: setting.user_id,
          chant_date: { $gte: weekStartStr },
        })
        .toArray();

      const weekTotal = records.reduce(
        (sum: number, r: any) => sum + (r.chant_count || 0),
        0
      );

      // Calculate streak
      const allRecords = await db
        .collection("chanting_records")
        .find({ user_id: setting.user_id })
        .sort({ chant_date: -1 })
        .toArray();

      let streak = 0;
      const dateMap = new Map<string, number>();
      allRecords.forEach((r: any) => {
        const existing = dateMap.get(r.chant_date) || 0;
        dateMap.set(r.chant_date, existing + (r.chant_count || 0));
      });

      for (let i = 0; i < 365; i++) {
        const checkDate = new Date(now);
        checkDate.setDate(checkDate.getDate() - i);
        const dateStr = checkDate.toISOString().split("T")[0];

        if (dateMap.has(dateStr) && (dateMap.get(dateStr) || 0) > 0) {
          streak++;
        } else if (i > 0) {
          break;
        }
      }

      shouldNotify = true;
      notificationTitle = "📊 Weekly Progress Summary";
      notificationBody = `Great week! You chanted ${weekTotal.toLocaleString()} times and maintained a ${streak}-day streak! Keep up the amazing work! 🙏`;
    }

    if (shouldNotify) {
      notificationsToSend.push({
        token: subscription.fcm_token,
        title: notificationTitle,
        body: notificationBody,
        userId: setting.user_id,
      });
    }
  }

  // Send notifications in batches using FCM
  let successCount = 0;

  if (notificationsToSend.length > 0) {
    try {
      // Group by notification type for batch sending
      const notificationGroups = new Map<
        string,
        { tokens: string[]; title: string; body: string }
      >();

      notificationsToSend.forEach((notif) => {
        const key = `${notif.title}|${notif.body}`;
        if (!notificationGroups.has(key)) {
          notificationGroups.set(key, {
            tokens: [],
            title: notif.title,
            body: notif.body,
          });
        }
        notificationGroups.get(key)!.tokens.push(notif.token);
      });

      // Send each group
      for (const group of notificationGroups.values()) {
        if (group.tokens.length === 1) {
          // Single notification
          const result = await sendFCMNotification(group.tokens[0], {
            title: group.title,
            body: group.body,
          });
          if (result.success) {
            successCount++;
          } else if (result.invalidToken) {
            invalidTokens.push(group.tokens[0]);
          }
        } else {
          // Batch notification
          const result = await sendFCMNotificationToMultiple(group.tokens, {
            title: group.title,
            body: group.body,
          });
          successCount += result.successCount;
          // Track invalid tokens from batch
          if (result.responses) {
            result.responses.forEach((resp, idx) => {
              if (!resp.success && resp.error?.code?.includes("invalid")) {
                invalidTokens.push(group.tokens[idx]);
              }
            });
          }
        }
      }

      // Remove invalid tokens from database
      if (invalidTokens.length > 0) {
        await db
          .collection("push_subscriptions")
          .deleteMany({ fcm_token: { $in: invalidTokens } });
      }
    } catch (error) {
      console.error("Error sending FCM notifications:", error);
    }
  }

  return {
    successCount,
    totalAttempted: notificationsToSend.length,
    invalidTokensRemoved: invalidTokens.length,
  };
}
