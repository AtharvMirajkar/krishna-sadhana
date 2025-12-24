import { MongoClient } from "mongodb";
import { hashPassword } from "../lib/auth";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = process.env.MONGODB_DB_NAME || "krishna_devotee";

const sampleUsers = [
  {
    email: "demo@krishnabhakti.com",
    password: "demo123",
    name: "Demo User",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    email: "devotee@krishnabhakti.com",
    password: "devotee123",
    name: "Krishna Devotee",
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const sampleMantras = [
  {
    name: "Hare Krishna Maha Mantra",
    sanskrit:
      "हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे। हरे राम हरे राम राम राम हरे हरे॥",
    transliteration:
      "Hare Krishna Hare Krishna Krishna Krishna Hare Hare, Hare Rama Hare Rama Rama Rama Hare Hare",
    description:
      "The Maha Mantra is the great mantra of deliverance. It cleanses the heart and awakens dormant love for Krishna. Chanting these 16 names of the Lord brings immense spiritual benefits.",
    category: "Maha Mantra",
    duration_seconds: 108,
    audio_url: null,
    created_at: new Date(),
  },
  {
    name: "Krishna Gayatri Mantra",
    sanskrit: "ॐ देवकीनन्दनाय विद्महे वासुदेवाय धीमहि तन्नो कृष्णः प्रचोदयात्",
    transliteration:
      "Om Devkinandanaya Vidmahe Vasudevaya Dhimahi Tanno Krishna Prachodayat",
    description:
      "This Gayatri mantra dedicated to Lord Krishna helps in meditation and spiritual advancement. It invokes the divine qualities of Krishna.",
    category: "Gayatri",
    duration_seconds: 45,
    audio_url: null,
    created_at: new Date(),
  },
  {
    name: "Radha Krishna Mantra",
    sanskrit: "ॐ श्रीं राधा कृष्णाभ्यां नमः",
    transliteration: "Om Shreem Radha Krishnabhyam Namah",
    description:
      "This mantra invokes the divine couple Radha and Krishna. It brings love, devotion, and harmonious relationships into life.",
    category: "Prayer",
    duration_seconds: 30,
    audio_url: null,
    created_at: new Date(),
  },
  {
    name: "Krishna Moola Mantra",
    sanskrit: "ॐ क्लीं कृष्णाय नमः",
    transliteration: "Om Kleem Krishnaya Namah",
    description:
      "The seed mantra of Lord Krishna. It is powerful for attracting divine grace, removing obstacles, and achieving success in spiritual and material endeavors.",
    category: "Beej Mantra",
    duration_seconds: 20,
    audio_url: null,
    created_at: new Date(),
  },
  {
    name: "Gopal Mantra",
    sanskrit: "ॐ श्री गोपालाय नमः",
    transliteration: "Om Shri Gopalaya Namah",
    description:
      "This mantra honors Krishna as the divine cowherd. Chanting it brings peace, protection, and the blessings of Lord Gopal.",
    category: "Prayer",
    duration_seconds: 25,
    audio_url: null,
    created_at: new Date(),
  },
];

async function seed() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);

    // Hash passwords for sample users
    const usersWithHashedPasswords = await Promise.all(
      sampleUsers.map(async (user) => ({
        ...user,
        password_hash: await hashPassword(user.password),
      }))
    );

    // Clear existing users (optional - comment out if you want to keep existing data)
    // await db.collection('users').deleteMany({});
    // console.log('Cleared existing users');

    // Check if users already exist
    const existingUserCount = await db.collection("users").countDocuments();
    if (existingUserCount === 0) {
      // Insert users
      const userResult = await db
        .collection("users")
        .insertMany(usersWithHashedPasswords);
      console.log(`Inserted ${userResult.insertedCount} users`);

      // Sample login credentials
      console.log("\n=== SAMPLE LOGIN CREDENTIALS ===");
      sampleUsers.forEach((user, index) => {
        console.log(`User ${index + 1}:`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Password: ${user.password}`);
        console.log(`  Name: ${user.name}`);
        console.log("");
      });
    } else {
      console.log(
        `Found ${existingUserCount} existing users. Skipping user seed.`
      );
    }

    // Clear existing mantras (optional - comment out if you want to keep existing data)
    // await db.collection('mantras').deleteMany({});
    // console.log('Cleared existing mantras');

    // Check if mantras already exist
    const existingMantraCount = await db.collection("mantras").countDocuments();
    if (existingMantraCount > 0) {
      console.log(
        `Found ${existingMantraCount} existing mantras. Skipping mantra seed.`
      );
      console.log("To re-seed, delete the mantras collection first.");
      return;
    }

    // Insert mantras
    const mantraResult = await db
      .collection("mantras")
      .insertMany(sampleMantras);
    console.log(`Inserted ${mantraResult.insertedCount} mantras`);

    // Create indexes
    await db.collection("users").createIndex({ email: 1 }, { unique: true });
    await db
      .collection("sessions")
      .createIndex({ session_id: 1 }, { unique: true });
    await db.collection("sessions").createIndex({ user_id: 1 });
    await db.collection("sessions").createIndex({ expires_at: 1 });
    await db
      .collection("chanting_records")
      .createIndex({ user_id: 1, chant_date: 1 });
    await db.collection("chanting_records").createIndex({ mantra_id: 1 });
    await db
      .collection("chanting_records")
      .createIndex(
        { mantra_id: 1, user_id: 1, chant_date: 1 },
        { unique: true }
      );
    console.log("Created indexes");

    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();
