"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/lib/products";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-paper py-16">
      <div className="container-app max-w-3xl">
        <div className="mb-8 text-center">
          <h2 className="section-title">الأسئلة الشائعة</h2>
          <p className="mt-2 text-navy/60">إجابات على أكتر الأسئلة اللي بتوصلنا</p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className="card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-3 p-5 text-right"
                >
                  <span className="font-extrabold text-navy">{faq.question}</span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-gold-dark transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && <p className="border-t border-navy/10 p-5 pt-4 text-sm leading-7 text-navy/70">{faq.answer}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
