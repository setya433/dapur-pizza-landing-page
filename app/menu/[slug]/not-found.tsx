import Link from "next/link";

export default function ProductNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f1e8] px-4 text-[#3b2418]">
      <div className="max-w-xl text-center">
        <h1 className="font-heading text-4xl uppercase md:text-6xl">
          Produk tidak ditemukan
        </h1>
        <p className="mt-4 text-sm leading-7 text-[#3b2418]/80 md:text-base">
          Menu yang kamu cari belum tersedia atau link-nya berubah.
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