import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchProductBySlug } from "@/lib/api";
import AddToCartButton from "@/marketplace/AddToCartButton";
import { formatRupiah } from "@/lib/utils";
import { mapProduct } from "@/lib/mapper";
import CartButton from "@/marketplace/CartButton";
import CartDrawer from "@/marketplace/CartDrawer";

// type ProductDetailPageProps = {
//   params: Promise<{
//     slug: string;
//   }>;
// };

export default async function ProductDetailPage({
  params,
}: {params: Promise<{ slug: string }>;}) {
  const { slug } = await params;

  const Raw = await fetchProductBySlug(slug);
  console.log("PRODUCT DETAIL DATA:", Raw);

  const [dataDetail] = await Promise.all([
      fetchProductBySlug(slug) ,
    ]);
  
  const data = mapProduct(dataDetail);

  if (!data) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f7f1e8] px-4 py-8 text-[#3b2418] md:px-6 md:py-10">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="mb-6">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase text-[#3b2418]/75 transition hover:text-[#3b2418]"
          >
            <span>←</span>
            <span>Kembali ke menu</span>
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <section className="overflow-hidden rounded-[28px] border-4 border-[#3b2418] bg-white shadow-[8px_8px_0_#3b2418]">
            <div className="relative aspect-[4/3] w-full bg-[#fff8ef]">
              <Image
            src={data.image}
            alt={data.name}
            fill
            sizes="100vw"
            unoptimized
            className="object-cover"
          />
            </div>
          </section>

          <section className="rounded-[28px] border-4 border-[#3b2418] bg-white p-6 shadow-[8px_8px_0_#3b2418] md:p-8">
            <div className="flex flex-wrap items-center gap-3">
              {data.badge && (
                <span className="inline-block rounded-full bg-[#cfe96a] px-3 py-1 text-[11px] font-bold uppercase tracking-wide">
                  {data.badge}
                </span>
              )}

              {data.category && (
                <span className="inline-block rounded-full border-2 border-[#3b2418] bg-[#fff8ef] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#3b2418]/75">
                  {data.category.name}
                </span>
              )}
            </div>

            <h1 className="mt-5 font-heading text-4xl uppercase leading-none md:text-6xl">
              {data.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-end gap-x-6 gap-y-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#3b2418]/60">
                  Harga
                </p>
                <p className="mt-1 text-2xl font-bold text-[#ff6b2c] md:text-3xl">
                  {formatRupiah(data.price)}
                </p>
              </div>

              {data.minOrder && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-[#3b2418]/60">
                    Minimal Order
                  </p>
                  <p className="mt-1 text-sm font-semibold uppercase text-[#3b2418]/80">
                    {data.minOrder}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 h-[2px] w-full border-t-2 border-dashed border-[#3b2418]/25" />

            <div className="mt-6">
              <h2 className="text-sm font-bold uppercase tracking-wide text-[#3b2418]/75">
                Deskripsi
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#3b2418]/80 md:text-base">
                {data.description}
              </p>
            </div>

            {/* {data.features && data.features.length > 0 && (
              <div className="mt-8">
                <h2 className="text-sm font-bold uppercase tracking-wide text-[#3b2418]/75">
                  Isi / Keunggulan
                </h2>

                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {data.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex gap-3 rounded-2xl border-2 border-[#3b2418] bg-[#fff8ef] px-4 py-3 text-sm leading-6 text-[#3b2418]/85"
                    >
                      <span className="mt-[2px] text-base font-bold text-[#ff6b2c]">
                        •
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )} */}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <AddToCartButton
                        variant="small"
                        product={{
                          id: String(data.id),
                          name: data.name,
                          price: data.price,
                          image: data.image,
                        }}
                      />

              <Link
                href="/menu"
                className="inline-flex items-center justify-center rounded-xl border-2 border-[#3b2418] bg-[#ffd42a] px-5 py-3 text-sm font-bold uppercase text-[#3b2418] transition hover:translate-x-[1px] hover:translate-y-[1px]"
              >
                Lihat Menu Lain
              </Link>
            </div>
          </section>
        </div>
      </div>
      <CartButton />
      <CartDrawer />
    </main>
  );
}