"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  FolderKanban,
  ShoppingCart,
  Settings,
  LogOut,
} from "lucide-react";

const menus = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: FolderKanban,
  },
  {
    label: "Orders",
    href: "/admin/order",
    icon: ShoppingCart,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[270px] shrink-0 flex-col border-r border-white/10 bg-[#0B1B4D] text-white lg:flex">
      <div className="border-b border-white/10 px-6 py-6">
        <h1 className="text-2xl font-semibold tracking-tight">DapurPizza</h1>
        <p className="mt-1 text-sm text-white/60">Admin Panel</p>
      </div>

      <div className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {menus.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/admin"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                  active
                    ? "bg-[#122766] text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white",
                ].join(" ")}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-white/10 px-4 py-4">
        <Link
          href="/admin/settings"
          className="mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
        >
          <Settings size={18} />
          <span>Settings</span>
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-200 transition hover:bg-red-500/10 hover:text-white"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}