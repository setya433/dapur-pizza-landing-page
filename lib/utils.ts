import type { CartItem } from "@/Store/useCartStore";

export type CheckoutFormValues = {
  customerName: string;
  phone: string;
  eventDate: string;
  address: string;
  notes: string;
};

export function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getCartTotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function mapCartToOrder(items: any[]) {
  return items.map((item) => ({
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    subtotal: item.price * item.quantity,
  }));
}

export function buildWhatsAppMessage(
  items: CartItem[],
  form?: Partial<CheckoutFormValues>
) {
  if (!items.length) return "";

  const lines = items.map(
    (item, index) =>
      `${index + 1}. ${item.name} x${item.quantity} = ${formatRupiah(
        item.price * item.quantity
      )}`
  );

  const total = getCartTotal(items);

  return [
    "Halo DapurPizza, saya ingin memesan:",
    "",
    ...lines,
    "",
    `Total sementara: ${formatRupiah(total)}`,
    "",
    "Data Pemesan:",
    `Nama: ${form?.customerName || "-"}`,
    `No. HP: ${form?.phone || "-"}`,
    `Tanggal Acara: ${form?.eventDate || "-"}`,
    `Alamat / Lokasi: ${form?.address || "-"}`,
    `Catatan: ${form?.notes || "-"}`,
    "",
    "Mohon info ketersediaan, ongkir, dan jadwal pengiriman ya.",
  ].join("\n");
}