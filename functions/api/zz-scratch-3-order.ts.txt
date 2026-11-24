import { products, getVariant } from "../../lib/products";
import { siteConfig, governorates } from "../../lib/config";
import { calculateShipping } from "../../lib/shipping";
import { newTrackingToken } from "./_session";

interface Env {
  DB: D1Database;
  TURNSTILE_SECRET: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let data: any;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: "invalid json" }, 400);
  }

  const id = String(data.id || "").slice(0, 40);
  const name = String(data.name || "").trim().slice(0, 120);
  const phone = String(data.phone || "").replace(/[^\d+]/g, "").slice(0, 20);
  const governorate = String(data.governorate || "").trim().slice(0, 80);
  const address = String(data.address || "").trim().slice(0, 300);
  const notes = String(data.notes || "").trim().slice(0, 500);
  const rawItems = Array.isArray(data.items) ? data.items.slice(0, 50) : [];
  const clientTotal = Number.isFinite(data.total) ? Math.round(data.total) : null;
  const token = String(data.turnstileToken || "");

  if (!/^AA-(?:\d{6}|[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i.test(id)) return json({ ok: false, error: "invalid order id" }, 400);
  if (name.length < 2) return json({ ok: false, error: "name required" }, 400);
  if (!/^\+?\d{10,15}$/.test(phone)) return json({ ok: false, error: "invalid phone" }, 400);
  if (!governorates.includes(governorate)) return json({ ok: false, error: "invalid governorate" }, 400);
  if (!address) return json({ ok: false, error: "address required" }, 400);
  if (!rawItems.length) return json({ ok: false, error: "empty cart" }, 400);
  if (!token) return json({ ok: false, error: "missing verification" }, 400);

  const verify: any = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ secret: env.TURNSTILE_SECRET, response: token }),
    }
  ).then((r) => r.json()).catch(() => null);
  if (!verify || !verify.success) {
    return json({ ok: false, error: "verification failed" }, 403);
  }

  // Rebuild every line from trusted catalog data; client-sent prices are ignored.
  const lines: { productId: string; name: string; size: string; height: string; quantity: number; unitPrice: number }[] = [];
  for (const raw of rawItems) {
    const productId = String(raw.productId || "");
    const sizeLabel = String(raw.sizeLabel || "");
    const heightLabel = String(raw.heightLabel || "");
    const quantity = Math.max(1, Math.min(20, Math.round(Number(raw.quantity) || 0)));
    const product = products.find((p) => p.id === productId);
    if (!product) return json({ ok: false, error: "unknown product" }, 400);
    const size = product.sizes.find((s) => s.label === sizeLabel);
    const height = product.heights.find((h) => h.label === heightLabel);
    const variant = size && height ? getVariant(product, size.id, height.id) : undefined;
    if (!variant) return json({ ok: false, error: "unknown variant" }, 400);
    lines.push({ productId, name: product.name, size: sizeLabel, height: heightLabel, quantity, unitPrice: variant.price });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  const shippingFee = calculateShipping(
    lines.map((l) => ({
      category: products.find((p) => p.id === l.productId)!.category,
      quantity: l.quantity,
    })),
    subtotal,
    governorate
  );
  const total = subtotal + shippingFee;

  if (clientTotal !== null && Math.abs(clientTotal - total) > 1) {
    return json({ ok: false, error: "total mismatch", expectedTotal: total }, 409);
  }

  const trackingToken = newTrackingToken();
  const itemsJson = JSON.stringify({ lines, subtotal, shippingFee, currency: siteConfig.currency });
  try {
    const stored = await env.DB.prepare(
      "INSERT INTO orders (id, created_at, customer_name, phone, governorate, address, notes, items_json, total_egp, status, tracking_token) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'received', ?)"
    )
      .bind(
        id,
        new Date().toISOString(),
        name,
        phone,
        governorate,
        address,
        notes,
        itemsJson,
        total,
        trackingToken
      )
      .run();
    if (!stored || stored.success !== true) return json({ ok: false, error: "storage error" }, 500);
  } catch (e: any) {
    if (String(e && e.message).includes("UNIQUE")) {
      // A key collision is not proof that THIS order was saved. Compare the whole normalized order.
      try {
        const existing = await env.DB.prepare(
          "SELECT customer_name, phone, governorate, address, notes, items_json, total_egp, tracking_token FROM orders WHERE id = ?"
        ).bind(id).first();
        if (existing && existing.customer_name === name && existing.phone === phone &&
            existing.governorate === governorate && existing.address === address &&
            (existing.notes || "") === notes && existing.items_json === itemsJson &&
            Number(existing.total_egp) === total) {
          return json({ ok: true, duplicate: true, id, total, trackingToken: String(existing.tracking_token || "") });
        }
        return json({ ok: false, error: "order id conflict" }, 409);
      } catch { return json({ ok: false, error: "storage verification error" }, 500); }
    }
    return json({ ok: false, error: "storage error" }, 500);
  }
  return json({ ok: true, id, total, trackingToken });
};

