import { Suspense } from "react";
import ShopPageClient from "./ShopPageClient";

export const metadata = {
  title: "المتجر | مراتب و مفروشات أبو عرب",
};

function ShopSkeleton() {
  return <div className="container-app py-10" role="status" aria-label="جاري تحميل المنتجات">
    <span className="sr-only">جاري تحميل المنتجات</span>
    <div aria-hidden="true" className="motion-safe:animate-pulse">
      <div className="mb-8 h-10 w-40 rounded bg-navy/10" />
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="hidden h-96 rounded-2xl bg-navy/5 lg:block" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => <div key={i} className="card overflow-hidden">
            <div className="aspect-[4/3] bg-navy/10" />
            <div className="space-y-3 p-4"><div className="h-5 w-4/5 rounded bg-navy/10" /><div className="h-4 w-2/3 rounded bg-navy/5" /><div className="h-5 w-1/2 rounded bg-navy/10" /></div>
          </div>)}
        </div>
      </div>
    </div>
  </div>;
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopPageClient />
    </Suspense>
  );
}
