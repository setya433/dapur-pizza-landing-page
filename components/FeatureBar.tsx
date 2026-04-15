const items = [
  "Fresh Daily",
  "Pengiriman Tepat Waktu",
  "Custom Menu",
  "Halal",
  "Event Kecil & Besar",
];

export default function FeatureBar() {
  return (
    <section className="border-y-4 border-[#3b2418] bg-[#cfe96a] py-3 sm:py-4">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 text-center text-[11px] font-bold uppercase sm:text-sm md:gap-x-6 md:text-base">
        {items.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </section>
  );
}