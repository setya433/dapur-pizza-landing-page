"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/Store/useCartStore";
import { formatRupiah, getCartTotal } from "@/lib/utils";

export default function CartPage() {
  const {
    items,
    increaseQty,
    decreaseQty,
    removeItem,
    clearCart,
  } = useCartStore();

  const total = getCartTotal(items);

  if (!items.length) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f7f1e8]">
        <div className="text-center">
          <h1 className="text-3xl font-bold uppercase">
            Keranjang kosong
          </h1>

          <Link
            href="/menu"
            className="mt-4 inline-block bg-[#ff6b2c] px-5 py-3 text-white rounded"
          >
            Kembali ke Menu
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f1e8] px-4 py-10 md:px-6">
      <div className="mx-auto max-w-[1100px]">
        <h1 className="font-heading text-4xl uppercase mb-8">
          Keranjang
        </h1>

        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-2xl border-4 border-[#3b2418] bg-white p-4"
            >
              {/* IMAGE */}
              <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-[#f7f1e8]">
               <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="80px"
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
              </div>

              {/* CONTENT */}
              <div className="flex-1">
                <h2 className="font-bold">{item.name}</h2>

                <p className="text-sm text-gray-600">
                  {formatRupiah(item.price)}
                </p>

                {/* QTY CONTROL */}
                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="border px-2 py-1 rounded"
                  >
                    <Minus size={16} />
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() => increaseQty(item.id)}
                    className="border px-2 py-1 rounded"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* ACTION */}
              <div className="flex flex-col justify-between items-end">
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500"
                >
                  <Trash2 size={18} />
                </button>

                <p className="font-bold">
                  {formatRupiah(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="mt-8 rounded-2xl border-4 border-[#3b2418] bg-white p-5">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{formatRupiah(total)}</span>
          </div>

          <div className="mt-4 flex gap-3 flex-wrap">
            <Link
              href="/checkout"
              className="bg-[#ff6b2c] text-white px-6 py-3 rounded-xl font-bold"
            >
              Checkout
            </Link>

            <button
              onClick={clearCart}
              className="bg-[#ffd42a] px-6 py-3 rounded-xl font-bold"
            >
              Kosongkan
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}