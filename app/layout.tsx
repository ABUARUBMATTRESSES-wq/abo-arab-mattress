import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import WhatsappFloatButton from "@/components/WhatsappFloatButton";
import MetaPixelScript from "@/components/MetaPixelScript";
import { siteConfig } from "@/lib/config";
import { Cairo } from "next/font/google";

// خط Cairo بيتحمّل من next/font وقت الـ build ويتخدم من نفس الموقع (بدون طلب خارجي بيعطّل العرض).
const cairo = Cairo({ subsets: ["arabic", "latin"], display: "swap", variable: "--font-cairo-nf" });
const SITE_URL = "https://abo-arab-mattress.pages.dev";
const SITE_DESCRIPTION = "تصفح المراتب والمخدات والخداديات وواقي المرتبة وطبقات التطرية من أبو عرب.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${siteConfig.brandNameAr} | Abo Arab Mattress`,
  description: SITE_DESCRIPTION,
  keywords: ["مراتب", "مفروشات", "مخدات", "واقي مرتبة", "أبو عرب", "مراتب طبية"],
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: SITE_URL,
    siteName: siteConfig.brandNameAr,
    title: `${siteConfig.brandNameAr} | Abo Arab Mattress`,
    description: SITE_DESCRIPTION,
    images: [{ url: "/1-og-share.png", width: 1200, height: 630, alt: "مراتب و مفروشات أبو عرب" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.brandNameAr} | Abo Arab Mattress`,
    description: SITE_DESCRIPTION,
    images: ["/1-og-share.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="pb-14 font-cairo antialiased md:pb-0">
        <MetaPixelScript />
        <CartProvider>
          {children}
          <WhatsappFloatButton />
        </CartProvider>
      </body>
    </html>
  );
}
