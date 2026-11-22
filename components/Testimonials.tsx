import { Star, Quote } from "lucide-react";
import { testimonials } from "@/lib/products";

export default function Testimonials() {
  if (testimonials.length === 0) return null;
  return (
    <section className="container-app py-16">
      <div className="mb-8 text-center">
        <h2 className="section-title">آراء عملائنا</h2>
        <p className="mt-2 text-navy/60">تجارب حقيقية من عملاء وثقوا في أبو عرب</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {testimonials.map((t) => (
          <div key={t.name} className="card flex flex-col gap-3 p-5">
            <Quote size={22} className="text-gold" />
            <p className="text-sm leading-7 text-navy/80">{t.comment}</p>
            <div className="mt-auto flex items-center justify-between pt-2">
              <div>
                <p className="text-sm font-extrabold text-navy">{t.name}</p>
                <p className="text-xs text-navy/50">{t.location}</p>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} className="fill-gold text-gold" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
