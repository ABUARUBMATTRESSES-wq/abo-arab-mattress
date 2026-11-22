import { Suspense } from "react";
import ShopPageClient from "./ShopPageClient";

export const metadata = {
  title: "المتجر | مراتب و مفروشات أبو عرب",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container-app py-20 text-center text-navy/60">جاري التحميل...</div>}>
      <ShopPageClient />
    </Suspense>
  );
}
