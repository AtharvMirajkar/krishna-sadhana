import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import type { MoodEntry, CreateMoodEntryData } from "@/lib/models/Journal";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("user_id");
    const date = searchParams.get("date");
    const fromDate = searchParams.get("from_date");
    const toDate = searchParams.get("to_date");

    if (!userId) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const query: any = { user_id: userId };

    if (date) {
      query.date = date;
    }

    if (fromDate || toDate) {
      query.date = {};
      if (fromDate) query.date.$gte = fromDate;
      if (toDate) query.date.$lte = toDate;
    }

    const entries = await db
      .collection<MoodEntry>("mood_entries")
      .find(query)
      .sort({ date: -1, created_at: -1 })
      .toArray();

    const formattedEntries = entries.map((entry) => ({
      id: entry._id?.toString() || "",
      user_id: entry.user_id,
      date: entry.date,
      mood: entry.mood,
      intensity: entry.intensity,
      note: entry.note,
      created_at: entry.created_at.toISOString(),
      updated_at: entry.updated_at.toISOString(),
    }));

    return NextResponse.json(formattedEntries);
  } catch (error) {
    console.error("Error fetching mood entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch mood entries" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CreateMoodEntryData & { user_id: string };
    const { user_id, date, mood, intensity, note } = body;

    if (!user_id || !date || !mood || intensity === undefined) {
      return NextResponse.json(
        { error: "user_id, date, mood, and intensity are required" },
        { status: 400 }
      );
    }

    if (intensity < 1 || intensity > 5) {
      return NextResponse.json(
        { error: "intensity must be between 1 and 5" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const now = new Date();

    const collection = db.collection<MoodEntry>("mood_entries");

    // Upsert: update if exists for the same date, insert if not
    const result = await collection.updateOne(
      {
        user_id,
        date,
      },
      {
        $set: {
          user_id,
          date,
          mood,
          intensity,
          note,
          updated_at: now,
        },
        $setOnInsert: {
          created_at: now,
        },
      },
      {
        upsert: true,
      }
    );

    // Fetch the updated/inserted document
    const entry = await collection.findOne({
      user_id,
      date,
    });

    if (!entry) {
      return NextResponse.json(
        { error: "Failed to create/update mood entry" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: entry._id?.toString() || "",
      user_id: entry.user_id,
      date: entry.date,
      mood: entry.mood,
      intensity: entry.intensity,
      note: entry.note,
      created_at: entry.created_at.toISOString(),
      updated_at: entry.updated_at.toISOString(),
    });
  } catch (error) {
    console.error("Error creating/updating mood entry:", error);
    return NextResponse.json(
      { error: "Failed to create/update mood entry" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection<MoodEntry>("mood_entries");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Mood entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting mood entry:", error);
    return NextResponse.json(
      { error: "Failed to delete mood entry" },
      { status: 500 }
    );
  }
}
