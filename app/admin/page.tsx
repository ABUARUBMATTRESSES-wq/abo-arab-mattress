"use client";

import { useCallback, useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// لوحة إدارة الطلبات — النسخة الفعلية (خاصة بصاحب العمل فقط)
// الدخول بكلمة سر محفوظة كمشتق آمن في إعدادات الاستضافة.
// تغيير الحالة بيتحفظ وبيظهر للعميل في صفحة التتبع بكود التتبع بتاعه.

const STATUSES = [
  { key: "received", label: "تم الاستلام" },
  { key: "preparing", label: "جاري التجهيز" },
  { key: "shipped", label: "خرج للشحن" },
  { key: "delivered", label: "تم التسليم" },
] as const;

type OrderRow = {
  id: string;
  created_at: string;
  customer_name: string;
  phone: string;
  governorate: string;
  items_json: string;
  total_egp: number;
  status: string;
  tracking_token: string;
};

function normalizeStatus(s: string): string {
  return s === "new" || !s ? "received" : s; // legacy default before the 4-status flow
}

function summarize(itemsJson: string): string {
  try {
    const parsed = JSON.parse(itemsJson || "{}");
    const lines = Array.isArray(parsed.lines) ? parsed.lines : [];
    return lines.map((l: { name?: string; size?: string; quantity?: number }) => `${l.name} — ${l.size} ×${l.quantity}`).join("، ");
  } catch {
    return "";
  }
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("ar-EG", { day: "numeric", month: "long", hour: "numeric", minute: "2-digit" });
}

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [pass, setPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [busy, setBusy] = useState(false);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [listError, setListError] = useState("");
  const [rowErrors, setRowErrors] = useState<Record<string, string>>({});

  const loadOrders = useCallback(async () => {
    setListError("");
    try {
      const res = await fetch("/api/admin/orders");
      if (res.status === 401) { setUnlocked(false); return; }
      const data = await res.json().catch(() => null);
      if (!res.ok || !data || !data.ok) { setListError("تعذّر تحميل الطلبات. حاول تاني."); return; }
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch {
      setListError("مشكلة اتصال أثناء تحميل الطلبات.");
    }
  }, []);

  const tryLogin = async () => {
    if (!pass.trim() || busy) return;
    setBusy(true);
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: pass }),
      });
      if (res.ok) {
        setPass("");
        setUnlocked(true);
        await loadOrders();
        return;
      }
      if (res.status === 429) { setLoginError("محاولات كتيرة. استنى عشر دقايق وحاول تاني."); return; }
      setLoginError("كلمة السر غلط.");
    } catch {
      setLoginError("مشكلة اتصال. حاول تاني.");
    } finally {
      setBusy(false);
    }
  };

  const changeStatus = async (id: string, status: string) => {
    const previous = orders.find((o) => o.id === id)?.status;
    setOrders((rows) => rows.map((o) => (o.id === id ? { ...o, status } : o)));
    setRowErrors((m) => ({ ...m, [id]: "" }));
    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "content-type": "application/json", "x-admin-request": "1" },
        body: JSON.stringify({ id, status }),
      });
      if (res.status === 401) { setUnlocked(false); return; }
      const data = await res.json().catch(() => null);
      if (!res.ok || !data || !data.ok) {
        setOrders((rows) => rows.map((o) => (o.id === id ? { ...o, status: previous || o.status } : o)));
        setRowErrors((m) => ({ ...m, [id]: "الحالة مااتحفظتش. حاول تاني." }));
      }
    } catch {
      setOrders((rows) => rows.map((o) => (o.id === id ? { ...o, status: previous || o.status } : o)));
      setRowErrors((m) => ({ ...m, [id]: "مشكلة اتصال. الحالة مااتحفظتش." }));
    }
  };

  useEffect(() => {
    // عند فتح الصفحة من الأول، رجّع الجلسة الشغالة بدل ما نطلب كلمة السر تاني.
    (async () => {
      try {
        const res = await fetch("/api/admin/orders");
        if (res.ok) { setUnlocked(true); await loadOrders(); }
      } catch { /* يفضل على فورم الدخول */ }
    })();
  }, [loadOrders]);

  return (
    <>
      <Header />
      <main className="container-app py-14">
        <div className="mx-auto max-w-4xl">
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
                  onKeyDown={(e) => e.key === "Enter" && tryLogin()}
                  placeholder="كلمة السر"
                  className="w-full rounded-xl border border-navy/15 px-4 py-3 text-navy outline-none focus:border-navy/40"
                />
                {loginError && <p className="text-sm font-bold text-red-600">{loginError}</p>}
                <button
                  onClick={tryLogin}
                  disabled={busy}
                  className="rounded-xl bg-navy px-8 py-3 font-extrabold text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  {busy ? "جاري الدخول..." : "دخول"}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8 flex items-center justify-between">
                <h1 className="section-title">الطلبات الواردة</h1>
                <div className="flex items-center gap-3">
                  <button
                    onClick={loadOrders}
                    className="rounded-full border border-navy/15 px-4 py-1.5 text-sm font-extrabold text-navy transition hover:bg-navy/5"
                  >
                    تحديث
                  </button>
                  <span className="rounded-full bg-navy/5 px-4 py-1.5 text-sm font-extrabold text-navy">{orders.length} طلبات</span>
                </div>
              </div>
              {listError && <p className="mb-4 rounded-xl bg-red-50 p-4 text-center font-bold text-red-700">{listError}</p>}
              {orders.length === 0 && !listError && (
                <p className="rounded-xl bg-navy/5 p-6 text-center font-bold text-navy/60">مفيش طلبات لسه.</p>
              )}
              <div className="space-y-4">
                {orders.map((o) => (
                  <div key={o.id} className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-extrabold text-navy">{o.customer_name} — <span dir="ltr" className="text-navy/60">{o.phone}</span></p>
                      <p className="mt-1 text-sm text-navy/70">{summarize(o.items_json)} · {o.governorate} · {Number(o.total_egp).toLocaleString("ar-EG")} ج.م</p>
                      <p className="mt-1 text-xs text-navy/50">{formatDate(o.created_at)} · <span dir="ltr">{o.id}</span></p>
                      {o.tracking_token && (
                        <p className="mt-1 text-xs font-bold text-[#85691a] break-all" dir="ltr">كود التتبع: {o.tracking_token}</p>
                      )}
                      {rowErrors[o.id] && <p className="mt-1 text-xs font-bold text-red-600">{rowErrors[o.id]}</p>}
                    </div>
                    <select
                      value={normalizeStatus(o.status)}
                      onChange={(e) => changeStatus(o.id, e.target.value)}
                      className="rounded-xl border border-navy/15 bg-white px-4 py-2.5 font-bold text-navy outline-none focus:border-navy/40"
                    >
                      {STATUSES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-center text-sm text-navy/50">تغيير الحالة بيتحفظ فورًا وبيظهر للعميل في صفحة التتبع بكود التتبع بتاعه.</p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
