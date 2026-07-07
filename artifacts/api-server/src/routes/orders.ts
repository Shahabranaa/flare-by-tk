import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, ordersTable, menuItemsTable } from "@workspace/db";
import { sql } from "drizzle-orm";
import { requireAdmin } from "../middlewares/requireAdmin";
import { randomUUID } from "crypto";
import {
  ListOrdersResponse,
  ListOrdersQueryParams,
  CreateOrderBody,
  CreateOrderResponse,
  GetOrderParams,
  GetOrderResponse,
  UpdateOrderStatusParams,
  UpdateOrderStatusBody,
  UpdateOrderStatusResponse,
  GetAdminDashboardResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function mapOrder(r: any) {
  return {
    ...r,
    totalAmount: parseFloat(r.totalAmount),
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
    items: Array.isArray(r.items) ? r.items : [],
  };
}

/** Strip PII for unauthenticated tracking responses */
function mapOrderPublic(r: any) {
  const full = mapOrder(r);
  return {
    id: full.id,
    trackingToken: full.trackingToken,
    orderType: full.orderType,
    status: full.status,
    totalAmount: full.totalAmount,
    items: full.items,
    createdAt: full.createdAt,
    specialInstructions: full.specialInstructions ?? null,
  };
}

// ── Admin: list all orders ──────────────────────────────────────────────────
router.get("/orders", requireAdmin, async (req, res): Promise<void> => {
  const qp = ListOrdersQueryParams.safeParse({
    status: req.query.status,
    limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
  });

  let rows;
  if (qp.success && qp.data.status) {
    rows = await db.select().from(ordersTable)
      .where(eq(ordersTable.status, qp.data.status))
      .orderBy(desc(ordersTable.createdAt))
      .limit(qp.data.limit ?? 100);
  } else {
    rows = await db.select().from(ordersTable)
      .orderBy(desc(ordersTable.createdAt))
      .limit(qp.success && qp.data.limit ? qp.data.limit : 100);
  }

  res.json(ListOrdersResponse.parse(rows.map(mapOrder)));
});

// ── Public: place an order ──────────────────────────────────────────────────
router.post("/orders", async (req, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { items, ...orderData } = parsed.data;

  if (items.length === 0) {
    res.status(400).json({ error: "Order must contain at least one item" });
    return;
  }

  const invalidItems = items.filter((i) => i.quantity < 1);
  if (invalidItems.length > 0) {
    res.status(400).json({ error: "Each item quantity must be at least 1" });
    return;
  }

  const menuItemIds = items.map((i) => i.menuItemId);
  const menuItems = await db
    .select({ id: menuItemsTable.id, name: menuItemsTable.name, price: menuItemsTable.price, isAvailable: menuItemsTable.isAvailable })
    .from(menuItemsTable)
    .where(sql`${menuItemsTable.id} = ANY(${menuItemIds}::int[])`);

  const menuItemMap = new Map(menuItems.map((m) => [m.id, m]));

  const missingIds = menuItemIds.filter((id) => !menuItemMap.has(id));
  if (missingIds.length > 0) {
    res.status(400).json({ error: `Menu items not found: ${missingIds.join(", ")}` });
    return;
  }

  const unavailableItems = menuItemIds.filter((id) => !menuItemMap.get(id)!.isAvailable);
  if (unavailableItems.length > 0) {
    res.status(400).json({ error: `Some items are currently unavailable: ${unavailableItems.join(", ")}` });
    return;
  }

  const enrichedItems = items.map((item) => {
    const menuItem = menuItemMap.get(item.menuItemId)!;
    return {
      menuItemId: item.menuItemId,
      name: menuItem.name,
      price: parseFloat(menuItem.price),
      quantity: item.quantity,
    };
  });

  const subtotal = enrichedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = orderData.orderType === "delivery" ? 150 : 0;
  const totalAmount = subtotal + deliveryFee;

  const [row] = await db
    .insert(ordersTable)
    .values({
      ...orderData,
      trackingToken: randomUUID(),
      totalAmount: totalAmount.toString(),
      items: enrichedItems,
    })
    .returning();

  res.status(201).json(CreateOrderResponse.parse(mapOrder(row)));
});

// ── Public: track order by token (no PII exposed) ──────────────────────────
router.get("/orders/track/:token", async (req, res): Promise<void> => {
  const token = Array.isArray(req.params.token) ? req.params.token[0] : req.params.token;
  if (!token || token.length < 10) {
    res.status(400).json({ error: "Invalid tracking token" });
    return;
  }

  const [row] = await db.select().from(ordersTable).where(eq(ordersTable.trackingToken, token));
  if (!row) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.json(mapOrderPublic(row));
});

// ── Admin: get order by id ──────────────────────────────────────────────────
router.get("/orders/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetOrderParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db.select().from(ordersTable).where(eq(ordersTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.json(GetOrderResponse.parse(mapOrder(row)));
});

// ── Admin: update order status ──────────────────────────────────────────────
router.patch("/orders/:id/status", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateOrderStatusParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateOrderStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db
    .update(ordersTable)
    .set({ status: parsed.data.status, updatedAt: new Date() })
    .where(eq(ordersTable.id, params.data.id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.json(UpdateOrderStatusResponse.parse(mapOrder(row)));
});

// ── Admin: dashboard summary ────────────────────────────────────────────────
router.get("/admin/dashboard", requireAdmin, async (req, res): Promise<void> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const allOrders = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt));

  const todayOrders = allOrders.filter((o) => o.createdAt >= today);

  const totalRevenue = allOrders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + parseFloat(o.totalAmount), 0);

  const todayRevenue = todayOrders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + parseFloat(o.totalAmount), 0);

  const ordersByStatus = {
    new: allOrders.filter((o) => o.status === "new").length,
    preparing: allOrders.filter((o) => o.status === "preparing").length,
    ready: allOrders.filter((o) => o.status === "ready").length,
    completed: allOrders.filter((o) => o.status === "completed").length,
    cancelled: allOrders.filter((o) => o.status === "cancelled").length,
  };

  const recentOrders = allOrders.slice(0, 10).map(mapOrder);

  res.json(GetAdminDashboardResponse.parse({
    totalOrders: allOrders.length,
    todayOrders: todayOrders.length,
    totalRevenue,
    todayRevenue,
    ordersByStatus,
    recentOrders,
  }));
});

export default router;
