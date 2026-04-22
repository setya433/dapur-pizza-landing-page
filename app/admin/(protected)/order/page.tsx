import { redirect } from "next/navigation";

export default function LegacyAdminOrderPage() {
  redirect("/admin/orders");
}
