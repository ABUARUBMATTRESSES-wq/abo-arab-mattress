export type CategorySlug = "mattresses" | "pillows" | "protectors" | "bedding";

export type SpringType = "اسفنج ضغط عالي" | "سوست لفافة" | "سوست بونيل" | "هجين (سوست + اسفنج)" | "بدون سوست";

export type Firmness = "طري" | "متوسط" | "متين" | "صلب";

export interface SizeOption {
  id: string;
  label: string; // "190×120"
  widthCm: number;
  lengthCm: number;
}

export interface HeightOption {
  id: string;
  label: string; // "20 سم"
  cm: number;
  priceModifier: number; // يضاف/يطرح من السعر الأساسي
}

export interface VariantPrice {
  sizeId: string;
  heightId: string;
  price: number; // السعر بعد الخصم
  originalPrice: number; // السعر قبل الخصم
}

export interface Bundle {
  id: string;
  title: string;
  includes: string[]; // أسماء المنتجات / الأصناف المتضمنة
  extraDiscountPercent: number;
  imageQuery: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  shortDescription: string;
  description: string;
  images: string[]; // روابط الصور (placeholders)
  springType: SpringType;
  firmness: Firmness;
  warrantyYears: number;
  sizes: SizeOption[];
  heights: HeightOption[];
  basePrice: number; // أعلى سعر قبل الخصم (أساس الحسابات)
  discountPercent: number; // نسبة الخصم الافتراضية
  variantPrices: VariantPrice[];
  bundles?: Bundle[];
  specs: { label: string; value: string }[];
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
  isNew?: boolean;
  stock: number;
}

export interface CartItem {
  productId: string;
  productName: string;
  slug: string;
  image: string;
  sizeLabel: string;
  heightLabel: string;
  unitPrice: number;
  originalUnitPrice: number;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  governorate: string;
  address: string;
  notes?: string;
}
