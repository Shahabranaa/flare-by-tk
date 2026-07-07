import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { logger } from "../lib/logger";

/**
 * Middleware that enforces admin-only access.
 *
 * A request is considered "admin" when ALL of the following are true:
 *  1. A valid Clerk session exists (user is signed in).
 *  2. The authenticated Clerk user ID is present in the ADMIN_USER_IDS
 *     environment variable (comma-separated list of Clerk user IDs).
 *
 * If ADMIN_USER_IDS is not set the middleware blocks every request with 503
 * so the misconfiguration is immediately obvious rather than silently granting
 * access to anyone.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const auth = getAuth(req);
  const userId = auth?.userId;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const raw = process.env.ADMIN_USER_IDS;
  if (!raw || !raw.trim()) {
    logger.error("ADMIN_USER_IDS env var is not set — admin access blocked for all users");
    res.status(503).json({ error: "Admin access is not configured on this server" });
    return;
  }

  const allowlist = raw.split(",").map((s) => s.trim()).filter(Boolean);
  if (!allowlist.includes(userId)) {
    logger.warn({ userId }, "Forbidden: userId not in ADMIN_USER_IDS allowlist");
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  next();
}
