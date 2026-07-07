import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, dealsTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/requireAdmin";
import {
  ListDealsResponse,
  ListDealsQueryParams,
  CreateDealBody,
  CreateDealResponse,
  GetDealParams,
  GetDealResponse,
  UpdateDealParams,
  UpdateDealBody,
  UpdateDealResponse,
  DeleteDealParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function mapDeal(r: any) {
  return {
    ...r,
    discountValue: r.discountValue ? parseFloat(r.discountValue) : null,
    originalPrice: r.originalPrice ? parseFloat(r.originalPrice) : null,
    dealPrice: r.dealPrice ? parseFloat(r.dealPrice) : null,
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
  };
}

router.get("/deals", async (req, res): Promise<void> => {
  const qp = ListDealsQueryParams.safeParse({
    active: req.query.active !== undefined ? req.query.active === "true" : undefined,
  });

  if (qp.success && qp.data.active != null) {
    const rows = await db.select().from(dealsTable).where(eq(dealsTable.isActive, qp.data.active)).orderBy(dealsTable.sortOrder);
    res.json(ListDealsResponse.parse(rows.map(mapDeal)));
    return;
  }

  const rows = await db.select().from(dealsTable).orderBy(dealsTable.sortOrder);
  res.json(ListDealsResponse.parse(rows.map(mapDeal)));
});

router.post("/deals", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateDealBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { discountValue, originalPrice, dealPrice, ...restDeal } = parsed.data;
  const [row] = await db.insert(dealsTable).values({
    ...restDeal,
    ...(discountValue != null ? { discountValue: discountValue.toString() } : {}),
    ...(originalPrice != null ? { originalPrice: originalPrice.toString() } : {}),
    ...(dealPrice != null ? { dealPrice: dealPrice.toString() } : {}),
  }).returning();
  res.status(201).json(CreateDealResponse.parse(mapDeal(row)));
});

router.get("/deals/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetDealParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db.select().from(dealsTable).where(eq(dealsTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Deal not found" });
    return;
  }

  res.json(GetDealResponse.parse(mapDeal(row)));
});

router.patch("/deals/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateDealParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateDealBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { discountValue, originalPrice, dealPrice, ...restDealUpdate } = parsed.data;
  const [row] = await db
    .update(dealsTable)
    .set({
      ...restDealUpdate,
      updatedAt: new Date(),
      ...(discountValue != null ? { discountValue: discountValue.toString() } : {}),
      ...(originalPrice != null ? { originalPrice: originalPrice.toString() } : {}),
      ...(dealPrice != null ? { dealPrice: dealPrice.toString() } : {}),
    })
    .where(eq(dealsTable.id, params.data.id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Deal not found" });
    return;
  }

  res.json(UpdateDealResponse.parse(mapDeal(row)));
});

router.delete("/deals/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteDealParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db.delete(dealsTable).where(eq(dealsTable.id, params.data.id)).returning();
  if (!row) {
    res.status(404).json({ error: "Deal not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
