"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTableToolbar from "@/components/admin/AdminPanelTableToolBar";
import { slugify } from "@/lib/slugify";

type StrapiRelation<T> = T | { data?: T | null } | null | undefined;

function unwrapStrapiRelation<T>(value: StrapiRelation<T>): T | null {
  if (!value) return null;

  if (
    typeof value === "object" &&
    "data" in value
  ) {
    return value.data ?? null;
  }

  return value as T;
}

type CategoryOption = {
  id: number;
  name: string;
  slug: string;
};

type ProductItem = {
  id: number;
  name: string;
  slug: string;
  price: number;
  description?: string;
  documentId: string;
  badge?: string;
  minOrder?: string;
  image?: string | null;
  category: CategoryOption | null;
};

type ProductFormState = {
  id: number | null;
  name: string;
  price: string;
  description: string;
  category: string;
  badge: string;
  documentId: string;
  minOrder: string;
};

type RichTextNode = {
  text?: string;
};

type RichTextBlock = string | { children?: RichTextNode[] };

type StrapiCategorySource = {
  id: number;
  name?: string;
  slug?: string;
  attributes?: {
    name?: string;
    slug?: string;
  };
};

type StrapiImageSource = {
  url?: string;
  attributes?: {
    url?: string;
  };
};

// type StrapiProductSource = {
//   documentId: string;
//   id: number;
//   name?: string;
//   slug?: string;
//   price?: number;
//   description?: string | RichTextBlock[];
//   badge?: string;
//   minOrder?: string;
//   category?: {
//     data?: StrapiCategorySource | null;
//   } | StrapiCategorySource | null;
//   image?: {
//     data?: StrapiImageSource | null;
//   } | StrapiImageSource | null;
//   attributes?: Omit<
//     StrapiProductSource,
//     "id" | "attributes"
//   >;
// };

type StrapiProductSource = {
  documentId: string;
  id: number;
  name?: string;
  slug?: string;
  price?: number;
  description?: string | RichTextBlock[];
  badge?: string;
  minOrder?: string;
  category?: StrapiRelation<StrapiCategorySource>;
  image?: StrapiRelation<StrapiImageSource>;
  attributes?: Omit<StrapiProductSource, "id" | "attributes">;
};

const initialForm: ProductFormState = {
  id: null,
  documentId: "",
  name: "",
  price: "",
  description: "",
  category: "",
  badge: "",
  minOrder: "",
};

const STRAPI_PUBLIC_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "https://striking-bell-1f63db83d6.strapiapp.com/";

function extractText(value: string | RichTextBlock[] | undefined): string {
  if (!value) return "";

  if (typeof value === "string") return value;

  if (Array.isArray(value)) {
    return value
      .map((block) => {
        if (typeof block === "string") return block;

        if (block?.children && Array.isArray(block.children)) {
          return block.children
            .map((child) => child?.text || "")
            .join("");
        }

        return "";
      })
      .join(" ");
  }

  type RichTextChild = {
  text?: string;
};

type RichTextNode = {
  children?: RichTextChild[];
};

if (
  typeof value === "object" &&
  value !== null &&
  "children" in value &&
  Array.isArray((value as RichTextNode).children)
) {
  return (value as RichTextNode).children!.map((child) => child?.text || "").join("");
}

  return "";
}

function mapCategory(item: StrapiCategorySource): CategoryOption {
  if (item?.attributes) {
    return {
      id: item.id,
      name: item.attributes.name || "",
      slug: item.attributes.slug || "",
    };
  }

  return {
    id: item.id,
    name: item.name || "",
    slug: item.slug || "",
  };
}

// function mapProduct(item: StrapiProductSource): ProductItem {
//   const source = item?.attributes ? item.attributes : item;
//   const rawCategory = item.category ??  null;
//   const category = rawCategory ? mapCategory(rawCategory) : null;
//   const rawImage = source.image?.data ?? source.image ?? null;

//   console.log("MAPPING ITEM:", item);
//   console.log("MAPPING Image:", source.image, "=>", rawImage);

//   let image: string | null = null;

//   if (rawImage?.attributes?.url) {
//     image = rawImage.attributes.url.startsWith("http")
//       ? rawImage.attributes.url
//       : `${STRAPI_PUBLIC_URL}${rawImage.attributes.url}`;
//   } else if (rawImage?.url) {
//     image = rawImage.url.startsWith("http")
//       ? rawImage.url
//       : `${STRAPI_PUBLIC_URL}${rawImage.url}`;
//   }

//   return {
//     id: item.id,
//     name: source.name || "",
//     documentId: item.documentId,
//     slug: source.slug || "",
//     price: source.price || 0,
//     description: extractText(source.description),
//     badge: source.badge ?? "",
//     minOrder: source.minOrder ?? "",
//     image,
//     category,
//   };
// }

