import Link from "next/link";
import { siteConfig } from "@/lib/config";

// الشريط المتحرك فوق الصفحة. النصوص الثلاثة الأولى هي نفس نصوص الشريط الثابت المنشورة أصلًا (بدون أي تغيير).
// نصوص العروض الجديدة: تتضاف في المصفوفة offers بعد موافقة صاحب الموقع على نصها، وفاضية لحد دلوقتي.
const offers: { href: string; text: string }[] = [];

export default function AnnouncementBar() {
  const items = [
    {
      href: "/shipping-policy",
      text: `الشحن مجاني للقاهرة والجيزة من ${siteConfig.freeShippingThreshold.toLocaleString("ar-EG")} ${siteConfig.currency}`,
    },
    { href: "/warranty-policy", text: "ضمان 10 سنوات على المراتب" },
    { href: "/shipping-policy", text: "استلام من المعرض مباشرة" },
    ...offers,
  ];
  const row = (copy: number) => (
    <ul className="flex shrink-0 items-center" aria-hidden={copy === 1 ? true : undefined}>
      {items.map((it, i) => (
        <li key={`${copy}-${i}`} className="px-6">
          <Link href={it.href} tabIndex={copy === 1 ? -1 : undefined} className="whitespace-nowrap hover:underline">
            {it.text}
          </Link>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="announce bg-navy py-2 text-sm font-bold text-gold sm:text-base" role="region" aria-label="إعلانات المعرض">
      <div dir="ltr" className="overflow-hidden">
        <div dir="rtl" className="announce-track flex w-max">
          {row(0)}
          {row(1)}
        </div>
      </div>
    </div>
  );
}
