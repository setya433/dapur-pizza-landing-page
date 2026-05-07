"use client";

import { useMemo, useState } from "react";
import CategoryFilter from "@/marketplace/CategoryFilter";
import ProductGrid from "@/marketplace/ProductGrid";
import SearchBar from "@/marketplace/SearchBar";
import CartButton from "@/marketplace/CartButton";
import CartDrawer from "@/marketplace/CartDrawer";

type Category = {
  id: number;
  name: string;
  slug: string;
};

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  description: string;
  badge?: string;
  minOrder?: string | number;
  image: string;
  alt: string;
  category: {
    id: number;
    name: string;
    slug: string;
  } | null;
};

type MenuClientProps = {
  categories: Category[];
  products: Product[];
};

export default function MenuClient({
  categories,
  products,
}: MenuClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categoryOptions = [
    { label: "Semua", value: "all" },
    ...categories.map((category) => ({
      label: category.name,
      value: category.slug,
    })),
  ];

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "all" ||
        product.category?.slug === activeCategory;

      const matchesSearch =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.description?.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  return (
    <>
      <div className="mb-6">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="mb-8">
        <CategoryFilter
          categories={categoryOptions}
          activeCategory={activeCategory}
          onChange={setActiveCategory}
        />
      </div>

      <ProductGrid products={filteredProducts} />

      <CartButton />
      <CartDrawer />
    </>
  );
}
