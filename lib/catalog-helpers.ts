import type { Product, VariantPrice } from "./types";

// دوال وبيانات لا تعتمد على كتالوج المنتجات، منفصلة عشان صفحات الواجهة ما تحمّلش الكتالوج كله.

export function getVariant(product: Product, sizeId: string, heightId: string): VariantPrice | undefined {
  return product.variantPrices.find((v) => v.sizeId === sizeId && v.heightId === heightId);
}

export function computeDiscountPercent(original: number, price: number): number {
  if (original <= 0) return 0;
  return Math.round(((original - price) / original) * 100);
}

export function formatPrice(value: number): string {
  return value.toLocaleString("ar-EG");
}

export const faqs = [
  {
    question: "إزاي أختار المقاس؟",
    answer: "افتح صفحة المنتج واختار من المقاسات والارتفاعات المعروضة. السعر بيتغير حسب الاختيار.",
  },
  {
    question: "بتوصّلوا لمحافظتي؟",
    answer: "بنوصّل لكل محافظات مصر السبعة وعشرين.",
  },
  {
    question: "الشحن بكام؟",
    answer: "القاهرة والجيزة ٥٠٠ جنيه، ومجاني للطلبات من ٢٠,٠٠٠ جنيه أو أكتر. باقي المحافظات ٣٠٠ جنيه لكل مرتبة، و٣٠٠ جنيه للطلب اللي كله إكسسوارات.",
  },
  {
    question: "فيه ضمان؟",
    answer: "كل المراتب عليها ضمان ١٠ سنين.",
  },
  {
    question: "إزاي أطلب؟",
    answer: "اختار المنتج والمقاس وضيفه للسلة وكمّل الطلب — هيتفتح واتساب بتفاصيل طلبك جاهزة، وأكّد من هناك.",
  },
  {
    question: "أقدر أقارن بين الموديلات؟",
    answer: "أيوه، من صفحة المتجر فعّل وضع المقارنة واختار لحد ٣ موديلات جنب بعض.",
  },
  {
    question: "عايز أعرف تفاصيل أكتر عن منتج؟",
    answer: "تواصل معنا عبر واتساب للاستفسار عن مواصفات المنتج والضمان والتوصيل قبل الطلب.",
  },
];

// A shared display selection keeps cards and comparison on the same real variant.
export function getDefaultVariant(product: Product): VariantPrice | undefined {
 return product.variantPrices.find(v => v.sizeId === product.sizes[0]?.id && v.heightId === product.heights[0]?.id) ?? product.variantPrices[0];
}
