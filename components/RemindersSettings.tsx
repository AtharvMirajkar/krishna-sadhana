"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import {
  Bell,
  BellOff,
  Clock,
  Flame,
  BarChart3,
  MessageSquare,
  Plus,
  X,
  Save,
  CheckCircle,
} from "lucide-react";
import {
  NotificationService,
  type ReminderSettings,
} from "@/lib/notifications";
import { FCMService } from "@/lib/fcm-client";
import { RemindersSkeleton } from "./skeleton";

export function RemindersSettings() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [initialLoading, setInitialLoading] = useState(true);
  const [settings, setSettings] = useState<ReminderSettings>({
    enabled: false,
    dailyReminders: {
      enabled: false,
      times: ["09:00", "18:00"],
    },
    streakProtection: {
      enabled: false,
      alertTime: "20:00",
    },
    weeklySummary: {
      enabled: false,
      day: 0,
      time: "09:00",
    },
  });
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>("default");
  const [pushSubscribed, setPushSubscribed] = useState(false);
  const [saved, setSaved] = useState(false);
  const [operationLoading, setOperationLoading] = useState(false);
  const notificationService = NotificationService.getInstance();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
      return;
    }

    if (user) {
      loadSettings();
      checkPermission();
      checkPushSubscription();
    }
  }, [user, authLoading, router]);

  const loadSettings = async () => {
    try {
      // Try to load from backend first
      const response = await fetch("/api/notifications/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      } else {
        // Fallback to local storage
        const loaded = notificationService.getSettings();
        setSettings(loaded);
      }
    } catch (error) {
      // Fallback to local storage
      const loaded = notificationService.getSettings();
      setSettings(loaded);
    } finally {
      // setLoading(false);
    }
  };

  const checkPermission = async () => {
    const permission = notificationService.getPermission();
    setNotificationPermission(permission);
  };

  const checkPushSubscription = async () => {
    const fcmService = FCMService.getInstance();
    const hasToken = fcmService.hasToken();
    setPushSubscribed(hasToken);
  };

  const requestPermission = async () => {
    setOperationLoading(true);
    try {
      const permission = await notificationService.requestPermission();
      setNotificationPermission(permission);

      if (permission === "granted") {
        // Initialize FCM and register token
        const fcmService = FCMService.getInstance();
        await fcmService.initialize();
        const success = await fcmService.registerToken();
        if (success) {
          setPushSubscribed(true);
        }
      }
    } catch (error) {
      console.error("Error requesting permission:", error);
    } finally {
      // setLoading(false);
    }
  };

  const handleSave = async () => {
    setOperationLoading(true);
    try {
      // Save to backend
      const response = await fetch("/api/notifications/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      // Also save locally for backward compatibility
      notificationService.updateSettings(settings);

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      // setLoading(false);
    }
  };

  const addReminderTime = () => {
    setSettings({
      ...settings,
      dailyReminders: {
        ...settings.dailyReminders,
        times: [...settings.dailyReminders.times, "12:00"],
      },
    });
  };

  const removeReminderTime = (index: number) => {
    const newTimes = settings.dailyReminders.times.filter(
      (_, i) => i !== index
    );
    setSettings({
      ...settings,
      dailyReminders: {
        ...settings.dailyReminders,
        times: newTimes,
      },
    });
  };

  const updateReminderTime = (index: number, time: string) => {
    const newTimes = [...settings.dailyReminders.times];
    newTimes[index] = time;
    setSettings({
      ...settings,
      dailyReminders: {
        ...settings.dailyReminders,
        times: newTimes,
      },
    });
  };

  const testNotification = async () => {
    if (!notificationService.hasPermission() || !pushSubscribed) {
      alert(
        "Please enable notifications and ensure push subscription is active."
      );
      return;
    }

    // setLoading(true);
    try {
      const response = await fetch("/api/notifications/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "🕉️ Test Notification",
          message:
            settings.customMessage ||
            "This is a test notification! Your reminders are working correctly. 🙏",
        }),
      });

      if (response.ok) {
        alert("Test notification sent! Check your notifications.");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to send test notification");
      }
    } catch (error) {
      console.error("Error sending test notification:", error);
      alert("Failed to send test notification. Please try again.");
    } finally {
      // setLoading(false);
    }
  };

  if (authLoading || initialLoading) {
    return <RemindersSkeleton />;
  }

  if (!user) {
    return null;
  }

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 dark:from-amber-400 dark:via-orange-400 dark:to-amber-500 mb-4">
            Reminders & Notifications
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Stay consistent with your spiritual practice through timely
            reminders
          </p>
        </div>

        {/* Notification Permission Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Browser Notifications
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {notificationPermission === "granted"
                    ? "Notifications are enabled"
                    : notificationPermission === "denied"
                    ? "Notifications are blocked. Please enable them in your browser settings."
                    : "Enable browser notifications to receive reminders"}
                </p>
              </div>
            </div>
            {notificationPermission !== "granted" && (
              <button
                onClick={requestPermission}
                disabled={operationLoading}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {operationLoading ? "Enabling..." : "Enable Notifications"}
              </button>
            )}
            {notificationPermission === "granted" && (
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Enabled</span>
                </div>
                {pushSubscribed && (
                  <span className="text-xs text-green-500 dark:text-green-400">
                    Push subscribed
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-lg ${
                  settings.enabled
                    ? "bg-gradient-to-br from-green-500 to-green-600"
                    : "bg-gray-300 dark:bg-gray-700"
                }`}
              >
                {settings.enabled ? (
                  <Bell className="w-6 h-6 text-white" />
                ) : (
                  <BellOff className="w-6 h-6 text-gray-500" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Enable Reminders
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Turn on all reminder features
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                setSettings({ ...settings, enabled: !settings.enabled })
              }
              className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${
                settings.enabled
                  ? "bg-gradient-to-r from-green-500 to-green-600"
                  : "bg-gray-300 dark:bg-gray-700"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                  settings.enabled ? "translate-x-8" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Daily Reminders */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg text-white">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    Daily Chanting Reminders
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get reminded to chant at specific times each day
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    dailyReminders: {
                      ...settings.dailyReminders,
                      enabled: !settings.dailyReminders.enabled,
                    },
                  })
                }
                className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${
                  settings.dailyReminders.enabled
                    ? "bg-gradient-to-r from-amber-500 to-orange-600"
                    : "bg-gray-300 dark:bg-gray-700"
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                    settings.dailyReminders.enabled
                      ? "translate-x-8"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {settings.dailyReminders.enabled && (
              <div className="ml-16 space-y-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                <div className="space-y-2">
                  {settings.dailyReminders.times.map((time, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="time"
                        value={time}
                        onChange={(e) =>
                          updateReminderTime(index, e.target.value)
                        }
                        className="px-4 py-2 border-2 border-amber-300 dark:border-amber-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      {settings.dailyReminders.times.length > 1 && (
                        <button
                          onClick={() => removeReminderTime(index)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={addReminderTime}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/40 transition-colors font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  Add Reminder Time
                </button>
              </div>
            )}
          </div>

          {/* Streak Protection */}
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg text-white">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    Streak Protection Alerts
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get alerted if you havent chanted and your streak is at
                    risk
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    streakProtection: {
                      ...settings.streakProtection,
                      enabled: !settings.streakProtection.enabled,
                    },
                  })
                }
                className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${
                  settings.streakProtection.enabled
                    ? "bg-gradient-to-r from-orange-500 to-red-600"
                    : "bg-gray-300 dark:bg-gray-700"
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                    settings.streakProtection.enabled
                      ? "translate-x-8"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {settings.streakProtection.enabled && (
              <div className="ml-16 bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Alert Time
                </label>
                <input
                  type="time"
                  value={settings.streakProtection.alertTime}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      streakProtection: {
                        ...settings.streakProtection,
                        alertTime: e.target.value,
                      },
                    })
                  }
                  className="px-4 py-2 border-2 border-orange-300 dark:border-orange-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            )}
          </div>

          {/* Weekly Summary */}
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg text-white">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    Weekly Progress Summary
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive a summary of your weekly chanting progress
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    weeklySummary: {
                      ...settings.weeklySummary,
                      enabled: !settings.weeklySummary.enabled,
                    },
                  })
                }
                className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${
                  settings.weeklySummary.enabled
                    ? "bg-gradient-to-r from-purple-500 to-purple-600"
                    : "bg-gray-300 dark:bg-gray-700"
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                    settings.weeklySummary.enabled
                      ? "translate-x-8"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {settings.weeklySummary.enabled && (
              <div className="ml-16 space-y-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Day of Week
                  </label>
                  <select
                    value={settings.weeklySummary.day}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        weeklySummary: {
                          ...settings.weeklySummary,
                          day: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full px-4 py-2 border-2 border-purple-300 dark:border-purple-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {daysOfWeek.map((day, index) => (
                      <option key={index} value={index}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={settings.weeklySummary.time}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        weeklySummary: {
                          ...settings.weeklySummary,
                          time: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2 border-2 border-purple-300 dark:border-purple-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Custom Message */}
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg text-white">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Custom Reminder Message
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Personalize your daily reminder messages
                </p>
              </div>
            </div>
            <div className="ml-16 bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <textarea
                value={settings.customMessage || ""}
                onChange={(e) =>
                  setSettings({ ...settings, customMessage: e.target.value })
                }
                placeholder="Enter your custom reminder message (e.g., 'Time to connect with Krishna! 🙏')"
                className="w-full px-4 py-2 border-2 border-green-300 dark:border-green-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                rows={3}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSave}
              disabled={operationLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {operationLoading ? "Saving..." : "Save Settings"}
            </button>
            {notificationPermission === "granted" && (
              <button
                onClick={testNotification}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Bell className="w-5 h-5" />
                Test Notification
              </button>
            )}
          </div>

          {saved && (
            <div className="mt-4 p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 rounded-lg flex items-center gap-2 text-green-800 dark:text-green-300">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">
                Settings saved successfully!
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
