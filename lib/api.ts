/**
 * API utility functions for client-side data fetching
 */

export interface Mantra {
  id: string;
  name: string;
  sanskrit: string;
  transliteration: string;
  description: string;
  audio_url?: string | null;
  category: string;
  duration_seconds: number;
  created_at: string;
}

export interface ChantingRecord {
  id: string;
  mantra_id: string;
  user_id: string;
  chant_count: number;
  chant_date: string;
  note?: string;
  created_at: string;
  updated_at: string;
}

export interface Stats {
  today: number;
  week: number;
  month: number;
  streak: number;
}

export interface MantraStats {
  mantra: Mantra;
  today: number;
  week: number;
  month: number;
}

/**
 * Fetch all mantras
 */
export async function getMantras(): Promise<Mantra[]> {
  const response = await fetch("/api/mantras", {
    cache: "no-store", // Always fetch fresh data
  });

  if (!response.ok) {
    throw new Error("Failed to fetch mantras");
  }

  return response.json();
}

/**
 * Fetch chanting records for a user
 */
export async function getChantingRecords(
  userId: string,
  options?: {
    chantDate?: string;
    fromDate?: string;
  }
): Promise<ChantingRecord[]> {
  const params = new URLSearchParams({ user_id: userId });

  if (options?.chantDate) {
    params.append("chant_date", options.chantDate);
  }

  if (options?.fromDate) {
    params.append("from_date", options.fromDate);
  }

  const response = await fetch(`/api/chanting-records?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch chanting records");
  }

  return response.json();
}


/**
 * Fetch user statistics
 */
export async function getStats(
  userId: string,
  options?: { date?: string }
): Promise<{
  stats: Stats;
  mantraStats: MantraStats[];
}> {
  const params = new URLSearchParams({ user_id: userId });
  if (options?.date) {
    params.append("date", options.date);
  }

  const response = await fetch(`/api/stats?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }

  return response.json();
}

/**
 * Analytics data types
 */
export interface AnalyticsData {
  chartData: Array<{
    date: string;
    total: number;
    byMantra: Record<string, number>;
  }>;
  mantraChartData: Array<{
    name: string;
    category: string;
    value: number;
    mantraId: string;
  }>;
  dateRange: {
    start: string;
    end: string;
    days: number;
  };
}

/**
 * Journal and notes interfaces
 */
export interface ChantingNote {
  id: string;
  user_id: string;
  mantra_id: string;
  chant_date: string;
  note: string;
  created_at: string;
  updated_at: string;
}

export interface MoodEntry {
  id: string;
  user_id: string;
  date: string;
  mood: 'peaceful' | 'joyful' | 'contemplative' | 'challenged' | 'inspired' | 'tired' | 'grateful' | 'other';
  intensity: number;
  note?: string;
  created_at: string;
  updated_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  date: string;
  title: string;
  content: string;
  reflection_prompts?: {
    question: string;
    answer: string;
  }[];
  mood?: MoodEntry;
  tags?: string[];
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch analytics data for visualizations
 */
export async function getAnalytics(
  userId: string,
  options?: { days?: number; groupBy?: string }
): Promise<AnalyticsData> {
  const params = new URLSearchParams({ user_id: userId });
  if (options?.days) {
    params.append("days", options.days.toString());
  }
  if (options?.groupBy) {
    params.append("group_by", options.groupBy);
  }

  const response = await fetch(`/api/analytics?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch analytics data");
  }

  return response.json();
}

/**
 * Journal and Notes API Functions
 */

/**
 * Create or update a chanting record with optional note
 */
export async function upsertChantingRecord(data: {
  mantra_id: string;
  user_id: string;
  chant_date: string;
  chant_count: number;
  note?: string;
}): Promise<ChantingRecord> {
  const response = await fetch("/api/chanting-records", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update chanting record");
  }

  return response.json();
}

/**
 * Fetch chanting notes for a user
 */
export async function getChantingNotes(
  userId: string,
  options?: {
    mantraId?: string;
    chantDate?: string;
  }
): Promise<ChantingNote[]> {
  const params = new URLSearchParams({ user_id: userId });

  if (options?.mantraId) {
    params.append("mantra_id", options.mantraId);
  }

  if (options?.chantDate) {
    params.append("chant_date", options.chantDate);
  }

  const response = await fetch(`/api/chanting-notes?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch chanting notes");
  }

  return response.json();
}

/**
 * Create a chanting note
 */
export async function createChantingNote(data: {
  mantra_id: string;
  user_id: string;
  chant_date: string;
  note: string;
}): Promise<ChantingNote> {
  const response = await fetch("/api/chanting-notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create chanting note");
  }

  return response.json();
}

/**
 * Fetch journal entries for a user
 */
export async function getJournalEntries(
  userId: string,
  options?: {
    date?: string;
    fromDate?: string;
    toDate?: string;
  }
): Promise<JournalEntry[]> {
  const params = new URLSearchParams({ user_id: userId });

  if (options?.date) {
    params.append("date", options.date);
  }

  if (options?.fromDate) {
    params.append("from_date", options.fromDate);
  }

  if (options?.toDate) {
    params.append("to_date", options.toDate);
  }

  const response = await fetch(`/api/journal-entries?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch journal entries");
  }

  return response.json();
}

/**
 * Create a journal entry
 */
export async function createJournalEntry(data: {
  user_id: string;
  date: string;
  title: string;
  content: string;
  reflection_prompts?: {
    question: string;
    answer: string;
  }[];
  tags?: string[];
  is_private?: boolean;
}): Promise<JournalEntry> {
  const response = await fetch("/api/journal-entries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create journal entry");
  }

  return response.json();
}

/**
 * Update a journal entry
 */
export async function updateJournalEntry(
  id: string,
  data: {
    title?: string;
    content?: string;
    reflection_prompts?: {
      question: string;
      answer: string;
    }[];
    tags?: string[];
    is_private?: boolean;
  }
): Promise<JournalEntry> {
  const params = new URLSearchParams({ id });
  const response = await fetch(`/api/journal-entries?${params.toString()}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update journal entry");
  }

  return response.json();
}

/**
 * Delete a journal entry
 */
export async function deleteJournalEntry(id: string): Promise<void> {
  const params = new URLSearchParams({ id });
  const response = await fetch(`/api/journal-entries?${params.toString()}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete journal entry");
  }
}

/**
 * Fetch mood entries for a user
 */
export async function getMoodEntries(
  userId: string,
  options?: {
    date?: string;
    fromDate?: string;
    toDate?: string;
  }
): Promise<MoodEntry[]> {
  const params = new URLSearchParams({ user_id: userId });

  if (options?.date) {
    params.append("date", options.date);
  }

  if (options?.fromDate) {
    params.append("from_date", options.fromDate);
  }

  if (options?.toDate) {
    params.append("to_date", options.toDate);
  }

  const response = await fetch(`/api/mood-entries?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch mood entries");
  }

  return response.json();
}

/**
 * Create or update a mood entry
 */
export async function upsertMoodEntry(data: {
  user_id: string;
  date: string;
  mood: MoodEntry['mood'];
  intensity: number;
  note?: string;
}): Promise<MoodEntry> {
  const response = await fetch("/api/mood-entries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create/update mood entry");
  }

  return response.json();
}

/**
 * Delete a mood entry
 */
export async function deleteMoodEntry(id: string): Promise<void> {
  const params = new URLSearchParams({ id });
  const response = await fetch(`/api/mood-entries?${params.toString()}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete mood entry");
  }
}