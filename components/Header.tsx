"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Search, ShoppingCart, Crown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { siteConfig } from "@/lib/config";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/shop?category=mattresses", label: "مراتب" },
  { href: "/shop?category=pillows", label: "مخدات" },
  { href: "/shop?category=protectors", label: "واقي مرتبة" },
  { href: "/shop?category=bedding", label: "مفروشات" },
  { href: "/shop?compare=1", label: "مقارنة الموديلات" },
  { href: "/contact", label: "تواصل معنا" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { itemsCount } = useCart();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-navy/10 bg-white/95 backdrop-blur">
      <div className="bg-navy py-2 text-center text-xs font-bold text-gold sm:text-sm">
        🎉 خصومات تصل إلى 25% + شحن مجاني فوق {siteConfig.freeShippingThreshold.toLocaleString("ar-EG")} {siteConfig.currency}
      </div>

      <div className="container-app flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-royal-gradient text-gold shadow-luxury">
            <Crown size={24} />
          </span>
          <div className="leading-tight">
            <p className="text-lg font-extrabold text-navy sm:text-xl">{siteConfig.brandNameAr}</p>
            <p className="hidden text-[11px] font-semibold tracking-wide text-gold-dark sm:block">{siteConfig.slogan}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-bold text-navy/80 transition hover:bg-navy/5 hover:text-navy"
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
            className="flex h-11 w-11 items-center justify-center rounded-full border border-navy/10 text-navy transition hover:bg-navy/5 lg:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-navy/10 bg-white">
          <div className="container-app py-3">
            <form action="/shop" method="get" className="flex items-center gap-2">
              <input
                name="q"
                type="text"
                placeholder="دور على مرتبة، مخدة، واقي مرتبة..."
                className="w-full rounded-xl border border-navy/15 px-4 py-2.5 text-sm outline-none focus:border-gold"
              />
              <button type="submit" className="btn-gold !px-4 !py-2.5">
                <Search size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      {open && (
        <div className="border-t border-navy/10 bg-white lg:hidden">
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
