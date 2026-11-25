import { Product } from "./types";

// ملخص كارت المنتج: يُبنى فقط من الحقول الموجودة في readable-descriptions
// (أو shortDescription عند غيابه). مفيش أي مواصفة بتتضاف من خارج البيانات،
// وكل جملة تتحط كاملة: مفيش قطع لأي مواصفة في نص الكلام.

// استثناءات مكتوبة بعد مراجعة المواصفات، للفروقات اللي لازم تبان على الكارت.
const summaryOverrides: Record<string, string> = {
  "cataract-27":
    "سوست متصلة بسوست إضافية في المنتصف والأطراف، ارتفاع 27 أو 31 سم، إسفنج يانسن كثافة 28 وقطن من كل وجه.",
  "cataract-pillowtop":
    "سوست متصلة بسوست إضافية في المنتصف والأطراف، ارتفاع 29 سم، إسفنج يانسن كثافة 28 وقطن من كل وجه، بالإضافة إلى طبقة بيلوتوب من الإسفنج السوفت.",
};

const MAX_SUMMARY_LENGTH = 160;
const MAX_CLAUSE_LENGTH = 95;

type Fact = { label: string; value: string; order: number };

// عبارة عامة مش مواصفة: تتشال عشان الملخص يبدأ بمعلومة حقيقية.
const POINTER = /(المواصفات الموضحة أدناه|المواصفات أدناه|تفاصيل الخامات والتكوين|مواصفات فوربد)/;

// طبقات ومكونات هي اللي بتفرّق بين الموديلات المتشابهة.
const SIGNATURE = /(ميموري|لاتكس|بيلوتوب|بيلو توب|قطن|ريبوند|فازلين|جاكار|فيسكو|سوفت)/;

const SPRING = /سوست/;

function clean(text: string): string {
  return text.trim().replace(/\s*\.\s*$/, "").trim();
}

function toFacts(points: string[]): Fact[] {
  return points
    .map((point, order) => {
      const text = clean(point);
      const colon = text.indexOf(":");
      if (colon > 0 && colon <= 30) {
        return {
          label: text.slice(0, colon).trim(),
          value: text.slice(colon + 1).trim(),
          order,
        };
      }
      return { label: "", value: text, order };
    })
    .filter((fact) => fact.value.length > 1);
}

// بتضيف الكلمة بس لو القيمة مش مذكورة فيها، عشان مفيش كلمة بتتكرر.
function withWord(word: string, value: string): string {
  return value.includes(word) ? value : `${word} ${value}`;
}

function heightClause(value: string): string {
  const parts = value
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length === 1) return `ارتفاع ${parts[0]}`;
  const numbers = parts.map((part) => part.replace(/\s*سم\s*$/, "").trim());
  const unit = parts[0].includes("سم") ? " سم" : "";
  return `ارتفاع ${numbers.join(" أو ")}${unit}`;
}

function clause(fact: Fact): string {
  const { label, value } = fact;
  if (label.includes("أقصى ارتفاع")) return `يناسب ارتفاع حتى ${value}`;
  if (label.includes("ارتفاع")) return heightClause(value);
  if (label.includes("استخدام")) {
    if (value.includes("على الوجهين")) return "تُستخدم على الوجهين";
    if (value.includes("وجه واحد")) return "تُستخدم من وجه واحد";
    return value;
  }
  if (label.includes("سوست")) return withWord("سوست", value);
  if (label.includes("الكسوة")) return withWord("كسوة", value);
  if (label.includes("قماش")) return withWord("قماش", value);
  if (label.includes("حشو")) return withWord("حشو", value);
  if (label.includes("خامة")) return withWord("خامة", value);
  if (label.includes("الإسفنج")) return withWord("إسفنج", value);
  if (label.includes("الشاسيه")) return withWord("شاسيه", value);
  if (label.includes("الوزن")) return withWord("وزن", value);
  if (label.includes("التغطية")) return withWord("تغطية", value);
  if (label.includes("الصلابة")) return withWord("صلابة", value);
  if (label.includes("التصميم")) return withWord("تصميم", value);
  if (label.includes("الطبقة العلوية")) return withWord("طبقة", value);
  if (label.includes("الموديل")) return withWord("موديل", value);
  return value;
}

function priority(fact: Fact): number {
  const { label, value } = fact;
  if (label.includes("أقصى ارتفاع")) return 20;
  if (label.includes("ارتفاع")) return 100;
  if (label.includes("سوست") || SPRING.test(value)) return 90;
  if (SIGNATURE.test(value)) return 70;
  if (
    label.includes("المكونات") ||
    label.includes("طبقات") ||
    label.includes("الحشو") ||
    label.includes("الخامة")
  ) {
    return 60;
  }
  if (
    label.includes("الإسفنج") ||
    label.includes("العازل") ||
    label.includes("اللباد") ||
    /^طبقة/.test(value)
  ) {
    return 50;
  }
  if (label.includes("قماش") || label.includes("الكسوة") || /^قماش/.test(value)) return 40;
  if (label.includes("استخدام")) return 30;
  return 10;
}

function isMattressHeight(fact: Fact): boolean {
  return fact.label.includes("ارتفاع") && !fact.label.includes("أقصى");
}

export function getCardSummary(product: Product): string {
  const override = summaryOverrides[product.id] ?? summaryOverrides[product.slug];
  if (override) return override;

  const readable = product.readableDescription;
  const facts = toFacts(readable?.points ?? []);
  const heightFact = facts.find(isMattressHeight);

  let intro = readable?.intro ? clean(readable.intro) : "";
  // وصف عام بيحيل للمواصفات اللي تحت، أو اسم موديل لوحده: مش ملخص.
  if (POINTER.test(intro) || (intro.length < 15 && !intro.includes(" "))) intro = "";

  // «بارتفاع 16 سم» في وصف السوست مش ارتفاع المرتبة، فبتتوضّح عشان مفيش رقمين متناقضين.
  if (heightFact && intro) {
    intro = intro.replace(/بارتفاع\s*([\d.]+)\s*سم/, (_match, cm: string) => `بارتفاع سوست ${cm} سم`);
  }

  const introFact = intro ? toFacts([intro])[0] : undefined;
  const introText = introFact ? clause(introFact) : "";

  const body: string[] = [];
  if (heightFact) body.push(heightClause(heightFact.value));
  if (introText && !body.includes(introText)) body.push(introText);

  const ordered = facts
    .filter((fact) => fact !== heightFact)
    .map((fact) => ({ fact, score: priority(fact) }))
    .sort((a, b) => b.score - a.score || a.fact.order - b.fact.order)
    .map((entry) => entry.fact);

  let length = body.join("، ").length;
  let added = 0;

  for (const fact of ordered) {
    if (added >= 4) break;
    if (introText.includes(fact.value)) continue;
    const text = clause(fact);
    if (!text || text.length > MAX_CLAUSE_LENGTH || body.includes(text)) continue;
    if (length + 2 + text.length > MAX_SUMMARY_LENGTH) continue;
    body.push(text);
    length += 2 + text.length;
    added += 1;
  }

  const summary = body.join("، ").trim();
  if (summary) return summary;

  const fallback = clean(product.shortDescription ?? "");
  return fallback && fallback !== product.name ? fallback : "";
}
