"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { Trash2, Minus, Plus, Truck, ShoppingBag, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { siteConfig, governorates, buildWhatsappLink } from "@/lib/config";
import { formatPrice } from "@/lib/products";
import { trackEvent } from "@/lib/pixel";
import { saveLead } from "@/lib/leads";
import { CustomerInfo } from "@/lib/types";
import { calculateShipping, isCairoOrGiza } from "@/lib/shipping";

const TURNSTILE_SITE_KEY = "0x4AAAAAAGNxoLS_4jeZj30N";

function normalizePhone(value: string): string {
  return value.replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 0x660))
    .replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 0x6f0))
    .replace(/[\s().-]/g, "").replace(/^00/, "+");
}

function isValidPhone(value: string): boolean {
  const phone = normalizePhone(value);
  if (phone.startsWith("+20")) return /^\+20(?:1[0125]\d{8}|[2-9]\d{7,8})$/.test(phone);
  if (phone.startsWith("+")) return /^\+[1-9]\d{7,14}$/.test(phone);
  if (phone.startsWith("01")) return /^01[0125]\d{8}$/.test(phone);
  return /^0[2-9]\d{7,8}$/.test(phone);
}

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    originalSubtotal,
    totalSavings,
  } = useCart();

  const [customer, setCustomer] = useState<CustomerInfo>({
    name: "",
    phone: "",
    governorate: governorates[0],
    address: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");
  const checkoutLockRef = useRef(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [saving, setSaving] = useState(false);
  const [orderError, setOrderError] = useState("");

  const turnstileBoxRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetRef = useRef<string | null>(null);

  // Explicit render: implicit .cf-turnstile scanning misses the div because
  // the api.js script loads before/after React paints in a static SPA.
  useEffect(() => {
    let cancelled = false;
    const tryRender = () => {
      if (cancelled) return;
      const ts = (window as unknown as { turnstile?: { render: (el: HTMLElement, opts: Record<string, unknown>) => string } }).turnstile;
      if (ts && turnstileBoxRef.current && turnstileWidgetRef.current === null) {
        turnstileWidgetRef.current = ts.render(turnstileBoxRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: "light",
          callback: (token: string) => setTurnstileToken(token),
          "expired-callback": () => setTurnstileToken(""),
          "error-callback": () => setTurnstileToken(""),
        });
        return;
      }
      setTimeout(tryRender, 500);
    };
    tryRender();
    return () => {
      cancelled = true;
    };
  }, []);

  const shippingFee = calculateShipping(items, subtotal, customer.governorate);
  const regionalFreeShipping = isCairoOrGiza(customer.governorate);
  const total = subtotal + shippingFee;
  const remainingForFreeShipping = Math.max(0, siteConfig.freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / siteConfig.freeShippingThreshold) * 100);

  const phoneIsValid = isValidPhone(customer.phone);
  const showPhoneError = customer.phone.trim().length > 0 && !phoneIsValid;

  const canSubmit = useMemo(
    () => Boolean(items.length > 0 && customer.name.trim() && isValidPhone(customer.phone) && customer.address.trim()),
    [items, customer]
  );

  const handleCheckout = async () => {
    if (!canSubmit || saving || checkoutLockRef.current) return;
    if (!turnstileToken) {
      setOrderError("من فضلك أكمل خطوة التحقق الأمني بالأسفل قبل إتمام الطلب.");
      return;
    }
    checkoutLockRef.current = true;
    setSaving(true);
    setOrderError("");

    let orderId = "";
    let trackingToken = "";

    // The order must be stored server-side before the WhatsApp handoff.
    // On any failure we stop here: no success screen, no WhatsApp window.
    try {
      const payload = {
        name: (customer.name || "").trim(), phone: normalizePhone(customer.phone),
        governorate: customer.governorate, address: (customer.address || "").trim(),
        notes: (customer.notes || "").trim(),
        items: items.map((i) => ({ productId: i.productId, sizeLabel: i.sizeLabel, heightLabel: i.heightLabel, quantity: i.quantity })),
        total,
      };
      // Keep one random id for retries of the same order, even after a lost response/reload.
      // Only a SHA-256 fingerprint and random id are kept here, not customer data.
      const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(payload)));
      const fingerprint = Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
      const newId = () => `AA-${crypto.randomUUID()}`;
      orderId = newId();
      try {
        const previous = JSON.parse(sessionStorage.getItem("abo_arab_pending_order") || "null");
        if (previous?.fingerprint === fingerprint && /^AA-[0-9a-f-]{36}$/i.test(previous.id)) orderId = previous.id;
        sessionStorage.setItem("abo_arab_pending_order", JSON.stringify({ fingerprint, id: orderId }));
      } catch { /* Storage can be disabled. The random id still avoids time-based collisions. */ }
      const res = await fetch("/api/order", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...payload, id: orderId, turnstileToken }),
      });
      const result = await res.json().catch(() => null);
      if (!res.ok || !result || !result.ok || result.id !== orderId || result.total !== total) {
        (window as unknown as { turnstile?: { reset: () => void } }).turnstile?.reset();
        setTurnstileToken("");
        setOrderError("تعذّر تأكيد تسجيل الطلب، ولم يُفتح واتساب. أعد التحقق وحاول مرة أخرى، ولو المشكلة مستمرة تواصل معنا على واتساب.");
        return;
      }
      trackingToken = typeof result.trackingToken === "string" ? result.trackingToken : "";
    } catch {
      (window as unknown as { turnstile?: { reset: () => void } }).turnstile?.reset();
      setTurnstileToken("");
      setOrderError("تعذّر تأكيد تسجيل الطلب بسبب الاتصال، ولم يُفتح واتساب. تحقق من اتصالك وأعد المحاولة بنفس البيانات لتجنب تكرار الطلب.");
      return;
    } finally {
      setSaving(false);
      checkoutLockRef.current = false;
    }

    // A confirmed success completes this attempt; a later intentional order gets a new id.
    setTrackingCode(trackingToken);
    try { sessionStorage.removeItem("abo_arab_pending_order"); } catch { /* optional storage */ }
    saveLead({
      id: orderId,
      createdAt: new Date().toISOString(),
      customer,
      items,
      subtotal,
      shippingFee,
      total,
    });

    trackEvent("Lead", {
      value: total,
      currency: "EGP",
      content_ids: items.map((i) => i.productId),
      num_items: items.reduce((s, i) => s + i.quantity, 0),
    });

    const itemsText = items
      .map(
        (i) =>
          `• ${i.productName} (${i.sizeLabel} / ${i.heightLabel}) × ${i.quantity} = ${formatPrice(
            i.unitPrice * i.quantity
          )} ${siteConfig.currency}`
      )
      .join("\n");

    const message = `🛒 طلب جديد رقم ${orderId}\n\n${itemsText}\n\nالإجمالي الفرعي: ${formatPrice(subtotal)} ${siteConfig.currency}\nالشحن: ${
      shippingFee === 0 ? "مجاني" : `${formatPrice(shippingFee)} ${siteConfig.currency}`
    }\nالإجمالي الكلي: ${formatPrice(total)} ${siteConfig.currency}\n\n👤 بيانات العميل:\nالاسم: ${customer.name}\nالهاتف: ${
      customer.phone
    }\nالمحافظة: ${customer.governorate}\nالعنوان: ${customer.address}${
      customer.notes ? `\nملاحظات: ${customer.notes}` : ""
    }${trackingToken ? `\n\nكود التتبع: ${trackingToken}` : ""}`;

    // The database order is saved already; keep the cart if WhatsApp compose is abandoned.
    window.open(buildWhatsappLink(message), "_blank");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <>
        <Header />
        <main className="container-app flex flex-col items-center justify-center py-24 text-center">
          <div className="card max-w-md p-10">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gold-gradient text-navy">
              <ShoppingBag size={28} />
            </div>
            <h1 className="section-title mb-3">تم تسجيل طلبك</h1>
            <p className="mb-3 text-navy/60">
              طلبك اتسجّل ومستني تأكيد المعرض. مفيش أي دفع تم على الموقع.
            </p>
            <p className="mb-6 text-navy/60">
              فتحنا لك واتساب بتفاصيل الطلب. اضغط إرسال هناك عشان رسالتك توصلنا ونكمّل تأكيد الطلب. لو ما بعتّش الرسالة، الطلب يفضل مسجّل في الموقع، لكن رسالة واتساب مش هتوصلنا. وسلتك محفوظة وتقدر ترجعلها.
            </p>
            {trackingCode && (
              <div className="mb-6 rounded-xl border border-navy/15 bg-navy/5 p-4 text-right">
                <p className="mb-1 font-extrabold text-navy">كود تتبع طلبك</p>
                <p className="select-all break-all font-mono text-sm text-navy" dir="ltr">{trackingCode}</p>
                <p className="mt-2 text-xs text-navy/60">
                  احتفظ بالكود ده — تقدر تتابع بيه حالة طلبك في أي وقت من{" "}
                  <Link href="/track" className="font-bold underline">صفحة تتبع الطلب</Link>.
                </p>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <Link href="/shop" className="btn-primary w-full">
                متابعة التسوق
              </Link>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="btn-outline w-full"
              >
                الرجوع إلى السلة
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      <main className="container-app py-10">
        <h1 className="section-title mb-8">سلة المشتريات</h1>

        {items.length === 0 ? (
          <div className="card flex flex-col items-center gap-4 p-14 text-center">
            <ShoppingBag size={48} className="text-navy/20" />
            <p className="text-navy/60">سلتك فارغة حالياً</p>
            <Link href="/shop" className="btn-primary">
              تصفح المنتجات
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div>
              {/* شريط الشحن المجاني */}
              <div className="card mb-6 p-5">
                <div className="mb-2 flex items-center gap-2 text-sm font-bold text-navy">
                  <Truck size={18} className="text-gold-dark" />
                  {!regionalFreeShipping ? (
                    <span>الشحن لباقي المحافظات: ٣٠٠ ج.م لكل مرتبة، أو ٣٠٠ ج.م للطلب كاملًا إذا كان إكسسوارات ومخدات فقط.</span>
                  ) : remainingForFreeShipping > 0 ? (
                    <span>
                      أضف {formatPrice(remainingForFreeShipping)} {siteConfig.currency} أخرى واحصل على شحن مجاني داخل القاهرة والجيزة!
                    </span>
                  ) : (
                    <span>حصلت على شحن مجاني داخل القاهرة والجيزة</span>
                  )}
                </div>
                {regionalFreeShipping && <div className="h-2.5 overflow-hidden rounded-full bg-navy/10">
                  <div
                    className="h-full rounded-full bg-gold-gradient transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>}
              </div>

              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.sizeLabel}-${item.heightLabel}`}
                    className="card flex gap-4 p-4"
                  >
                    <img src={item.image} alt={item.productName} className="h-24 w-24 shrink-0 rounded-xl object-cover" />
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <Link href={`/product/${item.slug}`} className="font-extrabold text-navy hover:text-gold-dark">
                          {item.productName}
                        </Link>
                        <button
                          onClick={() => removeItem(item.productId, item.sizeLabel, item.heightLabel)}
                          className="text-navy/40 hover:text-red-500"
                          aria-label="حذف"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <p className="text-xs text-navy/50">
                        المقاس: {item.sizeLabel} — الارتفاع: {item.heightLabel}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex items-center overflow-hidden rounded-lg border border-navy/15">
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.sizeLabel, item.heightLabel, item.quantity - 1)
                            }
                            className="px-3 py-1.5 text-navy hover:bg-navy/5"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-navy">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.sizeLabel, item.heightLabel, item.quantity + 1)
                            }
                            className="px-3 py-1.5 text-navy hover:bg-navy/5"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-extrabold text-navy">
                            {formatPrice(item.unitPrice * item.quantity)} {siteConfig.currency}
                          </p>
                          {item.originalUnitPrice > item.unitPrice && (
                            <p className="text-xs text-navy/40 line-through">
                              {formatPrice(item.originalUnitPrice * item.quantity)} {siteConfig.currency}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ملخص الطلب */}
            <div className="h-fit space-y-5">
              <div className="card space-y-2 p-5 text-sm">
                <div className="flex justify-between text-navy/70">
                  <span>الإجمالي الفرعي</span>
                  <span>{formatPrice(originalSubtotal)} {siteConfig.currency}</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between font-bold text-emerald-600">
                    <span>التوفير</span>
                    <span>- {formatPrice(totalSavings)} {siteConfig.currency}</span>
                  </div>
                )}
                <div className="flex justify-between text-navy/70">
                  <span>الشحن</span>
                  <span>{shippingFee === 0 ? "مجاني" : `${formatPrice(shippingFee)} ${siteConfig.currency}`}</span>
                </div>
                <div className="flex justify-between border-t border-navy/10 pt-3 text-base font-extrabold text-navy">
                  <span>الإجمالي</span>
                  <span>{formatPrice(total)} {siteConfig.currency}</span>
                </div>
              </div>

              <div className="card space-y-3 p-5">
                <h2 className="font-extrabold text-navy">بيانات التوصيل</h2>
                <input
                  value={customer.name}
                  onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))}
                  placeholder="الاسم بالكامل"
                  className="w-full rounded-xl border border-navy/15 px-3 py-2.5 text-sm outline-none focus:border-gold"
                />
                <input
                  value={customer.phone}
                  onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))}
                  placeholder="رقم الهاتف"
                  aria-label="رقم الهاتف"
                  aria-invalid={showPhoneError}
                  aria-describedby="phone-help"
                  autoComplete="tel"
                  inputMode="tel"
                  dir="ltr"
                  type="tel"
                  className="w-full rounded-xl border border-navy/15 px-3 py-2.5 text-sm outline-none focus:border-gold"
                />
                <p id="phone-help" role={showPhoneError ? "alert" : undefined} className={`text-xs leading-6 ${showPhoneError ? "text-red-600" : "text-navy/50"}`}>
                  {showPhoneError ? "رقم الهاتف غير صالح. اكتب رقمًا مصريًا صحيحًا أو رقمًا دوليًا يبدأ بـ + أو 00." : "مثال: 01012345678 أو +201012345678. الأرقام العربية مقبولة."}
                </p>
                <select
                  value={customer.governorate}
                  onChange={(e) => setCustomer((c) => ({ ...c, governorate: e.target.value }))}
                  className="w-full rounded-xl border border-navy/15 px-3 py-2.5 text-sm outline-none focus:border-gold"
                >
                  {governorates.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                <textarea
                  value={customer.address}
                  onChange={(e) => setCustomer((c) => ({ ...c, address: e.target.value }))}
                  placeholder="العنوان بالتفصيل (الحي، الشارع، رقم العقار...)"
                  rows={3}
                  className="w-full rounded-xl border border-navy/15 px-3 py-2.5 text-sm outline-none focus:border-gold"
                />
                <textarea
                  value={customer.notes}
                  onChange={(e) => setCustomer((c) => ({ ...c, notes: e.target.value }))}
                  placeholder="ملاحظات إضافية (اختياري)"
                  rows={2}
                  className="w-full rounded-xl border border-navy/15 px-3 py-2.5 text-sm outline-none focus:border-gold"
                />
              </div>

              <div ref={turnstileBoxRef} className="min-h-[65px]" />
              <button onClick={handleCheckout} disabled={!canSubmit || saving} className="btn-whatsapp w-full disabled:opacity-40">
                <MessageCircle size={20} /> {saving ? "جاري تسجيل الطلب..." : "إتمام الطلب عبر واتساب"}
              </button>
              {orderError && <p role="alert" className="text-center text-xs font-bold leading-6 text-red-600">{orderError}</p>}
              {!canSubmit && <p className="text-center text-xs text-navy/50">من فضلك أكمل بيانات التوصيل الأساسية</p>}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

