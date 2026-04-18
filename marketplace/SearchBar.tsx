"use client";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="w-full">
      <label htmlFor="search-menu" className="mb-2 block text-sm font-bold uppercase">
        Cari Menu
      </label>

      <input
        id="search-menu"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cari pizza, nasi box, snack box..."
        className="w-full rounded-2xl border-4 border-[#3b2418] bg-white px-4 py-3 text-sm outline-none placeholder:text-[#3b2418]/40 focus:border-[#ff6b2c]"
      />
    </div>
  );
}