import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, categoriesTable, menuItemsTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/requireAdmin";
import { redis, CACHE_TTL, KEYS } from "../lib/redis";
import {
  ListCategoriesResponse,
  CreateCategoryBody,
  CreateCategoryResponse,
  GetCategoryParams,
  GetCategoryResponse,
  UpdateCategoryParams,
  UpdateCategoryBody,
  UpdateCategoryResponse,
  DeleteCategoryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/categories", async (req, res): Promise<void> => {
  const cached = await redis.get<string>(KEYS.categories);
  if (cached) {
    res.json(cached);
    return;
  }

  const rows = await db
    .select({
      id: categoriesTable.id,
      name: categoriesTable.name,
      slug: categoriesTable.slug,
      description: categoriesTable.description,
      imageUrl: categoriesTable.imageUrl,
      sortOrder: categoriesTable.sortOrder,
      isActive: categoriesTable.isActive,
      createdAt: categoriesTable.createdAt,
    })
    .from(categoriesTable)
    .orderBy(categoriesTable.sortOrder, categoriesTable.name);

  const itemCounts = await db
    .select({
      categoryId: menuItemsTable.categoryId,
      count: sql<number>`cast(count(*) as int)`,
    })
    .from(menuItemsTable)
    .where(eq(menuItemsTable.isAvailable, true))
    .groupBy(menuItemsTable.categoryId);

  const countMap = new Map(itemCounts.map((r) => [r.categoryId, r.count]));

  const result = rows.map((r) => ({
    ...r,
    itemCount: countMap.get(r.id) ?? 0,
    createdAt: r.createdAt.toISOString(),
  }));

  const parsed = ListCategoriesResponse.parse(result);
  await redis.set(KEYS.categories, parsed, { ex: CACHE_TTL });

  res.json(parsed);
});

router.post("/categories", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateCategoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db.insert(categoriesTable).values(parsed.data).returning();

  await redis.del(KEYS.categories);

  res.status(201).json(CreateCategoryResponse.parse({ ...row, itemCount: 0, createdAt: row.createdAt.toISOString() }));
});

router.get("/categories/:id", async (req, res): Promise<void> => {
  const params = GetCategoryParams.safeParse({ id: parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db.select().from(categoriesTable).where(eq(categoriesTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Category not found" });
    return;
  }

  const [countRow] = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(menuItemsTable)
    .where(eq(menuItemsTable.categoryId, row.id));

  res.json(GetCategoryResponse.parse({ ...row, itemCount: countRow?.count ?? 0, createdAt: row.createdAt.toISOString() }));
});

router.patch("/categories/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateCategoryParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateCategoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db
    .update(categoriesTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(categoriesTable.id, params.data.id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Category not found" });
    return;
  }

  await redis.del(KEYS.categories);

  res.json(UpdateCategoryResponse.parse({ ...row, itemCount: 0, createdAt: row.createdAt.toISOString() }));
});

router.delete("/categories/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteCategoryParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db.delete(categoriesTable).where(eq(categoriesTable.id, params.data.id)).returning();
  if (!row) {
    res.status(404).json({ error: "Category not found" });
    return;
  }

  await redis.del(KEYS.categories);

  res.sendStatus(204);
});

export default router;
