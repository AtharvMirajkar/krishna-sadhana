export interface Database {
  public: {
    Tables: {
      mantras: {
        Row: {
          id: string;
          name: string;
          sanskrit: string;
          transliteration: string;
          description: string;
          audio_url: string | null;
          category: string;
          duration_seconds: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          sanskrit: string;
          transliteration: string;
          description: string;
          audio_url?: string | null;
          category?: string;
          duration_seconds?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          sanskrit?: string;
          transliteration?: string;
          description?: string;
          audio_url?: string | null;
          category?: string;
          duration_seconds?: number;
          created_at?: string;
        };
      };
      chanting_records: {
        Row: {
          id: string;
          mantra_id: string;
          user_id: string;
          chant_count: number;
          chant_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          mantra_id: string;
          user_id: string;
          chant_count?: number;
          chant_date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          mantra_id?: string;
          user_id?: string;
          chant_count?: number;
          chant_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
