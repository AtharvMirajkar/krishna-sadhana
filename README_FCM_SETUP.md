# FCM (Firebase Cloud Messaging) Setup Guide

This app uses **Firebase Cloud Messaging (FCM)** for push notifications, which is more reliable and easier to set up than Web Push API.

## Why FCM?

✅ **Easier Setup** - No VAPID keys needed  
✅ **Better Delivery** - Google's infrastructure handles delivery  
✅ **API-Based** - Send notifications directly via REST API  
✅ **Cross-Platform** - Works on web, iOS, Android  
✅ **Built-in Analytics** - Track notification delivery  
✅ **No Service Worker Required** - FCM handles it

## Setup Instructions

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable **Cloud Messaging** in the project settings

### 2. Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** → **General**
2. Scroll to **Your apps** section
3. Click **Web** icon (`</>`) to add a web app
4. Register your app and copy the config

### 3. Get Service Account Key

1. Go to **Project Settings** → **Service Accounts**
2. Click **Generate New Private Key**
3. Download the JSON file (this is your service account key)

### 4. Get VAPID Key (for Web)

1. Go to **Project Settings** → **Cloud Messaging**
2. Scroll to **Web configuration**
3. Copy the **Web Push certificates** (VAPID key)

### 5. Environment Variables

Add to your `.env.local` file:

```env
# Firebase Client Config (from step 2)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# FCM VAPID Key (from step 4)
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your-vapid-key

# Firebase Service Account (from step 3 - paste entire JSON as string)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}

# Cron Job Secret
CRON_SECRET=your-secure-random-secret-key
```

**Important**: For `FIREBASE_SERVICE_ACCOUNT`, you need to:

- Take the entire JSON file content
- Escape it as a single-line string, OR
- Use a JSON string in your .env file

Example:

```env
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"my-project","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
```

### 6. Set Up Smart Scheduler

**Important**: Instead of calling the endpoint every minute, we use a **smart scheduler** that only runs at scheduled notification times. This is much more efficient!

#### Option A: Smart Scheduler (Recommended)

Use the smart scheduler that only runs at scheduled times:

```bash
# Run every minute, but it only sends notifications at scheduled times
* * * * * cd /path/to/project && node scripts/smart-notification-scheduler.js
```

Or use GitHub Actions:

```yaml
name: Smart Notification Scheduler

on:
  schedule:
    - cron: "* * * * *" # Every minute (but only sends at scheduled times)
  workflow_dispatch:

jobs:
  send:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - name: Install dependencies
        run: npm install
      - name: Run Smart Scheduler
        env:
          APP_URL: ${{ secrets.APP_URL }}
          CRON_SECRET: ${{ secrets.CRON_SECRET }}
        run: node scripts/smart-notification-scheduler.js
```

#### Option B: Dynamic Cron Jobs (Most Efficient)

Generate cron expressions for specific notification times:

```bash
node scripts/setup-dynamic-cron.js
```

This will output cron expressions like:

```
# Notifications at: 08:00
0 8 * * * curl -X POST "https://your-app.com/api/notifications/send?time=08:00" -H "Authorization: Bearer your-secret"

# Notifications at: 12:00
0 12 * * * curl -X POST "https://your-app.com/api/notifications/send?time=12:00" -H "Authorization: Bearer your-secret"
```

Add these to your crontab. This way, the endpoint is only called at exact notification times!

#### Option C: Vercel Cron Jobs (Limited)

Vercel cron jobs can't be dynamically generated, so use Option A or B instead.

#### Option D: Manual Testing

```bash
# Send notification for current time
node scripts/send-notifications.js

# Or send for specific time
curl -X POST "http://localhost:3000/api/notifications/send?time=08:00" \
  -H "Authorization: Bearer your-cron-secret"
```

## How It Works

1. **User enables notifications** → Browser requests permission
2. **FCM SDK initializes** → Gets FCM token
3. **Token registered** → Stored in database
4. **Cron job runs** → Calls `/api/notifications/send` every minute
5. **Backend checks settings** → Determines who needs notifications
6. **FCM API called** → Sends notifications via Firebase
7. **User receives notification** → Even if browser is closed

## Testing

1. Enable notifications in the app (`/reminders` page)
2. Grant browser permission
3. Check browser console for FCM token
4. Manually trigger notification:
   ```bash
   curl -X POST http://localhost:3000/api/notifications/send \
     -H "Authorization: Bearer your-cron-secret"
   ```

## Troubleshooting

- **FCM not initializing?**

  - Check Firebase config in `.env.local`
  - Verify Firebase project has Cloud Messaging enabled
  - Check browser console for errors

- **Notifications not sending?**

  - Verify `FIREBASE_SERVICE_ACCOUNT` is correctly formatted
  - Check server logs for Firebase errors
  - Ensure cron job is running

- **Token not registering?**
  - Check `NEXT_PUBLIC_FIREBASE_VAPID_KEY` is set
  - Verify Firebase project settings
  - Check browser console for FCM errors

## Benefits Over Web Push API

1. **No VAPID Key Management** - Firebase handles it
2. **Better Delivery Rates** - Google's infrastructure
3. **Easier Setup** - Just Firebase config
4. **API-Based Sending** - Direct REST API calls
5. **Built-in Analytics** - Track in Firebase Console
6. **Cross-Platform** - Same code for web/mobile

## Production Checklist

- [ ] Firebase project created
- [ ] Cloud Messaging enabled
- [ ] Service account key downloaded
- [ ] VAPID key copied
- [ ] All environment variables set
- [ ] Cron job configured
- [ ] Test notifications working
- [ ] Monitor Firebase Console for delivery stats
