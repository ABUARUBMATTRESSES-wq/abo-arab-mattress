import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import FeaturesBar from "@/components/FeaturesBar";
import Categories from "@/components/Categories";
import BrandsSection from "@/components/BrandsSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import Testimonials from "@/components/Testimonials";
import FaqSection from "@/components/FaqSection";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// بيانات منظّمة للمعرض: كلها من إعدادات الموقع المنشورة أصلًا (العنوان، الهاتف، السوشيال) ومواعيد العمل المؤكدة (١٢ ظهرًا حتى ١٠ مساءً يوميًا).
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: siteConfig.brandNameAr,
  url: "https://abo-arab-mattress.pages.dev",
  address: { "@type": "PostalAddress", streetAddress: siteConfig.address, addressCountry: "EG" },
  hasMap: siteConfig.mapsUrl,
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "12:00",
      closes: "22:00",
    },
  ],
  sameAs: [siteConfig.social.facebook, siteConfig.social.instagram, siteConfig.social.tiktok],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd).replace(/</g, "\\u003c") }} />
      <Header />
      <main>
        <Hero />
        <FeaturesBar />
        <Categories />
        <BrandsSection />
        <FeaturedProducts />
        <Testimonials />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
