import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { randomUUID } from 'crypto';

const VALID_ORDER_TYPES = ['delivery', 'pickup'] as const;

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get('admin-session');
  if (cookie?.value !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const status = req.nextUrl.searchParams.get('status');
  try {
    const params: unknown[] = [];
    const where = status ? `WHERE status = $${(params.push(status), params.length)}` : '';
    const rows = await sql(`
      SELECT id, tracking_token AS "trackingToken", customer_name AS "customerName",
             customer_phone AS "customerPhone", customer_address AS "customerAddress",
             order_type AS "orderType", status,
             total_amount::float AS "totalAmount",
             special_instructions AS "specialInstructions",
             items, created_at AS "createdAt"
      FROM orders ${where}
      ORDER BY created_at DESC LIMIT 200
    `, params);
    return NextResponse.json(rows);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, customerPhone, customerAddress, orderType, specialInstructions, items } = body;

    if (!customerName?.trim() || !customerPhone?.trim()) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
    }
    if (!VALID_ORDER_TYPES.includes(orderType)) {
      return NextResponse.json({ error: 'orderType must be delivery or pickup' }, { status: 400 });
    }
    if (orderType === 'delivery' && !customerAddress?.trim()) {
      return NextResponse.json({ error: 'Address is required for delivery' }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'At least one item is required' }, { status: 400 });
    }
    for (const it of items) {
      if (!Number.isInteger(it.menuItemId) || it.menuItemId < 1) {
        return NextResponse.json({ error: 'Invalid menuItemId' }, { status: 400 });
      }
      if (!Number.isInteger(it.quantity) || it.quantity < 1) {
        return NextResponse.json({ error: 'Item quantity must be at least 1' }, { status: 400 });
      }
    }

    const menuIds = items.map((i: { menuItemId: number }) => i.menuItemId);
    const menuRows = await sql<{ id: number; name: string; price: string; is_available: boolean }>(
      `SELECT id, name, price, is_available FROM menu_items WHERE id = ANY($1::int[])`,
      [menuIds]
    );
    const menuMap = new Map(menuRows.map(m => [m.id, m]));

    for (const it of items) {
      const m = menuMap.get(it.menuItemId);
      if (!m) return NextResponse.json({ error: `Item ${it.menuItemId} not found` }, { status: 400 });
      if (!m.is_available) return NextResponse.json({ error: `${m.name} is unavailable` }, { status: 400 });
    }

    const enriched = items.map((it: { menuItemId: number; quantity: number }) => {
      const m = menuMap.get(it.menuItemId)!;
      return { menuItemId: it.menuItemId, name: m.name, price: parseFloat(m.price), quantity: it.quantity };
    });

    const subtotal = enriched.reduce((s: number, i: { price: number; quantity: number }) => s + i.price * i.quantity, 0);
    const total = subtotal + (orderType === 'delivery' ? 150 : 0);

    const [row] = await sql(`
      INSERT INTO orders (tracking_token, customer_name, customer_phone, customer_address,
                          order_type, status, total_amount, special_instructions, items)
      VALUES ($1,$2,$3,$4,$5,'new',$6,$7,$8)
      RETURNING id, tracking_token AS "trackingToken", status, total_amount::float AS "totalAmount", created_at AS "createdAt"
    `, [randomUUID(), customerName.trim(), customerPhone.trim(), customerAddress?.trim() || null,
        orderType, total.toString(), specialInstructions?.trim() || null, JSON.stringify(enriched)]);

    return NextResponse.json(row, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}
