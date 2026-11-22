"use client";

import { MessageCircle } from "lucide-react";
import { buildWhatsappLink } from "@/lib/config";

export default function WhatsappFloatButton({ message }: { message?: string }) {
  const link = buildWhatsappLink(message ?? "السلام عليكم، حابب أستفسر عن المراتب والمفروشات عندكم 🙏");

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      aria-label="تواصل عبر واتساب"
      className="fixed bottom-5 left-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-luxury transition hover:scale-110 active:scale-95"
    >
      <MessageCircle size={26} />
    </a>
  );
}
