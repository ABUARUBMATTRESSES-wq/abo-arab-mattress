import {
  Bundle,
  CategorySlug,
  Firmness,
  HeightOption,
  Product,
  SizeOption,
  SpringType,
  VariantPrice,
} from "./types";

// ============================================================
// بيانات تجريبية — استبدلها ببيانات حقيقية من الإكسيل/الشيت لاحقاً
// كل منتج مستقل، والـ helpers بالأسفل بتبني أسعار المقاسات تلقائياً
// ============================================================

export const categories: { slug: CategorySlug; name: string; icon: string; description: string }[] = [
  { slug: "mattresses", name: "مراتب", icon: "bed-double", description: "مراتب طبية وفندقية بجودة ملكية" },
  { slug: "pillows", name: "مخدات", icon: "sofa", description: "مخدات داعمة للرقبة والعمود الفقري" },
  { slug: "protectors", name: "واقي مرتبة", icon: "shield-check", description: "حماية كاملة ضد السوائل والأتربة" },
  { slug: "bedding", name: "مفروشات", icon: "layers", description: "شراشف وملايات وأغطية فاخرة" },
];

// مقاسات قياسية للمراتب (سم)
const SIZE_SINGLE: SizeOption = { id: "90x190", label: "90 × 190", widthCm: 90, lengthCm: 190 };
const SIZE_SINGLE_XL: SizeOption = { id: "100x200", label: "100 × 200", widthCm: 100, lengthCm: 200 };
const SIZE_DOUBLE: SizeOption = { id: "120x190", label: "120 × 190", widthCm: 120, lengthCm: 190 };
const SIZE_DOUBLE_XL: SizeOption = { id: "140x190", label: "140 × 190", widthCm: 140, lengthCm: 190 };
const SIZE_QUEEN: SizeOption = { id: "160x200", label: "160 × 200", widthCm: 160, lengthCm: 200 };
const SIZE_KING: SizeOption = { id: "180x200", label: "180 × 200", widthCm: 180, lengthCm: 200 };
const SIZE_SUPER_KING: SizeOption = { id: "200x200", label: "200 × 200", widthCm: 200, lengthCm: 200 };

const HEIGHT_15: HeightOption = { id: "h15", label: "15 سم", cm: 15, priceModifier: -300 };
const HEIGHT_20: HeightOption = { id: "h20", label: "20 سم", cm: 20, priceModifier: 0 };
const HEIGHT_25: HeightOption = { id: "h25", label: "25 سم", cm: 25, priceModifier: 350 };
const HEIGHT_30: HeightOption = { id: "h30", label: "30 سم", cm: 30, priceModifier: 700 };

// معامل سعر لكل مقاس بالنسبة لسعر الأساس (مقاس 120×190)
const SIZE_PRICE_FACTOR: Record<string, number> = {
  "90x190": 0.72,
  "100x200": 0.8,
  "120x190": 1,
  "140x190": 1.18,
  "160x200": 1.42,
  "180x200": 1.65,
  "200x200": 1.9,
};

function roundTo(value: number, step: number) {
  return Math.round(value / step) * step;
}

/** يبني مصفوفة أسعار لكل مقاس × ارتفاع اعتماداً على السعر الأساسي ونسبة الخصم */
function buildVariantPrices(
  basePrice: number,
  discountPercent: number,
  sizes: SizeOption[],
  heights: HeightOption[]
): VariantPrice[] {
  const variants: VariantPrice[] = [];
  for (const size of sizes) {
    const factor = SIZE_PRICE_FACTOR[size.id] ?? 1;
    for (const height of heights) {
      const original = roundTo(basePrice * factor + height.priceModifier * factor, 10);
      const discounted = roundTo(original * (1 - discountPercent / 100), 10);
      variants.push({
        sizeId: size.id,
        heightId: height.id,
        originalPrice: original,
        price: discounted,
      });
    }
  }
  return variants;
}

