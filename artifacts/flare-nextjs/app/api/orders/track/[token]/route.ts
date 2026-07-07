import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    const [row] = await sql(`
      SELECT id, tracking_token AS "trackingToken", order_type AS "orderType",
             status, total_amount::float AS "totalAmount",
             items, created_at AS "createdAt", special_instructions AS "specialInstructions"
      FROM orders WHERE tracking_token = $1
    `, [token]);
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(row);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
