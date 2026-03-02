import { kv } from "@vercel/kv";

/**
 * IP-based rate limiter using Vercel KV.
 * Fails open if KV is unavailable so the tool still works.
 * Returns true if the request is allowed, false if rate limited.
 */
export async function checkRateLimit(
  ip: string,
  limit = 10,
  windowSeconds = 3600,
  prefix = "tools"
): Promise<boolean> {
  try {
    const key = `ratelimit:${prefix}:${ip}`;
    const count = await kv.incr(key);
    if (count === 1) {
      await kv.expire(key, windowSeconds);
    }
    return count <= limit;
  } catch {
    // KV unavailable — fail open so tools keep working
    return true;
  }
}
