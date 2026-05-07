"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useCartStore } from "@/Store/useCartStore";
import { formatRupiah, getCartTotal } from "@/lib/utils";

export default function CartPage() {
  const { items, increaseQty, decreaseQty, removeItem, clearCart } = useCartStore();

  const subtotal = getCartTotal(items);
  const discount = 0;
  const deliveryFee = items.length > 0 ? 15000 : 0;
  const total = subtotal - discount + deliveryFee;

  if (!items.length) {
    return (
      <main className="min-h-screen bg-[#f7f1e8] px-4 py-10 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[32px] border border-[#e8dccb] bg-white p-10 text-center shadow-sm">
            <h1 className="text-4xl font-semibold tracking-tight text-[#2f241f]">
              Keranjang kosong
            </h1>
            <p className="mt-3 text-[#7b6a60]">
              Belum ada menu yang kamu tambahkan ke keranjang.
            </p>

            <Link
              href="/menu"
              className="mt-8 inline-flex h-12 items-center rounded-2xl bg-[#c9983a] px-6 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Kembali ke Menu
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f1e8] px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[36px] border border-[#e8dccb] bg-white p-5 shadow-sm md:p-8">
          {/* TOP BAR */}
          <div className="flex flex-col gap-5 border-b border-[#efe6db] pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-[#2f241f]">
                Cart
              </h1>
              <p className="mt-2 text-sm text-[#8a786d]">
                Tinjau pesanan sebelum lanjut ke checkout.
              </p>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <StepItem label="Cart" active />
              <StepDivider />
              <StepItem label="Checkout" />
              <StepDivider />
              <StepItem label="Payment" />
            </div>
          </div>

          {/* CONTENT */}
          <div className="mt-8 grid gap-8 xl:grid-cols-[1.4fr_0.8fr]">
            {/* LEFT */}
            <section>
              <div className="rounded-[28px] border border-[#e9e2d8] bg-[#fffdfa] p-5 md:p-7">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-[#2f241f]">
                      Cart
                      <span className="ml-2 text-lg font-normal text-[#8a786d]">
                        ({items.length} items)
                      </span>
                    </h2>
                  </div>

                  <button
                    onClick={clearCart}
                    className="inline-flex items-center gap-2 text-sm font-medium text-red-500 transition hover:opacity-80"
                  >
                    <Trash2 size={16} />
                    Clear cart
                  </button>
                </div>

                {/* TABLE HEAD */}
                <div className="mb-3 hidden grid-cols-[1.4fr_0.6fr_0.5fr_0.15fr] gap-4 px-3 text-sm text-[#7f7268] md:grid">
                  <p>Product</p>
                  <p>Quantity</p>
                  <p>Price</p>
                  <p></p>
                </div>

                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="grid gap-4 rounded-[24px] border border-[#e8e1d7] bg-white p-4 md:grid-cols-[1.4fr_0.6fr_0.5fr_0.15fr] md:items-center md:p-5"
                    >
                      {/* PRODUCT */}
                      <div className="flex gap-4">
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#f6efe6]">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-xl font-semibold text-[#2f241f]">
                            {item.name}
                          </h3>
                          <p className="mt-1 text-sm text-[#8a786d]">
                            DapurPizza Menu
                          </p>
                          <p className="mt-3 text-sm font-medium text-[#5f5249] md:hidden">
                            {formatRupiah(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>

                      {/* QTY */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => decreaseQty(item.id)}
                          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#ddd3c7] bg-[#faf7f2] text-[#5f5249] transition hover:bg-[#f3ece3]"
                        >
                          <Minus size={18} />
                        </button>

                        <span className="min-w-6 text-center text-lg font-semibold text-[#2f241f]">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => increaseQty(item.id)}
                          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#ddd3c7] bg-[#faf7f2] text-[#5f5249] transition hover:bg-[#f3ece3]"
                        >
                          <Plus size={18} />
                        </button>
                      </div>

                      {/* PRICE */}
                      <div className="hidden text-xl font-semibold text-[#2f241f] md:block">
                        {formatRupiah(item.price * item.quantity)}
                      </div>

                      {/* REMOVE */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 transition hover:opacity-80"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PROMO BANNER */}
              <div className="mt-6 overflow-hidden rounded-[28px] bg-[#2f241f] text-white">
                <div className="grid items-center gap-6 px-6 py-8 md:grid-cols-[1fr_260px] md:px-8">
                  <div>
                    <h3 className="max-w-md text-4xl font-semibold leading-tight">
                      Nikmati hidangan lezat dari DapurPizza
                    </h3>
                    <p className="mt-3 max-w-md text-sm text-white/70">
                      Pesan sekarang dan nikmati promo spesial hari ini.
                    </p>

                    <Link
                      href="/menu"
                      className="mt-6 inline-flex h-12 items-center rounded-2xl bg-[#c9983a] px-6 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                      Lihat Menu
                    </Link>
                  </div>

                  <div className="relative mx-auto h-48 w-full max-w-[260px] overflow-hidden rounded-[24px] bg-[#43352d]">
                    <Image
                      src="/../images/menu-pizza.webp"
                      alt="Promo DapurPizza"
                      fill
                      sizes="260px"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* RIGHT */}
            <aside>
              <div className="rounded-[28px] border border-[#e9e2d8] bg-[#fbf8f3] p-5 md:p-6">
                <h2 className="text-2xl font-semibold text-[#2f241f]">
                  Order Summary
                </h2>

                {/* PROMO */}
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-medium text-[#5f5249]">
                    Promo Code
                  </label>

                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      className="h-12 flex-1 rounded-2xl border border-[#ddd3c7] bg-white px-4 text-sm text-[#2f241f] outline-none placeholder:text-[#a29488] focus:border-[#c9983a]"
                    />
                    <button className="h-12 rounded-2xl bg-[#c9983a] px-6 text-sm font-semibold text-white transition hover:opacity-90">
                      Apply
                    </button>
                  </div>
                </div>

                {/* SUMMARY */}
                <div className="mt-8 space-y-5 border-t border-[#e8dfd2] pt-6">
                  <SummaryRow label="Subtotal" value={formatRupiah(subtotal)} />
                  <SummaryRow
                    label="Discount"
                    value={`- ${formatRupiah(discount)}`}
                    valueClassName="text-red-500"
                  />
                  <SummaryRow label="Delivery Fee" value={formatRupiah(deliveryFee)} />
                </div>

                <div className="mt-6 border-t border-[#e8dfd2] pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-semibold text-[#2f241f]">
                      Total
                    </span>
                    <span className="text-4xl font-semibold tracking-tight text-[#c9983a]">
                      {formatRupiah(total)}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#c9983a] text-base font-semibold text-white transition hover:opacity-90"
                >
                  Continue to Checkout
                  <ArrowRight size={18} />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}

function StepItem({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-5 w-5 rounded-full border ${
          active
            ? "border-[#c9983a] bg-[#c9983a]"
            : "border-[#d9cfc2] bg-white"
        }`}
      />
      <span
        className={`text-sm ${
          active ? "font-medium text-[#2f241f]" : "text-[#9a8c81]"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function StepDivider() {
  return <span className="text-[#b3a59a]">›</span>;
}

function SummaryRow({
  label,
  value,
  valueClassName = "text-[#2f241f]",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-lg text-[#5f5249]">{label}</span>
      <span className={`text-xl font-medium ${valueClassName}`}>{value}</span>
    </div>
  );
}
