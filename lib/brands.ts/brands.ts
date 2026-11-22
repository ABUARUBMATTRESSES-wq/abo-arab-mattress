import { Product, VariantPrice } from "./types";

// ============================================================
// الماركات المعتمدة في الكتالوج + الشعارات الرسمية من مواقع الماركات
// الشعارات محفوظة محليًا في public/brands (مصدرها المواقع الرسمية)
// ============================================================

export type BrandId = "taki" | "forbed" | "janssen" | "englander" | "wonderland";

export interface Brand {
  id: BrandId;
  name: string; // الاسم المعروض بالعربي
  logo: string; // مسار محلي داخل public
  keywords: string[]; // كلمات تمييز الماركة داخل اسم المنتج
}

export const brands: Brand[] = [
  {
    id: "taki",
    name: "تاكي",
    logo: "/brands/taki.png",
    keywords: ["تاكي"],
  },
  {
    id: "forbed",
    name: "فوربد",
    logo: "/brands/forbed.png",
    keywords: ["فوربد"],
  },
  {
    id: "janssen",
    name: "يانسن",
    logo: "/brands/janssen.png",
    keywords: ["يانسن"],
  },
  {
    id: "englander",
    name: "انجلندر",
    logo: "/brands/englander.jpg",
    keywords: ["انجلندر"],
  },
  {
    id: "wonderland",
    name: "وندر لاند",
    logo: "/brands/wonderland.png",
    keywords: ["وندر لاند", "وندرلاند"],
  },
];

export function getBrandById(id: BrandId): Brand {
  return brands.find((b) => b.id === id) as Brand;
}

export function getProductBrandId(productName: string): BrandId | null {
  for (const b of brands) {
    if (b.keywords.some((k) => productName.includes(k))) return b.id;
  }
  return null;
}

export function getProductBrand(productName: string): Brand | null {
  const id = getProductBrandId(productName);
  return id ? getBrandById(id) : null;
}

// ============================================================
// بدائل مشابهة بسعر أقل:
// - نفس القسم
// - مقاس وارتفاع متوفران في المنتجين وسعر البديل أقل لنفس الاختيار
// - نوع السوست مطابق عندما يكون موثقًا في المنتجين
// - الاختلافات تُعرض صراحة ولا توجد ادعاءات جودة
// ============================================================

export interface CheaperAlternative {
  product: Product;
  variant: VariantPrice; // اختيار البديل الأرخص ضمن اختيار مشترك
  currentPrice: number; // سعر المنتج الحالي لنفس الاختيار
  sizeLabel: string;
  heightLabel: string;
  differences: string[]; // اختلافات معلنة صراحة
}

export function findCheaperAlternatives(current: Product, all: Product[], max = 3): CheaperAlternative[] {
  const currentBrand = getProductBrandId(current.name);
  const results: CheaperAlternative[] = [];

  for (const candidate of all) {
    if (candidate.id === current.id) continue;
    if (candidate.category !== current.category) continue;
    // نوع السوست: لو موثق في المنتجين ولازم يتطابق
    if (current.springType && candidate.springType && current.springType !== candidate.springType) continue;

    // ابحث عن اختيار مشترك (نفس المقاس والارتفاع) يكون فيه البديل أرخص
    let best: CheaperAlternative | null = null;
    for (const cv of candidate.variantPrices) {
      const pv = current.variantPrices.find((v) => v.sizeId === cv.sizeId && v.heightId === cv.heightId);
      if (!pv) continue;
      if (cv.price >= pv.price) continue;
      if (!best || cv.price < best.variant.price) {
        const sizeLabel = candidate.sizes.find((s) => s.id === cv.sizeId)?.label ?? cv.sizeId;
        const heightLabel = candidate.heights.find((h) => h.id === cv.heightId)?.label ?? cv.heightId;
        best = {
          product: candidate,
          variant: cv,
          currentPrice: pv.price,
          sizeLabel,
          heightLabel,
          differences: [],
        };
      }
    }
    if (!best) continue;

    // الاختلافات المعلنة
    const candidateBrand = getProductBrandId(candidate.name);
    if (candidateBrand !== currentBrand) {
      const cName = candidateBrand ? getBrandById(candidateBrand).name : "ماركة أخرى";
      const pName = currentBrand ? getBrandById(currentBrand).name : "ماركة أخرى";
      best.differences.push(`الماركة مختلفة: ${cName} بدل ${pName}`);
    }
    if (current.springType !== candidate.springType) {
      if (!current.springType && candidate.springType) {
        best.differences.push(`نوع السوست في المنتج الحالي غير موثق، البديل: ${candidate.springType}`);
      } else if (current.springType && !candidate.springType) {
        best.differences.push("نوع السوست في البديل غير موثق في الكتالوج");
      } else {
        best.differences.push(`نوع السوست مختلف: ${candidate.springType} بدل ${current.springType}`);
      }
    }
    if (current.firmness !== candidate.firmness) {
      if (current.firmness && candidate.firmness) {
        best.differences.push(`درجة الصلابة مختلفة: ${candidate.firmness} بدل ${current.firmness}`);
      } else if (candidate.firmness) {
        best.differences.push(`درجة صلابة البديل: ${candidate.firmness} (غير موثقة في المنتج الحالي)`);
      } else if (current.firmness) {
        best.differences.push("درجة الصلابة غير موثقة في البديل");
      }
    }
    if (current.warrantyYears !== candidate.warrantyYears) {
      best.differences.push(`الضمان مختلف: ${candidate.warrantyYears} سنة بدل ${current.warrantyYears} سنة`);
    }
    results.push(best);
  }

  return results.sort((a, b) => a.variant.price - b.variant.price).slice(0, max);
}
