import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ChantingRecord } from "@/lib/models/ChantingRecord";
import { Mantra } from "@/lib/models/Mantra";

export const dynamic = "force-dynamic";

/**
 * Get historical chanting data for visualizations
 * Supports date ranges and aggregation
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("user_id");
    const days = parseInt(searchParams.get("days") || "30", 10);
    const groupBy = searchParams.get("group_by") || "day"; // day, week, month

    if (!userId) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const startDateStr = startDate.toISOString().split("T")[0];
    const endDateStr = endDate.toISOString().split("T")[0];

    // Fetch all records in the date range
    const records = await db
      .collection<ChantingRecord>("chanting_records")
      .find({
        user_id: userId,
        chant_date: { $gte: startDateStr, $lte: endDateStr },
      })
      .sort({ chant_date: 1 })
      .toArray();

    // Fetch mantras for reference
    const mantras = await db
      .collection<Mantra>("mantras")
      .find({})
      .toArray();

    const mantraMap = new Map(
      mantras.map((m) => [m._id?.toString() || "", m])
    );

    // Group records by date
    const dailyData: Record<
      string,
      { date: string; total: number; byMantra: Record<string, number> }
    > = {};

    records.forEach((record) => {
      const date = record.chant_date;
      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          total: 0,
          byMantra: {},
        };
      }
      dailyData[date].total += record.chant_count;
      dailyData[date].byMantra[record.mantra_id] =
        (dailyData[date].byMantra[record.mantra_id] || 0) +
        record.chant_count;
    });

    // Convert to array and fill missing dates with zeros
    const allDates: string[] = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split("T")[0];
      allDates.push(dateStr);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const chartData = allDates.map((date) => ({
      date,
      total: dailyData[date]?.total || 0,
      byMantra: Object.fromEntries(
        mantras.map((m) => [
          m._id?.toString() || "",
          dailyData[date]?.byMantra[m._id?.toString() || ""] || 0,
        ])
      ),
    }));

    // Aggregate by mantra for bar chart
    const mantraTotals: Record<
      string,
      { mantra: Mantra; total: number }
    > = {};

    records.forEach((record) => {
      const mantraId = record.mantra_id;
      if (!mantraTotals[mantraId]) {
        const mantra = mantraMap.get(mantraId);
        if (mantra) {
          mantraTotals[mantraId] = {
            mantra,
            total: 0,
          };
        }
      }
      if (mantraTotals[mantraId]) {
        mantraTotals[mantraId].total += record.chant_count;
      }
    });

    const mantraChartData = Object.values(mantraTotals)
      .map((item) => ({
        name: item.mantra.name,
        category: item.mantra.category,
        value: item.total,
        mantraId: item.mantra._id?.toString() || "",
      }))
      .sort((a, b) => b.value - a.value);

    return NextResponse.json({
      chartData,
      mantraChartData,
      dateRange: {
        start: startDateStr,
        end: endDateStr,
        days,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}

