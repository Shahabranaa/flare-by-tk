---
name: Admin auth setup
description: How admin authorization works — env-var allowlist via ADMIN_USER_IDS
---

Backend middleware `artifacts/api-server/src/middlewares/requireAdmin.ts` gates all admin routes.

**Rule:** A request is admin only when:
1. A valid Clerk session exists (`getAuth(req).userId` is non-null).
2. That `userId` appears in the `ADMIN_USER_IDS` env var (comma-separated Clerk user IDs).

**Why:** The previous inline check only verified the user was signed in (any Clerk user could access admin). The allowlist ensures only the restaurant owner's Clerk account gets through.

**How to apply:** All `POST /categories`, `PATCH/DELETE /menu-items`, `GET /orders`, `GET /admin/dashboard`, etc. import `requireAdmin` from this shared middleware. If `ADMIN_USER_IDS` is unset, every admin request gets 503 (misconfiguration is loud, not silent).

**Owner setup:** After first sign-in, the restaurant owner finds their Clerk userId in the Clerk dashboard and sets `ADMIN_USER_IDS=user_xxxxx` as an environment variable.
