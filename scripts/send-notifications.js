/**
 * Script to send notifications via FCM (can be run as a cron job)
 * Usage: node scripts/send-notifications.js
 *
 * Set up as a cron job to run every minute:
 * * * * * * node /path/to/scripts/send-notifications.js
 *
 * Or use GitHub Actions, Vercel Cron, or other scheduling services
 */

const https = require("https");
const http = require("http");

// Load environment variables from .env.local if available
require("dotenv").config({ path: ".env.local" });

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.APP_URL ||
  "http://localhost:3000";
const CRON_SECRET = process.env.CRON_SECRET || "your-secret-key";

const url = new URL(`${API_URL}/api/notifications/send`);

const options = {
  hostname: url.hostname,
  port: url.port || (url.protocol === "https:" ? 443 : 80),
  path: url.pathname,
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
        const result = JSON.parse(data);
        console.log(
          `✓ Notifications sent successfully. Sent to ${result.notificationsSent} users (${result.totalAttempted} attempted, ${result.invalidTokensRemoved} invalid tokens removed).`
        );
      } else {
        console.error(`✗ Error: ${res.statusCode} - ${data}`);
        process.exit(1);
      }
    });
  }
);

request.on("error", (error) => {
  console.error(`✗ Request error: ${error.message}`);
  process.exit(1);
});

request.end();
