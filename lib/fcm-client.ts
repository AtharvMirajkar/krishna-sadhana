/**
 * Firebase Cloud Messaging Client
 * Handles FCM token registration and management on client-side
 */

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  Messaging,
  isSupported,
} from "firebase/messaging";

let firebaseApp: FirebaseApp | null = null;
let messaging: Messaging | null = null;

const getFirebaseConfig = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
};

export class FCMService {
  private static instance: FCMService;
  private token: string | null = null;

  private constructor() {}

  static getInstance(): FCMService {
    if (!FCMService.instance) {
      FCMService.instance = new FCMService();
    }
    return FCMService.instance;
  }

  async initialize(): Promise<boolean> {
    if (typeof window === "undefined") {
      return false;
    }

    // Check if Firebase is supported
    const supported = await isSupported();
    if (!supported) {
      console.warn("FCM is not supported in this browser");
      return false;
    }

    try {
      // Initialize Firebase if not already initialized
      if (getApps().length === 0) {
        const firebaseConfig = getFirebaseConfig();
        if (
          !firebaseConfig ||
          !firebaseConfig.apiKey ||
          !firebaseConfig.projectId ||
          !firebaseConfig.messagingSenderId
        ) {
          console.warn("Firebase config is missing");
          return false;
        }
        firebaseApp = initializeApp(firebaseConfig);
      } else {
        firebaseApp = getApps()[0];
      }

      // Initialize messaging
      messaging = getMessaging(firebaseApp);

      return true;
    } catch (error) {
      console.error("Error initializing FCM:", error);
      return false;
    }
  }

  async getToken(): Promise<string | null> {
    if (!messaging) {
      const initialized = await this.initialize();
      if (!initialized) {
        return null;
      }
    }

    if (this.token) {
      return this.token;
    }

    try {
      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
      if (!vapidKey) {
        console.warn("FCM VAPID key not configured");
        return null;
      }

      const token = await getToken(messaging!, { vapidKey });
      this.token = token;
      return token;
    } catch (error) {
      console.error("Error getting FCM token:", error);
      return null;
    }
  }

  async registerToken(): Promise<boolean> {
    try {
      const token = await this.getToken();
      if (!token) {
        return false;
      }

      // Send token to backend
      const response = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fcm_token: token,
          device_info: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
          },
        }),
      });

      return response.ok;
    } catch (error) {
      console.error("Error registering FCM token:", error);
      return false;
    }
  }

  async unregisterToken(): Promise<boolean> {
    try {
      await fetch("/api/notifications/subscribe", {
        method: "DELETE",
      });
      this.token = null;
      return true;
    } catch (error) {
      console.error("Error unregistering FCM token:", error);
      return false;
    }
  }

  onMessage(callback: (payload: any) => void) {
    if (!messaging) {
      this.initialize().then(() => {
        if (messaging) {
          onMessage(messaging, callback);
        }
      });
      return;
    }

    onMessage(messaging, callback);
  }

  hasToken(): boolean {
    return this.token !== null;
  }
}

