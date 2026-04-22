import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "DapurPizza | Catering Pizza, Nasi Box, Snack Box & Paket Acara",
  description:
    "DapurPizza melayani catering pizza, nasi box, snack box, dan paket konsumsi untuk meeting, kantor, sekolah, ulang tahun, dan berbagai acara.",
  keywords: [
    "catering pizza",
    "nasi box",
    "snack box",
    "catering acara",
    "catering kantor",
    "pizza event",
    "DapurPizza",
  ],
  openGraph: {
    title: "DapurPizza",
    description:
      "Catering pizza, nasi box, snack box, dan paket acara untuk berbagai kebutuhan.",
    url: "https://dapurpizza.com",
    siteName: "DapurPizza",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className={`${anton.variable} ${inter.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
