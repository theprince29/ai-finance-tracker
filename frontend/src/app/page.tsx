
import Hero from "@/components/landing/hero"
import FeatureGrid from "@/components/landing/feature-grid"
import DemoSection from "@/components/landing/demo-section"
import CTASection from "@/components/landing/cta-section"
import SiteFooter from "@/components/landing/site-footer"
import Header from "@/components/common/header"

export default function Home() {
  return (
    <>
      {/* <header className="sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-gradient-to-tr from-indigo-600 to-blue-600" aria-hidden />
            <span className="font-semibold">Finance Tracker</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <a href="#features" className="text-muted-foreground hover:text-foreground">
              Features
            </a>
            <a href="#demo" className="text-muted-foreground hover:text-foreground">
              Demo
            </a>
            <a href="#cta" className="text-muted-foreground hover:text-foreground">
              Get started
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" className="hidden sm:inline-flex bg-transparent">
              <Link href="/finance">Explore demo</Link>
            </Button>
          </div>
        </div>
      </header> */}
      <Header/>

      <main>
        <Hero />
        <FeatureGrid />
        <DemoSection />
        <CTASection />
      </main>

      <SiteFooter />
    </>
  )
}