function img(query: string) {
  // صور بديلة مؤقتة (Placeholder) — استبدلها بصور المنتج الحقيقية في public/images
  return `https://images.unsplash.com/${query}?auto=format&fit=crop&w=1200&q=80`;
}

// ---------------- المراتب ----------------

const mattressSizes = [SIZE_SINGLE, SIZE_SINGLE_XL, SIZE_DOUBLE, SIZE_DOUBLE_XL, SIZE_QUEEN, SIZE_KING];
const mattressHeights = [HEIGHT_15, HEIGHT_20, HEIGHT_25];

const royalOrthoBase = 9800;
const royalOrthoDiscount = 25;

const royalOrtho: Product = {
  id: "mat-royal-ortho",
  slug: "royal-ortho-deluxe",
  name: "مرتبة رويال أورثو ديلوكس",
  category: "mattresses",
  shortDescription: "دعم طبي فاخر لعمود فقري صحي ونوم ملكي",
  description:
    "مرتبة رويال أورثو ديلوكس مصممة خصيصاً لدعم العمود الفقري بتقنية الطبقات متعددة الكثافة، تمنحك إحساساً بالفخامة مع فوائد طبية حقيقية. مثالية لمن يعانون من آلام الظهر والرقبة.",
  images: [img("photo-1505693416388-ac5ce068fe85"), img("photo-1522771739844-6a9f6d5f14af"), img("photo-1584100936595-c0654b55a2e2")],
  springType: "هجين (سوست + اسفنج)",
  firmness: "متين",
  warrantyYears: 10,
  sizes: mattressSizes,
  heights: mattressHeights,
  basePrice: royalOrthoBase,
  discountPercent: royalOrthoDiscount,
  variantPrices: buildVariantPrices(royalOrthoBase, royalOrthoDiscount, mattressSizes, mattressHeights),
  bundles: [
    {
      id: "bundle-royal-pillow",
      title: "المرتبة + طقم مخدات طبية",
      includes: ["مرتبة رويال أورثو ديلوكس", "2 مخدة طبية داعمة"],
      extraDiscountPercent: 10,
      imageQuery: "photo-1522708323590-d24dbb6b0267",
    },
    {
      id: "bundle-royal-protector",
      title: "المرتبة + واقي مرتبة مقاوم للماء",
      includes: ["مرتبة رويال أورثو ديلوكس", "واقي مرتبة بريميوم"],
      extraDiscountPercent: 8,
      imageQuery: "photo-1631049307264-da0ec9d70304",
    },
  ],
  specs: [
    { label: "نوع السوست", value: "هجين (سوست + اسفنج ضغط عالي)" },
    { label: "درجة الصلابة", value: "متينة (مناسبة لآلام الظهر)" },
    { label: "طبقة الوجه", value: "قطن مضاد للحساسية" },
    { label: "الضمان", value: "10 سنوات ضد عيوب الصناعة" },
    { label: "مقاوم للعث والبكتيريا", value: "نعم" },
    { label: "بلد الصناعة", value: "مصر" },
  ],
  rating: 4.9,
  reviewsCount: 342,
  isFeatured: true,
  stock: 24,
};

const cloudMemoryBase = 7200;
const cloudMemoryDiscount = 20;
const cloudMemory: Product = {
  id: "mat-cloud-memory",
  slug: "cloud-memory-foam",
  name: "مرتبة كلاود ميموري فوم",
  category: "mattresses",
  shortDescription: "اسفنج ميموري فوم يحتضن جسمك مثل السحابة",
  description: "مرتبة كلاود ميموري فوم تتكيف مع شكل جسمك لتوزيع الوزن بالتساوي وتقليل نقاط الضغط، تجربة نوم ناعمة وفاخرة.",
  images: [img("photo-1631049035182-249067d7618e"), img("photo-1540518614846-7eded433c457")],
  springType: "اسفنج ضغط عالي",
  firmness: "طري",
  warrantyYears: 7,
  sizes: mattressSizes,
  heights: mattressHeights,
  basePrice: cloudMemoryBase,
  discountPercent: cloudMemoryDiscount,
  variantPrices: buildVariantPrices(cloudMemoryBase, cloudMemoryDiscount, mattressSizes, mattressHeights),
  specs: [
    { label: "نوع السوست", value: "اسفنج ميموري فوم بالكامل" },
    { label: "درجة الصلابة", value: "طرية فاخرة" },
    { label: "طبقة الوجه", value: "قماش مخملي فاخر" },
    { label: "الضمان", value: "7 سنوات" },
    { label: "مقاوم للعث والبكتيريا", value: "نعم" },
  ],
  rating: 4.7,
  reviewsCount: 210,
  isFeatured: true,
  stock: 18,
};

