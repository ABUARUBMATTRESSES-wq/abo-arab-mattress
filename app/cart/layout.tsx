import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سلة المشتريات | مراتب و مفروشات أبو عرب",
  robots: { index: false, follow: true },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
