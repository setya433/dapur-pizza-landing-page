const API_URL = "https://striking-bell-1f63db83d6.strapiapp.com/api";

type StrapiListResponse<T> = {
  data: T[];
};

type StrapiCategoryResponseItem = {
  id: number;
  name?: string;
  slug?: string;
};

type StrapiProductResponseItem = {
  id: number;
  name?: string;
  slug?: string;
  price?: number;
  badge?: string | null;
  minOrder?: string | number | null;
  description?: unknown;
  category?: {
    id: number;
    name?: string;
    slug?: string;
  } | null;
  image?: {
    url?: string;
    alternativeText?: string | null;
  } | null;
};
const PRODUCTS_QUERY = [
  "sort=name:asc",
  "fields[0]=name",
  "fields[1]=slug",
  "fields[2]=price",
  "fields[3]=badge",
  "fields[4]=minOrder",
  "fields[5]=description",
  "populate[image][fields][0]=url",
  "populate[image][fields][1]=alternativeText",
  "populate[category][fields][0]=name",
  "populate[category][fields][1]=slug",
].join("&");

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`);
  }

  return res.json();
}

export async function fetchCategories(): Promise<StrapiCategoryResponseItem[]> {
  const res = await getJson<StrapiListResponse<StrapiCategoryResponseItem>>(
    `${API_URL}/categories?sort=name:asc&fields[0]=name&fields[1]=slug`
  );
  return res.data;
}

export async function fetchProducts(
  categorySlug?: string
): Promise<StrapiProductResponseItem[]> {
  const filters = categorySlug
    ? `&filters[category][slug][$eq]=${encodeURIComponent(categorySlug)}`
    : "";
  const url = `${API_URL}/products?${PRODUCTS_QUERY}${filters}`;

  const res = await getJson<StrapiListResponse<StrapiProductResponseItem>>(url);
  return res.data;
}

export async function fetchProductBySlug(
  slug: string
): Promise<StrapiProductResponseItem | undefined> {
  const res = await getJson<StrapiListResponse<StrapiProductResponseItem>>(
    `${API_URL}/products?${PRODUCTS_QUERY}&filters[slug][$eq]=${encodeURIComponent(slug)}`
  );

  return res.data[0];
}