const classicBonnelBase = 4500;
const classicBonnelDiscount: number = 15;
const classicBonnel: Product = {
  id: "mat-classic-bonnel",
  slug: "classic-bonnel-comfort",
  name: "مرتبة كلاسيك بونيل كومفورت",
  category: "mattresses",
  shortDescription: "جودة موثوقة وسعر مناسب لكل بيت مصري",
  description: "مرتبة اقتصادية بسوست بونيل تقليدية مع طبقة اسفنج مريحة، خيار موثوق للاستخدام اليومي بسعر يناسب الجميع.",
  images: [img("photo-1505693314120-0d443867891c")],
  springType: "سوست بونيل",
  firmness: "متوسط",
  warrantyYears: 5,
  sizes: mattressSizes,
  heights: [HEIGHT_15, HEIGHT_20],
  basePrice: classicBonnelBase,
  discountPercent: classicBonnelDiscount,
  variantPrices: buildVariantPrices(classicBonnelBase, classicBonnelDiscount, mattressSizes, [HEIGHT_15, HEIGHT_20]),
  specs: [
    { label: "نوع السوست", value: "بونيل تقليدي" },
    { label: "درجة الصلابة", value: "متوسطة" },
    { label: "الضمان", value: "5 سنوات" },
  ],
  rating: 4.4,
  reviewsCount: 156,
  stock: 40,
};

const pocketSpringBase = 11500;
const pocketSpringDiscount = 22;
const pocketSpring: Product = {
  id: "mat-pocket-spring",
  slug: "royal-pocket-spring",
  name: "مرتبة رويال بوكيت سبرينج",
  category: "mattresses",
  shortDescription: "سوست لفافة مستقلة لعزل الحركة وراحة فندقية",
  description: "تقنية السوست اللفافة المستقلة (Pocket Spring) تعزل حركة الشريك تماماً وتمنحك دعماً نقطياً دقيقاً، كالتي تجدها في الفنادق الخمس نجوم.",
  images: [img("photo-1631679706909-1844bbd07221"), img("photo-1616627561950-9f746e330187")],
  springType: "سوست لفافة",
  firmness: "متين",
  warrantyYears: 12,
  sizes: [SIZE_DOUBLE, SIZE_DOUBLE_XL, SIZE_QUEEN, SIZE_KING, SIZE_SUPER_KING],
  heights: [HEIGHT_20, HEIGHT_25, HEIGHT_30],
  basePrice: pocketSpringBase,
  discountPercent: pocketSpringDiscount,
  variantPrices: buildVariantPrices(
    pocketSpringBase,
    pocketSpringDiscount,
    [SIZE_DOUBLE, SIZE_DOUBLE_XL, SIZE_QUEEN, SIZE_KING, SIZE_SUPER_KING],
    [HEIGHT_20, HEIGHT_25, HEIGHT_30]
  ),
  bundles: [
    {
      id: "bundle-pocket-full",
      title: "طقم غرفة نوم كامل (مرتبة + مخدات + واقي + شرشف)",
      includes: ["مرتبة رويال بوكيت سبرينج", "2 مخدة", "واقي مرتبة", "طقم شراشف"],
      extraDiscountPercent: 15,
      imageQuery: "photo-1505691938895-1758d7feb511",
    },
  ],
  specs: [
    { label: "نوع السوست", value: "لفافة مستقلة (Pocket Spring)" },
    { label: "درجة الصلابة", value: "متينة فندقية" },
    { label: "عزل الحركة", value: "ممتاز" },
    { label: "الضمان", value: "12 سنة" },
  ],
  rating: 5.0,
  reviewsCount: 98,
  isNew: true,
  isFeatured: true,
  stock: 12,
};

