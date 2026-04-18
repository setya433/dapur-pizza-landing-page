"use client";

import AdminSidebar from "@/components/admin/AdminSideBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F6F4EC]">
      <div className="flex min-h-screen">
        <AdminSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1 p-4 md:p-6 xl:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}