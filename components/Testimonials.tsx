import { testimonials } from "@/lib/data";

const bgColors = ["bg-[#f6b4d8]", "bg-[#b8e061]", "bg-[#9fd1ff]"];

export default function Testimonials() {
  return (
    <section id="testimoni" className="px-4 py-12 sm:py-14 md:px-6 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center sm:mb-10">
          <span className="rounded-full bg-[#ffd42a] px-3 py-1 text-[10px] font-bold uppercase sm:text-xs">
            Customer Reviews
          </span>

          <h2 className="mt-4 font-heading text-3xl uppercase leading-none sm:text-4xl md:text-5xl xl:text-6xl">
            Pelanggan suka DapurPizza
          </h2>
        </div>

        <div className="grid gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((item, index) => (
            <div
              key={item.name}
              className={`rounded-[22px] border-4 border-[#3b2418] p-5 sm:p-6 ${bgColors[index % bgColors.length]}`}
            >
              <p className="text-base font-black uppercase leading-7 sm:text-lg sm:leading-8">
                “{item.text}”
              </p>

              <div className="mt-6 text-xs font-semibold uppercase sm:text-sm">
                <p>{item.name}</p>
                <p className="opacity-70">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}