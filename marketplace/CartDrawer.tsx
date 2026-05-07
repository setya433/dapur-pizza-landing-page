"use client";

import Image from "next/image";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/Store/useCartStore";
import { buildWhatsAppMessage, formatRupiah, getCartTotal } from "@/lib/utils";

const WHATSAPP_NUMBER = "6285157557523";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    increaseQty,
    decreaseQty,
    removeItem,
    clearCart,
  } = useCartStore();

  console.log("IMAGE DRAWER URL:", items.map((item) => item.image));

  const total = getCartTotal(items);
  const message = buildWhatsAppMessage(items);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Tutup cart"
          onClick={closeCart}
          className="fixed inset-0 z-40 bg-black/40"
        />
      )}

      <aside
        className={[
          "fixed right-0 top-0 z-50 h-screen w-full max-w-md border-l-4 border-[#3b2418] bg-[#fff8ef] shadow-2xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b-4 border-[#3b2418] px-5 py-4">
            <div>
              <p className="text-xs font-bold uppercase text-[#3b2418]/60">
                Ringkasan Pesanan
              </p>
              <h2 className="font-heading text-3xl uppercase text-[#3b2418]">
                Cart
              </h2>
            </div>

            <button
              type="button"
              onClick={closeCart}
              className="rounded-xl border-2 border-[#3b2418] bg-white p-2"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            {items.length === 0 ? (
              <div className="rounded-[20px] border-2 border-dashed border-[#3b2418] bg-white p-6 text-center">
                <p className="text-sm text-[#3b2418]/75">
                  Keranjang masih kosong.
                </p>
              </div>
            ) : (
              items.map((item) => (
                
                <div
                  key={item.id}
                  className="rounded-[20px] border-2 border-[#3b2418] bg-white p-4"
                >
                  <div className="flex gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#f7f1e8]">
                     <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* <div className="relative aspect-[4/3] w-full overflow-hidden">
                                      <Image
                                        src={item.image}
                                        alt={item.alt}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                      />
                                    </div> */}

                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-[#3b2418]">{item.name}</h3>
                      <p className="mt-1 text-sm text-[#3b2418]/70">
                        {formatRupiah(item.price)}
                      </p>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => decreaseQty(item.id)}
                            className="rounded-lg border-2 border-[#3b2418] bg-[#f7f1e8] p-1"
                          >
                            <Minus size={16} />
                          </button>

                          <span className="min-w-6 text-center text-sm font-bold">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => increaseQty(item.id)}
                            className="rounded-lg border-2 border-[#3b2418] bg-[#f7f1e8] p-1"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="rounded-lg border-2 border-[#3b2418] bg-white p-2 text-[#c0392b]"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t-4 border-[#3b2418] bg-white px-5 py-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold uppercase text-[#3b2418]/70">
                Total
              </span>
              <span className="text-xl font-bold text-[#3b2418]">
                {formatRupiah(total)}
              </span>
            </div>

            <div className="space-y-3">
                    <a
                        href={items.length ? "/cart" : "#"}
                        className={[
                        "block rounded-xl border-2 border-[#3b2418] px-4 py-3 text-center text-sm font-bold uppercase shadow-[4px_4px_0_#3b2418]",
                        items.length
                            ? "bg-[#ff6b2c] text-white"
                            : "pointer-events-none bg-gray-300 text-gray-500 shadow-none",
                        ].join(" ")}
                    >
                        Lanjut Checkout
                    </a>

                    {/* <a
                        href={items.length ? whatsappUrl : "#"}
                        target="_blank"
                        rel="noreferrer"
                        className={[
                        "block rounded-xl border-2 border-[#3b2418] px-4 py-3 text-center text-sm font-bold uppercase shadow-[4px_4px_0_#3b2418]",
                        items.length
                            ? "bg-[#25D366] text-white"
                            : "pointer-events-none bg-gray-300 text-gray-500 shadow-none",
                        ].join(" ")}
                    >
                        Checkout via WhatsApp
                    </a> */}

                    <button
                        type="button"
                        onClick={clearCart}
                        className="w-full rounded-xl border-2 border-[#3b2418] bg-[#ffd42a] px-4 py-3 text-sm font-bold uppercase text-[#3b2418]"
                    >
                        Kosongkan Cart
                    </button>
                    </div>
          </div>
        </div>
      </aside>
    </>
  );
}
