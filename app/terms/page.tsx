import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "شروط استخدام الموقع",
  description: "شروط استخدام موقع أبو عرب للمراتب والمفروشات.",
  alternates: { canonical: "/terms" },
};

const linkClass = "font-bold text-[#85691a] underline underline-offset-4";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="container-app py-14">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <h1 className="section-title">شروط استخدام الموقع</h1>
          </div>
          <div className="card p-6 sm:p-8">
            <ul className="list-disc space-y-3 pr-6 leading-8 text-navy/80">
              <li>الطلب المرسل من الموقع هو طلب مبدئي، ويتم تأكيده مع المعرض على واتساب.</li>
              <li>لا يوجد دفع أونلاين على الموقع.</li>
              <li>
                الاستبدال والاسترجاع حسب{" "}
                <Link href="/returns-policy" className={linkClass}>سياسة الاستبدال والاسترجاع</Link>.
              </li>
              <li>
                الشحن حسب{" "}
                <Link href="/shipping-policy" className={linkClass}>صفحة الشحن</Link>
                ، والضمان حسب{" "}
                <Link href="/warranty-policy" className={linkClass}>صفحة الضمان</Link>.
              </li>
              <li>
                نستخدم بياناتك لتنفيذ طلبك والتواصل معك حسب{" "}
                <Link href="/privacy-policy" className={linkClass}>سياسة الخصوصية</Link>.
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
