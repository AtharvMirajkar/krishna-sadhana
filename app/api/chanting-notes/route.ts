import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import type { ChantingNote } from "@/lib/models/Journal";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("user_id");
    const mantraId = searchParams.get("mantra_id");
    const chantDate = searchParams.get("chant_date");

    if (!userId) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const query: any = { user_id: userId };

    if (mantraId) {
      query.mantra_id = mantraId;
    }

    if (chantDate) {
      query.chant_date = chantDate;
    }

    const notes = await db
      .collection<ChantingNote>("chanting_notes")
      .find(query)
      .sort({ created_at: -1 })
      .toArray();

    const formattedNotes = notes.map((note) => ({
      id: note._id?.toString() || "",
      user_id: note.user_id,
      mantra_id: note.mantra_id,
      chant_date: note.chant_date,
      note: note.note,
      created_at: note.created_at.toISOString(),
      updated_at: note.updated_at.toISOString(),
    }));

    return NextResponse.json(formattedNotes);
  } catch (error) {
    console.error("Error fetching chanting notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch chanting notes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mantra_id, user_id, chant_date, note } = body;

    if (!mantra_id || !user_id || !chant_date || !note) {
      return NextResponse.json(
        { error: "mantra_id, user_id, chant_date, and note are required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const now = new Date();

    const collection = db.collection<ChantingNote>("chanting_notes");

    const result = await collection.insertOne({
      user_id,
      mantra_id,
      chant_date,
      note,
      created_at: now,
      updated_at: now,
    });

    return NextResponse.json({
      id: result.insertedId.toString(),
      mantra_id,
      user_id,
      chant_date,
      note,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    });
  } catch (error) {
    console.error("Error creating chanting note:", error);
    return NextResponse.json(
      { error: "Failed to create chanting note" },
      { status: 500 }
    );
  }
}
