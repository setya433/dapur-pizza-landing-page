import ProductCard from "@/marketplace/ProductCard";
import type { Product } from "@/lib/Product";

type ProductGridProps = {
  products: Product[];
};

export default function ProductGrid({ products }: ProductGridProps) {
  if (!products.length) {
    return (
      <div className="rounded-[24px] border-4 border-dashed border-[#3b2418] bg-white p-8 text-center">
        <p className="text-sm font-medium text-[#3b2418]/75">
          Belum ada menu di kategori ini.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}