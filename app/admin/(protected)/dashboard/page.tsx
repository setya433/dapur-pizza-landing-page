"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchOrders } from "@/lib/orderApi";
import { fetchProducts, fetchCategories } from "@/lib/api";
import { mapOrder } from "@/lib/orderMapper";
import { formatRupiah } from "@/lib/utils";

type OrderItem = {
  id: number;
  orderCode: string;
  customerName: string;
  total: number;
  statusOrder: string;
  eventDate?: string;
  createdAt?: string;
};

type ChartDatum = {
  label: string;
  orders: number;
  revenue: number;
};

type ProductItem = {
  id: number;
  documentId?: string;
};

type CategoryItem = {
  id: number;
};

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [ordersRes, productsRes, categoriesRes] = await Promise.all([
          fetchOrders(),
          fetchProducts(),
          fetchCategories(),
        ]);

        setOrders((ordersRes || []).map(mapOrder));
        setProducts(productsRes || []);
        setCategories(categoriesRes || []);
      } catch (error) {
        console.error("DASHBOARD LOAD FAILED:", error);
        setOrders([]);
        setProducts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const todayKey = new Date().toISOString().slice(0, 10);

  const todayOrders = useMemo(() => {
    return orders.filter((order) => {
      const created = order.createdAt?.slice(0, 10);
      return created === todayKey;
    });
  }, [orders, todayKey]);

  const stats = useMemo(() => {
    const pending = orders.filter((o) => o.statusOrder === "pending").length;
    const confirmed = orders.filter((o) => o.statusOrder === "confirmed").length;
    const processing = orders.filter((o) => o.statusOrder === "processing").length;
    const delivered = orders.filter((o) => o.statusOrder === "delivered").length;
    const done = orders.filter((o) => o.statusOrder === "done").length;
    const cancelled = orders.filter((o) => o.statusOrder  === "cancelled").length;

    console.log("ORDER STATUS COUNTS:", { pending, confirmed, processing, delivered, cancelled });
    console.log("ORDER ORDER RAW:", orders);

    const todayRevenue = todayOrders
      .filter((o) => o.statusOrder !== "cancelled")
      .reduce((sum, item) => sum + (item.total || 0), 0);

    const totalRevenue = orders
      .filter((o) => o.statusOrder !== "cancelled")
      .reduce((sum, item) => sum + (item.total || 0), 0);

    return {
      totalOrders: todayOrders.length,
      pending,
      processing,
      delivered,
      cancelled,
      done,
      todayRevenue,
      totalRevenue,
      totalProducts: products.length,
      totalCategories: categories.length,
    };

  }, [orders, todayOrders, products, categories]);

  console.log("DASHBOARD STATS:", stats);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => {
        const aTime = new Date(a.createdAt || 0).getTime();
        const bTime = new Date(b.createdAt || 0).getTime();
        return bTime - aTime;
      })
      .slice(0, 6);
  }, [orders]);

  const chartData: ChartDatum[] = useMemo(() => {
    const formatter = new Intl.DateTimeFormat("id-ID", { weekday: "short" });

    const days = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      return date;
    });

    return days.map((date) => {
      const key = date.toISOString().slice(0, 10);

      const dayOrders = orders.filter((order) => {
        const created = order.createdAt?.slice(0, 10);
        return created === key;
      });

      const revenue = dayOrders
        .filter((o) => o.statusOrder !== "cancelled")
        .reduce((sum, item) => sum + (item.total || 0), 0);

      return {
        label: formatter.format(date),
        orders: dayOrders.length,
        revenue,
      };
    });
  }, [orders]);

  return (
    <main className="space-y-6">
      <section className="rounded-[28px] bg-[#F8F8FB] p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-[#8A8FA3]">Selamat datang kembali</p>
            <h1 className="mt-1 text-4xl font-semibold tracking-tight text-[#1E2433]">
              Dashboard
            </h1>
            <p className="mt-2 text-sm text-[#8A8FA3]">
              Pantau order, progress, dan performa penjualan DapurPizza.
            </p>
          </div>

          <div className="rounded-2xl bg-white px-5 py-4 shadow-sm">
            <p className="text-sm text-[#8A8FA3]">Revenue Hari Ini</p>
            <p className="mt-2 text-2xl font-semibold text-[#1E2433]">
              {formatRupiah(stats.todayRevenue)}
              
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <DashboardStatCard
          title="Orders Hari Ini"
          value={stats.totalOrders}
          subtitle={`${stats.pending} pending`}
          tone="blue"
        />

        <DashboardStatCard
          title="On Progress"
          value={stats.processing}
          subtitle="Pesanan sedang diproses"
          tone="yellow"
        />

        <DashboardStatCard
          title="Orders Selesai"
          value={stats.done}
          subtitle="Sudah terkirim"
          tone="green"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_1fr]">
        <div className="rounded-[28px] bg-[#F8F8FB] p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-[32px] font-semibold tracking-tight text-[#1E2433]">
                Recent Orders
              </h2>
              <p className="mt-1 text-sm text-[#8A8FA3]">
                Order terbaru yang masuk ke sistem.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#EEF1F7] bg-white">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-[#EEF1F7] text-left text-[#8A8FA3]">
                  <th className="px-4 py-4 font-medium">Order ID</th>
                  <th className="px-4 py-4 font-medium">Customer</th>
                  <th className="px-4 py-4 font-medium">Status</th>
                  <th className="px-4 py-4 font-medium">Total</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-[#8A8FA3]">
                      Loading...
                    </td>
                  </tr>
                ) : recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-[#8A8FA3]">
                      Belum ada order.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-[#F4F6FB] text-[#1E2433] transition hover:bg-[#FBFCFF]"
                    >
                      <td className="px-4 py-4 font-medium">{order.orderCode}</td>
                      <td className="px-4 py-4">{order.customerName}</td>
                      <td className="px-4 py-4">
                        <StatusPill status={order.statusOrder} />
                      </td>
                      <td className="px-4 py-4 font-semibold">
                        {formatRupiah(order.total || 0)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-[28px] bg-[#F8F8FB] p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-[32px] font-semibold tracking-tight text-[#1E2433]">
                Orders & Revenue
              </h2>
              <p className="mt-1 text-sm text-[#8A8FA3]">
                Ringkasan performa 7 hari terakhir.
              </p>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <LegendDot color="bg-[#4C9AFF]" label="Orders" />
              <LegendDot color="bg-[#E5B320]" label="Revenue" />
            </div>
          </div>

          <SimpleComboChart data={chartData} />
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-4">
        <SmallInfoCard
          title="Revenue Total"
          value={formatRupiah(stats.totalRevenue)}
          subtitle="Akumulasi order non-cancelled"
        />
        <SmallInfoCard
          title="Cancelled Orders"
          value={String(stats.cancelled)}
          subtitle="Pesanan dibatalkan"
        />
        <SmallInfoCard
          title="Total Products"
          value={String(stats.totalProducts)}
          subtitle="Produk aktif di CMS"
        />
        <SmallInfoCard
          title="Total Categories"
          value={String(stats.totalCategories)}
          subtitle="Kategori tersedia"
        />
      </section>
    </main>
  );
}

function DashboardStatCard({
  title,
  value,
  subtitle,
  tone,
}: {
  title: string;
  value: number | string;
  subtitle: string;
  tone: "blue" | "yellow" | "green";
}) {
  const styles = {
    blue: {
      card: "bg-[#DCEBFC]",
      icon: "bg-[#C6DFFF] text-[#2B7FEA]",
      line: "bg-[#58A7FF]",
      value: "text-[#1E2433]",
    },
    yellow: {
      card: "bg-[#F7EFD9]",
      icon: "bg-[#F6DE9C] text-[#C69014]",
      line: "bg-[#F0C332]",
      value: "text-[#7A5A00]",
    },
    green: {
      card: "bg-[#DFF0E7]",
      icon: "bg-[#B7E3C4] text-[#1D9B50]",
      line: "bg-[#57C47D]",
      value: "text-[#1D9B50]",
    },
  }[tone];

  return (
    <div className={`rounded-[24px] ${styles.card} p-5`}>
      <div className="flex items-start justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${styles.icon}`}>
          <div className="h-4 w-4 rounded-full bg-current opacity-90" />
        </div>

        <button className="text-[#7E8598]">⋮</button>
      </div>

      <div className="mt-4">
        <p className="text-base font-medium text-[#1E2433]">{title}</p>
        <div className="mt-3 flex items-end gap-3">
          <span className={`text-5xl font-semibold leading-none ${styles.value}`}>
            {value}
          </span>
          <span className="pb-1 text-sm text-[#5D657A]">{subtitle}</span>
        </div>
      </div>

      {/* <div className="mt-5 h-1.5 rounded-full bg-white/60">
        <div className={`h-1.5 w-[42%] rounded-full ${styles.line}`} />
      </div> */}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-[#F8E8BA] text-[#8A6500]",
    processing: "bg-[#FDE5BE] text-[#A85E00]",
    delivered: "bg-[#D8F0DE] text-[#1B8A4A]",
    cancelled: "bg-[#FAD9D9] text-[#C53D3D]",
    confirmed: "bg-[#DDEBFF] text-[#2B6FD8]",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        styles[status] || "bg-[#EEF1F7] text-[#5D657A]"
      }`}
    >
      {status}
    </span>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-[#6F768A]">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}

function SmallInfoCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-[24px] bg-[#F8F8FB] p-5 shadow-sm">
      <p className="text-sm text-[#8A8FA3]">{title}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-[#1E2433]">
        {value}
      </p>
      <p className="mt-2 text-sm text-[#8A8FA3]">{subtitle}</p>
    </div>
  );
}

function SimpleComboChart({ data }: { data: ChartDatum[] }) {
  const maxOrders = Math.max(...data.map((d) => d.orders), 1);
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div className="rounded-2xl bg-white p-4">
      <div className="grid h-[320px] grid-cols-7 items-end gap-6">
        {data.map((item) => {
          const barHeight = `${(item.orders / maxOrders) * 180}px`;
          const pointBottom = `${(item.revenue / maxRevenue) * 180}px`;

          return (
            <div key={item.label} className="relative flex h-full flex-col items-center justify-end">
              <div className="relative flex h-[220px] items-end">
                <div
                  className="w-10 rounded-t-xl bg-[#71B4F7]"
                  style={{ height: barHeight }}
                />
                <div
                  className="absolute left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-white bg-[#E5B320] shadow"
                  style={{ bottom: pointBottom }}
                />
              </div>

              <p className="mt-4 text-sm text-[#6F768A]">{item.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
