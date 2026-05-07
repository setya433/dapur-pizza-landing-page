import Image from "next/image";

const products = [
  {
    title: "Paket Pizza Party",
    desc: "Cocok untuk ulang tahun, gathering, dan meeting santai.",
    price: "Mulai 150K",
    image: "/../images/paket-pizza-party.webp",
    alt: "Paket Pizza Party DapurPizza",
  },
  {
    title: "Paket Nasi Box Meeting",
    desc: "Pilihan praktis untuk rapat, seminar, dan pelatihan.",
    price: "Mulai 35K/box",
    image: "/../images/paket-nasi-box-meeting.webp",
    alt: "Paket nasi box meeting DapurPizza",
  },
  {
    title: "Snack Box Event",
    desc: "Pas untuk coffee break, pengajian, dan acara sekolah.",
    price: "Mulai 20K/box",
    image: "/../images/paket-snack-box-event.webp",
    alt: "Snack box event DapurPizza",
  },
];

export default function BestSeller() {
  return (
    <section className="bg-[#174d23] px-4 py-12 text-white sm:py-14 md:px-6 md:py-16">
      <div className="mx-auto w-full max-w-[1200px] xl:max-w-[1280px] 2xl:max-w-[1320px]">
        
        {/* Header */}
        <div className="mb-10 max-w-3xl">
          <span className="rounded-full bg-[#ffd42a] px-3 py-1 text-[10px] font-bold uppercase text-[#3b2418] sm:text-xs">
            Paket Favorit
          </span>

          <h2 className="mt-4 font-heading text-3xl uppercase leading-none sm:text-4xl md:text-5xl xl:text-6xl">
            Menu populer yang paling sering dipesan
          </h2>
        </div>

        {/* Grid */}
        <div className="grid justify-center gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((item) => (
            <div
              key={item.title}
              className="mx-auto w-full max-w-[360px]"
            >
              <article className="group overflow-hidden rounded-[22px] border-4 border-[#d0ef7a] bg-[#245e2f]">
                
                {/* Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 360px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6">
                  <h3 className="font-heading text-2xl uppercase sm:text-3xl">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-white/80">
                    {item.desc}
                  </p>

                  <p className="mt-5 inline-block rounded-full bg-[#ff6b2c] px-4 py-2 text-sm font-bold uppercase">
                    {item.price}
                  </p>
                </div>

              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
