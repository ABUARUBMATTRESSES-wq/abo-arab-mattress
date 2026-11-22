# مراتب و مفروشات أبو عرب (Abo Arab Mattress)

متجر إلكتروني كامل مبني بـ **Next.js 14 (App Router) + TypeScript + Tailwind CSS + Lucide Icons**، بتصميم عربي RTL بالكامل، جاهز للرفع على GitHub والنشر على Vercel مباشرة من الموبايل.

---

## 📁 هيكل المشروع

```
abo-arab-mattress/
├── app/
│   ├── layout.tsx              # التخطيط العام + خط Cairo + Meta Pixel
│   ├── page.tsx                # الصفحة الرئيسية
│   ├── globals.css             # الألوان والأنماط العامة
│   ├── shop/                   # صفحة المتجر + الفلاتر + المقارنة
│   ├── product/[slug]/         # صفحة تفاصيل المنتج
│   ├── cart/                   # السلة وإتمام الطلب
│   └── contact/                # تواصل معنا
├── components/                 # كل مكونات الواجهة (Header, Footer, ProductCard...)
├── context/CartContext.tsx     # إدارة حالة السلة (localStorage)
├── lib/
│   ├── config.ts               # ⚙️ إعدادات المتجر (واتساب، Pixel، الشحن...)
│   ├── products.ts             # 🛏️ بيانات المنتجات التجريبية (عدّلها لاحقاً)
│   ├── types.ts                # تعريفات TypeScript
│   ├── pixel.ts                # تتبع أحداث Meta Pixel
│   └── leads.ts                # حفظ بيانات العملاء وتصديرها CSV
├── package.json
├── tailwind.config.ts
└── next.config.mjs
```

## ⚙️ قبل الرفع — عدّل هذه الإعدادات

افتح `lib/config.ts` وغيّر:

| المتغير | الوصف |
|---|---|
| `whatsappNumber` | رقم واتساب الإدارة (بالصيغة الدولية بدون + مثل `201012345678`) |
| `metaPixelId` | معرّف Meta Pixel من Facebook Events Manager |
| `phoneDisplay`, `email`, `address` | بيانات التواصل |
| `freeShippingThreshold`, `shippingFee` | حدود الشحن المجاني والرسوم |

لتحديث المنتجات، عدّل `lib/products.ts` — كل منتج فيه اسم، وصف، صور، مقاسات، ارتفاعات، أسعار، وخصومات. لاحقاً تقدر تستبدلها بالكامل بقراءة بيانات من ملف إكسل/شيت.

---

## 📲 رفع المشروع على GitHub من الموبايل

### الطريقة الأسهل: تطبيق GitHub الرسمي + رفع ملفات مباشرة

> ملاحظة: تطبيق GitHub للموبايل حالياً لا يدعم رفع مجلد كامل بسهولة، فأفضل طريقة هي استخدام **متصفح الموبايل** مع واجهة GitHub ويب (تعمل تماماً من الموبايل):

1. ادخل على [github.com](https://github.com) من متصفح الموبايل وسجّل دخولك.
2. أنشئ Repository جديد باسم **`abo-arab-mattress`** (اتركه فاضي بدون README).
3. من صفحة الـ repo الفاضي، اختر **"uploading an existing file"**.
4. ارفع الملفات مجلد بمجلد (اسحب أو اختر من ملفات الموبايل) — تقدر ترفع أكتر من ملف مرة واحدة.
   - لو عندك ضغط الملفات كـ ZIP، ارفعه ثم فكّه... لكن GitHub ويب مش بيفك ضغط تلقائياً، فالأفضل ترفع الملفات والمجلدات مباشرة كما هي.
5. اكتب رسالة commit زي "البناء الأساسي للمتجر" واضغط **Commit changes**.

### الطريقة الأفضل (موصى بها): Git من تطبيق طرفية على الموبايل

لو عندك تطبيق **Termux** (أندرويد) أو **iSH** (آيفون)، أو تقدر تستخدم **GitHub Codespaces / Gitpod** من المتصفح:

```bash
git init
git remote add origin https://github.com/USERNAME/abo-arab-mattress.git
git add .
git commit -m "البناء الأساسي للمتجر - Abo Arab Mattress"
git branch -M main
git push -u origin main
```

(استبدل `USERNAME` باسم حسابك على GitHub، وهيطلب منك تسجيل دخول أو Personal Access Token).

### بعد الرفع: النشر مباشرة

1. ادخل على [vercel.com](https://vercel.com) من الموبايل وسجّل دخول بحساب GitHub.
2. اختر **"Import Project"** واختر الـ repo `abo-arab-mattress`.
3. Vercel هيكتشف إنه مشروع Next.js تلقائياً — فقط اضغط **Deploy**.
4. خلال دقائق هيبقى عندك رابط مباشر للمتجر شغّال لايف 🎉

---

## 💻 التشغيل محلياً (على كمبيوتر)

```bash
npm install
npm run dev
```

افتح `http://localhost:3000`

للبناء النهائي:

```bash
npm run build
npm start
```

---

## 🧩 ملاحظات مهمة

- **الصور حالياً تجريبية** من Unsplash — استبدلها بصور منتجاتك الحقيقية (ضع الصور في `public/images/` واستبدل الروابط في `lib/products.ts`).
- **بيانات العملاء** تُحفظ محلياً في متصفح العميل (localStorage) ويتم إرسال تفاصيل الطلب كاملة عبر واتساب للإدارة. لو عايز تخزين مركزي لكل الطلبات (لإعلانات الفيسبوك مثلاً)، تقدر تربط نموذج الطلب بجوجل شيت أو قاعدة بيانات لاحقاً.
- **أكواد الخصم التجريبية**: `ABOARAB10` (خصم 10%) و `ROYAL15` (خصم 15%) — عدّلها في `context/CartContext.tsx`.
- **تتبع Meta Pixel**: الأحداث (PageView, ViewContent, AddToCart, InitiateCheckout, Purchase) مفعّلة تلقائياً بمجرد وضع الـ Pixel ID الحقيقي في `lib/config.ts`.
