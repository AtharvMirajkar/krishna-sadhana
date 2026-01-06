/**
 * Dynamic Cron Job Setup
 * 
 * This script generates cron expressions for specific notification times
 * instead of running every minute.
 * 
 * It reads user notification settings and creates cron jobs
 * that only run at the exact times when notifications are scheduled.
 * 
 * Usage:
 *   node scripts/setup-dynamic-cron.js
 * 
 * This will output cron expressions that you can add to your cron scheduler.
 * 
 * For example, if users have notifications at 8:00 AM and 6:00 PM,
 * it will generate:
 *   0 8 * * * ... (runs at 8:00 AM daily)
 *   0 18 * * * ... (runs at 6:00 PM daily)
 */

require("dotenv").config({ path: ".env.local" });

const https = require("https");
const http = require("http");

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.APP_URL || "http://localhost:3000";

/**
 * Get all scheduled notification times
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
 * Generate cron expressions for scheduled times
 */
function generateCronExpressions(scheduledTimes) {
  const cronJobs = new Map();

  scheduledTimes.forEach((scheduled) => {
    const date = new Date(scheduled.time);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const timeKey = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

    // Create cron expression: minute hour * * *
    const cronExpr = `${minutes} ${hours} * * *`;

    if (!cronJobs.has(cronExpr)) {
      cronJobs.set(cronExpr, {
        cron: cronExpr,
        times: [],
      });
    }

    cronJobs.get(cronExpr).times.push(timeKey);
  });

  return Array.from(cronJobs.values());
}

/**
 * Main function
 */
async function main() {
  try {
    console.log("📅 Generating dynamic cron jobs for notification times...\n");

    const scheduledTimes = await getScheduledTimes();

    if (scheduledTimes.length === 0) {
      console.log("No notifications scheduled. No cron jobs needed.");
      return;
    }

    const cronJobs = generateCronExpressions(scheduledTimes);

    console.log("Generated cron expressions:\n");
    console.log("# Add these to your crontab or scheduler:\n");

    const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.APP_URL || "http://localhost:3000";
    const CRON_SECRET = process.env.CRON_SECRET || "your-secret-key";

    cronJobs.forEach((job) => {
      const times = job.times.join(", ");
      console.log(
        `# Notifications at: ${times}\n${job.cron} curl -X POST "${API_URL}/api/notifications/send?time=${job.times[0]}" -H "Authorization: Bearer ${CRON_SECRET}"\n`
      );
    });

    console.log(`\nTotal: ${cronJobs.length} unique cron jobs for ${scheduledTimes.length} scheduled times`);
  } catch (error) {
    console.error(`✗ Error: ${error.message}`);
    process.exit(1);
  }
}

main();

