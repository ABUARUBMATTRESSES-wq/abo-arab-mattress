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
// بدائل مشابهة بسعر أقل (للمقاس والارتفاع المختارين حاليًا):
// - نفس القسم
// - نفس المقاس والارتفاع المختارين متوفر في البديل وبسعر أقل فعليًا
// - للمراتب: نوع السوست لازم يكون موثقًا ومتطابقًا في المنتجين،
//   غير كده البديل يُستبعد (لا نفترض تطابق البنية مع غياب البيانات)
// - الاختلافات المعروفة تُعرض صراحة ولا توجد ادعاءات جودة
// ============================================================

export interface CheaperAlternative {
  product: Product;
  variant: VariantPrice; // اختيار البديل بنفس المقاس والارتفاع المختارين
  currentPrice: number; // سعر المنتج الحالي لنفس الاختيار
  sizeLabel: string;
  heightLabel: string;
  differences: string[]; // اختلافات معلنة صراحة
}

export function findCheaperAlternatives(
  current: Product,
  all: Product[],
  sizeId: string,
  heightId: string,
  max = 3
): CheaperAlternative[] {
  const currentBrand = getProductBrandId(current.name);
  const currentVariant = current.variantPrices.find((v) => v.sizeId === sizeId && v.heightId === heightId);
  if (!currentVariant) return [];

  const results: CheaperAlternative[] = [];

  for (const candidate of all) {
    if (candidate.id === current.id) continue;
    if (candidate.category !== current.category) continue;

    if (current.category === "mattresses") {
      // للمراتب: التشابه في البنية (نوع السوست) لازم يكون موثقًا ومتطابقًا
      if (!current.springType || !candidate.springType) continue;
      if (current.springType !== candidate.springType) continue;
    }

    const cv = candidate.variantPrices.find((v) => v.sizeId === sizeId && v.heightId === heightId);
    if (!cv || cv.price >= currentVariant.price) continue;

    const sizeLabel = candidate.sizes.find((s) => s.id === sizeId)?.label ?? sizeId;
    const heightLabel = candidate.heights.find((h) => h.id === heightId)?.label ?? heightId;
    const differences: string[] = [];

    const candidateBrand = getProductBrandId(candidate.name);
    if (candidateBrand !== currentBrand) {
      const cName = candidateBrand ? getBrandById(candidateBrand).name : "ماركة أخرى";
      const pName = currentBrand ? getBrandById(currentBrand).name : "ماركة أخرى";
      differences.push(`الماركة مختلفة: ${cName} بدل ${pName}`);
    }
    if (current.springType !== candidate.springType) {
      if (!current.springType && candidate.springType) {
        differences.push(`نوع السوست في المنتج الحالي غير موثق، البديل: ${candidate.springType}`);
      } else if (current.springType && !candidate.springType) {
        differences.push("نوع السوست في البديل غير موثق في الكتالوج");
      } else {
        differences.push(`نوع السوست مختلف: ${candidate.springType} بدل ${current.springType}`);
      }
    }
    if (current.firmness !== candidate.firmness) {
      if (current.firmness && candidate.firmness) {
        differences.push(`درجة الصلابة مختلفة: ${candidate.firmness} بدل ${current.firmness}`);
      } else if (candidate.firmness) {
        differences.push(`درجة صلابة البديل: ${candidate.firmness} (غير موثقة في المنتج الحالي)`);
      } else if (current.firmness) {
        differences.push("درجة الصلابة غير موثقة في البديل");
      }
    }
    if (current.warrantyYears !== candidate.warrantyYears) {
      differences.push(`الضمان مختلف: ${candidate.warrantyYears} سنة بدل ${current.warrantyYears} سنة`);
    }

    results.push({
      product: candidate,
      variant: cv,
      currentPrice: currentVariant.price,
      sizeLabel,
      heightLabel,
      differences,
    });
  }

  return results.sort((a, b) => a.variant.price - b.variant.price).slice(0, max);
}

// تصنيف المرتبة حسب التصنيع: يُشتق فقط من نوع السوست الموثق في الكتالوج وما يذكره اسم المنتج صراحة (ميموري فوم / طبي).
// المنتجات غير الموثقة التصنيع لا تُصنَّف (null) بدلاً من التخمين.
export type ConstructionClass = "connected" | "pocket" | "medical-no-springs" | "pocket-memory-foam";

export const constructionClassLabels: Record<ConstructionClass, string> = {
  connected: "سوست متصلة",
  pocket: "سوست منفصلة",
  "medical-no-springs": "طبي بدون سوست",
  "pocket-memory-foam": "سوست منفصلة بطبقة ميموري فوم",
};

export function getConstructionClass(p: Product): ConstructionClass | null {
  if (p.category !== "mattresses") return null;
  const memoryFoam = p.name.includes("ميموري") || p.shortDescription.includes("ميموري");
  const medical = p.name.includes("طبي");
  const s = p.springType;
  if (s === "سوست متصلة" || s === "مراتب متصلة (أمريكي)" || s === "مراتب متصلة ألماني") return "connected";
  if (s === "سوست منفصلة" || s === "مراتب منفصلة(بوكيت)") return memoryFoam ? "pocket-memory-foam" : "pocket";
  if ((s === "مراتب بدون سوست" || s === "فوم" || s === "مراتب رول") && medical) return "medical-no-springs";
  // استرجاع من نص الكتالوج نفسه: عبارات صريحة عن التصنيع في الاسم/الوصف/المواصفات (بدون استنتاج).
  const text = p.name + " " + p.shortDescription + " " + p.specs.map((x) => x.label + " " + x.value).join(" ");
  if (/سوست منفصل[ةه]|بوكيت|بوكت/.test(text)) return memoryFoam ? "pocket-memory-foam" : "pocket";
  if (/سوست متصل[ةه]/.test(text)) return "connected";
  return null;
}

export const constructionClassesList: ConstructionClass[] = ["connected", "pocket", "medical-no-springs", "pocket-memory-foam"];

