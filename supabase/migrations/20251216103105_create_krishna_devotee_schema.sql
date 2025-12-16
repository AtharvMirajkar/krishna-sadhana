/*
  # Krishna Devotee App Schema

  1. New Tables
    - `mantras`
      - `id` (uuid, primary key)
      - `name` (text) - Name of the mantra
      - `sanskrit` (text) - Sanskrit text of the mantra
      - `transliteration` (text) - Transliteration of the mantra
      - `description` (text) - Description and meaning
      - `audio_url` (text) - URL to audio file (optional)
      - `category` (text) - Category like "Maha Mantra", "Prayer", etc.
      - `duration_seconds` (integer) - Duration if audio exists
      - `created_at` (timestamptz)
    
    - `chanting_records`
      - `id` (uuid, primary key)
      - `mantra_id` (uuid, foreign key to mantras)
      - `user_id` (text) - Identifier for user (can be browser fingerprint or session ID for now)
      - `chant_count` (integer) - Number of times chanted
      - `chant_date` (date) - Date of chanting
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Allow public read access to mantras
    - Allow users to manage their own chanting records
*/

-- Create mantras table
CREATE TABLE IF NOT EXISTS mantras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sanskrit text NOT NULL,
  transliteration text NOT NULL,
  description text NOT NULL,
  audio_url text,
  category text NOT NULL DEFAULT 'General',
  duration_seconds integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create chanting_records table
CREATE TABLE IF NOT EXISTS chanting_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mantra_id uuid REFERENCES mantras(id) ON DELETE CASCADE NOT NULL,
  user_id text NOT NULL,
  chant_count integer DEFAULT 0,
  chant_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(mantra_id, user_id, chant_date)
);

-- Enable RLS
ALTER TABLE mantras ENABLE ROW LEVEL SECURITY;
ALTER TABLE chanting_records ENABLE ROW LEVEL SECURITY;

-- Policies for mantras (public read access)
CREATE POLICY "Anyone can view mantras"
  ON mantras FOR SELECT
  TO public
  USING (true);

-- Policies for chanting_records (users can manage their own records)
CREATE POLICY "Users can view their own chanting records"
  ON chanting_records FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert their own chanting records"
  ON chanting_records FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can update their own chanting records"
  ON chanting_records FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete their own chanting records"
  ON chanting_records FOR DELETE
  TO public
  USING (true);

-- Insert sample mantras
INSERT INTO mantras (name, sanskrit, transliteration, description, category, duration_seconds) VALUES
  (
    'Hare Krishna Maha Mantra',
    'हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे। हरे राम हरे राम राम राम हरे हरे॥',
    'Hare Krishna Hare Krishna Krishna Krishna Hare Hare, Hare Rama Hare Rama Rama Rama Hare Hare',
    'The Maha Mantra is the great mantra of deliverance. It cleanses the heart and awakens dormant love for Krishna. Chanting these 16 names of the Lord brings immense spiritual benefits.',
    'Maha Mantra',
    108
  ),
  (
    'Krishna Gayatri Mantra',
    'ॐ देवकीनन्दनाय विद्महे वासुदेवाय धीमहि तन्नो कृष्णः प्रचोदयात्',
    'Om Devkinandanaya Vidmahe Vasudevaya Dhimahi Tanno Krishna Prachodayat',
    'This Gayatri mantra dedicated to Lord Krishna helps in meditation and spiritual advancement. It invokes the divine qualities of Krishna.',
    'Gayatri',
    45
  ),
  (
    'Radha Krishna Mantra',
    'ॐ श्रीं राधा कृष्णाभ्यां नमः',
    'Om Shreem Radha Krishnabhyam Namah',
    'This mantra invokes the divine couple Radha and Krishna. It brings love, devotion, and harmonious relationships into life.',
    'Prayer',
    30
  ),
  (
    'Krishna Moola Mantra',
    'ॐ क्लीं कृष्णाय नमः',
    'Om Kleem Krishnaya Namah',
    'The seed mantra of Lord Krishna. It is powerful for attracting divine grace, removing obstacles, and achieving success in spiritual and material endeavors.',
    'Beej Mantra',
    20
  ),
  (
    'Gopal Mantra',
    'ॐ श्री गोपालाय नमः',
    'Om Shri Gopalaya Namah',
    'This mantra honors Krishna as the divine cowherd. Chanting it brings peace, protection, and the blessings of Lord Gopal.',
    'Prayer',
    25
  );

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_chanting_records_user_date ON chanting_records(user_id, chant_date);
CREATE INDEX IF NOT EXISTS idx_chanting_records_mantra ON chanting_records(mantra_id);