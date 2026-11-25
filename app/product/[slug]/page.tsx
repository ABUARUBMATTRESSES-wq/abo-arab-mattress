import { notFound } from "next/navigation";
import { getProductBySlug, products } from "@/lib/products";
import { getCardSummary } from "@/lib/card-summary";
import ProductDetailClient from "./ProductDetailClient";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) return {};
  const summary = getCardSummary(product);
  const description = summary && summary !== product.name ? summary : product.shortDescription;
  return {
    title: `${product.name} | مراتب و مفروشات أبو عرب`,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.images[0] ? [{ url: product.images[0], alt: product.name }] : undefined,
    },
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();
  const prices = product.variantPrices.map((v) => v.price).filter((n) => Number.isFinite(n) && n > 0);
  const jsonLd =
    prices.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.shortDescription,
          image: product.images.slice(0, 1),
          url: `https://abo-arab-mattress.pages.dev/product/${product.slug}`,
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "EGP",
            lowPrice: Math.min(...prices),
            highPrice: Math.max(...prices),
            offerCount: prices.length,
          },
        }
      : null;
  return (
    <>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      )}
      <ProductDetailClient product={product} />
    </>
  );
}
