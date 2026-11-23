"use client";

import { Phone, MapPin, MessageCircle } from "lucide-react";
import SocialLinks from "@/components/SocialLinks";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig, buildWhatsappLink } from "@/lib/config";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="container-app py-14">
        <div className="mb-10 text-center">
          <h1 className="section-title">تواصل معنا</h1>
          <p className="mt-2 text-navy/60">تواصل معنا للاستفسار عن المنتجات والطلبات.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href={buildWhatsappLink("السلام عليكم، حابب أستفسر عن منتجاتكم 🙏")}
            target="_blank"
            rel="noreferrer"
            className="card flex flex-col items-center gap-3 p-6 text-center transition hover:-translate-y-1"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#25D366]/10 text-[#25D366]">
              <MessageCircle size={26} />
            </span>
            <p className="font-extrabold text-navy">تواصل معنا عبر واتساب</p>
            <p className="text-sm text-navy/60">للاستفسارات والطلبات</p>
          </a>

          <a href={`tel:${siteConfig.phoneDisplay}`} className="card flex flex-col items-center gap-3 p-6 text-center transition hover:-translate-y-1">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy/5 text-navy">
              <Phone size={26} />
            </span>
            <p className="font-extrabold text-navy">اتصل بنا</p>
            <p className="text-sm text-navy/60">{siteConfig.phoneDisplay}</p>
          </a>

          <a href={siteConfig.mapsUrl} target="_blank" rel="noreferrer" className="card flex flex-col items-center gap-3 p-6 text-center transition hover:-translate-y-1">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy/5 text-navy">
              <MapPin size={26} />
            </span>
            <p className="font-extrabold text-navy">موقعنا</p>
            <p className="text-sm text-navy/60">{siteConfig.address}</p>
            <span className="text-sm font-bold text-[#85691a] underline underline-offset-4">الوصول للمعرض</span>
          </a>
        </div>

        <div className="mt-10 flex justify-center"><SocialLinks /></div>
      </main>
      <Footer />
    </>
  );
}
