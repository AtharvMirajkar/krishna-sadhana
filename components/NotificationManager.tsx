"use client";

import { useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { FCMService } from "@/lib/fcm-client";

/**
 * NotificationManager component
 * Initializes FCM and registers token on mount
 * Notifications are sent from backend via cron jobs using FCM API
 */
export function NotificationManager() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      return;
    }

    // Initialize FCM and register token if permission is granted
    const initializeFCM = async () => {
      if ("Notification" in window && Notification.permission === "granted") {
        try {
          const fcmService = FCMService.getInstance();
          await fcmService.initialize();

          // Check if already registered
          if (!fcmService.hasToken()) {
            await fcmService.registerToken();
          }

          // Listen for foreground messages
          fcmService.onMessage((payload) => {
            console.log("Message received:", payload);
            // You can show a custom notification UI here if needed
          });
        } catch (error) {
          console.error("Error initializing FCM:", error);
        }
      }
    };

    initializeFCM();
  }, [user]);

  return null; // This component doesn't render anything
}
