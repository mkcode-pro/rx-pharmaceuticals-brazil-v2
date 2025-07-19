import Header from '@/components/layout/header';
import Hero from '@/components/sections/hero';
import TrustBar from '@/components/sections/trust-pillars';
import PromoBanner from '@/components/sections/promo-banner';
import FeaturedProducts from '@/components/sections/featured-products';
import Team from '@/components/sections/team';
import Testimonials from '@/components/sections/testimonials';
import TelegramCTA from '@/components/sections/telegram-cta';
import Newsletter from '@/components/sections/newsletter';
import Categories from '@/components/sections/categories';
import FAQ from '@/components/sections/faq';
import Footer from '@/components/layout/footer';


import MobileBottomNav from '@/components/layout/mobile-bottom-nav';

export default function Home() {
  return (
    <>
      <Header />
      <main className="pb-20 md:pb-0">
        <Hero />
        <TrustBar />
        <PromoBanner />
        <FeaturedProducts />
        <Team />
        <Testimonials />
        <TelegramCTA />
        <Newsletter />
        <Categories />
        <FAQ />
      </main>
      <Footer />


      <MobileBottomNav />
    </>
  );
}
