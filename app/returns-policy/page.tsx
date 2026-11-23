import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { buildWhatsappLink } from "@/lib/config";

export const metadata: Metadata = {
  title: "سياسة الاستبدال والاسترجاع",
  description: "سياسة الاستبدال والاسترجاع في أبو عرب للمراتب والمفروشات وفقًا لقانون حماية المستهلك.",
};

export default function ReturnsPolicyPage() {
  return (
    <>
      <Header />
      <main className="container-app py-14">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <h1 className="section-title">سياسة الاستبدال والاسترجاع</h1>
          </div>

          <div className="card p-6 sm:p-8">
            <h2 className="text-lg font-extrabold text-navy">١) خلال ١٤ يوم من استلام المنتج:</h2>
            <p className="mt-2 leading-8 text-navy/80">
              يحق للعميل استبداله أو استرجاعه، بشرط بقائه بنفس حالته وقت الشراء، وفقًا لقانون حماية المستهلك.
            </p>
            <p className="mt-4 leading-8 text-navy/80">تُطبق الاستثناءات المقررة بقانون حماية المستهلك، ومنها:</p>
            <ul className="mt-2 list-disc space-y-2 pr-6 leading-8 text-navy/80">
              <li>المنتجات المصنوعة بمقاسات خاصة حددها العميل، وليس مجرد اختيار مقاس جاهز من الكتالوج.</li>
              <li>المنتج الذي لم يعد بنفس حالته وقت البيع لسبب يرجع إلى العميل.</li>
              <li>المنتج الذي تحول طبيعته أو طريقة تغليفه دون استبداله أو إعادته إلى حالته الأصلية.</li>
            </ul>

            <h2 className="mt-8 text-lg font-extrabold text-navy">٢) في حالة وجود عيب بالمنتج:</h2>
            <p className="mt-2 leading-8 text-navy/80">
              يحق للعميل الاستبدال أو الاسترجاع خلال ٣٠ يوم من الاستلام، وفقًا لقانون حماية المستهلك.
            </p>

            <h2 className="mt-8 text-lg font-extrabold text-navy">٣) لطلب الاستبدال أو الاسترجاع:</h2>
            <p className="mt-2 leading-8 text-navy/80">
              تواصل معنا عبر{" "}
              <a
                href={buildWhatsappLink("السلام عليكم، حابب أطلب استبدال أو استرجاع، رقم الطلب: ")}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[#85691a] underline underline-offset-4"
              >
                واتساب
              </a>{" "}
              أو اتصل على{" "}
              <a href="tel:01551600820" className="font-bold text-[#85691a] underline underline-offset-4">
                ٠١٥٥١٦٠٠٨٢٠
              </a>
              ، مع ذكر رقم الطلب.
            </p>

            <p className="mt-8 border-t border-navy/10 pt-4 leading-8 text-navy/70">
              تُطبق السياسة بما لا يخل بحقوق المستهلك المقررة قانونًا.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
