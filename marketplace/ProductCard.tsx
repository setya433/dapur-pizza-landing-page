"use client";

import Image from "next/image";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import type { Product } from "@/lib/Product";
import AddToCartButton from "@/marketplace/AddToCartButton";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group mt-5 overflow-hidden rounded-[28px] border border-[#eadfce] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* IMAGE */}
      <Link href={`/menu/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f6efe6]">
          <Image
            src={product.image}
            alt={product.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* subtle overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
        </div>
      </Link>

      {/* CONTENT */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            {product.badge && (
              <span className="inline-flex rounded-full bg-[#fff1c7] px-3 py-1 text-[11px] font-semibold text-[#8a6500]">
                {product.badge}
              </span>
            )}

            <Link href={`/menu/${product.slug}`} className="block">
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-[#2f241f] transition hover:opacity-80">
                {product.name}
              </h3>
            </Link>
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#7b6a60]">
          {product.description}
        </p>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#a08f83]">
              Mulai dari
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-[#c9983a]">
              {formatRupiah(product.price)}
            </p>
          </div>

          <AddToCartButton
            variant="small"
            product={{
              id: String(product.id),
              name: product.name,
              price: product.price,
              image: product.image,
            }}
          />
        </div>
      </div>
    </article>
  );
}
