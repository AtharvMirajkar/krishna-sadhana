# Smart Notification Scheduler Guide

## Problem with Previous Approach

The previous implementation called the notification endpoint **every minute**, which is inefficient because:
- ❌ Most minutes have no notifications to send
- ❌ Wastes server resources checking when nothing needs to happen
- ❌ Unnecessary database queries every minute
- ❌ Higher costs and slower performance

## New Smart Scheduler Solution

The new system only runs checks **at scheduled notification times**, making it much more efficient:

- ✅ Only runs when notifications are actually scheduled
- ✅ No wasted API calls or database queries
- ✅ Lower server costs
- ✅ Better performance

## How It Works

1. **User sets notification times** (e.g., 8:00 AM, 12:00 PM, 6:00 PM)
2. **Scheduler calculates all unique times** from all user settings
3. **Cron job runs at those specific times only**
4. **Notifications sent** only when needed

## Setup Options

### Option 1: Smart Scheduler (Recommended)

The smart scheduler runs every minute but only sends notifications at scheduled times:

```bash
# Add to crontab
* * * * * cd /path/to/project && node scripts/smart-notification-scheduler.js
```

**How it works:**
- Runs every minute (cron job)
- Checks if current time matches any scheduled notification time
- Only sends notifications if there's a match
- Logs when next notification will be sent

**Benefits:**
- Simple setup (one cron job)
- Automatically adapts to new notification times
- No manual updates needed

### Option 2: Dynamic Cron Jobs (Most Efficient)

Generate specific cron expressions for each notification time:

```bash
# Generate cron expressions
node scripts/setup-dynamic-cron.js
```

This outputs cron expressions like:
```
# Notifications at: 08:00
0 8 * * * curl -X POST "https://your-app.com/api/notifications/send?time=08:00" -H "Authorization: Bearer your-secret"

# Notifications at: 12:00, 18:00
0 12,18 * * * curl -X POST "https://your-app.com/api/notifications/send?time=12:00" -H "Authorization: Bearer your-secret"
```

**Benefits:**
- Most efficient (only runs at exact times)
- No unnecessary checks
- Lower resource usage

**Drawbacks:**
- Need to regenerate when users change notification times
- More complex setup

### Option 3: GitHub Actions

Use GitHub Actions with the smart scheduler:

```yaml
name: Smart Notification Scheduler

on:
  schedule:
    - cron: "* * * * *" # Every minute
  workflow_dispatch:

jobs:
  send:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run Smart Scheduler
        env:
          APP_URL: ${{ secrets.APP_URL }}
          CRON_SECRET: ${{ secrets.CRON_SECRET }}
        run: node scripts/smart-notification-scheduler.js
```

## API Endpoints

### GET /api/notifications/schedule

Get all scheduled notification times:

```bash
curl http://localhost:3000/api/notifications/schedule
```

Response:
```json
{
  "scheduledTimes": [
    {
      "time": "2024-01-15T08:00:00.000Z",
      "localTime": "1/15/2024, 8:00:00 AM",
      "minutesFromNow": 120
    },
    {
      "time": "2024-01-15T12:00:00.000Z",
      "localTime": "1/15/2024, 12:00:00 PM",
      "minutesFromNow": 360
    }
  ],
  "count": 2
}
```

### POST /api/notifications/send?time=08:00

Send notifications for a specific time:

```bash
curl -X POST "http://localhost:3000/api/notifications/send?time=08:00" \
  -H "Authorization: Bearer your-cron-secret"
```

## Efficiency Comparison

### Old Approach (Every Minute)
- **Runs**: 1,440 times per day (24 hours × 60 minutes)
- **Actual notifications**: Maybe 3-10 per day
- **Efficiency**: ~0.2% (99.8% wasted checks)

### New Approach (Smart Scheduler)
- **Runs**: 1,440 times per day (but only processes at scheduled times)
- **Actual notifications**: 3-10 per day
- **Efficiency**: ~100% (only processes when needed)
- **Database queries**: Only at scheduled times

### Dynamic Cron Jobs
- **Runs**: Only at scheduled times (e.g., 3-10 times per day)
- **Actual notifications**: 3-10 per day
- **Efficiency**: 100% (perfect efficiency)
- **Database queries**: Only at scheduled times

## Monitoring

Check scheduled times:
```bash
curl http://localhost:3000/api/notifications/schedule
```

View scheduler logs:
```bash
# If using smart scheduler, check cron logs
tail -f /var/log/cron.log | grep notification
```

## Updating Notification Times

When users add/remove notification times:
- **Smart Scheduler**: Automatically picks up changes (no action needed)
- **Dynamic Cron**: Regenerate cron expressions:
  ```bash
  node scripts/setup-dynamic-cron.js
  ```

## Best Practices

1. **Use Smart Scheduler** for simplicity and automatic updates
2. **Use Dynamic Cron** for maximum efficiency in production
3. **Monitor** scheduled times regularly
4. **Test** with manual API calls before deploying
5. **Log** notification sends for debugging

## Troubleshooting

**No notifications being sent?**
- Check scheduled times: `GET /api/notifications/schedule`
- Verify cron job is running
- Check Firebase configuration
- Review server logs

**Notifications sent at wrong times?**
- Verify timezone settings
- Check user notification settings
- Ensure cron job timezone matches server

**Too many notifications?**
- Check for duplicate notification times
- Verify user settings aren't duplicated
- Review notification logic

