---
name: Order tracking token
description: Orders use UUID trackingToken for public tracking, not sequential id
---

**Rule:** The public order tracking endpoint is `GET /api/orders/track/:token` where `token` is a UUID v4 generated at order creation time. The old `GET /orders/:id` endpoint is now admin-only.

**Why:** Sequential integer IDs are trivially enumerable (IDOR) — anyone could iterate `GET /orders/1`, `/orders/2` etc. and harvest all customer PII (name, phone, address).

**How to apply:**
- `POST /orders` generates `randomUUID()` and stores it in the `tracking_token` column (text, unique, NOT NULL).
- The public response from `GET /orders/track/:token` strips PII: only id, trackingToken, orderType, status, totalAmount, items, createdAt, specialInstructions are returned.
- Cart page redirects to `/order/${order.trackingToken}` after order creation.
- `order-tracking.tsx` uses `useParams<{ token: string }>()` and calls the track endpoint directly via `fetch`.
- DB schema: `lib/db/src/schema/orders.ts` has `trackingToken: text("tracking_token").notNull().unique()`.
