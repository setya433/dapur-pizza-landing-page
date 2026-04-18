import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AdminOrdersClient from "./AdminOrdersClient";

export default async function AdminOrdersPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/admin/login");
  }

  return <AdminOrdersClient />;
}