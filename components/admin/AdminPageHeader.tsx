type AdminPageHeaderProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export default function AdminPageHeader({
  title,
  description,
  action,
}: AdminPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-[#1F2937]">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 text-sm text-[#6B7280]">{description}</p>
        ) : null}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}