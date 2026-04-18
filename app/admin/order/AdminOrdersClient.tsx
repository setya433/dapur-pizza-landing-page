"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchOrders, updateOrderStatus } from "@/lib/orderApi";
import { mapOrder } from "@/lib/orderMapper";
import { formatRupiah } from "@/lib/utils";
import { signOut } from "next-auth/react";

export default function AdminOrdersClient() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  async function loadOrders() {
    try {
      const data = await fetchOrders();
      setOrders(data.map(mapOrder));
      console.log("MAPPED ORDERS:", data.map(mapOrder));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (id: number, status: string) => {
    await updateOrderStatus(id, status);
    loadOrders();
  };

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-200 text-yellow-800",
    confirmed: "bg-blue-200 text-blue-800",
    processing: "bg-orange-200 text-orange-800",
    delivered: "bg-green-200 text-green-800",
    cancelled: "bg-red-200 text-red-800",
  };

  // 🔥 FILTER + SEARCH
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchSearch =
        order.customerName
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        order.orderCode
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "all" || order.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-[#f7f1e8] p-6">
      {/* HEADER */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-4xl uppercase">
          Dashboard Order
        </h1>

        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="rounded bg-red-500 px-4 py-2 text-white"
        >
          Logout
        </button>
      </div>

      {/* FILTER + SEARCH */}
      <div className="mb-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Cari nama / order code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border px-4 py-2 text-sm"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="all">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-2xl border-4 border-[#3b2418] bg-white">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-[#3b2418] text-white">
            <tr>
              <th className="px-4 py-3 text-left">Order</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Tanggal</th>
              <th className="px-4 py-3 text-left">Items</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Note</th>
              <th className="px-4 py-3 text-left">Address</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                className="border-t hover:bg-[#fff8ef]"
              >
                {/* ORDER */}
                <td className="px-4 py-3 font-bold">
                  {order.orderCode}
                </td>

                {/* CUSTOMER */}
                <td className="px-4 py-3">
                  <p className="font-semibold">
                    {order.customerName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.phone}
                  </p>
                </td>

                {/* DATE */}
                <td className="px-4 py-3">
                  {new Date(order.eventDate).toLocaleDateString(
                    "id-ID"
                  )}
                </td>

                {/* ITEMS */}
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    {order.items
                      ?.slice(0, 2)
                      .map((item: any, i: number) => (
                        <div key={i}>
                          {item.name} x{item.quantity}
                        </div>
                      ))}

                    {order.items?.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{order.items.length - 2} lainnya
                      </span>
                    )}
                  </div>
                </td>

                {/* TOTAL */}
                <td className="px-4 py-3 font-bold">
                  {formatRupiah(order.total)}
                </td>

                {/* STATUS */}
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                      statusColor[order.statusOrder] ?? "bg-gray-200"
                    }`}
                  >
                    {order.statusOrder}
                  </span>
                </td>

                <td className="px-4 py-3 font-bold">
                  {order.note || "-"}
                </td>

                <td className="px-4 py-3 font-bold">
                  {order.address || "-"}
                </td>

                {/* ACTION */}
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() =>
                        handleUpdateStatus(order.id, "confirmed")
                      }
                      className="rounded bg-blue-500 px-2 py-1 text-xs text-white"
                    >
                      Confirm
                    </button>

                    <button
                      onClick={() =>
                        handleUpdateStatus(order.id, "processing")
                      }
                      className="rounded bg-orange-500 px-2 py-1 text-xs text-white"
                    >
                      Process
                    </button>

                    <button
                      onClick={() =>
                        handleUpdateStatus(order.id, "delivered")
                      }
                      className="rounded bg-green-500 px-2 py-1 text-xs text-white"
                    >
                      Done
                    </button>

                    <button
                      onClick={() =>
                        handleUpdateStatus(order.id, "cancelled")
                      }
                      className="rounded bg-red-500 px-2 py-1 text-xs text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            Tidak ada data ditemukan
          </div>
        )}
      </div>
    </main>
  );
}