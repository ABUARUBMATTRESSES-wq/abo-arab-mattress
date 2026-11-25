"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { siteConfig } from "@/lib/config";
import { trackEvent } from "@/lib/pixel";

export default function MetaPixelScript() {
  const pathname = usePathname();
  // صفحة التتبع بتحمل كود تتبع سري في الرابط — البكسل ميتحملش عليها خالص.
  const isTrack = pathname === "/track";

  useEffect(() => {
    if (isTrack) return;
    trackEvent("PageView");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isTrack]);

  if (isTrack || !siteConfig.metaPixelId || siteConfig.metaPixelId.includes("000000000000000")) {
    return null; // لسه متركبش الـ Pixel ID الحقيقي في lib/config.ts
  }

  return (
    <Script id="meta-pixel" strategy="beforeInteractive">
      {`
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${siteConfig.metaPixelId}');
      `}
    </Script>
  );
}
