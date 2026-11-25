import Link from "next/link";
import { ShoppingBag, MessageCircle, ShieldCheck, Star } from "lucide-react";
import { buildWhatsappLink } from "@/lib/config";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-royal-gradient">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #D4AF37 0%, transparent 35%), radial-gradient(circle at 80% 70%, #D4AF37 0%, transparent 30%)",
        }}
      />
      <div className="container-app relative grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:py-28">
        <div className="animate-fade-up text-center lg:text-right">
          <span className="badge-gold mb-5 inline-flex">
            <Star size={14} className="fill-navy" /> تصفح منتجات أبو عرب
          </span>
          <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
            نوم ملكي...
            <span className="block text-gold">يليق بيك</span>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base leading-8 text-white/80 lg:mx-0">
            مراتب ومفروشات أبو عرب. تصفح المراتب والمخدات والخداديات وواقي المرتبة وطبقات التطرية، واختار الموديل والمقاس المناسب ليك.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link href="/shop" className="btn-gold w-full sm:w-auto">
              <ShoppingBag size={20} /> تسوق الآن
            </Link>
            <a
              href={buildWhatsappLink("السلام عليكم، حابب أعرف تفاصيل أكتر عن المراتب 🙏")}
              target="_blank"
              rel="noreferrer"
              className="btn-whatsapp w-full sm:w-auto"
            >
              <MessageCircle size={20} /> اطلب عبر واتساب
            </a>
          </div>
          <p className="mx-auto mt-5 inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-2 text-sm font-extrabold text-gold lg:mx-0">
            بننفّذ مقاسات خاصة حسب الطلب
          </p>
          <div className="mt-5 flex items-center justify-center gap-2 text-sm font-bold text-white/80 lg:justify-start">
            <ShieldCheck size={18} className="text-gold" /> للاستفسار عن تفاصيل المنتج، تواصل معنا
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-md lg:max-w-lg">
          <div className="absolute inset-0 rounded-[2.5rem] bg-gold-gradient opacity-20 blur-3xl" />
          <div className="relative flex h-full items-center justify-center rounded-[2.5rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
            <img
              src="/img/1-hero-bedroom.webp"
              alt="غرفة نوم"
              width={900}
              height={600}
              fetchPriority="high"
              decoding="async"
              className="h-full w-full rounded-3xl object-cover shadow-luxury"
            />

          </div>
        </div>
      </div>
    </section>
  );
}
