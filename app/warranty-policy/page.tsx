import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { buildWhatsappLink } from "@/lib/config";

export const metadata: Metadata = {
  title: "الضمان",
  description: "ضمان 10 سنوات على المراتب من أبو عرب للمراتب والمفروشات.",
  alternates: { canonical: "/warranty-policy" },
};

const linkClass = "font-bold text-[#85691a] underline underline-offset-4";

export default function WarrantyPolicyPage() {
  return (
    <>
      <Header />
      <main className="container-app py-14">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <h1 className="section-title">الضمان</h1>
          </div>
          <div className="card p-6 sm:p-8">
            <p className="text-lg font-extrabold text-navy">ضمان 10 سنوات على المراتب.</p>
            <p className="mt-6 leading-8 text-navy/80">
              للاستفسار عن الضمان تواصل معنا على واتساب:{" "}
              <a href={buildWhatsappLink("السلام عليكم، حابب أستفسر")} target="_blank" rel="noreferrer" className={linkClass}>01551600820</a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
