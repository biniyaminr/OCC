import { ArrowRight } from "lucide-react";
import { ProductSearchBar } from "./ProductSearchBar";
import { useSiteContent } from "@/lib/site-content";
import { onProductImageError, productImage } from "@/lib/product-image";

export function Hero() {
  const { content } = useSiteContent();
  const hero = content.home.hero;
  return (
    <section className="on-dark relative flex min-h-[88svh] w-full items-center overflow-hidden bg-charcoal md:min-h-[90svh]">
      <img
        src={productImage(hero.image)}
        onError={onProductImageError}
        alt="Ethiopian coffee farmers harvesting ripe cherries on highland terraces at sunrise"
        width={1920}
        height={1088}
        loading="eager"
        fetchPriority="high"
        decoding="sync"
        className="absolute inset-0 h-full w-full object-cover object-[60%_center]"
      />
      {/* Directional gradient: deep espresso on the text side, clear toward the landscape */}
      <div aria-hidden className="photo-scrim-left" />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(to_bottom,transparent,var(--background))]"
      />

      <div className="container-x relative z-10 py-28 md:py-32">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold" />
            {hero.eyebrow}
          </span>

          <h1 className="mt-7 font-display text-h1 font-medium leading-[1.06] text-white">
            {hero.title}
            <br className="hidden sm:block" />{" "}
            <span className="italic text-gold">{hero.accent}</span>
          </h1>

          <p className="mt-6 measure text-lede leading-relaxed text-white/80">{hero.description}</p>

          <div className="mt-8 max-w-lg">
            <ProductSearchBar />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#products"
              className="group inline-flex min-h-[3rem] items-center gap-2 rounded-full bg-primary-strong px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary-hover hover:shadow-xl"
            >
              Explore Commodities
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#contact"
              className="inline-flex min-h-[3rem] items-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Start an Inquiry
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
