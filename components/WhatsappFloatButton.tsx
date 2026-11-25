"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { buildWhatsappLink } from "@/lib/config";

const CONTROL_SELECTOR = "a,button,input,select,textarea,label,summary,[role='button']";

// A tap target the button could block. Large links (a whole product card) are not counted,
// because covering their corner does not stop the person from opening them.
function isBlockableControl(n: Element) {
  const c = n.closest(CONTROL_SELECTOR);
  if (!c) return false;
  const r = c.getBoundingClientRect();
  return c.tagName !== "A" || r.height <= 72;
}

export default function WhatsappFloatButton({ message }: { message?: string }) {
  const pathname = usePathname();
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [lift, setLift] = useState(0);
  const [hiddenByControl, setHiddenByControl] = useState(false);
  const [focused, setFocused] = useState(false);

  // Mobile only. When scrolling stops, check whether the button sits on a tap target or field.
  // If so, lift it into the nearest free gap above; if there is no gap (dense form rows), hide it
  // until the next scroll. No polling: it runs on scroll end, resize and route change.
  useEffect(() => {
    const el = linkRef.current;
    if (!el) return;
    let timer = 0;
    const blocked = (left: number, top: number, w: number, h: number) => {
      const xs = [left + 2, left + w / 2, left + w - 2];
      const ys = [top + 2, top + h / 2, top + h - 2];
      for (const x of xs) {
        for (const y of ys) {
          for (const n of document.elementsFromPoint(x, y)) {
            if (n === el || el.contains(n)) continue;
            if (isBlockableControl(n)) return true;
          }
        }
      }
      return false;
    };
    const check = () => {
      if (window.innerWidth >= 768) {
        setLift(0);
        setHiddenByControl(false);
        return;
      }
      // offsetTop/offsetLeft ignore transforms, so the lift in progress does not skew the check
      const left = el.offsetLeft;
      const base = el.offsetTop;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      for (let dy = 0; dy <= 132; dy += 6) {
        if (!blocked(left, base - dy, w, h)) {
          setLift(dy);
          setHiddenByControl(false);
          return;
        }
      }
      setHiddenByControl(true);
    };
    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(check, 140);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Contact already has prominent WhatsApp links. Avoid covering its address.
  if (pathname === "/contact") return null;

  const link = buildWhatsappLink(message ?? "السلام عليكم، حابب أستفسر عن المراتب والمفروشات عندكم 🙏");
  const hidden = hiddenByControl && !focused;

  return (
    <a
      ref={linkRef}
      href={link}
      target="_blank"
      rel="noreferrer"
      aria-label="تواصل عبر واتساب"
      style={{ ["--wa-lift" as string]: `${lift}px` }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={`fixed bottom-[calc(var(--compare-bar-height,0px)+0.75rem)] left-2 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-luxury -translate-y-[var(--wa-lift,0px)] transition-[opacity,transform] duration-200 hover:scale-110 active:scale-95 md:bottom-[calc(var(--compare-bar-height,0px)+1.25rem)] md:left-5 md:h-14 md:w-14 ${
        hidden ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <MessageCircle size={22} />
    </a>
  );
}
