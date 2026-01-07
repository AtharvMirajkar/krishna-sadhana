import { ObjectId } from "mongodb";

export interface ChantingNote {
  _id?: string | ObjectId;
  user_id: string;
  mantra_id: string;
  chant_date: string; // ISO date string (YYYY-MM-DD)
  note: string;
  created_at: Date;
  updated_at: Date;
}

export interface MoodEntry {
  _id?: string | ObjectId;
  user_id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  mood: 'peaceful' | 'joyful' | 'contemplative' | 'challenged' | 'inspired' | 'tired' | 'grateful' | 'other';
  intensity: number; // 1-5 scale
  note?: string; // optional note about the mood
  created_at: Date;
  updated_at: Date;
}

export interface JournalEntry {
  _id?: string | ObjectId;
  user_id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  title: string;
  content: string;
  reflection_prompts?: {
    question: string;
    answer: string;
  }[];
  mood?: MoodEntry;
  tags?: string[]; // e.g., ['gratitude', 'devotion', 'learning']
  is_private: boolean; // whether this entry is private or can be shared
  created_at: Date;
  updated_at: Date;
}

export interface CreateChantingNoteData {
  mantra_id: string;
  chant_date: string;
  note: string;
}

export interface CreateMoodEntryData {
  date: string;
  mood: MoodEntry['mood'];
  intensity: number;
  note?: string;
}

export interface CreateJournalEntryData {
  date: string;
  title: string;
  content: string;
  reflection_prompts?: {
    question: string;
    answer: string;
  }[];
  tags?: string[];
  is_private?: boolean;
}

export interface UpdateJournalEntryData {
  title?: string;
  content?: string;
  reflection_prompts?: {
    question: string;
    answer: string;
  }[];
  tags?: string[];
  is_private?: boolean;
}
