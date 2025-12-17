import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import type { Mantra } from "@/lib/models/Mantra";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb();
    const mantras = await db
      .collection<Mantra>("mantras")
      .find({})
      .sort({ created_at: 1 })
      .toArray();

    // Convert _id to string and dates to ISO strings
    const formattedMantras = mantras.map((mantra: Mantra) => ({
      id: mantra._id?.toString() || "",
      name: mantra.name,
      sanskrit: mantra.sanskrit,
      transliteration: mantra.transliteration,
      description: mantra.description,
      audio_url: mantra.audio_url,
      category: mantra.category,
      duration_seconds: mantra.duration_seconds,
      created_at: mantra.created_at.toISOString(),
    }));

    return NextResponse.json(formattedMantras, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Error fetching mantras:", error);
    return NextResponse.json(
      { error: "Failed to fetch mantras" },
      { status: 500 }
    );
  }
}
