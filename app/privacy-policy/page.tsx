import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "سياسة الخصوصية" };

export default function PrivacyPolicyPage() {
  return <>
    <Header />
    <main className="container-app py-14">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center"><h1 className="section-title">سياسة الخصوصية</h1></div>
        <div className="card space-y-5 p-6 leading-8 text-navy/80 sm:p-8">
          <p>عند تسجيل طلب عبر الموقع، نجمع الاسم ورقم الهاتف والمحافظة والعنوان وأي ملاحظات تضيفها، إضافةً إلى تفاصيل الطلب. نستخدم هذه البيانات لتسجيل الطلب والتواصل معك بشأنه.</p>
          <p>تُحفظ بيانات الطلب في نظام الموقع، وتصلنا عبر رسالة واتساب عند ضغطك على إرسال. كما تُحفظ نسخة منها في متصفحك على جهازك.</p>
          <p>يستخدم الموقع خدمة Cloudflare Turnstile للتحقق الأمني قبل تسجيل الطلب.</p>
          <p>يستخدم الموقع أداة Meta Pixel لقياس الزيارات والإجراءات على الموقع، مثل عرض المنتجات وإضافتها إلى السلة وتسجيل الطلب. قد ترسل هذه الأداة إلى Meta معلومات عن الزيارة والجهاز والمتصفح وفق إعدادات Meta.</p>
        </div>
      </div>
    </main>
    <Footer />
  </>;
}
