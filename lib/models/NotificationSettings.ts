export interface NotificationSettings {
  _id?: string;
  user_id: string;
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
  created_at: Date;
  updated_at: Date;
}

export interface PushSubscription {
  _id?: string;
  user_id: string;
  fcm_token: string; // FCM registration token
  device_info?: {
    userAgent?: string;
    platform?: string;
  };
  created_at: Date;
  updated_at: Date;
}

