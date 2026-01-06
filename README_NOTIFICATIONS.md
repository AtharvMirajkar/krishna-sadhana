# Notifications System Setup Guide

This app uses **Firebase Cloud Messaging (FCM)** with backend-driven notifications for optimal performance and reliability.

**Note**: This guide has been updated. For FCM setup, see `README_FCM_SETUP.md` instead.

## Architecture

- **Backend-driven**: Notifications are sent from the server via scheduled jobs (cron)
- **Web Push API**: Uses browser's native push notification service
- **Service Worker**: Handles receiving and displaying notifications
- **No client polling**: Eliminates inefficient API calls every minute

## Setup Instructions

### 1. Generate VAPID Keys

VAPID keys are required for Web Push notifications. Generate them using:

```bash
node scripts/generate-vapid-keys.js
```

This will output keys that you need to add to your `.env.local` file:

```env
VAPID_PUBLIC_KEY=your-public-key-here
VAPID_PRIVATE_KEY=your-private-key-here
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-public-key-here
VAPID_EMAIL=mailto:your-email@example.com
CRON_SECRET=your-secure-random-secret-key
```

### 2. Set Up Cron Job

Notifications are sent via a backend endpoint that should be called periodically (every minute).

#### Option A: Using a Cron Service (Recommended for Production)

Use services like:
- **Vercel Cron Jobs** (if deploying on Vercel)
- **GitHub Actions** (free, runs on schedule)
- **Cloud Scheduler** (Google Cloud)
- **AWS EventBridge** (AWS)

Example GitHub Actions workflow (`.github/workflows/notifications.yml`):

```yaml
name: Send Notifications

on:
  schedule:
    - cron: '* * * * *'  # Every minute
  workflow_dispatch:

jobs:
  send:
    runs-on: ubuntu-latest
    steps:
      - name: Send Notifications
        run: |
          curl -X POST https://your-app-url.com/api/notifications/send \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

#### Option B: Using Node.js Script (Development/Testing)

Run the script manually or set up a local cron:

```bash
# Run manually
node scripts/send-notifications.js

# Or set up a cron job (Linux/Mac)
# Add to crontab: * * * * * cd /path/to/project && node scripts/send-notifications.js
```

### 3. Environment Variables

Add to `.env.local`:

```env
# VAPID Keys (from step 1)
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
VAPID_EMAIL=mailto:admin@example.com

# Cron job authentication
CRON_SECRET=your-secure-random-secret-key

# Your app URL (for cron script)
NEXT_PUBLIC_API_URL=http://localhost:3000  # Development
# NEXT_PUBLIC_API_URL=https://your-domain.com  # Production
```

### 4. Database Collections

The system automatically creates these MongoDB collections:
- `notification_settings` - User notification preferences
- `push_subscriptions` - Web Push subscription endpoints

## How It Works

1. **User enables notifications** → Browser requests permission
2. **Service worker registers** → Handles push notifications
3. **Push subscription created** → Stored in database
4. **Cron job runs** → Checks all users' settings every minute
5. **Notifications sent** → Via Web Push API to subscribed users
6. **Service worker receives** → Displays notification to user

## Features

✅ **Daily Reminders** - Multiple times per day  
✅ **Streak Protection** - Alerts if user hasn't chanted  
✅ **Weekly Summaries** - Progress reports  
✅ **Custom Messages** - Personalized reminders  
✅ **Works offline** - Service worker handles notifications  
✅ **No polling** - Efficient backend-driven system  

## Testing

1. Enable notifications in the app (`/reminders` page)
2. Grant browser permission
3. Manually trigger notification endpoint:
   ```bash
   curl -X POST http://localhost:3000/api/notifications/send \
     -H "Authorization: Bearer your-cron-secret"
   ```

## Troubleshooting

- **Notifications not working?**
  - Check VAPID keys are set correctly
  - Verify service worker is registered (check browser DevTools)
  - Ensure cron job is running
  - Check browser console for errors

- **Service worker not registering?**
  - Ensure HTTPS in production (required for service workers)
  - Check `public/sw.js` file exists
  - Verify browser supports service workers

- **Cron job not working?**
  - Verify CRON_SECRET matches in both .env and cron service
  - Check API endpoint is accessible
  - Review server logs for errors

## Production Checklist

- [ ] Generate and set VAPID keys
- [ ] Set up cron job (every minute)
- [ ] Configure CRON_SECRET securely
- [ ] Test notifications end-to-end
- [ ] Monitor notification delivery
- [ ] Set up error logging/alerts

