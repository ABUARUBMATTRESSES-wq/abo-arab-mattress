import Link from "next/link";
import { Crown, Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";
import { siteConfig } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="mt-20 bg-navy text-white">
      <div className="container-app grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-gradient text-navy">
              <Crown size={20} />
            </span>
            <p className="text-lg font-extrabold">{siteConfig.brandNameAr}</p>
          </div>
          <p className="text-sm leading-7 text-white/70">
            وجهتك الأولى لمراتب ومفروشات بجودة ملكية وضمان حقيقي، نهتم بنوم صحي يليق بيك وبعيلتك.
          </p>
          <div className="mt-4 flex gap-3">
            <a href={siteConfig.social.facebook} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-gold hover:text-navy">
              <Facebook size={16} />
            </a>
            <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-gold hover:text-navy">
              <Instagram size={16} />
            </a>
          </div>
        </div>

        <div>
          <p className="mb-4 font-extrabold text-gold">تسوق</p>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/shop?category=mattresses" className="hover:text-white">مراتب</Link></li>
            <li><Link href="/shop?category=pillows" className="hover:text-white">مخدات</Link></li>
            <li><Link href="/shop?category=protectors" className="hover:text-white">واقي مرتبة</Link></li>
            <li><Link href="/shop?category=bedding" className="hover:text-white">مفروشات</Link></li>
            <li><Link href="/shop?compare=1" className="hover:text-white">مقارنة الموديلات</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-4 font-extrabold text-gold">خدمة العملاء</p>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/contact" className="hover:text-white">تواصل معنا</Link></li>
            <li><Link href="/cart" className="hover:text-white">سلة المشتريات</Link></li>
            <li>سياسة الاستبدال والضمان</li>
            <li>الأسئلة الشائعة</li>
          </ul>
        </div>

        <div>
          <p className="mb-4 font-extrabold text-gold">تواصل معنا</p>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-center gap-2"><Phone size={16} className="text-gold" /> {siteConfig.phoneDisplay}</li>
            <li className="flex items-center gap-2"><Mail size={16} className="text-gold" /> {siteConfig.email}</li>
            <li className="flex items-center gap-2"><MapPin size={16} className="text-gold" /> {siteConfig.address}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {siteConfig.brandNameAr} — جميع الحقوق محفوظة
      </div>
    </footer>
  );
}
