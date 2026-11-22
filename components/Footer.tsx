import Link from "next/link";
import { Phone, MapPin, MessageCircle } from "lucide-react";
import SocialLinks from "@/components/SocialLinks";
import { siteConfig, buildWhatsappLink } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="mt-20 bg-navy text-white">
      <div className="container-app grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <img src="/brand-mark.svg" alt="شعار أبو عرب" width="44" height="56" className="h-14 w-11 shrink-0 rounded-lg object-contain" />
            <p className="text-lg font-extrabold">{siteConfig.brandNameAr}</p>
          </div>
          <p className="text-sm leading-7 text-white/70">
            تصفح المراتب والمخدات والخداديات وواقي المرتبة وطبقات التطرية من أبو عرب.
          </p>
          <div className="mt-4"><SocialLinks dark /></div>
        </div>

        <div>
          <p className="mb-4 font-extrabold text-gold">تسوق</p>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/shop?category=mattresses" className="hover:text-white">مراتب</Link></li>
            <li><Link href="/shop?category=pillows" className="hover:text-white">مخدات</Link></li>
            <li><Link href="/shop?category=protectors" className="hover:text-white">واقي مرتبة</Link></li>
            <li><Link href="/shop?category=toppers" className="hover:text-white">طبقات تطرية</Link></li>
            <li><Link href="/shop?compare=1" className="hover:text-white">مقارنة الموديلات</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-4 font-extrabold text-gold">خدمة العملاء</p>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/contact" className="hover:text-white">تواصل معنا</Link></li>
            <li><Link href="/cart" className="hover:text-white">سلة المشتريات</Link></li>
            <li><Link href="/contact" className="hover:text-white">استفسارات الضمان والاستبدال</Link></li>
            <li>الأسئلة الشائعة</li>
          </ul>
        </div>

        <div>
          <p className="mb-4 font-extrabold text-gold">تواصل معنا</p>
          <ul className="space-y-3 text-sm text-white/70">
            <li><a href={`tel:${siteConfig.phoneDisplay}`} className="flex items-center gap-2"><Phone size={16} className="shrink-0 text-gold" /><span dir="ltr">{siteConfig.phoneDisplay}</span></a></li>
            <li><a href={buildWhatsappLink("السلام عليكم، حابب أستفسر عن منتجاتكم")} target="_blank" rel="noreferrer" className="flex items-center gap-2"><MessageCircle size={16} className="shrink-0 text-gold" /> تواصل معنا عبر واتساب</a></li>
            <li><a href={siteConfig.mapsUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white"><MapPin size={16} className="shrink-0 text-gold" /><span>{siteConfig.address}<span className="mt-1 block text-xs text-gold underline underline-offset-4">الوصول للمعرض</span></span></a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {siteConfig.brandNameAr}، جميع الحقوق محفوظة
      </div>
    </footer>
  );
}
