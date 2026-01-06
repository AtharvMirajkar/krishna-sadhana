# FCM Migration Summary

## ✅ What Changed

### Replaced Web Push API with Firebase Cloud Messaging (FCM)

**Why FCM?**
- ✅ **Easier Setup** - No VAPID key generation needed
- ✅ **API-Based Sending** - Send notifications directly via REST API
- ✅ **Better Delivery** - Google's infrastructure handles delivery
- ✅ **No Client Polling** - Backend-driven, no API calls every minute
- ✅ **Cross-Platform** - Same system works for web, iOS, Android
- ✅ **Built-in Analytics** - Track delivery in Firebase Console

### Files Changed

#### Added:
- `lib/firebase.ts` - Firebase Admin SDK for server-side FCM
- `lib/fcm-client.ts` - FCM client SDK for browser
- `app/api/notifications/test/route.ts` - Test notification endpoint
- `README_FCM_SETUP.md` - Complete FCM setup guide

#### Updated:
- `lib/models/NotificationSettings.ts` - Changed to use FCM tokens
- `app/api/notifications/subscribe/route.ts` - Now stores FCM tokens
- `app/api/notifications/send/route.ts` - Uses FCM API instead of web-push
- `components/RemindersSettings.tsx` - Uses FCM client
- `components/NotificationManager.tsx` - Initializes FCM instead of service worker

#### Removed:
- `lib/webpush.ts` - Replaced with FCM
- `public/sw.js` - Not needed with FCM
- `app/api/notifications/vapid-key/route.ts` - Not needed
- `scripts/generate-vapid-keys.js` - Not needed

#### Dependencies:
- ✅ Added: `firebase`, `firebase-admin`, `dotenv`
- ❌ Removed: `web-push`

## Architecture

```
User → Enables Notifications → Browser Permission → FCM SDK Initializes
                                                          ↓
Cron Job (every minute) → /api/notifications/send → Checks Settings → FCM API
                                                          ↓
Firebase Cloud Messaging → Delivers to User's Device
```

## Setup Required

1. **Create Firebase Project** (see `README_FCM_SETUP.md`)
2. **Get Firebase Config** - Add to `.env.local`
3. **Get Service Account Key** - Download from Firebase Console
4. **Set Environment Variables**:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   NEXT_PUBLIC_FIREBASE_VAPID_KEY=...
   FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
   CRON_SECRET=your-secret-key
   ```
5. **Set Up Cron Job** - Call `/api/notifications/send` every minute

## Benefits

1. **No Client Polling** - Eliminated inefficient API calls
2. **Better Reliability** - Google's infrastructure
3. **Easier Setup** - Just Firebase config
4. **API-Based** - Send notifications via REST API
5. **Scalable** - Handles millions of notifications
6. **Analytics** - Built-in delivery tracking

## Migration Notes

- Old Web Push subscriptions will need to be re-registered
- Users need to re-enable notifications to get FCM tokens
- Database schema changed: `push_subscriptions` now stores `fcm_token` instead of `endpoint` + `keys`

