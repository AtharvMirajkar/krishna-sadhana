import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB_NAME || 'krishna_devotee';

const sampleMantras = [
  {
    name: 'Hare Krishna Maha Mantra',
    sanskrit: 'हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे। हरे राम हरे राम राम राम हरे हरे॥',
    transliteration: 'Hare Krishna Hare Krishna Krishna Krishna Hare Hare, Hare Rama Hare Rama Rama Rama Hare Hare',
    description: 'The Maha Mantra is the great mantra of deliverance. It cleanses the heart and awakens dormant love for Krishna. Chanting these 16 names of the Lord brings immense spiritual benefits.',
    category: 'Maha Mantra',
    duration_seconds: 108,
    audio_url: null,
    created_at: new Date(),
  },
  {
    name: 'Krishna Gayatri Mantra',
    sanskrit: 'ॐ देवकीनन्दनाय विद्महे वासुदेवाय धीमहि तन्नो कृष्णः प्रचोदयात्',
    transliteration: 'Om Devkinandanaya Vidmahe Vasudevaya Dhimahi Tanno Krishna Prachodayat',
    description: 'This Gayatri mantra dedicated to Lord Krishna helps in meditation and spiritual advancement. It invokes the divine qualities of Krishna.',
    category: 'Gayatri',
    duration_seconds: 45,
    audio_url: null,
    created_at: new Date(),
  },
  {
    name: 'Radha Krishna Mantra',
    sanskrit: 'ॐ श्रीं राधा कृष्णाभ्यां नमः',
    transliteration: 'Om Shreem Radha Krishnabhyam Namah',
    description: 'This mantra invokes the divine couple Radha and Krishna. It brings love, devotion, and harmonious relationships into life.',
    category: 'Prayer',
    duration_seconds: 30,
    audio_url: null,
    created_at: new Date(),
  },
  {
    name: 'Krishna Moola Mantra',
    sanskrit: 'ॐ क्लीं कृष्णाय नमः',
    transliteration: 'Om Kleem Krishnaya Namah',
    description: 'The seed mantra of Lord Krishna. It is powerful for attracting divine grace, removing obstacles, and achieving success in spiritual and material endeavors.',
    category: 'Beej Mantra',
    duration_seconds: 20,
    audio_url: null,
    created_at: new Date(),
  },
  {
    name: 'Gopal Mantra',
    sanskrit: 'ॐ श्री गोपालाय नमः',
    transliteration: 'Om Shri Gopalaya Namah',
    description: 'This mantra honors Krishna as the divine cowherd. Chanting it brings peace, protection, and the blessings of Lord Gopal.',
    category: 'Prayer',
    duration_seconds: 25,
    audio_url: null,
    created_at: new Date(),
  },
];

async function seed() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);

    // Clear existing mantras (optional - comment out if you want to keep existing data)
    // await db.collection('mantras').deleteMany({});
    // console.log('Cleared existing mantras');

    // Check if mantras already exist
    const existingCount = await db.collection('mantras').countDocuments();
    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing mantras. Skipping seed.`);
      console.log('To re-seed, delete the mantras collection first.');
      return;
    }

    // Insert mantras
    const result = await db.collection('mantras').insertMany(sampleMantras);
    console.log(`Inserted ${result.insertedCount} mantras`);

    // Create indexes
    await db.collection('chanting_records').createIndex({ user_id: 1, chant_date: 1 });
    await db.collection('chanting_records').createIndex({ mantra_id: 1 });
    await db.collection('chanting_records').createIndex({ mantra_id: 1, user_id: 1, chant_date: 1 }, { unique: true });
    console.log('Created indexes');

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();

