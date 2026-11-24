// POST /api/admin/login {password} -> sets admin_session cookie (HttpOnly, SameSite=Strict)
import { json, makeSessionCookie, rateLimit, verifyPassword } from "../_session";

interface Env {
  DB: D1Database;
  ADMIN_PASSWORD_PBKDF2: string;
  SESSION_SECRET: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  if (!(await rateLimit(env.DB, `login:${ip}`, 10, 600, true))) { // fail closed: brute-force protection must survive a D1 error
    return json({ ok: false, error: "too many attempts" }, 429);
  }
  let data: any;
  try { data = await request.json(); } catch { return json({ ok: false }, 400); }
  const given = String((data && data.password) || "");
  const stored = String(env.ADMIN_PASSWORD_PBKDF2 || "");
  if (!stored) return json({ ok: false }, 500);
  if (!env.SESSION_SECRET) return json({ ok: false }, 500); // refuse to issue forgeable cookies
  // Compare PBKDF2 derivations; the plaintext password is never stored anywhere.
  const match = await verifyPassword(given, stored);
  if (!match) return json({ ok: false, error: "wrong password" }, 403);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "set-cookie": await makeSessionCookie(env.SESSION_SECRET),
    },
  });
};
