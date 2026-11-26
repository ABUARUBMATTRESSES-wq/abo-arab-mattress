import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "المعرض",
  description: "عنوان معرض أبو عرب للمراتب والوصول إليه عبر الخريطة.",
  alternates: { canonical: "/showroom" },
};

const ADDRESS = "123 حسن المأمون أمام النادي الاهلي مول فرنتشر تاون معرض ابوعرب للمراتب مدينه نصر";
const MAPS_URL = "https://maps.app.goo.gl/SLcSHpZFfDi7EJq49";

const linkClass = "font-bold text-[#85691a] underline underline-offset-4";

export default function ShowroomPage() {
  return (
    <>
      <Header />
      <main className="container-app py-14">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <h1 className="section-title">المعرض</h1>
          </div>
          <div className="card space-y-6 p-6 sm:p-8">
            <div className="flex gap-3">
              <MapPin className="mt-1 shrink-0 text-gold-dark" size={22} aria-hidden="true" />
              <div>
                <h2 className="font-extrabold text-navy">العنوان</h2>
                <p className="mt-1 leading-8 text-navy/80">{ADDRESS}</p>
                <a href={MAPS_URL} target="_blank" rel="noreferrer" className="btn-gold mt-4 inline-block">افتح الموقع على الخريطة</a>
              </div>
            </div>
            <p className="border-t border-navy/10 pt-4 text-sm text-navy/70">
              للتواصل: <Link href="/contact" className={linkClass}>صفحة تواصل معنا</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
