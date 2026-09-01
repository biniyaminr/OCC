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
  head: () => ({
    meta: [
      { title: "OCC — Premium Ethiopian Agricultural Commodities for Global Markets" },
      {
        name: "description",
        content:
          "Oragon Commodity Center connects the world's markets with Ethiopia's agricultural excellence through trusted partnerships, uncompromising quality, transparent trade, and innovative commodity solutions.",
      },
      {
        property: "og:title",
        content: "OCC — Premium Ethiopian Agricultural Commodities",
      },
      {
        property: "og:description",
        content:
          "Oragon Commodity Center connects the world's markets with Ethiopia's agricultural excellence through trusted partnerships, quality, transparent trade, and innovative commodity solutions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
