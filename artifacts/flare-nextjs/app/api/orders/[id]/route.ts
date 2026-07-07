import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const cookie = req.cookies.get('admin-session');
  if (cookie?.value !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id } = await params;
    const { status } = await req.json();
    const valid = ['new', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!valid.includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 });

    const [row] = await sql(`
      UPDATE orders SET status=$1, updated_at=NOW()
      WHERE id=$2
      RETURNING id, status, tracking_token AS "trackingToken", updated_at AS "updatedAt"
    `, [status, parseInt(id)]);

    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(row);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
