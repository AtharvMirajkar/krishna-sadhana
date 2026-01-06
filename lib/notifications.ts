/**
 * Browser Notification Service
 * Handles notification permissions and scheduling
 */

export interface ReminderSettings {
  enabled: boolean;
  dailyReminders: {
    enabled: boolean;
    times: string[]; // HH:mm format
  };
  streakProtection: {
    enabled: boolean;
    alertTime: string; // HH:mm format
  };
  weeklySummary: {
    enabled: boolean;
    day: number; // 0 = Sunday, 1 = Monday, etc.
    time: string; // HH:mm format
  };
  customMessage?: string;
}

const DEFAULT_SETTINGS: ReminderSettings = {
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
    day: 0, // Sunday
    time: "09:00",
  },
};

export class NotificationService {
  private static instance: NotificationService;
  private permission: NotificationPermission = "default";
  private checkInterval: NodeJS.Timeout | null = null;

  private constructor() {
    if (typeof window !== "undefined") {
      this.permission = Notification.permission;
    }
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return "denied";
    }

    if (this.permission === "default") {
      this.permission = await Notification.requestPermission();
    }

    return this.permission;
  }

  getPermission(): NotificationPermission {
    return this.permission;
  }

  hasPermission(): boolean {
    return this.permission === "granted";
  }

  private loadSettings(): ReminderSettings {
    if (typeof window === "undefined") {
      return DEFAULT_SETTINGS;
    }

    const stored = localStorage.getItem("reminderSettings");
    if (stored) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  }

  private saveSettings(settings: ReminderSettings): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("reminderSettings", JSON.stringify(settings));
  }

  getSettings(): ReminderSettings {
    return this.loadSettings();
  }

  updateSettings(settings: Partial<ReminderSettings>): void {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    this.saveSettings(updated);
  }

  showNotification(
    title: string,
    options?: NotificationOptions
  ): Notification | null {
    if (!this.hasPermission()) {
      return null;
    }

    try {
      return new Notification(title, {
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: "krishna-reminder",
        requireInteraction: false,
        ...options,
      });
    } catch (error) {
      console.error("Error showing notification:", error);
      return null;
    }
  }

  showDailyReminder(customMessage?: string): void {
    if (!this.hasPermission()) return;

    const message =
      customMessage ||
      "It's time for your daily chanting practice! 🙏 Let's continue your spiritual journey.";
    const title = "🕉️ Chanting Reminder";

    this.showNotification(title, {
      body: message,
      tag: "daily-reminder",
    });
  }

  showStreakProtectionAlert(daysRemaining: number = 1): void {
    if (!this.hasPermission()) return;

    const title = "🔥 Streak Protection Alert";
    const body =
      daysRemaining === 0
        ? "Your streak is about to end! Chant now to keep it going! 🙏"
        : `Don't forget to chant today! You have ${daysRemaining} day(s) to maintain your streak.`;

    this.showNotification(title, {
      body,
      tag: "streak-alert",
      requireInteraction: true,
    });
  }

  showWeeklySummary(stats: {
    weekTotal: number;
    streak: number;
    improvement: number;
  }): void {
    if (!this.hasPermission()) return;

    const title = "📊 Weekly Progress Summary";
    const body = `Great week! You chanted ${stats.weekTotal.toLocaleString()} times, maintained a ${stats.streak}-day streak${
      stats.improvement > 0
        ? `, and improved by ${stats.improvement}%!`
        : "!"
    } Keep up the amazing work! 🙏`;

    this.showNotification(title, {
      body,
      tag: "weekly-summary",
    });
  }

  checkAndNotify(
    hasChantedToday?: boolean,
    stats?: { weekTotal: number; streak: number; improvement: number }
  ): void {
    if (typeof window === "undefined") return;

    const settings = this.getSettings();
    if (!settings.enabled || !this.hasPermission()) {
      return;
    }

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    // Check daily reminders
    if (
      settings.dailyReminders.enabled &&
      settings.dailyReminders.times.includes(currentTime)
    ) {
      this.showDailyReminder(settings.customMessage);
    }

    // Check streak protection (once per day at specified time)
    if (
      settings.streakProtection.enabled &&
      settings.streakProtection.alertTime === currentTime &&
      hasChantedToday === false
    ) {
      this.showStreakProtectionAlert(0);
    }

    // Check weekly summary (once per week on specified day and time)
    if (
      settings.weeklySummary.enabled &&
      now.getDay() === settings.weeklySummary.day &&
      settings.weeklySummary.time === currentTime &&
      stats
    ) {
      this.showWeeklySummary(stats);
    }
  }

  startChecking(): void {
    if (this.checkInterval) {
      this.stopChecking();
    }

    // Check every minute
    this.checkInterval = setInterval(() => {
      this.checkAndNotify();
    }, 60000); // 1 minute

    // Also check immediately
    this.checkAndNotify();
  }

  stopChecking(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  // Check if it's time for a reminder (for immediate checks)
  shouldShowReminder(settings: ReminderSettings): boolean {
    if (!settings.enabled || !this.hasPermission()) {
      return false;
    }

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    return (
      (settings.dailyReminders.enabled &&
        settings.dailyReminders.times.includes(currentTime)) ||
      (settings.streakProtection.enabled &&
        settings.streakProtection.alertTime === currentTime) ||
      (settings.weeklySummary.enabled &&
        now.getDay() === settings.weeklySummary.day &&
        settings.weeklySummary.time === currentTime)
    );
  }
}

