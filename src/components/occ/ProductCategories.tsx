import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { getSpec, type Product } from "@/data/products";
import { productAlt } from "@/lib/product-image";
import { ProductImage } from "./ProductImage";
import { Reveal } from "./Reveal";
import { categoryTags, tagOf, useManagedCategories, useSiteContent } from "@/lib/site-content";

const numberWords = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight"];

export function ProductCategories() {
  const managedCategories = useManagedCategories();
  const { content } = useSiteContent();
  const section = content.home.products;
  const [activeTag, setActiveTag] = useState<string>("All");

  // Tags follow the managed categories, so groups added or renamed in the
  // studio get their own filter chip.
  const allTags = useMemo(() => ["All", ...categoryTags(managedCategories)], [managedCategories]);
  const groupCountWord = numberWords[managedCategories.length] ?? String(managedCategories.length);

  // A renamed or removed category must not leave the grid stuck on a dead tag.
  const selectedTag = allTags.includes(activeTag) ? activeTag : "All";

  const countFor = (tag: string) =>
    managedCategories.reduce(
      (n, cat) => n + cat.products.filter((p) => tag === "All" || tagOf(cat, p) === tag).length,
      0,
    );

  const visible = managedCategories
    .map((cat) => ({
      ...cat,
      products:
        selectedTag === "All"
          ? cat.products
          : cat.products.filter((p) => tagOf(cat, p) === selectedTag),
    }))
    .filter((cat) => cat.products.length > 0);

  return (
    <section id="products" className="relative scroll-mt-24 bg-beige py-16 md:py-24">
      <div className="container-x">
        <Reveal>
          <div className="max-w-3xl">
            <span className="eyebrow">{section.eyebrow}</span>
            <h2 className="mt-4 text-[clamp(1.65rem,1.05rem+2.1vw,3rem)] font-medium leading-[1.12] text-foreground">
              <span className="block">{section.title}</span>
              <span className="block italic text-coffee">{section.accent}</span>
            </h2>
          </div>

          <p className="mt-5 measure leading-relaxed text-muted-foreground">
            {section.description.replace(/^Four\b/, groupCountWord)}
          </p>
        </Reveal>

        <div className="sticky top-[4.25rem] z-20 -mx-5 mt-10 bg-beige/95 px-5 py-3 backdrop-blur md:-mx-10 md:px-10 lg:top-[4.875rem]">
          <div
            role="group"
            aria-label="Filter products by category"
            className="flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {allTags.map((tag) => {
              const active = selectedTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveTag(tag)}
                  className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] transition-colors ${
                    active
                      ? "border-primary bg-primary-strong text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {tag}
                  <span className="ml-2 tabular-nums opacity-70">{countFor(tag)}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-12 space-y-20">
          {visible.map((cat, idx) => (
            <div key={cat.id} id={cat.id} className="scroll-mt-32">
              <Reveal>
                <div className="mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
                  <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        aria-hidden
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-xl"
                      >
                        {cat.icon}
                      </span>
                      <h3 className="truncate font-display text-h3 text-foreground">{cat.title}</h3>
                    </div>
                    <p className="mt-3 measure text-sm text-muted-foreground">{cat.blurb}</p>
                  </div>
                  <span className="shrink-0 text-sm font-medium tabular-nums text-muted-foreground">
                    0{idx + 1} / 0{visible.length}
                  </span>
                </div>
              </Reveal>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {cat.products.map((p, i) => (
                  <Reveal key={p.slug} delay={i * 60}>
                    <ProductCard product={p} categoryId={cat.id} categoryTitle={cat.title} />
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  categoryId,
  categoryTitle,
}: {
  product: Product;
  categoryId: string;
  categoryTitle: string;
}) {
  const specs = [
    getSpec(product, "Altitude"),
    getSpec(product, "Grades"),
    getSpec(product, "Processing"),
  ].filter((v): v is string => Boolean(v));

  const region = product.regions?.[0];

  return (
    <Link
      to="/products/$slug"
      params={{ slug: product.slug }}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg focus-visible:-translate-y-1 focus-visible:border-primary"
    >
      <div className="relative aspect-square overflow-hidden bg-beige">
        <ProductImage
          src={product.image}
          alt={productAlt(product.name, categoryTitle, region)}
          name={product.name}
          categoryId={categoryId}
          objectPosition={product.imagePosition}
          imageClassName="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />

        <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold" />
          {categoryId === "coffee" ? "Coffee" : categoryTitle}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h4 className="font-display text-xl text-foreground">{product.name}</h4>
        {region && (
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            {region}
          </p>
        )}
        {specs.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {specs.map((s) => (
              <li
                key={s}
                className="rounded-full border border-border px-2.5 py-1 text-[0.68rem] text-muted-foreground"
              >
                {s}
              </li>
            ))}
          </ul>
        )}
        <span className="mt-auto flex items-center gap-2 pt-5 text-xs font-semibold uppercase tracking-[0.16em] text-primary-strong">
          View details
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
