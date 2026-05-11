"use client";

import Swal from "sweetalert2";
import { mapCartToOrder } from "@/lib/utils";
import { createOrder} from "@/lib/orderApi";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useCartStore } from "@/Store/useCartStore";
import {
  buildWhatsAppMessage,
  formatRupiah,
  getCartTotal,
  type CheckoutFormValues,
} from "@/lib/utils";

const WHATSAPP_NUMBER = "6285157557523";

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const orderCode =
      "ORD-" +
      new Date().toISOString().slice(0, 10).replace(/-/g, "") +
      "-" +
      Math.floor(Math.random() * 1000);

  const [form, setForm] = useState<CheckoutFormValues>({
    customerName: "",
    phone: "",
    eventDate: "",
    address: "",
    notes: "",
  });

  const subtotal = useMemo(() => getCartTotal(items), [items]);
  const discount = 0;
  const deliveryFee = items.length > 0 ? 15000 : 0;
  const total = subtotal - discount + deliveryFee;

  const handleSubmit = async () => {
  try {
    const orderData = {
      orderCode: orderCode,

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

    // 🔥 AWESOME ALERT
    const result = await Swal.fire({
      title: "Pesanan Berhasil!",
      text: "Pesanan kamu sudah masuk sistem. Jangan lupa kirim ke WhatsApp untuk konfirmasi ya!",
      icon: "success",
      confirmButtonText: "Kirim ke WhatsApp",
      confirmButtonColor: "#25D366",
      // cancelButtonText: "Nanti saja",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      window.open(whatsappUrl, "_blank");
    }

    clearCart();
  } catch (error: any) {
    console.error(error.response?.data || error.message);

    Swal.fire({
      title: "Gagal!",
      text: "Terjadi kesalahan saat mengirim pesanan",
      icon: "error",
      confirmButtonColor: "#ff6b2c",
    });
  }
};

  const isFormValid =
    form.customerName.trim() &&
    form.phone.trim() &&
    form.eventDate.trim() &&
    form.address.trim();

  const whatsappUrl = useMemo(() => {
    const message = buildWhatsAppMessage(items, form);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }, [items, form]);

  const handleChange = (key: keyof CheckoutFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  if (!items.length) {
    return (
      <main className="min-h-screen bg-[#f7f1e8] px-4 py-10 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[32px] border border-[#e8dccb] bg-white p-10 text-center shadow-sm">
            <h1 className="text-4xl font-semibold tracking-tight text-[#2f241f]">
              Checkout kosong
            </h1>
            <p className="mt-3 text-[#7b6a60]">
              Keranjang kamu masih kosong. Tambahkan menu dulu sebelum lanjut checkout.
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
                Checkout
              </h1>
              <p className="mt-2 text-sm text-[#8a786d]">
                Lengkapi detail pemesanan untuk melanjutkan konfirmasi order.
              </p>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <StepItem label="Cart" done />
              <StepDivider />
              <StepItem label="Checkout" active />
              <StepDivider />
              <StepItem label="Payment" />
            </div>
          </div>

          {/* CONTENT */}
          <div className="mt-8 grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
            {/* LEFT FORM */}
            <section>
              <div className="rounded-[28px] border border-[#e9e2d8] bg-[#fffdfa] p-5 md:p-7">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-[#2f241f]">
                    Detail Pemesanan
                  </h2>
                  <p className="mt-2 text-sm text-[#8a786d]">
                    Isi data customer dan kebutuhan pengiriman acara.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <FormField label="Nama Pemesan">
                    <input
                      type="text"
                      value={form.customerName}
                      onChange={(e) => handleChange("customerName", e.target.value)}
                      placeholder="Masukkan nama lengkap"
                      className="h-12 w-full rounded-2xl border border-[#ddd3c7] bg-white px-4 text-sm text-[#2f241f] outline-none placeholder:text-[#a29488] focus:border-[#c9983a]"
                    />
                  </FormField>

                  <FormField label="Nomor WhatsApp">
                    <input
                      type="text"
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      className="h-12 w-full rounded-2xl border border-[#ddd3c7] bg-white px-4 text-sm text-[#2f241f] outline-none placeholder:text-[#a29488] focus:border-[#c9983a]"
                    />
                  </FormField>

                  <FormField label="Tanggal Acara / Pengiriman">
                    <input
                      type="date"
                      value={form.eventDate}
                      onChange={(e) => handleChange("eventDate", e.target.value)}
                      className="h-12 w-full rounded-2xl border border-[#ddd3c7] bg-white px-4 text-sm text-[#2f241f] outline-none focus:border-[#c9983a]"
                    />
                  </FormField>

                  <FormField label="Promo Code">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Enter promo code"
                        className="h-12 flex-1 rounded-2xl border border-[#ddd3c7] bg-white px-4 text-sm text-[#2f241f] outline-none placeholder:text-[#a29488] focus:border-[#c9983a]"
                      />
                      <button
                        type="button"
                        className="h-12 rounded-2xl bg-[#c9983a] px-5 text-sm font-semibold text-white transition hover:opacity-90"
                      >
                        Apply
                      </button>
                    </div>
                  </FormField>

                  <div className="md:col-span-2">
                    <FormField label="Alamat / Lokasi Acara">
                      <textarea
                        value={form.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                        placeholder="Masukkan alamat lengkap pengiriman / lokasi acara"
                        rows={4}
                        className="w-full rounded-2xl border border-[#ddd3c7] bg-white px-4 py-3 text-sm text-[#2f241f] outline-none placeholder:text-[#a29488] focus:border-[#c9983a]"
                      />
                    </FormField>
                  </div>

                  <div className="md:col-span-2">
                    <FormField label="Catatan Tambahan">
                      <textarea
                        value={form.notes}
                        onChange={(e) => handleChange("notes", e.target.value)}
                        placeholder="Contoh: tanpa sambal, kirim sebelum jam 10 pagi, dsb."
                        rows={4}
                        className="w-full rounded-2xl border border-[#ddd3c7] bg-white px-4 py-3 text-sm text-[#2f241f] outline-none placeholder:text-[#a29488] focus:border-[#c9983a]"
                      />
                    </FormField>
                  </div>
                </div>
              </div>

              {/* INFO BANNER */}
              <div className="mt-6 overflow-hidden rounded-[28px] bg-[#2f241f] text-white">
                <div className="grid items-center gap-6 px-6 py-8 md:grid-cols-[1fr_240px] md:px-8">
                  <div>
                    <h3 className="max-w-md text-4xl font-semibold leading-tight">
                      Pastikan detail pesanan sudah benar
                    </h3>
                    <p className="mt-3 max-w-md text-sm text-white/70">
                      Admin DapurPizza akan menghubungi kamu untuk konfirmasi ketersediaan, ongkir, dan jadwal pengiriman.
                    </p>

                    <Link
                      href="/cart"
                      className="mt-6 inline-flex h-12 items-center rounded-2xl bg-[#c9983a] px-6 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                      Kembali ke Cart
                    </Link>
                  </div>

                  <div className="relative mx-auto h-44 w-full max-w-[240px] overflow-hidden rounded-[24px] bg-[#43352d]">
                    <Image
                      src="/images/menu-pizza.webp"
                      alt="Checkout DapurPizza"
                      fill
                      sizes="240px"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* RIGHT SUMMARY */}
            <aside>
              <div className="rounded-[28px] border border-[#e9e2d8] bg-[#fbf8f3] p-5 md:p-6">
                <h2 className="text-2xl font-semibold text-[#2f241f]">
                  Order Summary
                </h2>

                <div className="mt-6 space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 rounded-[22px] border border-[#e8e1d7] bg-white p-4"
                    >
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#f6efe6]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-lg font-semibold text-[#2f241f]">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-sm text-[#8a786d]">
                          Qty: {item.quantity}
                        </p>
                        <p className="mt-3 text-lg font-semibold text-[#2f241f]">
                          {formatRupiah(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

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

                <a
                  // href={isFormValid ? whatsappUrl : "#"}
                  onClick={handleSubmit}
                  target="_blank"
                  rel="noreferrer"
                  className={[
                    "mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-base font-semibold text-white transition",
                    isFormValid
                      ? "bg-[#c9983a] hover:opacity-90"
                      : "pointer-events-none bg-[#d8c6a0] opacity-60",
                  ].join(" ")}
                >
                  Continue to Payment
                  <ArrowRight size={18} />
                </a>

                <button
                  onClick={clearCart}
                  className="mt-4 flex h-12 w-full items-center justify-center rounded-2xl border border-[#ddd3c7] bg-white text-sm font-semibold text-[#5f5249] transition hover:bg-[#f8f2ea]"
                >
                  Clear Cart
                </button>
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
  done = false,
}: {
  label: string;
  active?: boolean;
  done?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-5 w-5 rounded-full border ${
          active || done
            ? "border-[#c9983a] bg-[#c9983a]"
            : "border-[#d9cfc2] bg-white"
        }`}
      />
      <span
        className={`text-sm ${
          active || done ? "font-medium text-[#2f241f]" : "text-[#9a8c81]"
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

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#5f5249]">{label}</span>
      {children}
    </label>
  );
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

