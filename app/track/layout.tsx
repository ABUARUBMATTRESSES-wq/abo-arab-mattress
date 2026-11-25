import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تتبع طلبك | مراتب و مفروشات أبو عرب",
  robots: { index: false, follow: true },
};

export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
