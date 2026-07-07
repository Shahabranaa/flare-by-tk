import { Redis } from "@upstash/redis";

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

const _redis = getRedis();

export const CACHE_TTL = 300;

export const KEYS = {
  menuItems: "flare:menu-items",
  deals: "flare:deals",
  categories: "flare:categories",
} as const;

export const redis = {
  async get<T>(key: string): Promise<T | null> {
    if (!_redis) return null;
    try { return await _redis.get<T>(key); } catch { return null; }
  },
  async set(key: string, value: unknown, opts?: { ex: number }): Promise<void> {
    if (!_redis) return;
    try { await _redis.set(key, value, opts); } catch { /* ignore */ }
  },
  async del(key: string): Promise<void> {
    if (!_redis) return;
    try { await _redis.del(key); } catch { /* ignore */ }
  },
};
