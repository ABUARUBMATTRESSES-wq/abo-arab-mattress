import { siteConfig } from "./config";
import type { CartItem } from "./types";

export function isCairoOrGiza(governorate: string): boolean {
  return governorate === "القاهرة" || governorate === "الجيزة";
}

// Threshold applies to the merchandise subtotal, not the delivery charge.
// Toppers and protectors remain accessories, separate from mattresses.
export function calculateShipping(
  items: Pick<CartItem, "category" | "quantity">[],
  merchandiseSubtotal: number,
  governorate: string
): number {
  if (items.length === 0) return 0;
  if (isCairoOrGiza(governorate)) {
    return merchandiseSubtotal >= siteConfig.freeShippingThreshold ? 0 : siteConfig.shippingFee;
  }
  const mattressCount = items
    .filter((item) => item.category === "mattresses")
    .reduce((count, item) => count + item.quantity, 0);
  return mattressCount > 0 ? mattressCount * 300 : 300;
}
