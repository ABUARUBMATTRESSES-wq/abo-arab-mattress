import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdvisorClient from "./AdvisorClient";

export const metadata: Metadata = {
  title: "مساعد اختيار المرتبة",
  description: "اختار عرض وطول سريرك وشوف الموديلات المتاحة بهذا المقاس مع أسعارها وقارن بينها.",
  alternates: { canonical: "/advisor" },
};

export default function AdvisorPage() {
  return (
    <>
      <Header />
      <main className="container-app py-10">
        <Suspense fallback={<p className="py-10 text-center text-navy/60">جاري التحميل...</p>}>
          <AdvisorClient />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
