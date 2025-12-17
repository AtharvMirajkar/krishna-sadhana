import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import type { ChantingRecord } from "@/lib/models/ChantingRecord";
import type { Mantra } from "@/lib/models/Mantra";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    // Get start of week (Sunday)
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekStartStr = weekStart.toISOString().split("T")[0];

    // Get start of month
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthStartStr = monthStart.toISOString().split("T")[0];

    // Fetch mantras and records
    const [mantras, records] = await Promise.all([
      db
        .collection<Mantra>("mantras")
        .find({})
        .sort({ created_at: 1 })
        .toArray(),
      db
        .collection<ChantingRecord>("chanting_records")
        .find({
          user_id: userId,
          chant_date: { $gte: monthStartStr },
        })
        .toArray(),
    ]);

    let todayTotal = 0;
    let weekTotal = 0;
    let monthTotal = 0;

    const mantraStatsMap: Record<
      string,
      {
        mantra: Mantra;
        today: number;
        week: number;
        month: number;
      }
    > = {};

    mantras.forEach((mantra) => {
      mantraStatsMap[mantra._id?.toString() || ""] = {
        mantra,
        today: 0,
        week: 0,
        month: 0,
      };
    });

    records.forEach((record) => {
      const recordDate = record.chant_date;
      const count = record.chant_count;

      monthTotal += count;

      if (recordDate >= weekStartStr) {
        weekTotal += count;
      }

      if (recordDate === todayStr) {
        todayTotal += count;
      }

      const mantraId = record.mantra_id;
      if (mantraStatsMap[mantraId]) {
        mantraStatsMap[mantraId].month += count;

        if (recordDate >= weekStartStr) {
          mantraStatsMap[mantraId].week += count;
        }

        if (recordDate === todayStr) {
          mantraStatsMap[mantraId].today += count;
        }
      }
    });

    // Calculate streak
    const allRecords = await db
      .collection<ChantingRecord>("chanting_records")
      .find({ user_id: userId })
      .sort({ chant_date: -1 })
      .toArray();

    const dateMap = new Map<string, number>();
    allRecords.forEach((record) => {
      const existing = dateMap.get(record.chant_date) || 0;
      dateMap.set(record.chant_date, existing + record.chant_count);
    });

    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split("T")[0];

      if (dateMap.has(dateStr) && (dateMap.get(dateStr) || 0) > 0) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    const mantraStats = Object.values(mantraStatsMap).map((stat) => ({
      mantra: {
        id: stat.mantra._id?.toString() || "",
        name: stat.mantra.name,
        sanskrit: stat.mantra.sanskrit,
        transliteration: stat.mantra.transliteration,
        description: stat.mantra.description,
        audio_url: stat.mantra.audio_url,
        category: stat.mantra.category,
        duration_seconds: stat.mantra.duration_seconds,
        created_at: stat.mantra.created_at.toISOString(),
      },
      today: stat.today,
      week: stat.week,
      month: stat.month,
    }));

    return NextResponse.json({
      stats: {
        today: todayTotal,
        week: weekTotal,
        month: monthTotal,
        streak,
      },
      mantraStats,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
