import Image from "next/image";

export default function Hero() {
  return (
    <section className="px-4 py-4 sm:py-6 md:px-6">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[24px] border-4 border-[#3b2418] bg-white lg:grid-cols-2">
        <div className="relative min-h-[240px] sm:min-h-[320px] lg:min-h-[560px]">
          <Image
            src="/../images/hero-food.webp"
            alt="Menu catering DapurPizza berupa pizza, nasi box, dan snack box"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col justify-center bg-[#8fc8f4] p-5 sm:p-8 md:p-10 lg:p-12">
          {/* <span className="mb-4 inline-block w-fit rounded-full border-2 border-[#3b2418] bg-[#fff3d0] px-3 py-2 text-[10px] font-bold uppercase sm:px-4 sm:text-xs">
            Catering untuk berbagai acara
          </span> */}

          <h1 className="font-heading text-4xl uppercase leading-[0.95] sm:text-5xl md:text-6xl xl:text-7xl">
            Pizza, Nasi Box & Snack Lezat untuk Acara Anda
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#3b2418]/85 sm:text-base sm:leading-7 md:text-lg">
            DapurPizza melayani pesanan pizza, nasi box, snack box, dan paket
            catering untuk meeting kantor, acara sekolah, ulang tahun, arisan,
            hingga event keluarga.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <a
              href="/menu"
              className="rounded-xl border-2 border-[#3b2418] bg-[#ff6b2c] px-6 py-3 text-center text-sm font-bold uppercase text-white shadow-[5px_5px_0_#3b2418] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
            >
              Pesan Sekarang
            </a>
            <a
              href="/#menu"
              className="rounded-xl border-2 border-[#3b2418] bg-white px-6 py-3 text-center text-sm font-bold uppercase shadow-[5px_5px_0_#3b2418] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
            >
              Lihat Menu
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
