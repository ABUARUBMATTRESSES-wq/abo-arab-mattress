import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import FeaturesBar from "@/components/FeaturesBar";
import Categories from "@/components/Categories";
import BrandsSection from "@/components/BrandsSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import Testimonials from "@/components/Testimonials";
import FaqSection from "@/components/FaqSection";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeaturesBar />
        <Categories />
        <BrandsSection />
        <FeaturedProducts />
        <Testimonials />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
