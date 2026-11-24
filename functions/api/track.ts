// GET /api/track?token=<128-bit hex>
// Public order tracking by opaque token only: no phone, no order id, no PII echo.
import { json, rateLimit } from "./_session";

interface Env {
  DB: D1Database;
}

const STATUS_LABELS: Record<string, string> = {
  received: "تم استلام الطلب",
  preparing: "جاري التجهيز",
  shipped: "خرج للشحن",
  delivered: "تم التسليم",
};
const ORDER = ["received", "preparing", "shipped", "delivered"];

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const token = String(url.searchParams.get("token") || "").toLowerCase();
  if (!/^[0-9a-f]{32}$/.test(token)) return json({ ok: false, error: "not found" }, 404);

  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  if (!(await rateLimit(env.DB, `track:${ip}`, 30, 600))) {
    return json({ ok: false, error: "too many requests" }, 429);
  }

  const row: any = await env.DB.prepare(
    "SELECT status, items_json, governorate, created_at FROM orders WHERE tracking_token = ?"
  ).bind(token).first();
  if (!row) return json({ ok: false, error: "not found" }, 404);

  let summary = "";
  try {
    const items = JSON.parse(String(row.items_json || "{}"));
    const lines = Array.isArray(items.lines) ? items.lines : [];
    summary = lines.map((l: any) => `${l.name} — ${l.size} ×${l.quantity}`).join("، ");
  } catch { /* keep summary empty */ }

  const rawStatus = String(row.status || "received");
  const status = rawStatus === "new" ? "received" : rawStatus; // legacy default before the 4-status flow
  const stepIndex = Math.max(0, ORDER.indexOf(status));
  return json({
    ok: true,
    status,
    statusLabel: STATUS_LABELS[status] || STATUS_LABELS.received,
    stepIndex,
    steps: ORDER.map((k) => STATUS_LABELS[k]),
    summary,
    city: String(row.governorate || ""),
    createdAt: String(row.created_at || ""),
  });
};
