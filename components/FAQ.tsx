import { faqs } from "@/lib/data";

export default function FAQ() {
  return (
    <section id="faq" className="px-4 py-12 sm:py-14 md:px-6 md:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center sm:mb-10">
          <span className="rounded-full bg-[#ffd42a] px-3 py-1 text-[10px] font-bold uppercase sm:text-xs">
            FAQ
          </span>

          <h2 className="mt-4 font-heading text-3xl uppercase leading-none sm:text-4xl md:text-5xl xl:text-6xl">
            Pertanyaan yang sering ditanyakan
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="rounded-[18px] border-4 border-[#3b2418] bg-white p-4 sm:rounded-[20px] sm:p-5"
            >
              <summary className="cursor-pointer pr-6 text-base font-bold sm:text-lg">
                {item.q}
              </summary>
              <p className="mt-3 text-sm leading-6 text-[#3b2418]/80">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}