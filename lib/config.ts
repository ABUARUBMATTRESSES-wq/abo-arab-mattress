// ============================================================
// إعدادات المتجر العامة — غيّر القيم هنا فقط
// ============================================================

export const siteConfig = {
  // اسم البراند
  brandNameAr: "مراتب و مفروشات أبو عرب",
  brandNameEn: "Abo Arab Mattress",
  slogan: "نوم ملكي... يليق بيك",

  // رقم واتساب الإدارة (بصيغة دولية بدون + أو صفر في البداية)
  // مثال لمصر: بدل 01012345678 يبقى 201012345678
  whatsappNumber: "201551600820",

  // بريد ورقم تواصل إضافي
  phoneDisplay: "01002405715",
  email: "info@aboarab-mattress.com",

  // العنوان
  address: "123 حسن المأمون أمام النادي الأهلي مول فرنتشر تاون معرض أبوعرب للمراتب",

  // روابط السوشيال ميديا
  social: {
    facebook: "https://facebook.com/aboarabmattress",
    instagram: "https://instagram.com/aboarabmattress",
    tiktok: "https://tiktok.com/@aboarabmattress",
  },

  // Meta Pixel ID — للحصول عليه من Facebook Events Manager
  metaPixelId: "1184874403972925",

  // حد الشحن المجاني بالجنيه
  freeShippingThreshold: 20000,

  // رسوم الشحن الثابتة لو الطلب أقل من حد الشحن المجاني
  shippingFee: 500,

  // العملة
  currency: "ج.م",
};

// قائمة المحافظات المصرية للشحن
export const governorates = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "الدقهلية",
  "البحر الأحمر",
  "البحيرة",
  "الفيوم",
  "الغربية",
  "الإسماعيلية",
  "المنوفية",
  "المنيا",
  "القليوبية",
  "الوادي الجديد",
  "السويس",
  "اسوان",
  "اسيوط",
  "بني سويف",
  "بورسعيد",
  "دمياط",
  "الشرقية",
  "جنوب سيناء",
  "كفر الشيخ",
  "مطروح",
  "الأقصر",
  "قنا",
  "شمال سيناء",
  "سوهاج",
];

export function buildWhatsappLink(message: string) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encoded}`;
}
