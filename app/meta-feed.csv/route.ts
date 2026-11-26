// Product feed for Meta Commerce Manager.
// Source of truth: the site itself (lib/products.ts variants and prices, lib/catalog-ids.ts ids).
// Fixed per-group data (titles, categories, own images) lives in lib/meta-feed-groups.json,
// and the group (PARENT) rows are a fixed list in lib/meta-feed-parents.json.
import { products } from "@/lib/products";
import { CATALOG_IDS } from "@/lib/catalog-ids";
import groupsData from "@/lib/meta-feed-groups.json";
import parentRows from "@/lib/meta-feed-parents.json";

export const dynamic = "force-static";

const SITE = "https://abo-arab-mattress.pages.dev";
const IMG = `${SITE}/img/meta/`;

const COLUMNS = [
  "id", "title", "availability", "condition", "price", "sale_price", "discount_percentage",
  "width", "length", "height", "size", "product_type", "fb_product_category",
  "google_product_category", "brand", "link", "image_link", "additional_image_link",
  "custom_label_0", "custom_label_1", "item_group_id", "internal_label",
  "custom_label_2", "custom_label_3",
] as const;

type Row = Record<string, string>;
// [titlePrefix, custom_label_0, custom_label_1 is size?, product_type, fb_category, google_category,
//  brand, internal_label, custom_label_2, custom_label_3, image, additional images, condition, availability]
type Group = [string, string, number, string, string, string, string, string, string, string, string, string, string, string];
const groups = (groupsData as unknown as { groups: Record<string, Group>; over: Record<string, Row> }).groups;
const overrides = (groupsData as unknown as { groups: Record<string, Group>; over: Record<string, Row> }).over;

function sizeParts(label: string): { width: string; length: string; size: string } {
  const m = /^(\d+)\s*×\s*(\d+)$/.exec(label.trim());
  if (m) return { width: `${m[1]} سم`, length: `${m[2]} سم`, size: `${m[1]}×${m[2]} سم` };
  return { width: "", length: "", size: label };
}

function csvCell(v: string): string {
  return /[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

function absImages(list: string): string {
  return list ? list.split(",").map((x) => IMG + x).join(",") : "";
}

function buildRows(): Row[] {
  const rows: Row[] = [];
  for (const p of products) {
    const ids = CATALOG_IDS[p.slug];
    if (!ids) continue;
    for (const v of p.variantPrices) {
      const id = ids.v[`${v.sizeId}|${v.heightId}`];
      const g = groups[`${p.slug}|${v.heightId}`];
      if (!id || !g) continue;
      const size = p.sizes.find((s) => s.id === v.sizeId);
      const height = p.heights.find((h) => h.id === v.heightId);
      if (!size || !height) continue;
      const sp = sizeParts(size.label);
      const row: Row = {
        id,
        title: `${g[0]} مقاس ${sp.size}`,
        availability: g[13],
        condition: g[12],
        price: `${v.price} EGP`,
        sale_price: "",
        discount_percentage: "",
        width: sp.width,
        length: sp.length,
        height: height.label === "قياسي" ? "" : height.label,
        size: sp.size,
        product_type: g[3],
        fb_product_category: g[4],
        google_product_category: g[5],
        brand: g[6],
        link: `${SITE}/product/${p.slug}?size=${encodeURIComponent(v.sizeId)}&height=${encodeURIComponent(v.heightId)}`,
        image_link: g[10] ? IMG + g[10] : "",
        additional_image_link: absImages(g[11]),
        custom_label_0: g[1],
        custom_label_1: g[2] ? sp.size : "",
        item_group_id: ids.parent,
        internal_label: g[7],
        custom_label_2: g[8],
        custom_label_3: g[9],
      };
      Object.assign(row, overrides[id] ?? {});
      rows.push(row);
    }
  }
  for (const r of parentRows as string[][]) {
    const row: Row = {};
    COLUMNS.forEach((c, i) => { row[c] = r[i] ?? ""; });
    row.image_link = row.image_link ? IMG + row.image_link : "";
    row.additional_image_link = absImages(row.additional_image_link);
    rows.push(row);
  }
  return rows.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

export function GET() {
  const rows = buildRows();
  const lines = [COLUMNS.join(",")];
  for (const r of rows) lines.push(COLUMNS.map((c) => csvCell(r[c] ?? "")).join(","));
  return new Response(lines.join("\n") + "\n", {
    headers: { "content-type": "text/csv; charset=utf-8" },
  });
}
