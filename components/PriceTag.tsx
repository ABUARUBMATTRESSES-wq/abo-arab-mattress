import { computeDiscountPercent, formatPrice } from "@/lib/catalog-helpers";
import { siteConfig } from "@/lib/config";

export default function PriceTag({
  price,
  originalPrice,
  size = "md",
}: {
  price: number;
  originalPrice: number;
  size?: "sm" | "md" | "lg";
}) {
  const hasDiscount = originalPrice > price;
  const discountPercent = computeDiscountPercent(originalPrice, price);

  const priceClass = size === "lg" ? "text-3xl" : size === "md" ? "text-xl" : "text-base";
  const originalClass = size === "lg" ? "text-base" : "text-sm";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={`font-extrabold text-navy ${priceClass}`}>
        {formatPrice(price)} <span className="text-sm font-bold text-navy/60">{siteConfig.currency}</span>
      </span>
      {hasDiscount && (
        <>
          <span className={`text-navy/40 line-through ${originalClass}`}>{formatPrice(originalPrice)}</span>
          <span className="badge-gold">وفّر {discountPercent}%</span>
        </>
      )}
    </div>
  );
}
