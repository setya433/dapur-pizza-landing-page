"use client";

import { useEffect, useMemo, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTableToolbar from "@/components/admin/AdminPanelTableToolBar";
import { slugify } from "@/lib/slugify";

type CategoryItem = {
  id: number;
  name: string;
  slug: string;
};

type CategoryFormState = {
  id: number | null;
  name: string;
};

const initialForm: CategoryFormState = {
  id: null,
  name: "",
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [form, setForm] = useState<CategoryFormState>(initialForm);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function mapCategory(item: any): CategoryItem {
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
      await loadCategories();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    initLoad();
  }, []);

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();

    return categories.filter((category) => {
      return (
        !q ||
        category.name.toLowerCase().includes(q) ||
        category.slug.toLowerCase().includes(q)
      );
    });
  }, [categories, search]);

  const resetForm = () => {
    setForm(initialForm);
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

  const handleEdit = (category: CategoryItem) => {
    setForm({
      id: category.id,
      name: category.name,
    });

    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Yakin hapus kategori ini?");
    if (!confirmed) return;

    const res = await fetch("/api/categories", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("DELETE CATEGORY FAILED:", res.status, text);
      alert("Gagal menghapus kategori.");
      return;
    }

    await loadCategories();
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      alert("Nama kategori wajib diisi.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        id: form.id,
        name: form.name,
        slug: slugify(form.name),
      };

      const res = await fetch("/api/categories", {
        method: form.id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("SAVE CATEGORY FAILED:", res.status, text);
        alert("Gagal menyimpan kategori.");
        return;
      }

      await loadCategories();
      closeModal();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menyimpan kategori.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <AdminPageHeader
        title="Categories"
        description="Kelola kategori produk untuk marketplace dan filtering menu."
        action={
          <button
            onClick={openCreateModal}
            className="inline-flex h-11 items-center rounded-xl bg-[#C79A52] px-4 text-sm font-medium text-white transition hover:opacity-90"
          >
            + Add Category
          </button>
        }
      />

      <div className="rounded-2xl border border-[#E8E5DC] bg-white p-4 shadow-sm md:p-6">
        <AdminTableToolbar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search categories by name or slug..."
        />

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8E5DC] text-left text-[#6B7280]">
                <th className="px-4 py-3 font-medium">Category Name</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-8 text-center text-[#6B7280]" colSpan={3}>
                    Loading...
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-[#6B7280]" colSpan={3}>
                    No categories found.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b border-[#F3F4F6] text-[#1F2937] transition hover:bg-[#FAFAF8]"
                  >
                    <td className="px-4 py-4 font-semibold">{category.name}</td>

                    <td className="px-4 py-4 text-[#6B7280]">{category.slug}</td>

                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="rounded-lg bg-[#2563EB] px-3 py-2 text-xs font-medium text-white"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(category.id)}
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
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E8E5DC] px-6 py-4">
              <div>
                <h2 className="text-xl font-semibold text-[#1F2937]">
                  {form.id ? "Edit Category" : "Add Category"}
                </h2>
                <p className="mt-1 text-sm text-[#6B7280]">
                  Tambahkan atau perbarui kategori untuk produk marketplace.
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
              <div>
                <label className="mb-2 block text-sm font-medium text-[#374151]">
                  Category Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Contoh: Pizza"
                  className="h-11 w-full rounded-xl border border-[#E8E5DC] px-4 text-sm outline-none focus:border-[#C79A52]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#374151]">
                  Slug Preview
                </label>
                <div className="rounded-xl border border-dashed border-[#E8E5DC] bg-[#FAFAF8] px-4 py-3 text-sm text-[#6B7280]">
                  {form.name ? slugify(form.name) : "slug-kategori-akan-muncul-di-sini"}
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
                  ? "Update Category"
                  : "Create Category"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}