"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Search, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { siteConfig } from "@/lib/config";
import AnnouncementBar from "@/components/AnnouncementBar";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/shop?category=mattresses", label: "مراتب" },
  { href: "/shop?category=toppers", label: "طبقات تطرية" },
  { href: "/shop?category=pillows", label: "مخدات" },
  { href: "/shop?category=protectors", label: "واقي مرتبة" },
  { href: "/advisor", label: "مساعد الاختيار" },
  { href: "/size-guide", label: "دليل المقاسات" },
  { href: "/shop?compare=1", label: "مقارنة الموديلات" },
  { href: "/showroom", label: "المعرض" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "تواصل معنا" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { itemsCount } = useCart();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-navy/10 bg-white/95 backdrop-blur">
      <AnnouncementBar />

      <div className="container-app flex h-20 items-center justify-between gap-2 sm:gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <img src="/brand-mark.svg" alt="شعار أبو عرب" width="44" height="56" className="h-14 w-11 shrink-0 rounded-lg object-contain" />
          <div className="leading-tight">
            <p className="text-base font-extrabold text-navy min-[400px]:text-lg sm:text-xl">{siteConfig.brandNameAr}</p>
            <p className="hidden text-[11px] font-semibold tracking-wide text-gold-dark sm:block">{siteConfig.slogan}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="whitespace-nowrap rounded-lg px-2 py-2 text-sm font-bold text-navy/80 transition hover:bg-navy/5 hover:text-navy"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            aria-label="بحث"
            onClick={() => setSearchOpen((v) => !v)}
            className="hidden h-11 w-11 items-center justify-center rounded-full border border-navy/10 text-navy transition hover:bg-navy/5 sm:flex"
          >
            <Search size={20} />
          </button>
          <Link
            href="/cart"
            aria-label="السلة"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-navy/10 text-navy transition hover:bg-navy/5"
          >
            <ShoppingCart size={20} />
            {itemsCount > 0 && (
              <span className="absolute -top-1.5 -left-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gold-gradient px-1 text-[11px] font-extrabold text-navy shadow-gold">
                {itemsCount}
              </span>
            )}
          </Link>
          <button
            aria-label="القائمة"
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-navy/10 text-navy transition hover:bg-navy/5 xl:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {(true) && (
        <div className={`${searchOpen ? "" : "sm:hidden"} border-t border-navy/10 bg-white`}>
          <div className="container-app py-3">
            <form action="/shop" method="get" onSubmit={() => { setSearchOpen(false); setOpen(false); }} role="search" className="flex items-center gap-2">
              <input
                name="q"
                aria-label="البحث عن منتج"
                type="search"
                placeholder="دور على مرتبة، مخدة، واقي مرتبة..."
                className="w-full rounded-xl border border-navy/15 px-4 py-2.5 text-sm outline-none focus:border-gold"
              />
              <button type="submit" aria-label="ابحث" className="btn-gold !px-4 !py-2.5 min-h-[44px]">
                <Search size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      {open && (
        <div className="border-t border-navy/10 bg-white xl:hidden">
          <nav className="container-app flex flex-col py-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-3 text-sm font-bold ${
                  pathname === link.href ? "bg-navy/5 text-navy" : "text-navy/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
