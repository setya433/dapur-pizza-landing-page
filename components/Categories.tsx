import Image from "next/image";
import { categories } from "@/lib/data";

export default function Categories() {
  return (
    <section id="menu" className="px-4 py-12 sm:py-14 md:px-6 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-3xl sm:mb-10">
          <span className="rounded-full bg-[#ffd42a] px-3 py-1 text-[10px] font-bold uppercase sm:text-xs">
            Menu Kami
          </span>

          <h2 className="mt-4 font-heading text-3xl uppercase leading-none sm:text-4xl md:text-5xl xl:text-6xl">
            Pilihan Menu untuk Segala Kebutuhan Acara
          </h2>

          <p className="mt-4 text-sm leading-6 text-[#3b2418]/80 sm:text-base sm:leading-7">
            Dari pizza favorit sampai nasi box dan snack box praktis, semua bisa
            disesuaikan untuk kebutuhan personal, kantor, sekolah, dan event.
          </p>
        </div>

        <div className="grid gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((item) => (
            <article
                key={item.title}
                className="group overflow-hidden rounded-[22px] border-4 border-[#3b2418] bg-white transition-transform duration-300 hover:-translate-y-1"
                >
                <div className="relative h-52 overflow-hidden sm:h-56">
                    <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

                <div className="p-5 sm:p-6">
                    <h3 className="font-heading text-2xl uppercase sm:text-3xl">
                    {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-[#3b2418]/80">
                    {item.desc}
                    </p>
                </div>
                </article>
          ))}
        </div>
      </div>
    </section>
  );
}
