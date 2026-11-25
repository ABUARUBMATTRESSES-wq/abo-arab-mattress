import { Product } from "./types";

// ملخص كارت المنتج: يُبنى فقط من الوصف القابل للقراءة الموجود في readable-descriptions
// (أو shortDescription عند غيابه). مفيش أي مواصفة بتتضاف من خارج البيانات.

// استثناءات مكتوبة بعد مراجعة المواصفات، للفروقات اللي لازم تبان على الكارت.
const summaryOverrides: Record<string, string> = {
  "cataract-27":
    "سوست متصلة بسوست إضافية في المنتصف والأطراف، ارتفاع 27 أو 31 سم، إسفنج يانسن كثافة 28 وقطن على الوجهين.",
  "cataract-pillowtop":
    "سوست متصلة بسوست إضافية في المنتصف والأطراف، ارتفاع 29 سم، مع طبقة بيلوتوب من الإسفنج السوفت فوق إسفنج يانسن كثافة 28 وقطن.",
};

const MAX_SUMMARY_LENGTH = 120;
const MAX_FACT_LENGTH = 70;

type Fact = { label: string; value: string };

function clean(text: string): string {
  return text.trim().replace(/\s*\.\s*$/, "").trim();
}

function toFacts(points: string[]): Fact[] {
  return points
    .map((point) => {
      const text = clean(point);
      const colon = text.indexOf(":");
      if (colon > 0 && colon <= 30) {
        return { label: text.slice(0, colon).trim(), value: text.slice(colon + 1).trim() };
      }
      return { label: "", value: text };
    })
    .filter((fact) => fact.value.length > 0);
}

function shorten(text: string): string {
  if (text.length <= MAX_FACT_LENGTH) return text;
  const cut = text.slice(0, MAX_FACT_LENGTH);
  const space = cut.lastIndexOf(" ");
  return `${space > 30 ? cut.slice(0, space) : cut}…`;
}

function factClause(fact: Fact): string {
  const value = shorten(fact.value);
  if (fact.label.includes("الارتفاع")) return `ارتفاع ${value}`;
  if (fact.label.includes("استخدام")) return value.includes("وجه") ? `يُستخدم ${value}` : value;
  if (fact.label.includes("قماش") || fact.label.includes("الكسوة")) {
    return value.includes("قماش") ? value : `قماش ${value}`;
  }
  return value;
}

function priority(fact: Fact): number {
  const label = fact.label;
  if (label.includes("الارتفاع")) return 5;
  if (label.includes("المكونات") || label.includes("طبقات") || label.includes("الحشو") || label.includes("الخامة")) {
    return 4;
  }
  if (label.includes("قماش") || label.includes("الكسوة")) return 3;
  if (label.includes("استخدام")) return 2;
  return 1;
}

// سطر مختصر أو سطر على شكل «عنوان: معلومة» محتاج تكملة عشان يبقى ملخص مفيد.
function isThin(intro: string): boolean {
  const colon = intro.indexOf(":");
  const labelLed = colon > 0 && colon <= 30;
  return labelLed || intro.length < 45;
}

export function getCardSummary(product: Product): string {
  const override = summaryOverrides[product.id] ?? summaryOverrides[product.slug];
  if (override) return override;

  const readable = product.readableDescription;
  const intro = readable?.intro ? clean(readable.intro) : "";

  if (!intro) {
    const fallback = clean(product.shortDescription ?? "");
    return fallback && fallback !== product.name ? fallback : "";
  }

  if (!isThin(intro)) return intro;

  const facts = toFacts(readable?.points ?? [])
    .filter((fact) => fact.value.length > 3 && !intro.includes(fact.value))
    .sort((a, b) => priority(b) - priority(a));

  let summary = intro;
  let added = 0;

  for (const fact of facts) {
    if (added >= 2) break;
    const clause = factClause(fact);
    if (!clause || summary.includes(clause)) continue;
    if (`${summary}، ${clause}`.length > MAX_SUMMARY_LENGTH) continue;
    summary = `${summary}، ${clause}`;
    added += 1;
  }

  return summary;
}
