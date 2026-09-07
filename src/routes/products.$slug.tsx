import { productHead } from "@/lib/seo";
import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Toaster } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  MapPin,
  Package,
  Sparkles,
  Utensils,
} from "lucide-react";
import { ProductImage } from "@/components/occ/ProductImage";
import { SiteHeader } from "@/components/occ/SiteHeader";
import { SiteFooter } from "@/components/occ/SiteFooter";
import { RfqModal } from "@/components/occ/RfqModal";
import { downloadTechnicalDataSheet } from "@/lib/datasheet";
import { categories, resolveRegionLink } from "@/data/products";
import { resolveManagedProduct, useManagedCategories, useSiteContent } from "@/lib/site-content";
import {
  onProductImageError,
  productAlt,
  productImage,
  PRODUCT_IMAGE_FALLBACK,
} from "@/lib/product-image";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params, context }) => {
    const product = resolveManagedProduct(params.slug, context.publicCatalog.content);
    if (!product) {
      // Do not tell crawlers a custom product was deleted during a database outage.
      if (!context.publicCatalog.available)
        throw new Error("Catalog temporarily unavailable. Please try again.");
      throw notFound();
    }
    return { product, slug: params.slug };
  },
  head: ({ loaderData }) =>
    loaderData?.product
      ? productHead(loaderData.product)
      : {
          meta: [{ title: "Product unavailable — OCC" }, { name: "robots", content: "noindex" }],
        },
  component: ProductPage,
  notFoundComponent: NotFoundView,
  errorComponent: ({ error }) => (
    <div className="min-h-screen grid place-items-center p-6 text-center">
      <p className="text-muted-foreground">{error.message}</p>
    </div>
  ),
});

function NotFoundView() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="container-x pt-40 pb-24 text-center">
        <h1 className="font-display text-5xl">Product not found</h1>
        <p className="mt-4 text-muted-foreground">
          The product you're looking for isn't in our catalog.
        </p>
        <Link
          to="/"
          hash="products"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary-strong px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Browse products
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}

