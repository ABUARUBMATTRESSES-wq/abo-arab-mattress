import type { Metadata } from "next";

// Login page: keep it out of search results. This is not access control;
// protection is the password login and the 401 on the admin API.
export const metadata: Metadata = {
  title: "لوحة الإدارة",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
