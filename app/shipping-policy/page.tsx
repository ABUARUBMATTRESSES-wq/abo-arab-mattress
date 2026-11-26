import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { buildWhatsappLink } from "@/lib/config";

export const metadata: Metadata = {
  title: "الشحن والتوصيل",
  description: "الشحن والتوصيل في أبو عرب للمراتب والمفروشات: الرسوم، الشحن المجاني، والاستلام من المعرض.",
  alternates: { canonical: "/shipping-policy" },
};

const linkClass = "font-bold text-[#85691a] underline underline-offset-4";

export default function ShippingPolicyPage() {
  return (
    <>
      <Header />
      <main className="container-app py-14">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <h1 className="section-title">الشحن والتوصيل</h1>
          </div>
          <div className="card p-6 sm:p-8">
            <ul className="list-disc space-y-3 pr-6 leading-8 text-navy/80">
              <li>القاهرة والجيزة: رسوم الشحن 500 جنيه للطلب. الشحن مجاني إذا بلغت قيمة المنتجات 20,000 جنيه أو أكثر.</li>
              <li>باقي المحافظات: 300 جنيه عن كل مرتبة. الطلب الذي لا يحتوي مراتب (مخدات أو إكسسوارات فقط): 300 جنيه للطلب.</li>
              <li>موعد التسليم نتفق عليه معك بعد تأكيد الطلب.</li>
              <li>يمكنك الاستلام من المعرض مباشرة: 123 حسن المأمون أمام النادي الأهلي، مول فرنتشر تاون.</li>
              <li>مواعيد المعرض: يوميا من 12 ظهرا حتى 10 مساء.</li>
              <li>
                للتواصل على واتساب:{" "}
                <a href={buildWhatsappLink("السلام عليكم، حابب أستفسر")} target="_blank" rel="noreferrer" className={linkClass}>01551600820</a>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
