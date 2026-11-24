// Shared helpers for the tracking + admin functions.
// Secrets live in Pages env vars (ADMIN_PASSWORD / SESSION_SECRET), never in code.

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

// 128-bit opaque tracking token (CSPRNG). Not the order id, not the phone.
export function newTrackingToken(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

const te = new TextEncoder();

async function hmacHex(secret: string, msg: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", te.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, te.encode(msg));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

// Stored credential format: "v1:<iterations>:<saltHex>:<hashHex>" (PBKDF2-HMAC-SHA256).
// The plaintext password never lives in env, code, or the repo.
export async function derivePasswordHash(password: string, saltHex: string, iterations: number): Promise<string> {
  const key = await crypto.subtle.importKey("raw", te.encode(password), "PBKDF2", false, ["deriveBits"]);
  const salt = new Uint8Array(saltHex.match(/../g)!.map((h) => parseInt(h, 16)));
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256);
  return Array.from(new Uint8Array(bits), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyPassword(given: string, stored: string): Promise<boolean> {
  const m = /^v1:(\d+):([0-9a-f]{32}):([0-9a-f]{64})$/.exec(stored);
  if (!m) return false;
  const derived = await derivePasswordHash(given, m[2], Number(m[1]));
  return timingSafeEqualHex(derived, m[3]);
}

// Preview redeploy marker 2026-11-24: env refresh; PBKDF2 iterations kept within Workers runtime limits.
export function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function makeSessionCookie(secret: string, maxAgeSec = 60 * 60 * 12): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + maxAgeSec;
  const sig = await hmacHex(secret, `admin:${exp}`);
  return `admin_session=${exp}.${sig}; Path=/api/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAgeSec}`;
}

export async function isAdmin(request: Request, secret: string): Promise<boolean> {
  const cookie = request.headers.get("cookie") || "";
  const m = cookie.match(/admin_session=(\d+)\.([0-9a-f]{64})/);
  if (!m) return false;
  const exp = Number(m[1]);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return false;
  const expected = await hmacHex(secret, `admin:${exp}`);
  return timingSafeEqualHex(m[2], expected);
}

// Naive fixed-window rate limit backed by D1: max `limit` hits per key per window.
export async function rateLimit(DB: D1Database, key: string, limit: number, windowSec: number): Promise<boolean> {
  const bucket = Math.floor(Date.now() / 1000 / windowSec);
  try {
    await DB.prepare(
      "CREATE TABLE IF NOT EXISTS rate_limits (k TEXT PRIMARY KEY, n INTEGER NOT NULL)"
    ).run();
    const row: any = await DB.prepare(
      "INSERT INTO rate_limits (k, n) VALUES (?, 1) ON CONFLICT(k) DO UPDATE SET n = n + 1 RETURNING n"
    ).bind(`${key}:${bucket}`).first();
    return Number(row && row.n) <= limit;
  } catch {
    return true; // fail open: never block customers on a limiter error
  }
}
