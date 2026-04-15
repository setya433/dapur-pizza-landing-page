import Image from "next/image";

export default function MenuShowcase() {
  return (
    <section className="px-4 py-12 md:px-6 md:py-16">
      <div className="mx-auto w-full max-w-[1280px] 2xl:max-w-[1400px]">
        
        {/* Title */}
        <div className="mb-8 text-center">
          <h2 className="font-heading text-3xl uppercase sm:text-4xl md:text-5xl">
            Menu Kami
          </h2>
          <p className="mt-3 text-sm text-[#3b2418]/80 sm:text-base">
            Pilihan menu dari DapurPizza untuk berbagai acara
          </p>
        </div>

        {/* Image Banner */}
        <div className="relative overflow-hidden rounded-[28px] border-4 border-[#3b2418] shadow-lg">
          <div className="relative aspect-[3/2] w-full">
            <Image
              src="/../images/paket-pizza.png"
              alt="Menu Pizza DapurPizza"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[28px] border-4 border-[#3b2418] shadow-lg mt-12">
          <div className="relative aspect-[3/2] w-full">
            <Image
              src="/../images/paket-nasi-box-1.png"
              alt="Menu Nasi Box DapurPizza"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>


        <div className="relative overflow-hidden rounded-[28px] border-4 border-[#3b2418] shadow-lg mt-12">
          <div className="relative aspect-[3/2] w-full">
            <Image
              src="/../images/paket-snack-box.png"
              alt="Menu Nasi Box Snack DapurPizza"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  );
}

export function PaketShowcase() {
  return (
    <section className="px-4 pb-16 md:px-6">
      <div className="mx-auto w-full max-w-[1280px] 2xl:max-w-[1400px]">

        <div className="mb-8 text-center">
          <h2 className="font-heading text-3xl uppercase sm:text-4xl md:text-5xl">
            Paket Catering Acara
          </h2>
        </div>

        <div className="relative overflow-hidden rounded-[28px] border-4 border-[#3b2418] shadow-lg">
          <div className="relative aspect-[3/2] w-full">
            <Image
              src="/images/menu-paket-banner.jpg"
              alt="Menu Paket Catering DapurPizza"
              fill
              className="object-cover"
            />
          </div>
        </div>

      </div>
    </section>
  );
}