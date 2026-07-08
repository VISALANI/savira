import HeroBanner from "@/components/home/HeroBanner";
import CategorySection from "@/components/home/CategorySection";
import ProductSection from "@/components/home/ProductSection";
import FestiveBanner from "@/components/home/FestiveBanner";
import WhySavira from "@/components/home/WhySavira";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import NewsletterSection from "@/components/home/NewsletterSection";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <CategorySection />
      <ProductSection
        title="New Arrivals"
        subtitle="Just Landed"
        type="new-arrivals"
        viewAllHref="/shop?category=new-arrivals"
      />
      <FestiveBanner />
      <ProductSection
        title="Best Sellers"
        subtitle="Most Loved"
        type="best-sellers"
        viewAllHref="/shop?sort=popularity"
      />
      <WhySavira />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}
