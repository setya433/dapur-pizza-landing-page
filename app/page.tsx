import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeatureBar from "@/components/FeatureBar";
import Categories from "@/components/Categories";
import WhyUs from "@/components/WhyUs";
import BestSeller from "@/components/BestSeller";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import MenuShowcase from "@/components/MenuShowcase";

export default function HomePage() {
  return (
    <main className="overflow-x-hidden bg-[#f7f1e8] text-[#3b2418]">
      <Navbar />
      <Hero />
      <FeatureBar />
      <Categories />
      <MenuShowcase />
      <BestSeller />
      <WhyUs />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}