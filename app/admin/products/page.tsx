"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTableToolbar from "@/components/admin/AdminPanelTableToolBar";
import { slugify } from "@/lib/slugify";

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
  minOrder: string;
};

const initialForm: ProductFormState = {
  id: null,
  name: "",
  price: "",
  description: "",
  category: "",
  badge: "",
  minOrder: "",
};

function extractText(value: any): string {
  if (!value) return "";

  if (typeof value === "string") return value;

  if (Array.isArray(value)) {
    return value
      .map((block) => {
        if (typeof block === "string") return block;

        if (block?.children && Array.isArray(block.children)) {
          return block.children
            .map((child: any) => child?.text || "")
            .join("");
        }

        return "";
      })
      .join(" ");
  }

  if (typeof value === "object") {
    if (value?.children && Array.isArray(value.children)) {
      return value.children.map((child: any) => child?.text || "").join("");
    }
  }

  return "";
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

  function mapCategory(item: any): CategoryOption {
    if (item?.attributes) {
      return {
        id: item.id,
        name: item.attributes.name,
        slug: item.attributes.slug,
      };
    }

    return {
      id: item.id,
      name: item.name,
      slug: item.slug,
    };
  }

  function mapProduct(item: any): ProductItem {
    const source = item?.attributes ? item.attributes : item;

    const rawCategory = source.category?.data ?? source.category ?? null;
    const category = rawCategory ? mapCategory(rawCategory) : null;

    const rawImage = source.image?.data ?? source.image ?? null;

    let image: string | null = null;

    if (rawImage?.attributes?.url) {
      image = rawImage.attributes.url.startsWith("http")
        ? rawImage.attributes.url
        : `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}${rawImage.attributes.url}`;
    } else if (rawImage?.url) {
      image = rawImage.url.startsWith("http")
        ? rawImage.url
        : `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}${rawImage.url}`;
    }

    return {
      id: item.id,
      name: source.name,
      slug: source.slug,
      price: source.price,
      description: extractText(source.description),
      badge: source.badge ?? "",
      minOrder: source.minOrder ?? "",
      image,
      category,
    };
  }

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

  async function loadCategories() {
    const res = await fetch("/api/categories", { cache: "no-store" });

    if (!res.ok) {
      const text = await res.text();
      console.error("LOAD CATEGORIES FAILED:", res.status, text);
      setCategories([]);
      return;
    }

    const data = await res.json();
    setCategories((data.data || []).map(mapCategory));
  }

  async function initLoad() {
    try {
      await Promise.all([loadProducts(), loadCategories()]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    initLoad();
  }, []);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.description?.toLowerCase().includes(q) ||
        product.slug?.toLowerCase().includes(q);

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
      category: product.category ? String(product.category.id) : "",
      badge: product.badge ?? "",
      minOrder: product.minOrder ?? "",
    });

    setFile(null);
    setPreview(product.image ?? null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Yakin hapus produk ini?");
    if (!confirmed) return;

    const res = await fetch("/api/products", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("DELETE PRODUCT FAILED:", res.status, text);
      alert("Gagal menghapus produk.");
      return;
    }

    await loadProducts();
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const uploadImage = async () => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("files", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("UPLOAD IMAGE FAILED:", res.status, text);
      throw new Error("Gagal upload gambar");
    }

    const data = await res.json();
    return data?.[0]?.id ?? null;
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      alert("Nama produk wajib diisi.");
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      alert("Harga produk harus lebih dari 0.");
      return;
    }

    setSubmitting(true);

    try {
      let imageId: number | null = null;

      if (file) {
        imageId = await uploadImage();
      }

      const payload: Record<string, any> = {
        id: form.id,
        name: form.name,
        slug: slugify(form.name),
        price: Number(form.price),
        description: form.description,
        badge: form.badge,
        minOrder: form.minOrder,
        category: form.category ? Number(form.category) : null,
      };

      if (imageId) {
        payload.image = imageId;
      }

      const res = await fetch("/api/products", {
        method: form.id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

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
        description="Kelola daftar produk, harga, kategori, gambar, dan detail menu."
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
              onChange={(e) => setCategoryFilter(e.target.value)}
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
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Description</th>
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
                        <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-[#F3F4F6]">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-[#9CA3AF]">
                              No Img
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-semibold">{product.name}</p>
                          {product.badge ? (
                            <p className="mt-1 text-xs text-[#6B7280]">{product.badge}</p>
                          ) : null}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      {product.category ? (
                        <span className="inline-flex rounded-full bg-[#F3F4F6] px-2.5 py-1 text-xs font-medium text-[#4B5563]">
                          {product.category.name}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td className="px-4 py-4 font-semibold">
                      Rp {product.price.toLocaleString("id-ID")}
                    </td>

                    <td className="px-4 py-4 text-[#6B7280]">{product.slug}</td>

                    <td className="max-w-[320px] px-4 py-4 text-[#6B7280]">
                      <div className="line-clamp-2">{product.description || "-"}</div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="rounded-lg bg-[#2563EB] px-3 py-2 text-xs font-medium text-white"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(product.id)}
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
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E8E5DC] px-6 py-4">
              <div>
                <h2 className="text-xl font-semibold text-[#1F2937]">
                  {form.id ? "Edit Product" : "Add Product"}
                </h2>
                <p className="mt-1 text-sm text-[#6B7280]">
                  Lengkapi detail produk untuk marketplace.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-lg border border-[#E8E5DC] px-3 py-2 text-sm text-[#6B7280]"
              >
                Close
              </button>
            </div>

            <div className="space-y-5 px-6 py-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#374151]">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Contoh: Pepperoni Pizza"
                    className="h-11 w-full rounded-xl border border-[#E8E5DC] px-4 text-sm outline-none focus:border-[#C79A52]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#374151]">
                    Price
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, price: e.target.value }))
                    }
                    placeholder="Contoh: 35000"
                    className="h-11 w-full rounded-xl border border-[#E8E5DC] px-4 text-sm outline-none focus:border-[#C79A52]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#374151]">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="h-11 w-full rounded-xl border border-[#E8E5DC] bg-white px-4 text-sm outline-none focus:border-[#C79A52]"
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
                  <label className="mb-2 block text-sm font-medium text-[#374151]">
                    Badge
                  </label>
                  <input
                    type="text"
                    value={form.badge}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, badge: e.target.value }))
                    }
                    placeholder="Contoh: Best Seller"
                    className="h-11 w-full rounded-xl border border-[#E8E5DC] px-4 text-sm outline-none focus:border-[#C79A52]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-[#374151]">
                    Minimum Order
                  </label>
                  <input
                    type="text"
                    value={form.minOrder}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, minOrder: e.target.value }))
                    }
                    placeholder="Contoh: Minimal 10 box"
                    className="h-11 w-full rounded-xl border border-[#E8E5DC] px-4 text-sm outline-none focus:border-[#C79A52]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-[#374151]">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, description: e.target.value }))
                    }
                    rows={5}
                    placeholder="Tulis deskripsi produk..."
                    className="w-full rounded-xl border border-[#E8E5DC] px-4 py-3 text-sm outline-none focus:border-[#C79A52]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-[#374151]">
                    Slug Preview
                  </label>
                  <div className="rounded-xl border border-dashed border-[#E8E5DC] bg-[#FAFAF8] px-4 py-3 text-sm text-[#6B7280]">
                    {form.name ? slugify(form.name) : "slug-produk-akan-muncul-di-sini"}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-[#374151]">
                    Product Image
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    className="block w-full text-sm text-[#6B7280] file:mr-4 file:rounded-lg file:border-0 file:bg-[#F3F4F6] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#1F2937]"
                  />

                  {preview ? (
                    <div className="mt-4">
                      <div className="relative h-40 w-40 overflow-hidden rounded-2xl border border-[#E8E5DC] bg-[#F9FAFB]">
                        <Image
                          src={preview}
                          alt="Preview"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-[#E8E5DC] px-6 py-4">
              <button
                onClick={closeModal}
                disabled={submitting}
                className="rounded-xl border border-[#E8E5DC] px-4 py-2.5 text-sm font-medium text-[#374151] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-xl bg-[#C79A52] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
              >
                {submitting
                  ? "Saving..."
                  : form.id
                  ? "Update Product"
                  : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}