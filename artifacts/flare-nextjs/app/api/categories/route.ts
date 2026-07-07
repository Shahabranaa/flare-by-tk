import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const rows = await sql(`
      SELECT id, name, slug, description, image_url AS "imageUrl",
             sort_order AS "sortOrder", is_active AS "isActive"
      FROM categories
      WHERE is_active = true
      ORDER BY sort_order, name
    `);
    return NextResponse.json(rows);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
