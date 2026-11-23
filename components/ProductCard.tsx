"use client";

import Link from "next/link";
import { Star, Scale, Sparkles } from "lucide-react";
import { Product } from "@/lib/types";
import { getDefaultVariant } from "@/lib/products";
import PriceTag from "./PriceTag";
import { productImageAtWidth, productImageSrcSet } from "@/lib/product-images";

export default function ProductCard({
  product,
  compareMode = false,
  isComparing = false,
  onToggleCompare,
  eager = false,
}: {
  product: Product;
  compareMode?: boolean;
  isComparing?: boolean;
  onToggleCompare?: (id: string) => void;
  eager?: boolean;
}) {
  const defaultVariant = getDefaultVariant(product);

  return (
    <div className="card group relative flex flex-col overflow-hidden transition hover:-translate-y-1 hover:border-gold">
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-navy/5">
        <img
          src={productImageAtWidth(product.images[0], 640)}
          srcSet={productImageSrcSet(product.images[0])}
          sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 50vw"
          alt={product.name}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {product.isNew && <span className="badge-navy">جديد</span>}
          {defaultVariant && defaultVariant.originalPrice > defaultVariant.price && (
            <span className="badge-gold">
              <Sparkles size={12} /> خصم {Math.round(((defaultVariant.originalPrice - defaultVariant.price) / defaultVariant.originalPrice) * 100)}%
            </span>
          )}
        </div>
        {compareMode && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onToggleCompare?.(product.id);
            }}
            className={`absolute top-3 left-3 flex h-9 w-9 items-center justify-center rounded-full shadow-luxury transition ${
              isComparing ? "bg-gold-gradient text-navy" : "bg-white text-navy/60"
            }`}
            aria-label="إضافة للمقارنة"
          >
            <Scale size={16} />
          </button>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/product/${product.slug}`}>
          <h2 className="font-extrabold text-navy line-clamp-2 leading-6">{product.name}</h2>
        </Link>
        {product.shortDescription !== product.name && (
          <p className="line-clamp-2 text-sm text-navy/60">{product.shortDescription}</p>
        )}

        {product.reviewsCount > 0 && (
          <div className="mt-1 flex items-center gap-1 text-xs text-navy/60">
            <Star size={14} className="fill-gold text-gold" />
            <span className="font-bold text-navy">{product.rating}</span>
            <span>({product.reviewsCount} تقييم)</span>
          </div>
        )}

        {defaultVariant && (
          <div className="mt-auto pt-3">
            <PriceTag price={defaultVariant.price} originalPrice={defaultVariant.originalPrice} />
          </div>
        )}

        <Link href={`/product/${product.slug}`} className="btn-primary mt-3 w-full !py-2.5 !px-2 text-sm whitespace-nowrap">
          عرض التفاصيل
        </Link>
      </div>
    </div>
  );
}
