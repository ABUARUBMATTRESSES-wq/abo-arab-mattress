// WhatsApp order-notification plumbing (Gupshup Cloud-API coexistence route).
// DORMANT BY DEFAULT: sends only when ALL WHATSAPP_* env vars are configured in
// Pages (API key, source number, app name, approved template IDs) AND the order
// carries an explicit whatsapp_opt_in flag. No customer-facing text lives here:
// the approved templates (Arabic copy, owner-reviewed) live in the Meta/Gupshup
// template registry; this code passes only variables. Never throws and never
// blocks the order: a notification failure must not fail a sale.

interface NotifyEnv {
  WHATSAPP_API_KEY?: string;
  WHATSAPP_SOURCE_NUMBER?: string;      // digits with country code, e.g. 201551600820
  WHATSAPP_SRC_NAME?: string;           // Gupshup app name the number belongs to
  WHATSAPP_TEMPLATE_ID_ORDER?: string;  // Meta-approved order-confirmation template id
  WHATSAPP_TEMPLATE_ID_STATUS?: string; // Meta-approved status-change template id
}

// Source of truth for these labels is track.ts (what customers already see on /track).
const STATUS_LABELS: Record<string, string> = {
  received: "تم استلام الطلب",
  preparing: "جاري التجهيز",
  shipped: "خرج للشحن",
  delivered: "تم التسليم",
};

// Egyptian local mobile (01xxxxxxxxx) -> international digits (201xxxxxxxxx).
export function toIntlDigits(phone: string): string {
  let p = phone.replace(/[^\d]/g, "");
  if (p.startsWith("00")) p = p.slice(2);
  if (p.startsWith("0")) p = "20" + p.slice(1);
  return p;
}

async function sendTemplate(env: NotifyEnv, templateId: string | undefined, destinationPhone: string, params: string[]): Promise<void> {
  if (!env.WHATSAPP_API_KEY || !env.WHATSAPP_SOURCE_NUMBER || !env.WHATSAPP_SRC_NAME || !templateId) return;
  try {
    const body = new URLSearchParams({
      channel: "whatsapp",
      source: env.WHATSAPP_SOURCE_NUMBER,
      "src.name": env.WHATSAPP_SRC_NAME,
      destination: toIntlDigits(destinationPhone),
      template: JSON.stringify({ id: templateId, params }),
    });
    const res = await fetch("https://api.gupshup.io/wa/api/v1/template/msg", {
      method: "POST",
      headers: { apikey: env.WHATSAPP_API_KEY, "content-type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!res.ok) console.log("whatsapp notify failed", res.status);
  } catch (e) {
    console.log("whatsapp notify error", String(e));
  }
}

// New order confirmed: params [order id, tracking token].
export async function notifyOrderPlaced(
  env: NotifyEnv,
  order: { id: string; phone: string; trackingToken: string }
): Promise<void> {
  await sendTemplate(env, env.WHATSAPP_TEMPLATE_ID_ORDER, order.phone, [order.id, order.trackingToken]);
}

// Status changed: params [order id, Arabic status label already shown on /track].
export async function notifyStatusChanged(
  env: NotifyEnv,
  order: { id: string; phone: string; status: string }
): Promise<void> {
  const label = STATUS_LABELS[order.status];
  if (!label) return;
  await sendTemplate(env, env.WHATSAPP_TEMPLATE_ID_STATUS, order.phone, [order.id, label]);
}