// ---------------- المخدات ----------------

const pillowSizes: SizeOption[] = [{ id: "50x70", label: "50 × 70", widthCm: 50, lengthCm: 70 }];
const pillowHeights: HeightOption[] = [{ id: "standard", label: "قياسي", cm: 12, priceModifier: 0 }];

function simplePillowVariant(price: number, discount: number): VariantPrice[] {
  const original = roundTo(price, 5);
  const discounted = roundTo(original * (1 - discount / 100), 5);
  return [{ sizeId: "50x70", heightId: "standard", originalPrice: original, price: discounted }];
}

const memoryPillow: Product = {
  id: "pil-memory-neck",
  slug: "memory-neck-support-pillow",
  name: "مخدة ميموري فوم طبية للرقبة",
  category: "pillows",
  shortDescription: "دعم مثالي للرقبة والفقرات العنقية",
  description: "مخدة بتصميم موجي من الميموري فوم تدعم فقرات الرقبة وتقلل آلام الاستيقاظ، مغلفة بقماش قطني ناعم قابل للغسل.",
  images: [img("photo-1584100936595-c0654b55a2e2")],
  springType: "بدون سوست",
  firmness: "متوسط",
  warrantyYears: 2,
  sizes: pillowSizes,
  heights: pillowHeights,
  basePrice: 950,
  discountPercent: 18,
  variantPrices: simplePillowVariant(950, 18),
  specs: [
    { label: "الخامة", value: "ميموري فوم طبي" },
    { label: "الغطاء", value: "قطن قابل للغسل" },
    { label: "الضمان", value: "سنتان" },
  ],
  rating: 4.8,
  reviewsCount: 180,
  isFeatured: true,
  stock: 60,
};

const featherPillow: Product = {
  id: "pil-luxury-feather",
  slug: "luxury-feather-pillow",
  name: "مخدة ريش فاخرة",
  category: "pillows",
  shortDescription: "نعومة فندقية خالصة",
  description: "مخدة محشوة بخامة ريش صناعي فاخر تمنحك إحساساً بالفنادق الخمس نجوم، خفيفة ومرنة وقابلة للتهوية.",
  images: [img("photo-1522708323590-d24dbb6b0267")],
  springType: "بدون سوست",
  firmness: "طري",
  warrantyYears: 1,
  sizes: pillowSizes,
  heights: pillowHeights,
  basePrice: 650,
  discountPercent: 10,
  variantPrices: simplePillowVariant(650, 10),
  specs: [
    { label: "الخامة", value: "حشو ريش صناعي فاخر" },
    { label: "الغطاء", value: "ساتان" },
  ],
  rating: 4.5,
  reviewsCount: 90,
  stock: 70,
};

// ---------------- واقي مرتبة ----------------

const protectorSizes = [SIZE_SINGLE, SIZE_DOUBLE, SIZE_QUEEN, SIZE_KING];
const protectorHeight: HeightOption[] = [{ id: "standard", label: "قياسي", cm: 30, priceModifier: 0 }];

function protectorVariants(basePrice: number, discount: number): VariantPrice[] {
  return protectorSizes.map((size) => {
    const factor = SIZE_PRICE_FACTOR[size.id] ?? 1;
    const original = roundTo(basePrice * factor, 5);
    const discounted = roundTo(original * (1 - discount / 100), 5);
    return { sizeId: size.id, heightId: "standard", originalPrice: original, price: discounted };
  });
}

