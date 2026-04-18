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
    <article className="mt-5 group overflow-hidden rounded-[24px] border-4 border-[#3b2418] bg-white">
      <Link href={`/menu/${product.slug}`}>
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f7f1e8]">
          <Image
              src={product.image}
              alt={product.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
              unoptimized
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />  
        </div>
      </Link>

      <div className="p-5">
        {product.badge && (
          <span className="rounded-full bg-[#cfe96a] px-3 py-1 text-[10px] font-bold uppercase text-[#3b2418]">
            {product.badge}
          </span>
        )}

        <Link href={`/menu/${product.slug}`}>
          <h3 className="mt-3 font-heading text-2xl uppercase hover:opacity-80">
            {product.name}
          </h3>
        </Link>

        <p className="mt-2 text-sm leading-6 text-[#3b2418]/75">
          {product.description}
        </p>

        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase text-[#3b2418]/60">Mulai dari</p>
            <p className="text-xl font-bold">{formatRupiah(product.price)}</p>
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