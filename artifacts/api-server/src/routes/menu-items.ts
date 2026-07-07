import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, menuItemsTable, categoriesTable } from "@workspace/db";
import { getAuth } from "@clerk/express";
import {
  ListMenuItemsResponse,
  ListMenuItemsQueryParams,
  CreateMenuItemBody,
  CreateMenuItemResponse,
  GetMenuItemParams,
  GetMenuItemResponse,
  UpdateMenuItemParams,
  UpdateMenuItemBody,
  UpdateMenuItemResponse,
  DeleteMenuItemParams,
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

function buildFilters(params: { categoryId?: number; featured?: boolean; available?: boolean }) {
  const conditions = [];
  if (params.categoryId != null) conditions.push(eq(menuItemsTable.categoryId, params.categoryId));
  if (params.featured != null) conditions.push(eq(menuItemsTable.isFeatured, params.featured));
  if (params.available != null) conditions.push(eq(menuItemsTable.isAvailable, params.available));
  return conditions.length > 0 ? and(...conditions) : undefined;
}

router.get("/menu-items", async (req, res): Promise<void> => {
  const qp = ListMenuItemsQueryParams.safeParse({
    categoryId: req.query.categoryId ? parseInt(req.query.categoryId as string, 10) : undefined,
    featured: req.query.featured !== undefined ? req.query.featured === "true" : undefined,
    available: req.query.available !== undefined ? req.query.available === "true" : undefined,
  });

  const where = qp.success ? buildFilters(qp.data) : undefined;

  const rows = await db
    .select({
      id: menuItemsTable.id,
      name: menuItemsTable.name,
      slug: menuItemsTable.slug,
      description: menuItemsTable.description,
      categoryId: menuItemsTable.categoryId,
      categoryName: categoriesTable.name,
      price: menuItemsTable.price,
      originalPrice: menuItemsTable.originalPrice,
      imageUrl: menuItemsTable.imageUrl,
      isAvailable: menuItemsTable.isAvailable,
      isFeatured: menuItemsTable.isFeatured,
      calories: menuItemsTable.calories,
      tags: menuItemsTable.tags,
      createdAt: menuItemsTable.createdAt,
    })
    .from(menuItemsTable)
    .leftJoin(categoriesTable, eq(menuItemsTable.categoryId, categoriesTable.id))
    .where(where)
    .orderBy(menuItemsTable.categoryId, menuItemsTable.name);

  const result = rows.map((r) => ({
    ...r,
    price: parseFloat(r.price),
    originalPrice: r.originalPrice ? parseFloat(r.originalPrice) : null,
    createdAt: r.createdAt.toISOString(),
  }));

  res.json(ListMenuItemsResponse.parse(result));
});

router.post("/menu-items", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateMenuItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db.insert(menuItemsTable).values(parsed.data).returning();
  const [cat] = await db.select({ name: categoriesTable.name }).from(categoriesTable).where(eq(categoriesTable.id, row.categoryId));

  res.status(201).json(CreateMenuItemResponse.parse({
    ...row,
    categoryName: cat?.name ?? null,
    price: parseFloat(row.price),
    originalPrice: row.originalPrice ? parseFloat(row.originalPrice) : null,
    createdAt: row.createdAt.toISOString(),
  }));
});

router.get("/menu-items/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetMenuItemParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db
    .select({
      id: menuItemsTable.id,
      name: menuItemsTable.name,
      slug: menuItemsTable.slug,
      description: menuItemsTable.description,
      categoryId: menuItemsTable.categoryId,
      categoryName: categoriesTable.name,
      price: menuItemsTable.price,
      originalPrice: menuItemsTable.originalPrice,
      imageUrl: menuItemsTable.imageUrl,
      isAvailable: menuItemsTable.isAvailable,
      isFeatured: menuItemsTable.isFeatured,
      calories: menuItemsTable.calories,
      tags: menuItemsTable.tags,
      createdAt: menuItemsTable.createdAt,
    })
    .from(menuItemsTable)
    .leftJoin(categoriesTable, eq(menuItemsTable.categoryId, categoriesTable.id))
    .where(eq(menuItemsTable.id, params.data.id));

  if (!row) {
    res.status(404).json({ error: "Menu item not found" });
    return;
  }

  res.json(GetMenuItemResponse.parse({
    ...row,
    price: parseFloat(row.price),
    originalPrice: row.originalPrice ? parseFloat(row.originalPrice) : null,
    createdAt: row.createdAt.toISOString(),
  }));
});

router.patch("/menu-items/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateMenuItemParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateMenuItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db
    .update(menuItemsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(menuItemsTable.id, params.data.id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Menu item not found" });
    return;
  }

  const [cat] = await db.select({ name: categoriesTable.name }).from(categoriesTable).where(eq(categoriesTable.id, row.categoryId));

  res.json(UpdateMenuItemResponse.parse({
    ...row,
    categoryName: cat?.name ?? null,
    price: parseFloat(row.price),
    originalPrice: row.originalPrice ? parseFloat(row.originalPrice) : null,
    createdAt: row.createdAt.toISOString(),
  }));
});

router.delete("/menu-items/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteMenuItemParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db.delete(menuItemsTable).where(eq(menuItemsTable.id, params.data.id)).returning();
  if (!row) {
    res.status(404).json({ error: "Menu item not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
