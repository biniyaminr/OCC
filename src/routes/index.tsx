import { seoHead, organizationSchema, absoluteUrl } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { SiteHeader } from "@/components/occ/SiteHeader";
import { SiteFooter } from "@/components/occ/SiteFooter";
import { Hero } from "@/components/occ/Hero";
import { TrustStrip } from "@/components/occ/TrustStrip";
import { PageOverview } from "@/components/occ/PageOverview";
import { Slideshow } from "@/components/occ/Slideshow";
import { AboutSection } from "@/components/occ/AboutSection";
import { ProductCategories } from "@/components/occ/ProductCategories";
import { WhyEthiopia } from "@/components/occ/WhyEthiopia";
import { WhyOCC } from "@/components/occ/WhyOCC";
import { SourcingProcess } from "@/components/occ/SourcingProcess";
import { ContactSection } from "@/components/occ/ContactSection";

export const Route = createFileRoute("/")({
  head: () =>
    seoHead({
      title: "Ethiopian Coffee, Oilseeds, Pulses & Cereals | OCC",
      description:
        "Source Ethiopian coffee, sesame, pulses and cereals through Oragon Commodity Center. Explore origins, product specifications and packaging, and request a quote.",
      path: "/",
      schema: [
        organizationSchema(),
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Oragon Commodity Center",
          url: absoluteUrl("/"),
          publisher: { "@id": absoluteUrl("/#organization") },
        },
      ],
    }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="top-right" richColors />
      <SiteHeader />
      <main>
        <Hero />
        <TrustStrip />
        <PageOverview />
        <Slideshow />
        <AboutSection />
        <ProductCategories />
        <WhyEthiopia />
        <WhyOCC />
        <SourcingProcess />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}
