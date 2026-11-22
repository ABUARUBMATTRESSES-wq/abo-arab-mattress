"use client";

import { Phone, Mail, MapPin, MessageCircle, Facebook, Instagram } from "lucide-react";
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
          <p className="mt-2 text-navy/60">فريقنا جاهز للرد على استفساراتك في أي وقت</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href={buildWhatsappLink("السلام عليكم، حابب أستفسر عن منتجاتكم 🙏")}
            target="_blank"
            rel="noreferrer"
            className="card flex flex-col items-center gap-3 p-6 text-center transition hover:-translate-y-1"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#25D366]/10 text-[#25D366]">
              <MessageCircle size={26} />
            </span>
            <p className="font-extrabold text-navy">واتساب</p>
            <p className="text-sm text-navy/60">الرد الأسرع لاستفساراتك</p>
          </a>

          <a href={`tel:${siteConfig.phoneDisplay}`} className="card flex flex-col items-center gap-3 p-6 text-center transition hover:-translate-y-1">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy/5 text-navy">
              <Phone size={26} />
            </span>
            <p className="font-extrabold text-navy">اتصل بنا</p>
            <p className="text-sm text-navy/60">{siteConfig.phoneDisplay}</p>
          </a>

          <a href={`mailto:${siteConfig.email}`} className="card flex flex-col items-center gap-3 p-6 text-center transition hover:-translate-y-1">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy/5 text-navy">
              <Mail size={26} />
            </span>
            <p className="font-extrabold text-navy">البريد الإلكتروني</p>
            <p className="text-sm text-navy/60">{siteConfig.email}</p>
          </a>

          <div className="card flex flex-col items-center gap-3 p-6 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy/5 text-navy">
              <MapPin size={26} />
            </span>
            <p className="font-extrabold text-navy">موقعنا</p>
            <p className="text-sm text-navy/60">{siteConfig.address}</p>
          </div>
        </div>

        <div className="mt-10 flex justify-center gap-4">
          <a href={siteConfig.social.facebook} target="_blank" rel="noreferrer" className="flex h-11 w-11 items-center justify-center rounded-full bg-navy/5 text-navy transition hover:bg-navy hover:text-white">
            <Facebook size={20} />
          </a>
          <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer" className="flex h-11 w-11 items-center justify-center rounded-full bg-navy/5 text-navy transition hover:bg-navy hover:text-white">
            <Instagram size={20} />
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
