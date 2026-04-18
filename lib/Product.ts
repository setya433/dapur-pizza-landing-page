// export type ProductCategory =
//   | "all"
//   | "pizza"
//   | "nasi-box"
//   | "snack-box"
//   | "paket-acara"
//   | "add-on";

// export type Product = {
//   id: string;
//   slug: string;
//   name: string;
//   category: Exclude<ProductCategory, "all">;
//   price: number;
//   image: string;
//   alt: string;
//   description: string;
//   badge?: string | null;
//   longDescription?: string;
//   features?: string[];
//   minOrder?: string;
// };

export type ProductCategory = string;

export type ProductCategoryRef = {
  id: number;
  name: string;
  slug: string;
} | null;


export type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  description: string;
  badge?: string | null;
  minOrder?: string | number;
  image: string;
  alt: string;
  category: ProductCategoryRef;
};
// export const categories: { label: string; value: ProductCategory }[] = [
//   { label: "Semua", value: "all" },
//   { label: "Pizza", value: "pizza" },
//   { label: "Nasi Box", value: "nasi-box" },
//   { label: "Snack Box", value: "snack-box" },
//   { label: "Paket Acara", value: "paket-acara" },
//   { label: "Add On", value: "add-on" },
// ];

export type CategoryOption = {
  label: string;
  value: string;
};


export function getProductBySlug(products: Product[], slug: string) {
  return products.find((product) => product.slug === slug);
}

// export const products: Product[] = [
//   {
//     id: "pizza-pepperoni-classic",
//     slug: "pizza-pepperoni-classic",
//     name: "Pepperoni Classic",
//     category: "pizza",
//     price: 25000,
//     image: "/images/menu-pizza-banner.jpg",
//     alt: "Pizza Pepperoni Classic DapurPizza",
//     description: "Pizza klasik dengan topping pepperoni dan keju melimpah.",
//     longDescription:
//       "Pepperoni Classic adalah pilihan favorit untuk acara santai, ulang tahun, dan meeting. Rasa gurih, topping melimpah, dan cocok untuk berbagai suasana.",
//     badge: "Best Seller",
//     minOrder: "Minimal 1 box",
//     features: [
//       "Topping pepperoni",
//       "Keju melimpah",
//       "Cocok untuk sharing",
//       "Fresh dibuat saat order",
//     ],
//   },
//   {
//     id: "nasi-box-hemat",
//     slug: "nasi-box-hemat",
//     name: "Paket Hemat",
//     category: "nasi-box",
//     price: 15000,
//     image: "/images/paket-nasi-box.png",
//     alt: "Paket Hemat nasi box DapurPizza",
//     description: "Paket nasi box ekonomis untuk rapat, syukuran, dan acara kantor.",
//     longDescription:
//       "Paket Hemat cocok untuk kebutuhan acara dengan budget efisien tanpa mengurangi kualitas rasa dan kerapian penyajian.",
//     minOrder: "Minimal 20 pax",
//     features: [
//       "Nasi putih",
//       "Ayam goreng",
//       "Tempe orek",
//       "Telur dadar",
//       "Air mineral 330 ml",
//     ],
//   },
//   {
//     id: "paket-acara-premium",
//     slug: "paket-acara-premium",
//     name: "Paket Acara Premium",
//     category: "paket-acara",
//     price: 30000,
//     image: "/images/paket-nasi-box.png",
//     alt: "Paket acara premium DapurPizza",
//     description: "Paket konsumsi lengkap untuk acara formal dan event keluarga.",
//     longDescription:
//       "Paket Acara Premium dirancang untuk acara formal, gathering keluarga, seminar, dan berbagai event yang membutuhkan menu lebih lengkap.",
//     badge: "Premium",
//     minOrder: "Minimal 20 pax",
//     features: [
//       "Nasi putih",
//       "Ayam goreng kremes",
//       "Daging semur",
//       "Capcay",
//       "Buah potong",
//       "Puding",
//       "Air mineral 330 ml",
//     ],
//   },
// ];