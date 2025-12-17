import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import type { ChantingRecord } from '@/lib/models/ChantingRecord';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id');
    const chantDate = searchParams.get('chant_date');
    const fromDate = searchParams.get('from_date');

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const query: any = { user_id: userId };

    if (chantDate) {
      query.chant_date = chantDate;
    }

    if (fromDate) {
      query.chant_date = { $gte: fromDate };
    }

    const records = await db
      .collection<ChantingRecord>('chanting_records')
      .find(query)
      .toArray();

    const formattedRecords = records.map(record => ({
      id: record._id?.toString() || '',
      mantra_id: record.mantra_id,
      user_id: record.user_id,
      chant_count: record.chant_count,
      chant_date: record.chant_date,
      created_at: record.created_at.toISOString(),
      updated_at: record.updated_at.toISOString(),
    }));

    return NextResponse.json(formattedRecords);
  } catch (error) {
    console.error('Error fetching chanting records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chanting records' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mantra_id, user_id, chant_date, chant_count } = body;

    if (!mantra_id || !user_id || !chant_date) {
      return NextResponse.json(
        { error: 'mantra_id, user_id, and chant_date are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const now = new Date();

    // Upsert: update if exists, insert if not
    const result = await db.collection<ChantingRecord>('chanting_records').findOneAndUpdate(
      {
        mantra_id,
        user_id,
        chant_date,
      },
      {
        $set: {
          mantra_id,
          user_id,
          chant_date,
          chant_count: chant_count || 0,
          updated_at: now,
        },
        $setOnInsert: {
          created_at: now,
        },
      },
      {
        upsert: true,
        returnDocument: 'after',
      }
    );

    const record = result.value;
    if (!record) {
      return NextResponse.json(
        { error: 'Failed to create/update record' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: record._id?.toString() || '',
      mantra_id: record.mantra_id,
      user_id: record.user_id,
      chant_count: record.chant_count,
      chant_date: record.chant_date,
      created_at: record.created_at.toISOString(),
      updated_at: record.updated_at.toISOString(),
    });
  } catch (error) {
    console.error('Error creating/updating chanting record:', error);
    return NextResponse.json(
      { error: 'Failed to create/update chanting record' },
      { status: 500 }
    );
  }
}

