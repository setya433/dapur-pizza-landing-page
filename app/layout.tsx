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
  title: "Catering Nasi Box, Aqiqah & Acara Kendal | Dapurpizza Premium Catering",
  description:
    "Dapurpizza Premium Catering Kendal melayani catering pernikahan, aqiqah, nasi box, dan berbagai acara penting dengan sajian berkualitas, higienis, dan tampilan elegan.",
  keywords: [
    "catering Kendal",
    "catering aqiqah Kendal",
    "nasi box Kendal",
    "catering pernikahan Kendal",
    "catering acara Kendal",
    "catering premium Kendal",
    "Dapurpizza catering",
  ],
  openGraph: {
    title: "Dapurpizza Premium Catering Kendal",
    description:
      "Catering premium untuk pernikahan, aqiqah, nasi box, dan acara penting di Kendal.",
    url: "https://dapurpizza.com",
    siteName: "Dapurpizza Catering Kendal",
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