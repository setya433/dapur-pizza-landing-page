type StatusBadgeProps = {
  status: string;
};

const styles: Record<string, string> = {
  pending: "bg-[#FEF3C7] text-[#B45309]",
  confirmed: "bg-[#DBEAFE] text-[#1D4ED8]",
  processing: "bg-[#FDE68A] text-[#92400E]",
  delivered: "bg-[#DDF5E3] text-[#15803D]",
  cancelled: "bg-[#FEE2E2] text-[#DC2626]",
  active: "bg-[#DDF5E3] text-[#15803D]",
  inactive: "bg-[#F3F4F6] text-[#6B7280]",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize",
        styles[status] ?? "bg-[#F3F4F6] text-[#6B7280]",
      ].join(" ")}
    >
      {status}
    </span>
  );
}