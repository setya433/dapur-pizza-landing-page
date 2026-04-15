export default function CTA() {
  return (
    <section className="px-4 py-12 sm:py-14 md:px-6 md:py-16">
      <div className="mx-auto max-w-7xl rounded-[24px] border-4 border-[#3b2418] bg-[#ff6b2c] px-5 py-10 text-white sm:px-6 sm:py-12 md:px-10">
        <div className="max-w-3xl">
          <h2 className="font-heading text-3xl uppercase leading-none sm:text-4xl md:text-5xl xl:text-6xl">
            Siap pesan untuk acara Anda?
          </h2>

          <p className="mt-4 text-sm leading-6 text-white/90 sm:text-base sm:leading-7">
            Konsultasikan kebutuhan acara Anda sekarang. Kami bantu pilihkan
            menu terbaik untuk kantor, sekolah, keluarga, dan berbagai event.
          </p>

          <a
            href="https://wa.me/6285157557523"
            className="mt-7 inline-block rounded-xl border-2 border-[#3b2418] bg-[#ffd42a] px-6 py-3 text-sm font-bold uppercase text-[#3b2418] shadow-[5px_5px_0_#3b2418] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
          >
            Hubungi via WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}