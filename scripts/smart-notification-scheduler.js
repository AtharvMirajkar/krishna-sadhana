/**
 * Smart Notification Scheduler
 *
 * This script calculates all notification times from user settings
 * and only triggers notifications at those specific times,
 * instead of checking every minute.
 *
 * Usage:
 *   node scripts/smart-notification-scheduler.js
 *
 * Set up as a cron job to run every minute, but it will only
 * send notifications at scheduled times.
 */

require("dotenv").config({ path: ".env.local" });

const https = require("https");
const http = require("http");

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.APP_URL ||
  "http://localhost:3000";
const CRON_SECRET = process.env.CRON_SECRET || "your-secret-key";

/**
 * Get all scheduled notification times from the API
 */
async function getScheduledTimes() {
  return new Promise((resolve, reject) => {
    const url = new URL(`${API_URL}/api/notifications/schedule`);
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === "https:" ? 443 : 80),
      path: url.pathname,
      method: "GET",
    };

    const request = (url.protocol === "https:" ? https : http).request(
      options,
      (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          if (res.statusCode === 200) {
            try {
              const result = JSON.parse(data);
              resolve(result.scheduledTimes || []);
            } catch (error) {
              reject(new Error("Failed to parse response"));
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      }
    );

    request.on("error", reject);
    request.end();
  });
}

/**
 * Send notification for a specific time
 */
function sendNotificationForTime(time) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${API_URL}/api/notifications/send?time=${time}`);
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === "https:" ? 443 : 80),
      path: url.pathname + url.search,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CRON_SECRET}`,
      },
    };

    const request = (url.protocol === "https:" ? https : http).request(
      options,
      (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          if (res.statusCode === 200) {
            try {
              const result = JSON.parse(data);
              resolve(result);
            } catch (error) {
              reject(new Error("Failed to parse response"));
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      }
    );

    request.on("error", reject);
    request.end();
  });
}

/**
 * Main scheduler logic
 */
async function runScheduler() {
  try {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    // Get all scheduled times
    const scheduledTimes = await getScheduledTimes();

    if (scheduledTimes.length === 0) {
      console.log("No notifications scheduled. Skipping.");
      return;
    }

    // Check if current time matches any scheduled time (within 1 minute window)
    const matchingTime = scheduledTimes.find((scheduled) => {
      const scheduledDate = new Date(scheduled.time);
      const timeDiff = Math.abs(now.getTime() - scheduledDate.getTime());
      return timeDiff <= 60000; // Within 1 minute
    });

    if (matchingTime) {
      console.log(
        `⏰ Sending notifications for scheduled time: ${currentTime}`
      );
      const result = await sendNotificationForTime(currentTime);
      console.log(
        `✓ Sent ${result.notificationsSent} notifications (${result.totalAttempted} attempted)`
      );
    } else {
      // No notifications scheduled for this minute
      const nextTime = scheduledTimes.find(
        (scheduled) => new Date(scheduled.time) > now
      );
      if (nextTime) {
        const minutesUntil = Math.round(
          (new Date(nextTime.time).getTime() - now.getTime()) / 60000
        );
        console.log(
          `⏸️  No notifications scheduled. Next notification in ${minutesUntil} minutes (${nextTime.localTime})`
        );
      } else {
        console.log("⏸️  No notifications scheduled.");
      }
    }
  } catch (error) {
    console.error(`✗ Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the scheduler
runScheduler();
