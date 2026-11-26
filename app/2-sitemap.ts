import type { MetadataRoute } from "next";
import { products } from "@/lib/products";

export const dynamic = "force-static";

const SITE_URL = "https://abo-arab-mattress.pages.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/shop`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/advisor`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/size-guide`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/showroom`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/returns-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/shipping-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/warranty-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/privacy-policy`, changeFrequency: "yearly", priority: 0.2 },
  ];
  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/product/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));
  return [...staticRoutes, ...productRoutes];
}