function mapProduct(item: StrapiProductSource): ProductItem {
  const source = item?.attributes ? item.attributes : item;

  const rawCategory = unwrapStrapiRelation(source.category);
  const category = rawCategory ? mapCategory(rawCategory) : null;

  const rawImage = unwrapStrapiRelation(source.image);

  let image: string | null = null;

  if (rawImage?.attributes?.url) {
    image = rawImage.attributes.url.startsWith("http")
      ? rawImage.attributes.url
      : `${STRAPI_PUBLIC_URL}${rawImage.attributes.url}`;
  } else if (rawImage?.url) {
    image = rawImage.url.startsWith("http")
      ? rawImage.url
      : `${STRAPI_PUBLIC_URL}${rawImage.url}`;
  }

  return {
    id: item.id,
    name: source.name || "",
    documentId: item.documentId,
    slug: source.slug || "",
    price: source.price || 0,
    description: extractText(source.description),
    badge: source.badge ?? "",
    minOrder: source.minOrder ?? "",
    image,
    category,
  };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [form, setForm] = useState<ProductFormState>(initialForm);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function loadProducts() {
    const res = await fetch("/api/products", { cache: "no-store" });

    if (!res.ok) {
      const text = await res.text();
      console.error("LOAD PRODUCTS FAILED:", res.status, text);
      setProducts([]);
      return;
    }

    const data = await res.json();
    setProducts((data.data || []).map(mapProduct));
  }

  useEffect(() => {
    void (async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("/api/products", { cache: "no-store" }),
          fetch("/api/categories", { cache: "no-store" }),
        ]);

        if (!productsRes.ok) {
          const text = await productsRes.text();
          console.error("LOAD PRODUCTS FAILED:", productsRes.status, text);
          setProducts([]);
        } else {
          const data = await productsRes.json();
          setProducts((data.data || []).map(mapProduct));
        }

        if (!categoriesRes.ok) {
          const text = await categoriesRes.text();
          console.error("LOAD CATEGORIES FAILED:", categoriesRes.status, text);
          setCategories([]);
        } else {
          const data = await categoriesRes.json();
          setCategories((data.data || []).map(mapCategory));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.slug?.toLowerCase().includes(query);

      const matchCategory =
        categoryFilter === "all" || product.category?.slug === categoryFilter;

      return matchSearch && matchCategory;
    });
  }, [products, search, categoryFilter]);

  const resetForm = () => {
    setForm(initialForm);
    setFile(null);
    setPreview(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (product: ProductItem) => {
    setForm({
      id: product.id,
      name: product.name,
      price: String(product.price),
      description: product.description ?? "",
      documentId: product.documentId,
      category: product.category ? String(product.category.id) : "",
      badge: product.badge ?? "",
      minOrder: product.minOrder ?? "",
    });

    console.log("EDITING PRODUCT:", setForm, product);

    setFile(null);
    setPreview(product.image ?? null);
    setIsModalOpen(true);
  };

  // const handleDelete = async (id: number) => {
  //   const confirmed = window.confirm("Yakin hapus produk ini?");
    
  //   if (!confirmed) return;

  //   const res = await fetch("/api/products", {
  //     method: "DELETE",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ id }),
  //   });

  //   console.log("DELETING PRODUCT ID:", id);
  //   console.log("DELETE RESPONSE:", res.status, res.statusText);

  //   if (!res.ok) {
  //     const text = await res.text();
  //     console.error("DELETE PRODUCT FAILED:", res.status, text);
  //     alert("Gagal menghapus produk.");
  //     return;
  //   }

  //   await loadProducts();
  // };

  const handleDelete = async (documentId: string) => {
  const confirmed = window.confirm("Yakin hapus produk ini?");
  if (!confirmed) return;

  const res = await fetch("/api/products", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ documentId }),
  });

  console.log("DELETING PRODUCT DOCUMENT ID:", documentId);
  console.log("DELETE RESPONSE:", res.status, res.statusText);

  if (!res.ok) {
    const text = await res.text();
    console.error("DELETE PRODUCT FAILED:", res.status, text);
    alert("Gagal menghapus produk.");
    return;
  }

  await loadProducts();
};

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.price.trim()) {
      alert("Nama produk dan harga wajib diisi.");
      return;
    }

    setSubmitting(true);

    try {
      let imageId: number | null = null;

      if (file) {
        const uploadFormData = new FormData();
        uploadFormData.append("files", file);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadRes.ok) {
          const text = await uploadRes.text();
          console.error("UPLOAD FAILED:", uploadRes.status, text);
          alert("Gagal upload gambar.");
          return;
        }

        const uploadData = await uploadRes.json();
        imageId = uploadData?.[0]?.id ?? null;
      }

      const payload = {
  id: form.id,
  name: form.name,
  documentId: form.documentId,
  slug: slugify(form.name),
  price: Number(form.price),
  description: [
    {
      type: "paragraph",
      children: [
        {
          type: "text",
          text: form.description,
        },
      ],
    },
  ],
  category: form.category ? Number(form.category) : null,
  badge: form.badge,
  minOrder: form.minOrder,
  ...(imageId && { image: imageId }),
};

      const res = await fetch("/api/products", {
        method: form.id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("SUBMITTING PRODUCT:", payload);
      console.log("RESPONSE:", res.status, res.statusText);

      if (!res.ok) {
        const text = await res.text();
        console.error("SAVE PRODUCT FAILED:", res.status, text);
        alert("Gagal menyimpan produk.");
        return;
      }

      await loadProducts();
      closeModal();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menyimpan produk.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <AdminPageHeader
        title="Products"
        description="Kelola produk marketplace, edit detail, harga, dan kategorinya."
        action={
          <button
            onClick={openCreateModal}
            className="inline-flex h-11 items-center rounded-xl bg-[#C79A52] px-4 text-sm font-medium text-white transition hover:opacity-90"
          >
            + Add Product
          </button>
        }
      />

      <div className="rounded-2xl border border-[#E8E5DC] bg-white p-4 shadow-sm md:p-6">
        <AdminTableToolbar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search products by name, slug, or description..."
          rightSlot={
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="h-11 rounded-xl border border-[#E8E5DC] bg-white px-4 text-sm text-[#1F2937] outline-none"
            >
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          }
        />

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8E5DC] text-left text-[#6B7280]">
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Badge</th>
                <th className="px-4 py-3 font-medium">Min order</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-8 text-center text-[#6B7280]" colSpan={6}>
                    Loading...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-[#6B7280]" colSpan={6}>
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-[#F3F4F6] text-[#1F2937] transition hover:bg-[#FAFAF8]"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={56}
                            height={56}
                            unoptimized
                            className="h-14 w-14 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#F3F4F6] text-xs text-[#6B7280]">
                            No Image
                          </div>
                        )}

                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="mt-1 text-xs text-[#6B7280]">{product.slug}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">{product.category?.name ?? "-"}</td>
                    <td className="px-4 py-4">Rp{product.price.toLocaleString("id-ID")}</td>
                    <td className="px-4 py-4">{product.badge || "-"}</td>
                    <td className="px-4 py-4">{product.minOrder || "-"}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="rounded-lg bg-[#2563EB] px-3 py-2 text-xs font-medium text-white"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(product.documentId)}
                          className="rounded-lg bg-[#DC2626] px-3 py-2 text-xs font-medium text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E8E5DC] px-6 py-4">
              <div>
                <h2 className="text-xl font-semibold text-[#1F2937]">
                  {form.id ? "Edit Product" : "Add Product"}
                </h2>
                <p className="mt-1 text-sm text-[#6B7280]">
                  Lengkapi detail produk sebelum disimpan ke marketplace.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-full bg-[#F3F4F6] px-3 py-1 text-sm text-[#1F2937]"
              >
                Close
              </button>
            </div>

            <div className="grid gap-6 px-6 py-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1F2937]">
                    Product name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, name: event.target.value }))
                    }
                    className="w-full rounded-xl border border-[#E8E5DC] px-4 py-3 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1F2937]">
                    Price
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, price: event.target.value }))
                    }
                    className="w-full rounded-xl border border-[#E8E5DC] px-4 py-3 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1F2937]">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, category: event.target.value }))
                    }
                    className="w-full rounded-xl border border-[#E8E5DC] px-4 py-3 text-sm outline-none"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1F2937]">
                    Badge
                  </label>
                  <input
                    type="text"
                    value={form.badge}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, badge: event.target.value }))
                    }
                    className="w-full rounded-xl border border-[#E8E5DC] px-4 py-3 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1F2937]">
                    Minimum order
                  </label>
                  <input
                    type="text"
                    value={form.minOrder}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, minOrder: event.target.value }))
                    }
                    className="w-full rounded-xl border border-[#E8E5DC] px-4 py-3 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1F2937]">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, description: event.target.value }))
                    }
                    rows={8}
                    className="w-full rounded-xl border border-[#E8E5DC] px-4 py-3 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1F2937]">
                    Product image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    className="w-full rounded-xl border border-[#E8E5DC] px-4 py-3 text-sm outline-none"
                  />
                </div>

                {preview ? (
                  <div className="overflow-hidden rounded-2xl border border-[#E8E5DC]">
                    <Image
                      src={preview}
                      alt="Preview"
                      width={640}
                      height={360}
                      unoptimized
                      className="h-56 w-full object-cover"
                    />
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-[#E8E5DC] px-6 py-4">
              <button
                onClick={closeModal}
                className="rounded-xl border border-[#D1D5DB] px-4 py-2 text-sm font-medium text-[#1F2937]"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-xl bg-[#0B1B4D] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Saving..." : "Save Product"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
