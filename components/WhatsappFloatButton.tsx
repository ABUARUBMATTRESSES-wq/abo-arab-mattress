"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { buildWhatsappLink } from "@/lib/config";

export default function WhatsappFloatButton({ message }: { message?: string }) {
  const pathname = usePathname();
  const link = buildWhatsappLink(message ?? "السلام عليكم، حابب أستفسر عن المراتب والمفروشات عندكم 🙏");

  return (
    <>
      {/* Mobile: a fixed bar with its own reserved space (the page has bottom padding), so it never covers content. */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex h-14 items-center justify-center border-t border-navy/10 bg-white md:hidden">
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="flex h-10 items-center gap-2 rounded-full bg-[#188741] px-5 text-sm font-extrabold text-white shadow-luxury active:scale-95"
        >
          <MessageCircle size={18} aria-hidden="true" />
          تواصل عبر واتساب
        </a>
      </div>
      {/* Desktop: unchanged floating button. Contact already has prominent WhatsApp links. */}
      {pathname !== "/contact" && (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          aria-label="تواصل عبر واتساب"
          style={{ bottom: "calc(var(--compare-bar-height, 0px) + 1.25rem)" }}
          className="fixed bottom-5 left-5 z-50 hidden h-14 w-14 items-center justify-center rounded-full bg-[#188741] text-white shadow-luxury transition hover:scale-110 active:scale-95 md:flex"
        >
          <MessageCircle size={26} />
        </a>
      )}
    </>
  );
}
