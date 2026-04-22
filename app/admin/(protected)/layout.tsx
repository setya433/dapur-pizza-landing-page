import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSideBar";
import { getAdminSession } from "@/lib/auth";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

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
