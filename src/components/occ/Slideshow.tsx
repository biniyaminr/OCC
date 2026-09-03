import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import coffee from "@/assets/Coffee_Beans.jpg";
import coffeeHighland from "@/assets/coffee-highland-1024.webp";
import sesame from "@/assets/Sesame.jpg";
import soybean from "@/assets/Soybean.jpg";
import peanuts from "@/assets/Peanuts.jpg";
import lskb from "@/assets/Light_Speckled_Kidney_Beans.jpg";
import rskb from "@/assets/Red_Speckled_kidney_Beans.jpg";
import rkb from "@/assets/Redkidney_beans.jpg";
import chickpeas from "@/assets/Chickpeas.jpg";
import sorghum from "@/assets/Sorghum.jpg";
import corn from "@/assets/Corn.jpg";
import { useSiteContent } from "@/lib/site-content";
import { onProductImageError, productImage } from "@/lib/product-image";
import { useT } from "@/lib/i18n";

type Slide = {
  image: string;
  kicker: string;
  title: string;
  caption: string;
  slug: string;
  objectPosition?: string;
};

/**
 * The cinematic band runs the whole harvest, one distinct photograph per lot —
 * it is the atmospheric counterpart to the catalog grid, not a second listing
 * of it. Every slide here has its own picture; none is repeated.
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
    image: coffeeHighland,
    kicker: "Coffee",
    title: "Limmu",
    caption: "Washed highland Arabica from the Jimma zone",
    slug: "limmu-coffee",
  },
  {
    image: sesame,
    kicker: "Oilseeds",
    title: "Humera Sesame",
    caption: "Whitish, high-oil content export grade",
    slug: "sesame-seeds",
  },
  {
    image: soybean,
    kicker: "Oilseeds",
    title: "Soybeans",
    caption: "Non-GMO, protein-rich",
    slug: "soybeans",
  },
  {
    image: peanuts,
    kicker: "Oilseeds",
    title: "Raw Peanuts",
    caption: "Skin-on, export cleaned",
    slug: "peanuts",
  },
  {
    image: chickpeas,
    kicker: "Pulses",
    title: "Kabuli Chickpeas",
    caption: "Bold-seeded, uniform caliber",
    slug: "chickpeas",
  },
  {
    image: rkb,
    kicker: "Pulses",
    title: "Red Kidney Beans",
    caption: "Deep-red, hand-graded",
    slug: "red-kidney-beans",
  },
  {
    image: lskb,
    kicker: "Pulses",
    title: "Light Speckled Kidney Beans",
    caption: "Sugar bean varietal",
    slug: "light-speckled-kidney-beans",
  },
  {
    image: rskb,
    kicker: "Pulses",
    title: "Red Speckled Kidney Beans",
    caption: "Cranberry / borlotti type",
    slug: "red-speckled-kidney-beans",
  },
  {
    image: sorghum,
    kicker: "Cereals",
    title: "White Sorghum",
    caption: "Food & feed grade from the highlands",
    slug: "sorghum",
  },
  {
    image: corn,
    kicker: "Cereals",
    title: "Yellow Corn",
    caption: "Feed & milling grade",
    slug: "corn",
  },
];

const pad = (n: number) => String(n).padStart(2, "0");
const HOLD_MS = 6500;

export function Slideshow() {
  const t = useT();
  const { content } = useSiteContent();
  const [i, setI] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [playing, setPlaying] = useState(true);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current) setPlaying(false);
  }, []);

  // Studio edits flow through; a cleared image falls back to the shipped photo.
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

  const go = useCallback((n: number) => setI((n + slides.length) % slides.length), []);

  useEffect(() => {
    if (!playing || hovering) return;
    const id = setInterval(() => setI((v) => (v + 1) % slides.length), HOLD_MS);
    return () => clearInterval(id);
  }, [playing, hovering]);

  const current = managedSlides[i]!;

  return (
    <section aria-label="Featured commodities" className="section-y bg-background">
      <div className="container-x">
        <div className="max-w-3xl">
          <span className="eyebrow">{t("catalog.featuredEyebrow")}</span>
          <h2 className="mt-3 text-h2 font-medium leading-[1.1] text-foreground">
            {t("catalog.featuredTitleLead")}{" "}
            <span className="italic text-coffee">{t("catalog.featuredTitleAccent")}</span>
          </h2>
        </div>
      </div>

      {/* Cinematic band — full-bleed, slow crossfade, slow drift. */}
      <div
        className="full-bleed relative mt-10 overflow-hidden bg-charcoal"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onFocusCapture={() => setHovering(true)}
        onBlurCapture={() => setHovering(false)}
      >
        <div className="relative aspect-[4/5] max-h-[86vh] w-full sm:aspect-[16/9] lg:aspect-[21/9]">
          {managedSlides.map((slide, index) => {
            const active = index === i;
            return (
              <div
                key={slide.slug}
                aria-hidden={!active}
                className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${
                  active ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={productImage(slide.image)}
                  alt={
                    active
                      ? `${slide.title} — Ethiopian ${slide.kicker.toLowerCase()} for export`
                      : ""
                  }
                  onError={onProductImageError}
                  loading={index === 0 ? "eager" : "lazy"}
                  style={
                    slide.objectPosition ? { objectPosition: slide.objectPosition } : undefined
                  }
                  className={`h-full w-full object-cover ${active ? "cinematic-pan" : ""}`}
                />
              </div>
            );
          })}

          <div aria-hidden className="photo-scrim on-dark" />
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(to_bottom,rgba(18,14,13,0.55),transparent)]"
          />

          {/* Caption */}
          <div className="absolute inset-x-0 bottom-0 on-dark">
            <div className="container-x pb-8 md:pb-12">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold" />
                  {current.kicker}
                </span>
                <h3 className="mt-4 font-display text-h2 leading-[1.08] text-white">
                  {current.title}
                </h3>
                <p className="mt-2 max-w-xl text-sm text-white/85 md:text-base">
                  {current.caption}
                </p>
                <Link
                  to="/products/$slug"
                  params={{ slug: current.slug }}
                  className="group mt-6 inline-flex min-h-[2.75rem] items-center gap-2 rounded-full bg-primary-strong px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
                >
                  {t("action.viewProduct")}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Transport controls */}
          <div className="on-dark absolute inset-x-0 top-0">
            <div className="container-x flex items-center justify-between gap-4 pt-6">
              <p className="text-xs font-semibold tabular-nums text-white/80">
                {pad(i + 1)} <span className="text-white/40">/ {pad(slides.length)}</span>
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPlaying((v) => !v)}
                  aria-label={playing ? t("catalog.pause") : t("catalog.play")}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur transition-colors hover:border-gold hover:text-gold"
                >
                  {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => go(i - 1)}
                  aria-label={t("catalog.previous")}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur transition-colors hover:border-gold hover:text-gold"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => go(i + 1)}
                  aria-label={t("catalog.next")}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur transition-colors hover:border-gold hover:text-gold"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="on-dark absolute inset-x-0 bottom-0">
          <div className="container-x flex justify-center gap-1.5 pb-3">
            {managedSlides.map((slide, index) => (
              <button
                key={slide.slug}
                type="button"
                onClick={() => go(index)}
                aria-label={t("catalog.showSlide", { name: slide.title })}
                aria-current={index === i}
                className={`h-1 rounded-full transition-all duration-500 ${
                  index === i ? "w-8 bg-gold" : "w-3 bg-white/35 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="container-x">
        <p className="mt-6 measure text-sm text-muted-foreground">
          Eleven export lots in rotation.{" "}
          <a
            href="#products"
            className="font-semibold text-primary-strong underline-offset-4 hover:underline"
          >
            Browse the full catalog
          </a>{" "}
          to filter by commodity group.
        </p>
      </div>
    </section>
  );
}