const waterproofProtector: Product = {
  id: "prot-waterproof-premium",
  slug: "waterproof-premium-protector",
  name: "واقي مرتبة بريميوم ضد الماء",
  category: "protectors",
  shortDescription: "حماية كاملة من السوائل والعث بدون إزعاج صوتي",
  description: "واقي مرتبة مقاوم للماء بالكامل بخامة ناعمة لا تصدر صوتاً عند الحركة، يحمي مرتبتك من البقع والعث ويطيل عمرها الافتراضي.",
  images: [img("photo-1631049307264-da0ec9d70304")],
  springType: "بدون سوست",
  firmness: "طري",
  warrantyYears: 3,
  sizes: protectorSizes,
  heights: protectorHeight,
  basePrice: 1200,
  discountPercent: 20,
  variantPrices: protectorVariants(1200, 20),
  specs: [
    { label: "مقاوم للماء", value: "نعم 100%" },
    { label: "الخامة", value: "تيري كوتن + طبقة TPU" },
    { label: "قابل للغسل", value: "نعم حتى 60°" },
  ],
  rating: 4.6,
  reviewsCount: 134,
  isFeatured: true,
  stock: 85,
};

// ---------------- مفروشات ----------------

const beddingSizes = [SIZE_DOUBLE, SIZE_QUEEN, SIZE_KING];
const beddingHeight: HeightOption[] = [{ id: "standard", label: "قياسي", cm: 0, priceModifier: 0 }];

function beddingVariants(basePrice: number, discount: number): VariantPrice[] {
  return beddingSizes.map((size) => {
    const factor = SIZE_PRICE_FACTOR[size.id] ?? 1;
    const original = roundTo(basePrice * factor, 5);
    const discounted = roundTo(original * (1 - discount / 100), 5);
    return { sizeId: size.id, heightId: "standard", originalPrice: original, price: discounted };
  });
}

const royalBeddingSet: Product = {
  id: "bed-royal-satin-set",
  slug: "royal-satin-bedding-set",
  name: "طقم مفروشات ساتان رويال",
  category: "bedding",
  shortDescription: "ملاية + غطاء لحاف + 2 كيس مخدة بلمسة ملكية",
  description: "طقم مفروشات فاخر من الساتان المصري بألوان هادئة ونقشات ملكية، يضم ملاية سرير وغطاء لحاف وكيسين مخدة.",
  images: [img("photo-1522771739844-6a9f6d5f14af")],
  springType: "بدون سوست",
  firmness: "متوسط",
  warrantyYears: 1,
  sizes: beddingSizes,
  heights: beddingHeight,
  basePrice: 2200,
  discountPercent: 25,
  variantPrices: beddingVariants(2200, 25),
  specs: [
    { label: "الخامة", value: "ساتان مصري 300 خيط" },
    { label: "المحتويات", value: "ملاية + غطاء لحاف + 2 كيس مخدة" },
  ],
  rating: 4.7,
  reviewsCount: 76,
  isNew: true,
  stock: 50,
};

const cottonSheetSet: Product = {
  id: "bed-cotton-classic",
  slug: "cotton-classic-sheet-set",
  name: "طقم شراشف قطن كلاسيك",
  category: "bedding",
  shortDescription: "قطن 100% مريح للاستخدام اليومي",
  description: "طقم شراشف قطني مريح ومتين، مناسب للاستخدام اليومي مع سهولة في الغسيل والعناية.",
  images: [img("photo-1505691938895-1758d7feb511")],
  springType: "بدون سوست",
  firmness: "متوسط",
  warrantyYears: 1,
  sizes: beddingSizes,
  heights: beddingHeight,
  basePrice: 950,
  discountPercent: 12,
  variantPrices: beddingVariants(950, 12),
  specs: [
    { label: "الخامة", value: "قطن 100%" },
    { label: "المحتويات", value: "ملاية + 2 كيس مخدة" },
  ],
  rating: 4.3,
  reviewsCount: 64,
  stock: 65,
};

