import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import type { JournalEntry, CreateJournalEntryData, UpdateJournalEntryData } from "@/lib/models/Journal";

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
      .collection<JournalEntry>("journal_entries")
      .find(query)
      .sort({ date: -1, created_at: -1 })
      .toArray();

    const formattedEntries = entries.map((entry) => ({
      id: entry._id?.toString() || "",
      user_id: entry.user_id,
      date: entry.date,
      title: entry.title,
      content: entry.content,
      reflection_prompts: entry.reflection_prompts || [],
      mood: entry.mood,
      tags: entry.tags || [],
      is_private: entry.is_private,
      created_at: entry.created_at.toISOString(),
      updated_at: entry.updated_at.toISOString(),
    }));

    return NextResponse.json(formattedEntries);
  } catch (error) {
    console.error("Error fetching journal entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch journal entries" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CreateJournalEntryData & { user_id: string };
    const { user_id, date, title, content, reflection_prompts, tags, is_private } = body;

    if (!user_id || !date || !title || !content) {
      return NextResponse.json(
        { error: "user_id, date, title, and content are required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const now = new Date();

    const collection = db.collection<JournalEntry>("journal_entries");

    const result = await collection.insertOne({
      user_id,
      date,
      title,
      content,
      reflection_prompts: reflection_prompts || [],
      tags: tags || [],
      is_private: is_private ?? true,
      created_at: now,
      updated_at: now,
    });

    return NextResponse.json({
      id: result.insertedId.toString(),
      user_id,
      date,
      title,
      content,
      reflection_prompts: reflection_prompts || [],
      tags: tags || [],
      is_private: is_private ?? true,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    });
  } catch (error) {
    console.error("Error creating journal entry:", error);
    return NextResponse.json(
      { error: "Failed to create journal entry" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    const body = await request.json() as UpdateJournalEntryData;
    const updateData: Partial<JournalEntry> = {
      updated_at: new Date(),
    };

    if (body.title !== undefined) updateData.title = body.title;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.reflection_prompts !== undefined) updateData.reflection_prompts = body.reflection_prompts;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.is_private !== undefined) updateData.is_private = body.is_private;

    const db = await getDb();
    const collection = db.collection<JournalEntry>("journal_entries");

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Journal entry not found" },
        { status: 404 }
      );
    }

    // Fetch updated entry
    const updatedEntry = await collection.findOne({ _id: new ObjectId(id) });

    if (!updatedEntry) {
      return NextResponse.json(
        { error: "Failed to fetch updated entry" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: updatedEntry._id?.toString() || "",
      user_id: updatedEntry.user_id,
      date: updatedEntry.date,
      title: updatedEntry.title,
      content: updatedEntry.content,
      reflection_prompts: updatedEntry.reflection_prompts || [],
      mood: updatedEntry.mood,
      tags: updatedEntry.tags || [],
      is_private: updatedEntry.is_private,
      created_at: updatedEntry.created_at.toISOString(),
      updated_at: updatedEntry.updated_at.toISOString(),
    });
  } catch (error) {
    console.error("Error updating journal entry:", error);
    return NextResponse.json(
      { error: "Failed to update journal entry" },
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
    const collection = db.collection<JournalEntry>("journal_entries");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Journal entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting journal entry:", error);
    return NextResponse.json(
      { error: "Failed to delete journal entry" },
      { status: 500 }
    );
  }
}
