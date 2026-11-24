// GET  /api/admin/orders            -> latest 100 orders (admin session required)
// POST /api/admin/orders {id,status} -> update one order's status
// CSRF: SameSite=Strict cookie + required custom header "x-admin-request".
import { json, isAdmin } from "../_session";
import { notifyStatusChanged } from "../_notify";

interface Env {
  DB: D1Database;
  SESSION_SECRET: string;
}

const ALLOWED = new Set(["received", "preparing", "shipped", "delivered"]);

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await isAdmin(request, env.SESSION_SECRET))) return json({ ok: false }, 401);
  const rows: any = await env.DB.prepare(
    "SELECT id, created_at, customer_name, phone, governorate, items_json, total_egp, status, tracking_token FROM orders ORDER BY created_at DESC LIMIT 100"
  ).all();
  return json({ ok: true, orders: (rows && rows.results) || [] });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env, ctx }) => {
  if (request.headers.get("x-admin-request") !== "1") return json({ ok: false }, 403);
  if (!(await isAdmin(request, env.SESSION_SECRET))) return json({ ok: false }, 401);
  let data: any;
  try { data = await request.json(); } catch { return json({ ok: false }, 400); }
  const id = String((data && data.id) || "").slice(0, 40);
  const status = String((data && data.status) || "");
  if (!id || !ALLOWED.has(status)) return json({ ok: false, error: "bad input" }, 400);
  const current: any = await env.DB.prepare(
    "SELECT status, phone, items_json FROM orders WHERE id = ?"
  ).bind(id).first();
  if (!current) return json({ ok: false, error: "unknown order" }, 404);
  const res: any = await env.DB.prepare("UPDATE orders SET status = ? WHERE id = ?").bind(status, id).run();
  if (!res || res.success !== true) return json({ ok: false, error: "storage error" }, 500);
  if (Number(res.meta && res.meta.changes) === 0) return json({ ok: false, error: "unknown order" }, 404);
  // Notify only when the status actually changed (dedup) and the order opted in.
  if (String(current.status || "received") !== status) {
    let optedIn = false;
    try { optedIn = JSON.parse(String(current.items_json || "{}")).whatsapp_opt_in === true; } catch { /* stay false */ }
    if (optedIn) ctx.waitUntil(notifyStatusChanged(env, { id, phone: String(current.phone || ""), status }));
  }
  return json({ ok: true });
};
