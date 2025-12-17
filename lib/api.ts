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
 * Create or update a chanting record
 */
export async function upsertChantingRecord(data: {
  mantra_id: string;
  user_id: string;
  chant_date: string;
  chant_count: number;
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
 * Fetch user statistics
 */
export async function getStats(userId: string): Promise<{
  stats: Stats;
  mantraStats: MantraStats[];
}> {
  const response = await fetch(
    `/api/stats?user_id=${encodeURIComponent(userId)}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }

  return response.json();
}
