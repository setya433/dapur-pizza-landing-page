export default function Footer() {
  return (
    <footer className="border-t-4 border-[#3b2418] bg-[#3b2418] px-4 py-10 text-[#f7f1e8] md:px-6">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 xl:grid-cols-3">
        <div>
          <h3 className="font-heading text-2xl uppercase sm:text-3xl">
            DapurPizza
          </h3>
          <p className="mt-3 text-sm leading-6 text-[#f7f1e8]/80">
            Catering pizza, nasi box, snack box, dan paket acara untuk berbagai
            kebutuhan personal maupun corporate.
          </p>
        </div>

        <div>
          <h4 className="text-base font-bold uppercase sm:text-lg">Menu</h4>
          <ul className="mt-3 space-y-2 text-sm text-[#f7f1e8]/80">
            <li>Pizza</li>
            <li>Nasi Box</li>
            <li>Snack Box</li>
            <li>Paket Catering Acara</li>
          </ul>
        </div>

        <div>
          <h4 className="text-base font-bold uppercase sm:text-lg">Kontak</h4>
          <ul className="mt-3 space-y-2 text-sm text-[#f7f1e8]/80">
            <li>WhatsApp: 0812-3456-7890</li>
            <li>Email: hello@dapurpizza.com</li>
            <li>Alamat: Jakarta, Indonesia</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}