function ProductGallery({
  name,
  image,
  gallery,
  categoryTitle,
  region,
}: {
  name: string;
  image: string;
  gallery: string[];
  categoryTitle: string;
  region?: string;
}) {
  const pictures = [image, ...gallery].filter((picture) => picture && picture.trim());
  if (pictures.length === 0) pictures.push(PRODUCT_IMAGE_FALLBACK);
  const [active, setActive] = useState(0);
  const shown = pictures[Math.min(active, pictures.length - 1)] ?? PRODUCT_IMAGE_FALLBACK;

  return (
    <div>
      <div className="relative">
        <div className="absolute -left-3 -top-3 h-full w-full rounded-3xl border border-gold/40" />
        <img
          src={productImage(shown)}
          alt={productAlt(name, categoryTitle, region)}
          onError={onProductImageError}
          className="relative aspect-[4/5] w-full rounded-3xl object-cover shadow-2xl"
        />
        <span className="absolute right-4 top-4 rounded-full bg-gold px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-foreground shadow">
          Export Grade
        </span>
      </div>
      {pictures.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {pictures.map((picture, index) => (
            <button
              key={`${picture}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show picture ${index + 1} of ${name}`}
              aria-current={index === active}
              className={`h-16 w-16 overflow-hidden rounded-xl border-2 transition-all ${
                index === active
                  ? "border-primary shadow-md"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={productImage(picture)}
                alt=""
                onError={onProductImageError}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductPage() {
  const { slug } = Route.useLoaderData();
  const { content, ready } = useSiteContent();
  const managedCategories = useManagedCategories();
  const product = resolveManagedProduct(slug, content);
  const [rfqOpen, setRfqOpen] = useState(false);
  if (!ready && !product) {
    return <div className="min-h-screen bg-background" />;
  }
  if (!product) return <NotFoundView />;
  const category =
    managedCategories.find((c) => c.id === product.categoryId) ??
    categories.find((c) => c.id === product.categoryId)!;
  const related = category.products.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="top-right" richColors />
      <SiteHeader />

      <main className="pt-24">
        {/* Breadcrumb + hero */}
        <section className="bg-beige">
          <div className="container-x py-10 md:py-14">
            <nav className="flex flex-wrap items-center gap-1.5 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              <Link to="/" className="hover:text-primary-strong">
                Home
              </Link>
              <span>/</span>
              <Link to="/" hash="products" className="hover:text-primary-strong">
                Products
              </Link>
              <span>/</span>
              <Link to="/" hash={category.id} className="hover:text-primary-strong">
                {category.title}
              </Link>
              <span>/</span>
              <span className="text-foreground">{product.name}</span>
            </nav>

            <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-center">
              <ProductGallery
                name={product.name}
                image={product.image}
                gallery={product.gallery ?? []}
                categoryTitle={category.title}
                region={product.regions?.[0]}
              />

              <div>
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary-strong">
                  <span aria-hidden>{category.icon}</span> {category.title}
                </span>
                <h1 className="mt-4 font-display text-4xl font-medium leading-tight md:text-6xl">
                  {product.name}
                </h1>
                <p className="mt-5 font-display text-xl italic text-coffee md:text-2xl">
                  {product.tagline}
                </p>
                <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                  {product.overview}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setRfqOpen(true)}
                    className="group inline-flex items-center gap-2 rounded-full bg-primary-strong px-7 py-4 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:-translate-y-0.5"
                  >
                    Request Quote for {product.name}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                  <Link
                    to="/"
                    hash="products"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-4 text-sm font-semibold text-foreground transition-all hover:border-primary"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    All products
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detail grid */}
        <section className="py-20 md:py-28">
          <div className="container-x grid gap-10 lg:grid-cols-3">
            {/* Specs */}
            <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-8 md:p-10 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary-strong">
                  <Sparkles className="h-5 w-5" />
                </span>
                <h2 className="font-display text-3xl font-medium">Specifications</h2>
              </div>
              <dl className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {product.specs.map((s: { label: string; value: string }) => (
                  <div key={s.label} className="border-b border-border/60 pb-4">
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {s.label}
                    </dt>
                    <dd className="mt-1.5 text-foreground">{s.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary-strong" />
                    <h3 className="font-display text-lg font-medium">Packaging</h3>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {product.packaging.map((p: string) => (
                      <li key={p} className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />

                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Utensils className="h-4 w-4 text-primary-strong" />
                    <h3 className="font-display text-lg font-medium">Applications</h3>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {product.uses.map((u: string) => (
                      <li key={u} className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />

                        <span>{u}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Sourcing regions + CTA */}
            <aside className="space-y-6">
              <div className="rounded-3xl bg-primary-strong p-8 text-primary-foreground shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gold text-gold-foreground">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <h2 className="font-display text-2xl font-medium">Sourcing Regions</h2>
                </div>
                <p className="mt-4 text-sm text-primary-foreground/75">
                  Sourced directly from cooperatives and farms across:
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {product.regions.map((r: string) => {
                    const slug = resolveRegionLink(r, product.slug, category.id);
                    return slug ? (
                      <li key={r}>
                        <Link
                          to="/products/$slug"
                          params={{ slug }}
                          className="inline-block rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-xs font-medium backdrop-blur transition-all hover:bg-white/20 hover:border-white/50"
                        >
                          {r}
                        </Link>
                      </li>
                    ) : (
                      <li
                        key={r}
                        className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium backdrop-blur"
                      >
                        {r}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="rounded-3xl border border-border bg-beige p-8">
                <h3 className="font-display text-2xl font-medium">Ready to import?</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  Share your target volume, destination port and required grade — we'll respond
                  within one business day.
                </p>
                <button
                  type="button"
                  onClick={() => setRfqOpen(true)}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-coffee px-6 py-3.5 text-sm font-semibold text-coffee-foreground transition-all hover:opacity-90"
                >
                  Send Inquiry
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => downloadTechnicalDataSheet(product)}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-coffee/40 bg-transparent px-6 py-3.5 text-sm font-semibold text-coffee transition-all hover:border-coffee hover:bg-coffee/5"
                >
                  <Download className="h-4 w-4" />
                  Download Technical Data Sheet (PDF)
                </button>
              </div>
            </aside>
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="bg-beige py-20 md:py-24">
            <div className="container-x">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 className="font-display text-3xl font-medium md:text-4xl">
                  More {category.title.toLowerCase()} products
                </h2>
                <Link
                  to="/"
                  hash={category.id}
                  className="text-sm font-semibold text-primary-strong hover:text-primary-strong/80"
                >
                  View all →
                </Link>
              </div>
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    to="/products/$slug"
                    params={{ slug: p.slug }}
                    className="group overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-border transition-all hover:-translate-y-1 hover:shadow-2xl"
                  >
                    <div className="aspect-square overflow-hidden bg-beige">
                      <ProductImage
                        src={p.image}
                        alt={productAlt(p.name, category.title, p.regions?.[0])}
                        name={p.name}
                        categoryId={category.id}
                        imageClassName="transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-lg font-medium">{p.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{p.tagline}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <SiteFooter />

      <RfqModal open={rfqOpen} onClose={() => setRfqOpen(false)} commodity={product.name} />
    </div>
  );
}
