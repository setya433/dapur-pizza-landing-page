"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Menu", href: "#menu" },
  { label: "Why Us", href: "#kenapa-kami" },
  { label: "Testimoni", href: "#testimoni" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-4 border-[#3b2418] bg-[#ffd42a]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
        <a
          href="#"
          className="font-heading text-2xl uppercase tracking-wide sm:text-3xl"
        >
          DapurPizza
        </a>

        <nav className="hidden items-center gap-5 text-sm font-semibold uppercase lg:flex">
          {navLinks.map((item) => (
            <a key={item.label} href={item.href} className="hover:opacity-70">
              {item.label}
            </a>
          ))}
        </nav>

        {/* <div className="hidden lg:block">
          <a
            href="https://wa.me/6281234567890"
            className="rounded-xl border-2 border-[#3b2418] bg-white px-4 py-2 text-sm font-bold uppercase shadow-[4px_4px_0_#3b2418] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
          >
            Order Now
          </a>
        </div> */}

        <button
          type="button"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex rounded-xl border-2 border-[#3b2418] bg-white p-2 lg:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t-4 border-[#3b2418] bg-[#fff6cf] px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-3 text-sm font-bold uppercase">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl border-2 border-[#3b2418] bg-white px-4 py-3"
              >
                {item.label}
              </a>
            ))}

            <a
              href="https://wa.me/6281234567890"
              onClick={() => setOpen(false)}
              className="rounded-xl border-2 border-[#3b2418] bg-[#ff6b2c] px-4 py-3 text-center text-white"
            >
              Pesan Sekarang
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}