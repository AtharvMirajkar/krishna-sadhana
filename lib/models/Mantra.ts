export interface Mantra {
  _id?: string;
  name: string;
  sanskrit: string;
  transliteration: string;
  description: string;
  audio_url?: string | null;
  category: string;
  duration_seconds: number;
  created_at: Date;
}

