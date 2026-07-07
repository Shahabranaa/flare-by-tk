import { pgTable, text, serial, timestamp, numeric, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  trackingToken: text("tracking_token").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerAddress: text("customer_address"),
  orderType: text("order_type").notNull().default("delivery"),
  status: text("status").notNull().default("new"),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  specialInstructions: text("special_instructions"),
  items: jsonb("items").notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
