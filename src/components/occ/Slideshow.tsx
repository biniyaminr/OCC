import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import coffee from "@/assets/Coffee_Beans.jpg";
import sesame from "@/assets/Sesame.jpg";
import chickpeas from "@/assets/Chickpeas.jpg";
import sorghum from "@/assets/Sorghum.jpg";
import { useSiteContent } from "@/lib/site-content";
import { onProductImageError, productImage } from "@/lib/product-image";

type Slide = {
  image: string;
  kicker: string;
  title: string;
  caption: string;
  slug: string;
  objectPosition?: string;
};

/**
 * A curated highlight — one flagship lot per commodity group. The complete
 * catalog lives in the "Our Products" grid below, so this stays short on
 * purpose rather than mirroring it.
 */
const slides: Slide[] = [
  {
    image: coffee,
    kicker: "Coffee",
    title: "Ethiopian Arabica",
    caption: "Yirgacheffe · Sidamo · Guji · Harar — the coffee that moves the world",
    slug: "yirgacheffe-coffee",
    objectPosition: "center 30%",
  },
  {
    image: sesame,
    kicker: "Oilseeds",
    title: "Humera Sesame",
    caption: "Whitish, high-oil content export grade",
    slug: "sesame-seeds",
  },
  {
    image: chickpeas,
    kicker: "Pulses",
    title: "Kabuli Chickpeas",
    caption: "Bold-seeded, uniform caliber",
    slug: "chickpeas",
  },
  {
    image: sorghum,
    kicker: "Cereals",
    title: "White Sorghum",
    caption: "Food & feed grade from the highlands",
    slug: "sorghum",
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

export function Slideshow() {
  const { content } = useSiteContent();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (paused || reduced.current) return;
    const id = setInterval(() => setI((v) => (v + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [paused]);

  const go = useCallback((n: number) => setI((n + slides.length) % slides.length), []);

  // Studio edits flow through, but a cleared image falls back to the shipped photo.
  const managedSlides = slides.map((slide) => {
    const product = content.products[slide.slug];
    if (!product || product.deleted) return slide;
    return {
      ...slide,
      image: productImage(product.image, slide.image),
      title: product.name || slide.title,
      caption: product.tagline || slide.caption,
    };
  });
  const current = managedSlides[i]!;
  const supporting = [1, 2, 3].map((o) => managedSlides[(i + o) % managedSlides.length]!);

  return (
    <section aria-label="Featured commodities" className="section-y bg-background">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="min-w-0">
            <span className="eyebrow">Featured Commodities</span>
            <h2 className="mt-3 text-h2 font-medium leading-[1.1] text-foreground">
              One flagship lot from <span className="italic text-coffee">each commodity group</span>
            </h2>
            <p className="mt-3 measure text-sm text-muted-foreground">
              A short highlight reel.{" "}
              <a
                href="#products"
                className="font-semibold text-primary-strong underline-offset-4 hover:underline"
              >
                Browse the full catalog
              </a>{" "}
              below for every product we export.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <p
              aria-live="polite"
              className="text-sm font-semibold tabular-nums text-muted-foreground"
            >
              {pad(i + 1)} / {pad(slides.length)}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => go(i - 1)}
                aria-label="Previous commodity"
                className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary-strong"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => go(i + 1)}
                aria-label="Next commodity"
                className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary-strong"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div
          className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <article className="relative overflow-hidden rounded-3xl border border-border bg-muted">
            <img
              key={current.image}
              src={productImage(current.image)}
              alt={`${current.title} — Ethiopian ${current.kicker.toLowerCase()} for export`}
              onError={onProductImageError}
              style={
                current.objectPosition ? { objectPosition: current.objectPosition } : undefined
              }
              className="aspect-[4/3] w-full object-cover md:aspect-[16/10]"
              loading="lazy"
            />
            <div aria-hidden className="photo-scrim on-dark" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold" />
                {current.kicker}
              </span>
              <h3 className="mt-4 font-display text-h3 leading-tight text-white">
                {current.title}
              </h3>
              <p className="mt-2 max-w-xl text-sm text-white/85">{current.caption}</p>
              <Link
                to="/products/$slug"
                params={{ slug: current.slug }}
                className="group mt-5 inline-flex min-h-[2.75rem] items-center gap-2 rounded-full bg-primary-strong px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                View product
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </article>

          <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
            {supporting.map((s) => (
              <button
                key={s.title}
                type="button"
                onClick={() => go(managedSlides.indexOf(s))}
                className="group relative overflow-hidden rounded-3xl border border-border bg-beige text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg focus-visible:-translate-y-1 focus-visible:border-primary"
              >
                <img
                  src={productImage(s.image)}
                  alt={`${s.title} — Ethiopian ${s.kicker.toLowerCase()} for export`}
                  loading="lazy"
                  onError={onProductImageError}
                  className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105 lg:aspect-[16/9]"
                />
                <div aria-hidden className="photo-scrim on-dark" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-gold">
                    {s.kicker}
                  </p>
                  <p className="mt-1 font-display text-lg text-white">{s.title}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
