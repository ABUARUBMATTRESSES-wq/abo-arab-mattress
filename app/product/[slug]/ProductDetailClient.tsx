"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Star, MessageCircle, ShoppingCart, ShieldCheck, Truck, Check } from "lucide-react";
import { Product } from "@/lib/types";
import { getVariant, formatPrice, computeDiscountPercent, products } from "@/lib/products";
import { findCheaperAlternatives } from "@/lib/brands";
import { buildWhatsappLink, siteConfig } from "@/lib/config";
import { useCart } from "@/context/CartContext";
import { trackEvent } from "@/lib/pixel";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PriceTag from "@/components/PriceTag";
import { productImageAtWidth, productImageSrcSet } from "@/lib/product-images";

export default function ProductDetailClient({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(0);
  const [sizeId, setSizeId] = useState(product.sizes[0]?.id);
  const [heightId, setHeightId] = useState(product.heights[0]?.id);

  // Pre-select the variant passed in the URL (e.g. from a cheaper-alternative card).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get("size");
    const h = params.get("height");
    if (s && product.sizes.some((x) => x.id === s)) setSizeId(s);
    if (h && product.heights.some((x) => x.id === h)) setHeightId(h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);
  const { addItem } = useCart();

  const variant = useMemo(
    () => getVariant(product, sizeId, heightId),
    [product, sizeId, heightId]
  );

  const selectedSize = product.sizes.find((s) => s.id === sizeId);
  const selectedHeight = product.heights.find((h) => h.id === heightId);
  const cheaperAlternatives = useMemo(
    () => findCheaperAlternatives(product, products, sizeId, heightId),
    [product, sizeId, heightId]
  );

  useEffect(() => {
    trackEvent("ViewContent", {
      content_name: product.name,
      content_ids: [product.id],
      value: variant?.price,
      currency: "EGP",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  if (!variant || !selectedSize || !selectedHeight) return null;

  const discountPercent = computeDiscountPercent(variant.originalPrice, variant.price);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      category: product.category,
      productName: product.name,
      slug: product.slug,
      image: product.images[0],
      sizeLabel: selectedSize.label,
      heightLabel: selectedHeight.label,
      unitPrice: variant.price,
      originalUnitPrice: variant.originalPrice,
      quantity,
    });
    trackEvent("AddToCart", {
      content_name: product.name,
      content_ids: [product.id],
      value: variant.price * quantity,
      currency: "EGP",
    });
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2500);
  };

  const whatsappMessage = `السلام عليكم، حابب أطلب:\n\n🛏️ ${product.name}\nالمقاس: ${selectedSize.label}\nالارتفاع: ${selectedHeight.label}\nالكمية: ${quantity}\nالسعر: ${formatPrice(variant.price * quantity)} ${siteConfig.currency}\n\nمنتظر ردكم 🙏`;

  const handleWhatsappClick = () => {
    trackEvent("InitiateCheckout", {
      content_name: product.name,
      value: variant.price * quantity,
      currency: "EGP",
    });
  };

  return (
    <>
      <Header />
      <main className="container-app py-10">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* معرض الصور */}
          <div>
            <div className="card mb-3 aspect-square overflow-hidden">
              <img src={productImageAtWidth(product.images[activeImage], 960)} srcSet={productImageSrcSet(product.images[activeImage])} sizes="(min-width: 1024px) 560px, 100vw" decoding="async" fetchPriority="high" alt={product.name} className="h-full w-full object-cover" />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    type="button"
                    aria-label={`صورة ${i + 1} لمنتج ${product.name}`}
                    key={img}
                    onClick={() => setActiveImage(i)}
                    className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${
                      activeImage === i ? "border-gold" : "border-transparent"
                    }`}
                  >
                    <img src={productImageAtWidth(img, 160)} loading="lazy" decoding="async" alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* تفاصيل المنتج */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              {product.isNew && <span className="badge-navy">جديد</span>}
              {product.reviewsCount > 0 && (
                <span className="flex items-center gap-1 text-sm text-navy/60">
                  <Star size={16} className="fill-gold text-gold" />
                  <span className="font-bold text-navy">{product.rating}</span> ({product.reviewsCount} تقييم)
                </span>
              )}
            </div>
            <h1 className="text-2xl font-extrabold text-navy sm:text-3xl">{product.name}</h1>
            <p className="mt-2 text-navy/60">{product.shortDescription}</p>

            <div className="my-5 flex flex-wrap items-center gap-3">
              <PriceTag price={variant.price} originalPrice={variant.originalPrice} size="lg" />
            </div>
            {discountPercent > 0 && (
              <p className="mb-5 -mt-3 text-sm font-bold text-emerald-600">
                وفرت {formatPrice(variant.originalPrice - variant.price)} {siteConfig.currency} ({discountPercent}%)
              </p>
            )}

            {/* المقاس / الاختيار */}
            {product.sizes.length > 1 && (
            <div className="mb-5">
              <p className="mb-2 text-sm font-extrabold text-navy">
                {product.category === "mattresses" || product.category === "toppers" ? "المقاس (سم)" : "الاختيار"}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s.id}
                    disabled={!getVariant(product, s.id, heightId)}
                    onClick={() => setSizeId(s.id)}
                    className={`rounded-xl border px-4 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-30 ${
                      sizeId === s.id ? "border-gold bg-gold-gradient text-navy shadow-gold" : "border-navy/15 text-navy/70"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            )}

            {/* الارتفاع */}
            {product.heights.length > 1 && (
            <div className="mb-6">
              <p className="mb-2 text-sm font-extrabold text-navy">الارتفاع</p>
              <div className="flex flex-wrap gap-2">
                {product.heights.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => {
                      setHeightId(h.id);
                      if (!getVariant(product, sizeId, h.id)) {
                        const available = product.variantPrices.find((v) => v.heightId === h.id);
                        if (available) setSizeId(available.sizeId);
                      }
                    }}
                    className={`rounded-xl border px-4 py-2 text-sm font-bold transition ${
                      heightId === h.id ? "border-gold bg-gold-gradient text-navy shadow-gold" : "border-navy/15 text-navy/70"
                    }`}
                  >
                    {h.label}
                  </button>
                ))}
              </div>
            </div>

            )}

            {/* الكمية */}
            <div className="mb-6 flex items-center gap-3">
              <p className="text-sm font-extrabold text-navy">الكمية</p>
              <div className="flex items-center overflow-hidden rounded-xl border border-navy/15">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 font-bold text-navy hover:bg-navy/5"
                >
                  −
                </button>
                <span className="w-10 text-center font-bold text-navy">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-4 py-2 font-bold text-navy hover:bg-navy/5"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button onClick={handleAddToCart} className="btn-primary w-full sm:w-auto">
                <ShoppingCart size={20} /> أضف إلى السلة
              </button>
              <a
                href={buildWhatsappLink(whatsappMessage)}
                target="_blank"
                rel="noreferrer"
                onClick={handleWhatsappClick}
                className="btn-whatsapp w-full sm:w-auto"
              >
                <MessageCircle size={20} /> طلب سريع عبر واتساب
              </a>
            </div>

            {addedMessage && (
              <p className="mt-3 flex items-center gap-2 text-sm font-bold text-emerald-600">
                <Check size={16} /> تمت الإضافة إلى السلة بنجاح
              </p>
            )}

            <div className="mt-6 grid grid-cols-2 gap-3 text-xs font-bold text-navy/70">
              {product.warrantyYears > 0 && (
                <div className="flex items-center gap-2 rounded-xl bg-navy/5 p-3">
                  <ShieldCheck size={18} className="text-gold-dark" /> ضمان {product.warrantyYears} سنوات
                </div>
              )}
              <div className="flex items-center gap-2 rounded-xl bg-navy/5 p-3">
                <Truck size={18} className="text-gold-dark" /> توصيل لكل المحافظات
              </div>
            </div>
          </div>
        </div>

        {/* الباقات */}
        {product.bundles && product.bundles.length > 0 && (
          <section className="mt-16">
            <h2 className="section-title mb-6">باقات توفير مقترحة</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {product.bundles.map((bundle) => (
                <div key={bundle.id} className="card flex gap-4 p-5">
                  <img
                    src={`https://images.unsplash.com/${bundle.imageQuery}?auto=format&fit=crop&w=300&q=80`}
                    alt={bundle.title}
                    className="h-24 w-24 shrink-0 rounded-xl object-cover"
                  />
                  <div>
                    <p className="font-extrabold text-navy">{bundle.title}</p>
                    <ul className="mt-1 space-y-0.5 text-xs text-navy/60">
                      {bundle.includes.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                    <span className="badge-gold mt-2 inline-flex">وفر {bundle.extraDiscountPercent}% إضافية</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* بدائل مشابهة بسعر أقل */}
        {cheaperAlternatives.length > 0 && (
          <section className="mt-16">
            <h2 className="section-title mb-2">بدائل مشابهة بسعر أقل</h2>
            <p className="mb-6 text-sm text-navy/60">
              بدائل متوفرة بنفس المقاس والارتفاع بسعر أقل، مع توضيح الاختلافات بينها وبين هذا المنتج.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cheaperAlternatives.map((alt) => (
                <div key={alt.product.id} className="card flex flex-col overflow-hidden">
                  <Link href={`/product/${alt.product.slug}?size=${sizeId}&height=${heightId}`} className="relative block aspect-[4/3] overflow-hidden bg-navy/5">
                    <img
                      src={productImageAtWidth(alt.product.images[0], 640)}
                      srcSet={productImageSrcSet(alt.product.images[0])}
                      sizes="(min-width: 1024px) 360px, 50vw"
                      decoding="async"
                      alt={alt.product.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <Link href={`/product/${alt.product.slug}?size=${sizeId}&height=${heightId}`} className="font-extrabold text-navy hover:text-gold-dark">
                      {alt.product.name}
                    </Link>
                    <p className="text-xs text-navy/60">
                      متوفر بنفس الاختيار: {alt.sizeLabel} / {alt.heightLabel}
                    </p>
                    <p className="text-sm">
                      <span className="font-extrabold text-navy">{formatPrice(alt.variant.price)} ج.م</span>
                    </p>
                    <p className="text-xs leading-5 text-navy/60">
                      أقل بـ {formatPrice(alt.currentPrice - alt.variant.price)} ج.م من سعر هذا المنتج (
                      {formatPrice(alt.currentPrice)} ج.م) لنفس المقاس والارتفاع.
                    </p>
                    {alt.differences.length > 0 && (
                      <div className="rounded-xl bg-paper p-3">
                        <p className="mb-1 text-xs font-extrabold text-navy">الاختلافات عن هذا المنتج:</p>
                        <ul className="space-y-1 text-xs leading-5 text-navy/70">
                          {alt.differences.map((d) => (
                            <li key={d}>• {d}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* المواصفات */}
        <section className="mt-16 max-w-2xl">
          <h2 className="section-title mb-6">المواصفات التفصيلية</h2>
          <div className="card overflow-hidden">
            {product.specs.map((spec, i) => (
              <div
                key={spec.label}
                className={`flex items-center justify-between p-4 text-sm ${i % 2 === 0 ? "bg-white" : "bg-paper"}`}
              >
                <span className="font-bold text-navy/60">{spec.label}</span>
                <span className="font-extrabold text-navy">{spec.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="section-title mb-6">عن المنتج</h2>
          {product.readableDescription ? (
            <div className="card max-w-3xl p-6 sm:p-8">
              <p className="mb-5 leading-8 text-navy/80">{product.readableDescription.intro}</p>
              <ul className="space-y-3 text-navy/80">
                {product.readableDescription.points.map((point) => (
                  <li key={point} className="flex items-start gap-3 leading-7">
                    <Check size={18} className="mt-1 shrink-0 text-gold-dark" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="max-w-3xl leading-8 text-navy/70">{product.description}</p>
          )}
        </section>

        <div className="mt-10">
          <Link href="/shop" className="font-bold text-navy hover:text-gold-dark">
            ← الرجوع للمتجر
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
