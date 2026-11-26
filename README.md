# مراتب و مفروشات أبو عرب (Abo Arab Mattress)

موقع متجر مبني بـ Next.js 14 (App Router) + TypeScript + Tailwind CSS، بتصميم عربي RTL. الطلبات تنتهي برسالة واتساب جاهزة للمعرض، ولا يوجد دفع أونلاين.

## النشر
- الاستضافة: Cloudflare Pages. فرع النشر هو `cloudflare-pages` (الفرع الافتراضي القديم لا يمثل الموقع المنشور).
- الإضافات الخلفية في `functions/api`: حفظ الطلبات (`order.ts`) وتتبع الطلب (`track.ts`) ولوحة الإدارة (`admin/`).
- التخزين: Cloudflare D1 (ربط باسم `DB`). الجداول أُنشئت من لوحة Cloudflare ولا توجد ملفات سكيما في هذا المستودع.
- الأسرار (`SESSION_SECRET`, `TURNSTILE_SECRET`, `ADMIN_PASSWORD_PBKDF`) تُضبط في إعدادات Pages، ولا تُكتب في الكود.

## هيكل المشروع
```
app/            صفحات الموقع (الرئيسية، shop، product، cart، contact، track، admin، السياسات)
components/     مكونات الواجهة
context/        حالة السلة (تُحفظ في متصفح العميل)
functions/api/  واجهات الطلب والتتبع والإدارة
lib/            بيانات المنتجات والكتالوج والشحن والبكسل
public/         الصور والأصول (public/img)
```

## ملفات مهمة
- `lib/products.ts` بيانات المنتجات، و`lib/readable-descriptions.ts` الأوصاف المقروءة، و`lib/card-summary.ts` ملخص كارت المنتج.
- `lib/catalog-ids.ts` يربط مفاتيح المقاس والارتفاع بمعرفات كتالوج Meta. لا يُعدَّل يدويا ولا تُغيَّر مفاتيحه.
- `lib/shipping.ts` حساب الشحن، و`lib/pixel.ts` أحداث Meta Pixel، و`lib/config.ts` بيانات المعرض والمحافظات.

## التشغيل محليا
```
npm install
npm run dev
npm run build
```

## ملاحظات
- صور المنتجات مأخوذة من مصادر الشركات، وحق استخدامها غير موثق بعد.
- أي تغيير في الأسعار أو السياسات أو معرفات الكتالوج يحتاج قرار صاحب المتجر.
