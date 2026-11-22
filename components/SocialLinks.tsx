import { Facebook, Instagram, Music2 } from "lucide-react";
import { siteConfig } from "@/lib/config";

export default function SocialLinks({ dark = false }: { dark?: boolean }) {
  const links = [
    { href: siteConfig.social.facebook, label: "فيسبوك", Icon: Facebook },
    { href: siteConfig.social.instagram, label: "إنستجرام", Icon: Instagram },
    { href: siteConfig.social.tiktok, label: "تيك توك", Icon: Music2 },
  ];
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
      {links.map(({ href, label, Icon }) => (
        <a key={label} href={href} aria-label={label} target="_blank" rel="noreferrer"
          className={`flex min-h-10 items-center gap-2 rounded-full px-3 py-2 text-xs font-bold transition ${dark ? "bg-white/10 text-white hover:bg-gold hover:text-navy" : "bg-navy/5 text-navy hover:bg-navy hover:text-white"}`}>
          <Icon size={16} aria-hidden="true" />{label}
        </a>
      ))}
    </div>
  );
}
