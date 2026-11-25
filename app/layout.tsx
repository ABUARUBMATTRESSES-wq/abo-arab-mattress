import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import WhatsappFloatButton from "@/components/WhatsappFloatButton";
import MetaPixelScript from "@/components/MetaPixelScript";
import { siteConfig } from "@/lib/config";

// ملاحظة: بنحمّل خط Cairo عن طريق رابط Google Fonts مباشرة بدل next/font
// عشان نضمن نجاح البناء (build) حتى في بيئات بدون اتصال وقت الـ build.
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
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Fonts load without blocking first paint: the stylesheet starts as media=print and switches to all on load. */}
        <link
          id="abo-fonts"
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Tajawal:wght@400;500;700;900&display=swap"
          rel="stylesheet"
          media="print"
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var l=document.getElementById('abo-fonts');if(!l)return;function a(){l.media='all'}if(l.sheet){a()}else{l.addEventListener('load',a);setTimeout(a,3000)}})();",
          }}
        />
        <noscript>
          <link
            href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Tajawal:wght@400;500;700;900&display=swap"
            rel="stylesheet"
          />
        </noscript>
      </head>
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
