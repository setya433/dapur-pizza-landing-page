import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminOrdersClient from "@/components/admin/AdminSideBar";

export default function AdminOrdersPage() {
  return (
    <section>
      <AdminPageHeader
        title="Orders"
        description="Kelola pesanan masuk, update status, dan pantau aktivitas order."
      />
      <AdminOrdersClient />
    </section>
  );
}