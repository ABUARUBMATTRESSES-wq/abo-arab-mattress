"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    originalSubtotal,
    totalSavings,
    clearCart,
  } = useCart();

  const [customer, setCustomer] = useState<CustomerInfo>({
    name: "",
    phone: "",
    governorate: governorates[0],
    address: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const shippingFee = calculateShipping(items, subtotal, customer.governorate);
  const regionalFreeShipping = isCairoOrGiza(customer.governorate);
  const total = subtotal + shippingFee;
  const remainingForFreeShipping = Math.max(0, siteConfig.freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / siteConfig.freeShippingThreshold) * 100);

  const canSubmit = useMemo(
    () => items.length > 0 && customer.name.trim() && customer.phone.trim() && customer.address.trim(),
    [items, customer]
  );

  const handleCheckout = () => {
    if (!canSubmit) return;

    const orderId = `AA-${Date.now().toString().slice(-6)}`;

    saveLead({
      id: orderId,
      createdAt: new Date().toISOString(),
      customer,
      items,
      subtotal,
      shippingFee,
      total,
    });

    trackEvent("Purchase", {
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
    }`;

    window.open(buildWhatsappLink(message), "_blank");
    setSubmitted(true);
    clearCart();
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
            <h1 className="section-title mb-3">تم إرسال طلبك بنجاح!</h1>
            <p className="mb-6 text-navy/60">
              تم تجهيز تفاصيل طلبك وفتح واتساب لإرسالها لفريقنا. هنتواصل معاك للتأكيد خلال وقت قصير.
            </p>
            <Link href="/shop" className="btn-primary w-full">
              متابعة التسوق
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
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
                  type="tel"
                  className="w-full rounded-xl border border-navy/15 px-3 py-2.5 text-sm outline-none focus:border-gold"
                />
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

              <button onClick={handleCheckout} disabled={!canSubmit} className="btn-whatsapp w-full disabled:opacity-40">
                <MessageCircle size={20} /> إتمام الطلب عبر واتساب
              </button>
              {!canSubmit && <p className="text-center text-xs text-navy/50">من فضلك أكمل بيانات التوصيل الأساسية</p>}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
