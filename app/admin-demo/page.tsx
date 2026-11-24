"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// ============================================================
// لوحة إدارة الطلبات — نسخة معاينة تجريبية ببيانات توضيحية فقط
// النسخة النهائية: دخول آمن لصاحب العمل فقط + طلبات حقيقية محفوظة،
// وتحديث الحالة بيوصل للعميل بكود التتبع بتاعه
// ============================================================

const STATUSES = ["تم الاستلام", "جاري التجهيز", "خرج للشحن", "تم التسليم"] as const;

type DemoRow = { code: string; customer: string; phone: string; product: string; total: number; city: string };

const INITIAL: DemoRow[] = [
  { code: "DEMO-1001", customer: "أحمد م.", phone: "0100 000 0001", product: "إيليت ميموري فوم 160×200", total: 15690, city: "القاهرة" },
  { code: "DEMO-1002", customer: "سارة ع.", phone: "0100 000 0002", product: "يانسن ألمانى 90×190", total: 4610, city: "الجيزة" },
  { code: "DEMO-1003", customer: "محمود س.", phone: "0100 000 0003", product: "برنسيس وندر لاند 140×190", total: 6290, city: "القليوبية" },
];

export default function AdminDemoPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);
  const [statusMap, setStatusMap] = useState<Record<string, string>>({
    "DEMO-1001": STATUSES[1],
    "DEMO-1002": STATUSES[3],
    "DEMO-1003": STATUSES[0],
  });

  const tryUnlock = () => {
    if (pass.trim() === "1234") { setUnlocked(true); setError(false); } else { setError(true); }
  };

  return (
    <>
      <Header />
      <main className="container-app py-14">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 rounded-2xl border border-[#85691a]/30 bg-[#85691a]/5 p-4 text-center text-sm font-bold text-[#85691a]">
            لوحة تجريبية للمعاينة فقط — البيانات توضيحية وليست طلبات حقيقية. كلمة السر التجريبية: 1234
          </div>

          {!unlocked ? (
            <div className="mx-auto max-w-md">
              <div className="mb-8 text-center">
                <h1 className="section-title">لوحة الطلبات</h1>
                <p className="mt-2 text-navy/60">الصفحة دي مخصصة لإدارة المتجر فقط.</p>
              </div>
              <div className="card flex flex-col gap-3 p-6">
                <input
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && tryUnlock()}
                  placeholder="كلمة السر"
                  className="w-full rounded-xl border border-navy/15 px-4 py-3 text-navy outline-none focus:border-navy/40"
                />
                {error && <p className="text-sm font-bold text-red-600">كلمة السر غلط.</p>}
                <button onClick={tryUnlock} className="rounded-xl bg-navy px-8 py-3 font-extrabold text-white transition hover:opacity-90">
                  دخول
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8 flex items-center justify-between">
                <h1 className="section-title">الطلبات الواردة</h1>
                <span className="rounded-full bg-navy/5 px-4 py-1.5 text-sm font-extrabold text-navy">{INITIAL.length} طلبات</span>
              </div>
              <div className="space-y-4">
                {INITIAL.map((o) => (
                  <div key={o.code} className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-extrabold text-navy">{o.customer} — <span dir="ltr" className="text-navy/60">{o.phone}</span></p>
                      <p className="mt-1 text-sm text-navy/70">{o.product} · {o.city} · {o.total.toLocaleString("ar-EG")} ج.م</p>
                      <p className="mt-1 text-xs font-bold text-[#85691a]" dir="ltr">كود التتبع: {o.code}</p>
                    </div>
                    <select
                      value={statusMap[o.code]}
                      onChange={(e) => setStatusMap((m) => ({ ...m, [o.code]: e.target.value }))}
                      className="rounded-xl border border-navy/15 bg-white px-4 py-2.5 font-bold text-navy outline-none focus:border-navy/40"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-center text-sm text-navy/50">في النسخة النهائية: تغيير الحالة بيتحفظ وبيظهر للعميل في صفحة التتبع.</p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
