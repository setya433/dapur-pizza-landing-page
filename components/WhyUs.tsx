import Image from "next/image";
import { benefits } from "@/lib/data";

export default function WhyUs() {
  return (
    <section id="kenapa-kami" className="px-4 py-12 sm:py-14 md:px-6 md:py-16">
      <div className="mx-auto grid max-w-7xl gap-6 rounded-[24px] bg-[#fff8ef] p-5 sm:p-6 md:gap-8 md:p-8 lg:grid-cols-3 lg:p-10">
        <div className="lg:col-span-2">
          <span className="rounded-full bg-[#ffd42a] px-3 py-1 text-[10px] font-bold uppercase sm:text-xs">
            Kenapa pilih kami
          </span>

          <h2 className="mt-4 font-heading text-3xl uppercase leading-none sm:text-4xl md:text-5xl xl:text-6xl">
            Catering yang praktis, rapi, dan bikin tamu puas
          </h2>

          <div className="mt-6 grid gap-5 sm:mt-8 md:grid-cols-2 md:gap-6">
            {benefits.map((item) => (
              <div key={item.title}>
                <h3 className="text-lg font-bold sm:text-xl">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#3b2418]/80">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[280px] overflow-hidden rounded-[22px] border-4 border-[#3b2418] sm:min-h-[360px] lg:min-h-full">
          <Image
            src="/../images/about-catering.png"
            alt="Tim DapurPizza menyiapkan catering"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}