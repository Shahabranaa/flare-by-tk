import { Router, type IRouter } from "express";
import { eq, desc, sql } from "drizzle-orm";
import { db, ordersTable, menuItemsTable } from "@workspace/db";
import { getAuth } from "@clerk/express";
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

function requireAdmin(req: any, res: any, next: any) {
  const auth = getAuth(req);
  const userId = auth?.sessionClaims?.userId || auth?.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

function mapOrder(r: any) {
  return {
    ...r,
    totalAmount: parseFloat(r.totalAmount),
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
    items: Array.isArray(r.items) ? r.items : [],
  };
}

router.get("/orders", requireAdmin, async (req, res): Promise<void> => {
  const qp = ListOrdersQueryParams.safeParse({
    status: req.query.status,
    limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
  });

  let rows;
  if (qp.success && qp.data.status) {
    rows = await db.select().from(ordersTable).where(eq(ordersTable.status, qp.data.status)).orderBy(desc(ordersTable.createdAt)).limit(qp.data.limit ?? 100);
  } else {
    rows = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt)).limit(qp.success && qp.data.limit ? qp.data.limit : 100);
  }

  res.json(ListOrdersResponse.parse(rows.map(mapOrder)));
});

router.post("/orders", async (req, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { items, ...orderData } = parsed.data;

  // Fetch prices for each menu item
  const menuItemIds = items.map((i) => i.menuItemId);
  const menuItems = await db
    .select({ id: menuItemsTable.id, name: menuItemsTable.name, price: menuItemsTable.price })
    .from(menuItemsTable)
    .where(sql`${menuItemsTable.id} = ANY(${menuItemIds}::int[])`);

  const menuItemMap = new Map(menuItems.map((m) => [m.id, m]));

  const enrichedItems = items.map((item) => {
    const menuItem = menuItemMap.get(item.menuItemId);
    return {
      menuItemId: item.menuItemId,
      name: menuItem?.name ?? "Unknown Item",
      price: menuItem ? parseFloat(menuItem.price) : 0,
      quantity: item.quantity,
    };
  });

  const totalAmount = enrichedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const [row] = await db
    .insert(ordersTable)
    .values({
      ...orderData,
      totalAmount: totalAmount.toString(),
      items: enrichedItems,
    })
    .returning();

  res.status(201).json(CreateOrderResponse.parse(mapOrder(row)));
});

router.get("/orders/:id", async (req, res): Promise<void> => {
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

// Admin dashboard
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
