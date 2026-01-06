/**
 * Firebase Admin SDK initialization
 * Used for server-side FCM operations
 */

import admin from "firebase-admin";

let firebaseAdmin: admin.app.App | null = null;

export function initializeFirebaseAdmin() {
  if (firebaseAdmin) {
    return firebaseAdmin;
  }

  // Check if Firebase is already initialized
  if (admin.apps.length > 0) {
    firebaseAdmin = admin.app();
    return firebaseAdmin;
  }

  // Initialize Firebase Admin
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  
  if (!serviceAccount) {
    console.warn("FIREBASE_SERVICE_ACCOUNT not set. FCM notifications will not work.");
    return null;
  }

  try {
    const serviceAccountJson = JSON.parse(serviceAccount);
    
    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert(serviceAccountJson),
    });

    return firebaseAdmin;
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error);
    return null;
  }
}

export function getFirebaseAdmin() {
  if (!firebaseAdmin) {
    return initializeFirebaseAdmin();
  }
  return firebaseAdmin;
}

/**
 * Send FCM notification to a single token
 */
export async function sendFCMNotification(
  token: string,
  notification: {
    title: string;
    body: string;
    icon?: string;
  },
  data?: Record<string, string>
) {
  const app = getFirebaseAdmin();
  if (!app) {
    throw new Error("Firebase Admin not initialized");
  }

  const message: admin.messaging.Message = {
    token,
    notification: {
      title: notification.title,
      body: notification.body,
    },
    data: data || {},
    webpush: {
      notification: {
        icon: notification.icon || "/favicon.ico",
        badge: "/favicon.ico",
      },
    },
  };

  try {
    const response = await admin.messaging().send(message);
    return { success: true, messageId: response };
  } catch (error: any) {
    // Handle invalid tokens
    if (
      error.code === "messaging/invalid-registration-token" ||
      error.code === "messaging/registration-token-not-registered"
    ) {
      return { success: false, invalidToken: true };
    }
    throw error;
  }
}

/**
 * Send FCM notification to multiple tokens
 */
export async function sendFCMNotificationToMultiple(
  tokens: string[],
  notification: {
    title: string;
    body: string;
    icon?: string;
  },
  data?: Record<string, string>
) {
  const app = getFirebaseAdmin();
  if (!app) {
    throw new Error("Firebase Admin not initialized");
  }

  if (tokens.length === 0) {
    return { successCount: 0, failureCount: 0 };
  }

  const message: admin.messaging.MulticastMessage = {
    tokens,
    notification: {
      title: notification.title,
      body: notification.body,
    },
    data: data || {},
    webpush: {
      notification: {
        icon: notification.icon || "/favicon.ico",
        badge: "/favicon.ico",
      },
    },
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    return {
      successCount: response.successCount,
      failureCount: response.failureCount,
      responses: response.responses,
    };
  } catch (error) {
    console.error("Error sending multicast message:", error);
    throw error;
  }
}

