const BASE_URL = "https://striking-bell-1f63db83d6.strapiapp.com/";

function blocksToText(blocks: any): string {
  if (typeof blocks === "string") return blocks;
  if (!Array.isArray(blocks)) return "";

  return blocks
    .map((block) => {
      if (!Array.isArray(block.children)) return "";
      return block.children.map((child: any) => child.text ?? "").join("");
    })
    .join(" ")
    .trim();
}

export function mapCategory(item: any) {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
  };
}

export function mapProduct(item: any) {
  const attr = item.attributes ?? item;

  return {
    id: attr.id ?? item.id,
    name: attr.name ?? "",
    slug: attr.slug ?? "",
    documentId: attr.documentId ?? "",
    price: Number(attr.price ?? 0),
    description: blocksToText(attr.description),
    category: attr.category ?? null,
    badge: attr.badge ?? null,
    minOrder: Number(attr.minOrder ?? 1),
    image: attr.image?.url
      ? `${BASE_URL}${attr.image.url}`
      : "/images/fallback.jpg",
    alt: attr.image?.alternativeText ?? attr.name ?? "",
  };
}