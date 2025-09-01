import Hero from "@/components/landing/hero";
import FeatureGrid from "@/components/landing/feature-grid";
import DemoSection from "@/components/landing/demo-section";
import CTASection from "@/components/landing/cta-section";
import SiteFooter from "@/components/landing/site-footer";
import Header from "@/components/common/header";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeatureGrid />
        <DemoSection />
        <CTASection />
      </main>
      <SiteFooter />
    </>
  );
}
