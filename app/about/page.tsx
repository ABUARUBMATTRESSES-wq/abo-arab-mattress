import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { buildWhatsappLink } from "@/lib/config";

export const metadata: Metadata = {
  title: "من نحن",
  description: "معرض أبو عرب للمراتب في فرنتشر تاون: مراتب يانسن وإنجلندر وتاكي وفوربد ووندر لاند، وتنفيذ مقاسات خاصة حسب الطلب.",
  alternates: { canonical: "/about" },
};

const linkClass = "font-bold text-[#85691a] underline underline-offset-4";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="container-app py-14">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <h1 className="section-title">من نحن</h1>
          </div>
          <div className="card p-6 sm:p-8">
            <h2 className="text-lg font-extrabold text-navy">معرض أبو عرب للمراتب</h2>
            <p className="mt-2 leading-8 text-navy/80">
              معرض مراتب ومفروشات في فرنتشر تاون. نعرض مراتب يانسن، إنجلندر، تاكي، فوربد، وندر لاند، وننفّذ مقاسات خاصة حسب الطلب.
            </p>
            <ul className="mt-6 list-disc space-y-3 pr-6 leading-8 text-navy/80">
              <li>العنوان: 123 حسن المأمون أمام النادي الأهلي، مول فرنتشر تاون.</li>
              <li>المواعيد: يوميا من 12 ظهرا حتى 10 مساء.</li>
              <li>
                واتساب:{" "}
                <a href={buildWhatsappLink("السلام عليكم، حابب أستفسر")} target="_blank" rel="noreferrer" className={linkClass}>01551600820</a>
              </li>
              <li>
                هاتف:{" "}
                <a href="tel:01002405715" className={linkClass}>
                  01002405715
                </a>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
