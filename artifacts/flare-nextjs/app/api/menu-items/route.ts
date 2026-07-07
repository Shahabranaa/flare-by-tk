import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const available = sp.get('available');
  const categoryId = sp.get('categoryId');
  const featured = sp.get('featured');

  try {
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (available === 'true') { params.push(true); conditions.push(`mi.is_available = $${params.length}`); }
    if (featured === 'true') { params.push(true); conditions.push(`mi.is_featured = $${params.length}`); }
    if (categoryId) { params.push(parseInt(categoryId)); conditions.push(`mi.category_id = $${params.length}`); }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

    const rows = await sql(`
      SELECT mi.id, mi.name, mi.slug, mi.description,
             mi.category_id AS "categoryId", c.name AS "categoryName",
             mi.price::float AS price,
             mi.original_price::float AS "originalPrice",
             mi.image_url AS "imageUrl",
             mi.is_available AS "isAvailable",
             mi.is_featured AS "isFeatured",
             mi.calories, mi.tags
      FROM menu_items mi
      LEFT JOIN categories c ON mi.category_id = c.id
      ${where}
      ORDER BY mi.category_id, mi.name
    `, params);
    return NextResponse.json(rows);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
