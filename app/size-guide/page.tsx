import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SizeGuideClient from "./SizeGuideClient";

export const metadata: Metadata = {
  title: "دليل المقاسات",
  description: "إزاي تقيس سريرك، وحاسبة بسيطة تعرض مساحة المرتبة داخل الأوضة.",
  alternates: { canonical: "/size-guide" },
};

export default function SizeGuidePage() {
  return (
    <>
      <Header />
      <main className="container-app py-10">
        <SizeGuideClient />
      </main>
      <Footer />
    </>
  );
}
