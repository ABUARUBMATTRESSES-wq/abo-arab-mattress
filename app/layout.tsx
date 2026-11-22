import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import WhatsappFloatButton from "@/components/WhatsappFloatButton";
import MetaPixelScript from "@/components/MetaPixelScript";
import { siteConfig } from "@/lib/config";

// ملاحظة: بنحمّل خط Cairo عن طريق رابط Google Fonts مباشرة بدل next/font
// عشان نضمن نجاح البناء (build) حتى في بيئات بدون اتصال وقت الـ build.
export const metadata: Metadata = {
  title: `${siteConfig.brandNameAr} | Abo Arab Mattress`,
  description: "مراتب ومفروشات أبو عرب — جودة فندقية، ضمان حقيقي، توصيل لكل محافظات مصر، والدفع عند الاستلام.",
  keywords: ["مراتب", "مفروشات", "مخدات", "واقي مرتبة", "أبو عرب", "مراتب طبية"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Tajawal:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-cairo antialiased">
        <MetaPixelScript />
        <CartProvider>
          {children}
          <WhatsappFloatButton />
        </CartProvider>
      </body>
    </html>
  );
}
