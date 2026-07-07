import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_KV_REST_API_URL!,
  token: process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN!,
});

export const CACHE_TTL = 300;

export const KEYS = {
  menuItems: "flare:menu-items",
  deals: "flare:deals",
  categories: "flare:categories",
} as const;
