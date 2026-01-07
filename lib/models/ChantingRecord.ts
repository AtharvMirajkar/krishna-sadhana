export interface ChantingRecord {
  _id?: string;
  mantra_id: string;
  user_id: string;
  chant_count: number;
  chant_date: string; // ISO date string (YYYY-MM-DD)
  note?: string; // Optional note for the chanting session
  created_at: Date;
  updated_at: Date;
}

