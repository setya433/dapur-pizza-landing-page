"use client";

import { useCartStore } from "@/Store/useCartStore";

type AddToCartButtonProps = {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  variant?: "default" | "small";
};


export default function AddToCartButton({
  product,
  variant = "default",
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);

  const hasHydrated = useCartStore((state) => state.hasHydrated);

if (!hasHydrated) return null;

  const className =
    variant === "small"
      ? "rounded-xl border-2 border-[#3b2418] bg-[#ff6b2c] px-4 py-2 text-sm font-bold uppercase text-white shadow-[4px_4px_0_#3b2418] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
      : "rounded-xl border-2 border-[#3b2418] bg-[#ff6b2c] px-6 py-3 text-sm font-bold uppercase text-white shadow-[5px_5px_0_#3b2418] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none";

  return (
    <button
      type="button"
      onClick={() => {addItem(product)
        console.log("CLICKED", product);
      }}
      className={className}
    >
      Tambah ke Cart
      
    </button>
  );
}