"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/Store/useCartStore";

export default function CartButton() {
  const items = useCartStore((state) => state.items);
  console.log("CART ITEMS:", items);
  const openCart = useCartStore((state) => state.openCart);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <button
      type="button"
      onClick={openCart}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full border-2 border-[#3b2418] bg-[#ffd42a] px-4 py-3 font-bold uppercase text-[#3b2418] shadow-[5px_5px_0_#3b2418]"
    >
      <ShoppingBag size={18} />
      <span>Cart</span>
      <span className="rounded-full bg-[#ff6b2c] px-2 py-1 text-xs text-white">
        {totalItems}
      </span>
    </button>
  );
}