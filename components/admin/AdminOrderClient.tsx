"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchOrders, updateOrderStatus } from "@/lib/orderApi";
import { mapOrder } from "@/lib/orderMapper";
import { formatRupiah } from "@/lib/utils";
import AdminTableToolbar from "@/components/admin/AdminPanelTableToolBar";
import StatusBadge from "@/components/admin/StatusBadge";

export default function AdminOrdersClient() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  async function loadOrders() {
    try {
      const data = await fetchOrders();
      setOrders(data.map(mapOrder));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const query = search.toLowerCase();
    
      console.log("RAW ORDER:", order);
      const matchSearch =
        !query ||
        order.customerName?.toLowerCase().includes(query) ||
        order.orderCode?.toLowerCase().includes(query);

        

      const matchStatus =
        statusFilter === "all" || order.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);


  const handleUpdateStatus = async (documentId: string, StatusOrder: string) => {
    console.log("DI PAGE Updating order StatusOrder:", { documentId, StatusOrder });
    await updateOrderStatus(documentId, StatusOrder);
    loadOrders();
  };

  return (
    <div className="rounded-2xl border border-[#E8E5DC] bg-white p-4 shadow-sm md:p-6">
      <AdminTableToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by customer or order code..."
        rightSlot={
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 rounded-xl border border-[#E8E5DC] bg-white px-4 text-sm text-[#1F2937] outline-none"
          >
            <option value="all">All status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="delivered">Delivered</option>
            <option value="done">Done</option>
            <option value="cancelled">Cancelled</option>
          </select>
        }
      />

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-[#E8E5DC] text-left text-[#6B7280]">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-8 text-center text-[#6B7280]" colSpan={7}>
                  Loading...
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-[#6B7280]" colSpan={7}>
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                
                <tr
                  key={order.id}
                  className="border-b border-[#F3F4F6] text-[#1F2937] transition hover:bg-[#FAFAF8]"
                >
                  <td className="px-4 py-4 font-semibold">{order.orderCode}</td>
                  <td className="px-4 py-4">
                    <p className="font-medium">{order.customerName}</p>
                    <p className="mt-1 text-xs text-[#6B7280]">{order.phone}</p>
                  </td>
                  <td className="px-4 py-4">
                    {order.eventDate
                      ? new Date(order.eventDate).toLocaleDateString("id-ID")
                      : "-"}
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      {order.items?.slice(0, 2).map((item: any, i: number) => (
                        <div key={i}>
                          {item.name} x{item.quantity}
                        </div>
                      ))}
                      {order.items?.length > 2 ? (
                        <p className="text-xs text-[#6B7280]">
                          +{order.items.length - 2} lainnya
                        </p>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-4 font-semibold">
                    {formatRupiah(order.total)}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={order.statusOrder} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleUpdateStatus(order.documentId, "confirmed")}
                        className="rounded-lg bg-[#2563EB] px-3 py-2 text-xs font-medium text-white"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(order.documentId, "processing")}
                        className="rounded-lg bg-[#D97706] px-3 py-2 text-xs font-medium text-white"
                      >
                        Process
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(order.documentId, "delivered")}
                        className="rounded-lg bg-[#16A34A] px-3 py-2 text-xs font-medium text-white"
                      >
                        Delivery
                      </button>
                       <button
                        onClick={() => handleUpdateStatus(order.documentId, "done")}
                        className="rounded-lg bg-[#D7BFDC] px-3 py-2 text-xs font-medium text-white"
                      >
                        Done
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(order.documentId, "cancelled")}
                        className="rounded-lg bg-[#DC2626] px-3 py-2 text-xs font-medium text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}