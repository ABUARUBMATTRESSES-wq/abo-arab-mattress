import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تواصل معنا | مراتب و مفروشات أبو عرب",
  description: "تواصل معنا للاستفسار عن المنتجات والطلبات.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
