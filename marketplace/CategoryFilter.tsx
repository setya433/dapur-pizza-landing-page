"use client";

import type { ProductCategory } from "@/lib/Product";

type Category = {
  label: string;
  value: ProductCategory;
};

type CategoryFilterProps = {
  categories: Category[];
  activeCategory: ProductCategory;
  onChange: (value: ProductCategory) => void;
};

export default function CategoryFilter({
  categories,
  activeCategory,
  onChange,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => {
        const isActive = activeCategory === category.value;

        return (
          <button
            key={category.value}
            type="button"
            onClick={() => onChange(category.value)}
            className={[
              "rounded-full border-2 px-4 py-2 text-sm font-bold uppercase transition",
              isActive
                ? "border-[#3b2418] bg-[#ff6b2c] text-white"
                : "border-[#3b2418] bg-white text-[#3b2418]",
            ].join(" ")}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}