export const products: Product[] = [
  royalOrtho,
  cloudMemory,
  classicBonnel,
  pocketSpring,
  memoryPillow,
  featherPillow,
  waterproofProtector,
  royalBeddingSet,
  cottonSheetSet,
];

// ---------------- Helpers ----------------

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: CategorySlug): Product[] {
  return products.filter((p) => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured);
}

export function getVariant(product: Product, sizeId: string, heightId: string): VariantPrice | undefined {
  return product.variantPrices.find((v) => v.sizeId === sizeId && v.heightId === heightId);
}

/** نسبة الخصم كعدد صحيح بدون كسور */
export function computeDiscountPercent(original: number, price: number): number {
  if (original <= 0) return 0;
  return Math.round(((original - price) / original) * 100);
}

export function formatPrice(value: number): string {
  return value.toLocaleString("ar-EG");
}

export const springTypesList: SpringType[] = [
  "اسفنج ضغط عالي",
  "سوست لفافة",
  "سوست بونيل",
  "هجين (سوست + اسفنج)",
  "بدون سوست",
];

export const firmnessList: Firmness[] = ["طري", "متوسط", "متين", "صلب"];

export const allHeightsList = Array.from(
  new Map(
    products.flatMap((p) => p.heights).map((h) => [h.id, h])
  ).values()
);

export const allSizesList = Array.from(
  new Map(
    products.flatMap((p) => p.sizes).map((s) => [s.id, s])
  ).values()
);

// آراء العملاء (تجريبية)
export const testimonials = [
  {
    name: "أحمد السيد",
    location: "القاهرة",
    rating: 5,
    comment: "جودة المرتبة فاقت توقعاتي، حسيت بفرق كبير في نومي من أول أسبوع. التوصيل كان سريع والتعامل راقي جداً.",
  },
  {
    name: "مروة حسن",
    location: "الإسكندرية",
    rating: 5,
    comment: "اشتريت طقم المفروشات مع المخدات الطبية، الخامات فخمة والألوان زي ما شايفه بالظبط. أنصح بيهم بشدة.",
  },
  {
    name: "محمود عبد الله",
    location: "المنصورة",
    rating: 4,
    comment: "خدمة ممتازة واستجابة سريعة على واتساب، المرتبة كويسة جداً بالنسبة للسعر.",
  },
  {
    name: "سارة إبراهيم",
    location: "طنطا",
    rating: 5,
    comment: "عندي آلام ظهر من زمان، ومرتبة رويال أورثو فرقت معايا بشكل ملحوظ. شكراً أبو عرب.",
  },
];

export const faqs = [
  {
    question: "هل يوجد ضمان حقيقي على المراتب؟",
    answer: "نعم، جميع مراتبنا تأتي بضمان حقيقي يتراوح من 5 إلى 12 سنة حسب نوع المرتبة، يغطي عيوب الصناعة وتهالك الإسفنج.",
  },
  {
    question: "هل الدفع عند الاستلام متاح؟",
    answer: "نعم، نوفر خدمة الدفع عند الاستلام في جميع المحافظات مع إمكانية معاينة المنتج قبل الدفع.",
  },
  {
    question: "كم تستغرق مدة التوصيل؟",
    answer: "يتم التوصيل خلال 2-5 أيام عمل داخل القاهرة والجيزة، ومن 3-7 أيام عمل لباقي المحافظات.",
  },
  {
    question: "هل يمكن استبدال المرتبة بعد الاستلام؟",
    answer: "نعم، نوفر سياسة استبدال مرنة خلال 14 يوم من تاريخ الاستلام في حالة عدم الرضا عن المنتج (شروط الاستبدال تنطبق).",
  },
  {
    question: "كيف أطلب مقاس غير موجود بالموقع؟",
    answer: "يمكنك التواصل معنا مباشرة عبر واتساب وسنوفر لك المقاس المطلوب حسب الطلب الخاص.",
  },
];
