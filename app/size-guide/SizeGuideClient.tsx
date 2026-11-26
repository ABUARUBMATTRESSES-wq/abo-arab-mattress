"use client";

import Link from "next/link";
import { useState } from "react";
import { buildWhatsappLink } from "@/lib/config";

const field = "w-full rounded-xl border border-navy/20 bg-white px-3 py-3 text-sm font-bold text-navy";

function num(v: string) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export default function SizeGuideClient() {
  const [roomW, setRoomW] = useState("350");
  const [roomL, setRoomL] = useState("400");
  const [bedW, setBedW] = useState("160");
  const [bedL, setBedL] = useState("200");
  const [rotated, setRotated] = useState(false);
  const [atWall, setAtWall] = useState(true);

  const rw = num(roomW), rl = num(roomL), bw = num(bedW), bl = num(bedL);
  const mw = rotated ? bl : bw; // mattress footprint inside the room
  const ml = rotated ? bw : bl;
  const valid = rw && rl && bw && bl;
  const fits = valid && mw <= rw && ml <= rl;
  const sideEach = fits ? (rw - mw) / 2 : 0;
  const front = fits ? rl - ml : 0;
  const pct = fits ? Math.round(((mw * ml) / (rw * rl)) * 100) : 0;

  // Drawing scale: fit the room into a 300 x 300 box.
  const scale = valid ? Math.min(300 / rw, 300 / rl) : 1;
  const drawW = rw * scale, drawL = rl * scale;
  const bedX = ((rw - mw) / 2) * scale;
  const bedY = atWall ? 0 : ((rl - ml) / 2) * scale;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="section-title">دليل المقاسات</h1>
        <p className="mt-3 text-navy/70">قيس سريرك صح قبل ما تختار، وشوف المرتبة هتاخد قد إيه من الأوضة.</p>
      </div>

      <section className="card p-6">
        <h2 className="text-lg font-extrabold text-navy">إزاي تقيس؟</h2>
        <ol className="mt-4 list-decimal space-y-3 pr-6 leading-8 text-navy/80">
          <li><b>العرض:</b> قيس من الداخل بين جانبي قاعدة السرير. لو الشكل مش منتظم، قيس في أكتر من مكان.</li>
          <li><b>الطول:</b> قيس من الداخل من ناحية الراس لناحية القدمين.</li>
          <li><b>الارتفاع:</b> راجع ارتفاع المرتبة مع قاعدة وإطار السرير.</li>
        </ol>
        <p className="mt-4 text-sm text-navy/60">العرض × الطول بالسنتيمتر، وارتفاع كل موديل بيظهر في صفحته.</p>
      </section>

      <section className="card mt-8 p-6">
        <h2 className="text-lg font-extrabold text-navy">حاسبة المرتبة داخل الأوضة</h2>
        <p className="mt-1 text-sm text-navy/60">المقاسات الظاهرة مثال. اكتب مقاسات أوضتك والمرتبة الفعلية (بالسنتيمتر).</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="grid grid-cols-2 gap-3">
            <div><label htmlFor="rw" className="mb-1 block text-xs font-bold text-navy">عرض الأوضة</label><input id="rw" inputMode="numeric" className={field} value={roomW} onChange={(e) => setRoomW(e.target.value.replace(/\D/g, ""))} /></div>
            <div><label htmlFor="rl" className="mb-1 block text-xs font-bold text-navy">طول الأوضة</label><input id="rl" inputMode="numeric" className={field} value={roomL} onChange={(e) => setRoomL(e.target.value.replace(/\D/g, ""))} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label htmlFor="bw" className="mb-1 block text-xs font-bold text-navy">عرض المرتبة</label><input id="bw" inputMode="numeric" className={field} value={bedW} onChange={(e) => setBedW(e.target.value.replace(/\D/g, ""))} /></div>
            <div><label htmlFor="bl" className="mb-1 block text-xs font-bold text-navy">طول المرتبة</label><input id="bl" inputMode="numeric" className={field} value={bedL} onChange={(e) => setBedL(e.target.value.replace(/\D/g, ""))} /></div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={() => setRotated((v) => !v)} className="rounded-xl border border-navy/20 px-4 py-2 text-sm font-bold text-navy hover:border-gold">لف المرتبة ٩٠°</button>
          <button type="button" onClick={() => setAtWall((v) => !v)} className="rounded-xl border border-navy/20 px-4 py-2 text-sm font-bold text-navy hover:border-gold">
            {atWall ? "المرتبة عند الحيطة (اضغط لنقلها للنص)" : "المرتبة في النص (اضغط لنقلها للحيطة)"}
          </button>
        </div>

        <div className="mt-6 grid items-center gap-6 md:grid-cols-[320px_1fr]">
          <div className="mx-auto">
            {valid ? (
              <svg width={drawW + 4} height={drawL + 4} viewBox={`-2 -2 ${drawW + 4} ${drawL + 4}`} role="img" aria-label="رسم من أعلى للمرتبة داخل الأوضة بنفس النسبة">
                <rect x={0} y={0} width={drawW} height={drawL} fill="#f8f5ee" stroke="#0b1f3a" strokeWidth={2} />
                {fits && <rect x={bedX} y={bedY} width={mw * scale} height={ml * scale} fill="#c9a24a" fillOpacity={0.55} stroke="#0b1f3a" strokeWidth={1.5} />}
              </svg>
            ) : (
              <p className="text-sm text-navy/60">اكتب كل المقاسات لعرض الرسم.</p>
            )}
            <p className="mt-2 text-center text-xs text-navy/50">مخطط من أعلى بنفس النسبة</p>
          </div>
          <div aria-live="polite" className="space-y-2 text-navy">
            {valid && !fits && <p className="font-bold text-red-700">المرتبة ({mw} × {ml}) أكبر من الأوضة ({rw} × {rl}). راجع المقاسات.</p>}
            {fits && (
              <>
                <p>المرتبة: <b>{bw} × {bl} سم</b></p>
                <p>المتبقي في كل جنب (لو في النص): <b>{Math.round(sideEach)} سم</b></p>
                <p>المتبقي قدام المرتبة: <b>{front} سم</b></p>
                <p>نسبة المرتبة من مساحة الأوضة: <b>{pct}%</b></p>
                <p className="text-xs text-navy/60">الحساب للمرتبة فقط. هيكل السرير والأثاث والباب ومساحة الحركة محتاجين مراجعة منفصلة.</p>
              </>
            )}
          </div>
        </div>

        {fits && (
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`/advisor?w=${bw}&l=${bl}`} className="btn-gold">شوف الموديلات بالمقاس ده</Link>
            <a href={buildWhatsappLink(`السلام عليكم، عايز مرتبة بمقاس ${bw} × ${bl} سم وحابب أعرف المتاح.`)} target="_blank" rel="noreferrer" className="rounded-xl border border-navy/20 px-5 py-3 text-sm font-bold text-navy hover:border-gold">اسأل على واتساب</a>
          </div>
        )}
      </section>

      <section className="card mt-8 p-6">
        <h2 className="text-lg font-extrabold text-navy">مقاسك مش موجود؟</h2>
        <p className="mt-2 leading-8 text-navy/80">بننفّذ مقاسات خاصة حسب الطلب. ابعتلنا العرض والطول وصورة توضح القاعدة على واتساب.</p>
        <a href={buildWhatsappLink("السلام عليكم، عايز مقاس خاص للمرتبة.")} target="_blank" rel="noreferrer" className="btn-gold mt-4 inline-block">ابعت المقاس على واتساب</a>
      </section>
    </div>
  );
}
