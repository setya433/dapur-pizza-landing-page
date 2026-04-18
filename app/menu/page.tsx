// "use client";

// import { useMemo, useState } from "react";
// import CategoryFilter from "@/marketplace/CategoryFilter";
// import ProductGrid from "@/marketplace/ProductGrid";
// import CartDrawer from "@/marketplace/CartDrawer";
// import CartButton from "@/marketplace/CartButton";
// import SearchBar from "@/marketplace/SearchBar";
// import { categories, products, type ProductCategory } from "@/lib/Product";

// export default function MenuPage() {
//   const [activeCategory, setActiveCategory] = useState<ProductCategory>("all");
//   const [searchQuery, setSearchQuery] = useState("");

//   const filteredProducts = useMemo(() => {
//     const normalizedQuery = searchQuery.trim().toLowerCase();

//     return products.filter((product) => {
//       const matchesCategory =
//         activeCategory === "all" || product.category === activeCategory;

//       const matchesSearch =
//         !normalizedQuery ||
//         product.name.toLowerCase().includes(normalizedQuery) ||
//         product.description.toLowerCase().includes(normalizedQuery);

//       return matchesCategory && matchesSearch;
//     });
//   }, [activeCategory, searchQuery]);

//   return (
//     <main className="min-h-screen bg-[#f7f1e8] px-4 py-10 text-[#3b2418] md:px-6">
//       <div className="mx-auto w-full max-w-[1280px]">
//         <div className="mb-10 max-w-3xl">
//           <span className="rounded-full bg-[#ffd42a] px-3 py-1 text-xs font-bold uppercase">
//             Marketplace
//           </span>

//           <h1 className="mt-4 font-heading text-4xl uppercase leading-none md:text-6xl">
//             Pilih menu favorit untuk acara Anda
//           </h1>

//           <p className="mt-4 text-sm leading-7 text-[#3b2418]/80 md:text-base">
//             Pizza, nasi box, snack box, dan paket acara untuk meeting, keluarga,
//             sekolah, dan berbagai kebutuhan konsumsi.
//           </p>
//         </div>

//         <div className="mb-6">
//           <SearchBar value={searchQuery} onChange={setSearchQuery} />
//         </div>

//         <div className="mb-8">
//           <CategoryFilter
//             categories={categories}
//             activeCategory={activeCategory}
//             onChange={setActiveCategory}
//           />
//         </div>

//         <ProductGrid products={filteredProducts} />
//       </div>

//       <CartButton />
//       <CartDrawer />
//     </main>
//   );
// }


import { fetchCategories, fetchProducts } from "@/lib/api";
import { mapCategory, mapProduct } from "@/lib/mapper";
import MenuClient from "@/marketplace/MenuClient";

export default async function MenuPage() {
  const [categoriesData, productsData] = await Promise.all([
    fetchCategories(),
    fetchProducts(),
  ]);

  const categories = categoriesData.map(mapCategory);
  const products = productsData.map(mapProduct);

  return (
    <main className="min-h-screen bg-[#f7f1e8] px-4 py-10 text-[#3b2418] md:px-6">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="mb-10 max-w-3xl">
          <span className="rounded-full bg-[#ffd42a] px-3 py-1 text-xs font-bold uppercase">
            Marketplace
          </span>

          <h1 className="mt-4 font-heading text-4xl uppercase leading-none md:text-6xl">
            Pilih menu favorit untuk acara Anda
          </h1>

          <p className="mt-4 text-sm leading-7 text-[#3b2418]/80 md:text-base">
            Pizza, nasi box, snack box, dan paket acara untuk meeting, keluarga,
            sekolah, dan berbagai kebutuhan konsumsi.
          </p>
        </div>

        <MenuClient categories={categories} products={products} />
      </div>
    </main>
  );
}