module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
    ok: true,
    env: {
      DATABASE_URL: !!process.env.DATABASE_URL,
      CLERK_PUBLISHABLE_KEY: !!process.env.CLERK_PUBLISHABLE_KEY,
      CLERK_SECRET_KEY: !!process.env.CLERK_SECRET_KEY,
      UPSTASH_REDIS_URL: !!process.env.UPSTASH_REDIS_REST_KV_REST_API_URL,
      UPSTASH_REDIS_TOKEN: !!process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN,
    }
  }));
};
