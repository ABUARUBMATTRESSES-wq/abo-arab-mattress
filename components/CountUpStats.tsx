"use client";

import { useEffect, useRef, useState } from "react";

export type CountUpStat = {
  value: number;
  label: string;
  suffix?: string;
};

function CountUpItem({ stat }: { stat: CountUpStat }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      setShown(stat.value);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const duration = 1600;
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setShown(Math.round(stat.value * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [stat.value]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-3xl font-extrabold text-gold-dark sm:text-4xl" aria-label={`${stat.value}${stat.suffix ?? ""} ${stat.label}`}>
        <span aria-hidden="true">
          {shown.toLocaleString("ar-EG")}
          {stat.suffix ?? ""}
        </span>
      </p>
      <p className="mt-1 text-sm font-bold text-navy/70">{stat.label}</p>
    </div>
  );
}

// Counts each number up from 0 when it scrolls into view.
// Numbers and wording come only from the owner. With an empty list nothing is shown.
export default function CountUpStats({ stats }: { stats: CountUpStat[] }) {
  if (stats.length === 0) return null;
  return (
    <section className="bg-white py-10">
      <div className="container-app grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {stats.map((s) => (
          <CountUpItem key={s.label} stat={s} />
        ))}
      </div>
    </section>
  );
}
