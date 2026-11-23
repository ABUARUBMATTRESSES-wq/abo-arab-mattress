// Keep the source image and version. Request only the display width from known image CDNs.
export function productImageAtWidth(src: string, width: number): string {
  try {
    const url = new URL(src);
    if (url.hostname !== "cdn.shopify.com" && url.hostname !== "bedjanssen.com") return src;
    if (!url.pathname.includes("/cdn/shop/") && !url.pathname.includes("/s/files/")) return src;
    url.searchParams.set("width", String(width));
    return url.toString();
  } catch { return src; }
}

export function productImageSrcSet(src: string): string | undefined {
  if (productImageAtWidth(src, 400) === src) return undefined;
  return [320, 480, 640, 960].map((width) => `${productImageAtWidth(src, width)} ${width}w`).join(", ");
}
