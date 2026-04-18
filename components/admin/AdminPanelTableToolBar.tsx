type AdminTableToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  rightSlot?: React.ReactNode;
};

export default function AdminTableToolbar({
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  rightSlot,
}: AdminTableToolbarProps) {
  return (
    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="w-full max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="h-11 w-full rounded-xl border border-[#E8E5DC] bg-white px-4 text-sm text-[#1F2937] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#C79A52]"
        />
      </div>

      {rightSlot ? <div className="flex flex-wrap gap-3">{rightSlot}</div> : null}
    </div>
  );
}