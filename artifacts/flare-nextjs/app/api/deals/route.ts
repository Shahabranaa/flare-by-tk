import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(req: NextRequest) {
  const active = req.nextUrl.searchParams.get('active');
  try {
    const where = active === 'true' ? 'WHERE is_active = true' : '';
    const rows = await sql(`
      SELECT id, title, slug, description, image_url AS "imageUrl",
             discount_type AS "discountType",
             discount_value::float AS "discountValue",
             original_price::float AS "originalPrice",
             deal_price::float AS "dealPrice",
             is_active AS "isActive", sort_order AS "sortOrder"
      FROM deals
      ${where}
      ORDER BY sort_order, title
    `);
    return NextResponse.json(rows);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
