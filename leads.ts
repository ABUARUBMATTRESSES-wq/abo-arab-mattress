import { CartItem, CustomerInfo } from "./types";

// ============================================================
// تسجيل بيانات العملاء محلياً (localStorage) وتصديرها كـ CSV
// ملاحظة: ده حل مبدئي بدون باك إند. لو عايز تخزين دائم ومركزي
// اربط النموذج بجوجل شيت أو قاعدة بيانات حقيقية لاحقاً.
// ============================================================

export interface OrderLead {
  id: string;
  createdAt: string;
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  discountCode?: string;
}

const STORAGE_KEY = "abo_arab_leads";

export function saveLead(lead: OrderLead) {
  if (typeof window === "undefined") return;
  try {
    const existing = getLeads();
    existing.push(lead);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch {
    // تجاهل أخطاء التخزين المحلي
  }
}

export function getLeads(): OrderLead[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as OrderLead[]) : [];
  } catch {
    return [];
  }
}

export function exportLeadsAsCsv() {
  const leads = getLeads();
  const headers = [
    "رقم الطلب",
    "التاريخ",
    "الاسم",
    "الهاتف",
    "المحافظة",
    "العنوان",
    "المنتجات",
    "الإجمالي الفرعي",
    "الشحن",
    "الإجمالي",
    "كود الخصم",
  ];

  const rows = leads.map((lead) => {
    const itemsSummary = lead.items
      .map((i) => `${i.productName} (${i.sizeLabel}/${i.heightLabel}) ×${i.quantity}`)
      .join(" | ");
    return [
      lead.id,
      lead.createdAt,
      lead.customer.name,
      lead.customer.phone,
      lead.customer.governorate,
      lead.customer.address,
      itemsSummary,
      lead.subtotal.toString(),
      lead.shippingFee.toString(),
      lead.total.toString(),
      lead.discountCode ?? "",
    ];
  });

  const csvContent =
    "﻿" + // BOM لدعم العربي في إكسل
    [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `abo-arab-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
