"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/Store/useCartStore";
import {
  buildWhatsAppMessage,
  formatRupiah,
  getCartTotal,
  type CheckoutFormValues,
} from "@/lib/utils";
import { createOrder } from "@/lib/orderApi";
import { mapCartToOrder } from "@/lib/utils";

const WHATSAPP_NUMBER = "6285157557523";



export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  console.log("CART ITEMS:", items);
  const clearCart = useCartStore((state) => state.clearCart);

  const [form, setForm] = useState<CheckoutFormValues>({
    customerName: "",
    phone: "",
    eventDate: "",
    address: "",
    notes: "",
  });
  const isFormValid =
  form.customerName.trim() &&
  form.phone.trim() &&
  form.eventDate.trim() &&
  form.address.trim();

  const total = useMemo(() => getCartTotal(items), [items]);

  const whatsappUrl = useMemo(() => {
    const message = buildWhatsAppMessage(items, form);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }, [items, form]);

  const orderCode =
      "ORD-" +
      new Date().toISOString().slice(0, 10).replace(/-/g, "") +
      "-" +
      Math.floor(Math.random() * 1000);

  const handleChange = (
    key: keyof CheckoutFormValues,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  

  const handleSubmit = async () => {
  try {
    // ✅ taruh di sini
    

    const orderData = {
      orderCode: orderCode, // ← masukkan ke data

      customerName: form.customerName,
      phone: form.phone,
      eventDate: form.eventDate,
      address: form.address,
      note: form.notes,

      items: mapCartToOrder(items),
      total: total,
      statusOrder: "pending",
    };

    console.log("ORDER DATA:", orderData);

    await createOrder(orderData);

    alert("Pesanan berhasil dikirim!");

    clearCart();
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    alert("Gagal mengirim pesanan");
    
  }
};

  if (!items.length) {
    return (
      <main className="min-h-screen bg-[#f7f1e8] px-4 py-10 text-[#3b2418] md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-heading text-4xl uppercase md:text-6xl">
            Checkout
          </h1>
          <p className="mt-4 text-sm leading-7 text-[#3b2418]/80 md:text-base">
            Keranjang kamu masih kosong. Pilih menu dulu sebelum lanjut checkout.
          </p>

          <Link
            href="/menu"
            className="mt-6 inline-block rounded-xl border-2 border-[#3b2418] bg-[#ffd42a] px-6 py-3 text-sm font-bold uppercase text-[#3b2418] shadow-[5px_5px_0_#3b2418]"
          >
            Kembali ke Menu
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f1e8] px-4 py-10 text-[#3b2418] md:px-6">
      <div className="mx-auto grid max-w-[1280px] gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section>
          <span className="rounded-full bg-[#ffd42a] px-3 py-1 text-xs font-bold uppercase">
            Checkout
          </span>

          <h1 className="mt-4 font-heading text-4xl uppercase leading-none md:text-6xl">
            Lengkapi data pemesanan
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#3b2418]/80 md:text-base">
            Isi data di bawah ini lalu kirim pesanan ke WhatsApp untuk konfirmasi
            ketersediaan, ongkir, dan jadwal pengiriman.
          </p>

          <div className="mt-8 space-y-5 rounded-[28px] border-4 border-[#3b2418] bg-white p-5 sm:p-6">
            <div>
              <label className="mb-2 block text-sm font-bold uppercase">
                Nama Pemesan
              </label>
              <input
                type="text"
                value={form.customerName}
                onChange={(e) => handleChange("customerName", e.target.value)}
                placeholder="Masukkan nama lengkap"
                className="w-full rounded-2xl border-2 border-[#3b2418] px-4 py-3 text-sm outline-none focus:border-[#ff6b2c]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold uppercase">
                Nomor WhatsApp
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="08xxxxxxxxxx"
                className="w-full rounded-2xl border-2 border-[#3b2418] px-4 py-3 text-sm outline-none focus:border-[#ff6b2c]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold uppercase">
                Tanggal Acara / Pengiriman
              </label>
              <input
                type="date"
                value={form.eventDate}
                onChange={(e) => handleChange("eventDate", e.target.value)}
                className="w-full rounded-2xl border-2 border-[#3b2418] px-4 py-3 text-sm outline-none focus:border-[#ff6b2c]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold uppercase">
                Alamat / Lokasi Acara
              </label>
              <textarea
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Masukkan alamat lengkap"
                rows={4}
                className="w-full rounded-2xl border-2 border-[#3b2418] px-4 py-3 text-sm outline-none focus:border-[#ff6b2c]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold uppercase">
                Catatan Tambahan
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Contoh: tanpa sambal, kirim sebelum jam 10, dll"
                rows={4}
                className="w-full rounded-2xl border-2 border-[#3b2418] px-4 py-3 text-sm outline-none focus:border-[#ff6b2c]"
              />
            </div>

            <div className="flex flex-wrap gap-3">
             {/* <a
                href={isFormValid ? whatsappUrl : "#"}
                target="_blank"
                rel="noreferrer"
                className={[
                  "rounded-xl border-2 border-[#3b2418] px-6 py-3 text-sm font-bold uppercase shadow-[5px_5px_0_#3b2418]",
                  isFormValid
                    ? "bg-[#25D366] text-white"
                    : "pointer-events-none bg-gray-300 text-gray-500 shadow-none",
                ].join(" ")}
              >
                Kirim ke WhatsApp
              </a> */}

              <button
                onClick={handleSubmit}
                className="rounded-xl border-2 border-[#3b2418] bg-[#ff6b2c] px-6 py-3 text-sm font-bold uppercase text-white shadow-[5px_5px_0_#3b2418]"
              >
                Kirim Pesanan
              </button>

              <button
                type="button"
                onClick={clearCart}
                className="rounded-xl border-2 border-[#3b2418] bg-[#ffd42a] px-6 py-3 text-sm font-bold uppercase text-[#3b2418]"
              >
                Kosongkan Cart
              </button>
            </div>
          </div>
        </section>

        <aside>
          <div className="rounded-[28px] border-4 border-[#3b2418] bg-white p-5 sm:p-6">
            <h2 className="font-heading text-3xl uppercase">Ringkasan Order</h2>

            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-[20px] border-2 border-[#3b2418] bg-[#fff8ef] p-4"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#f7f1e8]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  

                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="mt-1 text-sm text-[#3b2418]/70">
                      Qty: {item.quantity}
                    </p>
                    <p className="mt-2 text-sm font-semibold">
                      {formatRupiah(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t-2 border-dashed border-[#3b2418] pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold uppercase text-[#3b2418]/70">
                  Total Sementara
                </span>
                <span className="text-xl font-bold">{formatRupiah(total)}</span>
              </div>

              <p className="mt-3 text-xs leading-6 text-[#3b2418]/65">
                Total ini belum termasuk ongkir, penyesuaian custom menu, atau
                biaya tambahan lainnya jika ada.
              </p>
            </div>

            <Link
              href="/menu"
              className="mt-6 inline-block text-sm font-bold uppercase underline underline-offset-4"
            >
              + Tambah Menu Lain
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}