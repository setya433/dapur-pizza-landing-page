import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { getAdminSession } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin/orders");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f1e8]">
      <div className="w-full max-w-md rounded-2xl border-4 border-[#3b2418] bg-white p-6">
        <AdminLoginForm />
      </div>
    </main>
  );
}
