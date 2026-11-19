import { seoHead, breadcrumbSchema } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, ChevronRight, Cpu, Factory, Settings2, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/occ/SiteHeader";
import { SiteFooter } from "@/components/occ/SiteFooter";
import { Reveal } from "@/components/occ/Reveal";
import { PartnerCarousel } from "@/components/occ/PartnerCarousel";
import { resolveManagedPartners, useSiteContent } from "@/lib/site-content";

const benefits = [
  {
    icon: Cpu,
    title: "Modern technology",
    text: "Precision machinery that raises purity and reduces manual re-sorting.",
  },
  {
    icon: Factory,
    title: "Processing capacity",
    text: "Equipment sized for commercial export volumes and continuous operation.",
  },
  {
    icon: Settings2,
    title: "Local service",
    text: "On-the-ground installation, training and spare parts support.",
  },
  {
    icon: ShieldCheck,
    title: "Export standards",
    text: "Consistent grading that meets international buyer specifications.",
  },
];

export const Route = createFileRoute("/partners")({
  head: () =>
    seoHead({
      title: "Commodity Processing & Machinery Partners | OCC",
      description:
        "Explore OCC's machinery partnerships for optical sorting, cleaning, grading and processing Ethiopian coffee, pulses, oilseeds and cereals.",
      path: "/partners",
      schema: [breadcrumbSchema("Partners", "/partners")],
    }),
  component: PartnersPage,
});

function PartnersPage() {
  const { content } = useSiteContent();
  const managedPartners = resolveManagedPartners(content);
  return (
    <div className="partners-theme min-h-screen">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden border-b border-border pt-32 pb-16 md:pt-40 md:pb-20">
          <div aria-hidden className="tech-grid pointer-events-none absolute inset-0 opacity-60" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(70% 60% at 50% -10%, color-mix(in oklab, var(--primary) 14%, transparent), transparent 70%)",
            }}
          />
          <div className="container-x relative">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
            >
              <Link to="/" className="transition-colors hover:text-gold">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-foreground">Partners</span>
            </nav>

            <div className="mt-8">
              <p className="text-center text-2xl font-semibold leading-snug text-foreground/90 md:text-3xl lg:text-4xl">
                Are you looking for processing lines for your best crops? Then Meet the top leading
                manufacturers of the food processing machinery industry.
              </p>
            </div>

            <div className="mt-10 overflow-hidden border-y border-border py-4">
              <div className="marquee-track">
                <span className="whitespace-nowrap px-8 font-display text-2xl font-semibold uppercase tracking-tight text-gold md:text-3xl">
                  From the engineering hub to the world!
                </span>
                <span className="whitespace-nowrap px-8 font-display text-2xl font-semibold uppercase tracking-tight text-gold md:text-3xl">
                  From the engineering hub to the world!
                </span>
                <span className="whitespace-nowrap px-8 font-display text-2xl font-semibold uppercase tracking-tight text-gold md:text-3xl">
                  From the engineering hub to the world!
                </span>
                <span className="whitespace-nowrap px-8 font-display text-2xl font-semibold uppercase tracking-tight text-gold md:text-3xl">
                  From the engineering hub to the world!
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="container-x">
            {managedPartners.map((p, i) => (
              <Reveal key={p.slug} delay={i * 80}>
                <article
                  id={p.slug}
                  className="grid gap-10 border-b border-border py-14 last:border-b-0 lg:grid-cols-12 lg:py-20"
                >
                  <div className="lg:col-span-4">
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-3xl text-gold/60">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h2 className="font-sans text-2xl font-semibold uppercase tracking-tight md:text-3xl">
                        {p.name}
                      </h2>
                    </div>
                    <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {p.category}
                    </p>
                    <p className="mt-5 text-sm leading-relaxed text-foreground/75">{p.tagline}</p>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer external"
                      aria-label={`Visit the ${p.name} website (opens in a new tab)`}
                      className="group mt-7 inline-flex w-fit items-center gap-3 border border-gold px-8 py-4 font-mono text-sm uppercase tracking-[0.18em] text-gold transition-colors hover:bg-gold hover:text-gold-foreground"
                    >
                      {p.domain}
                      <ArrowUpRight className="h-6 w-6 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </div>

                  <div className="lg:col-span-8">
                    <p className="text-base leading-relaxed text-foreground/80">
                      {p.longDescription}
                    </p>

                    <div className="mt-8">
                      <h3 className="border-b border-border pb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-gold">
                        Product range
                      </h3>
                      <div className="mt-4">
                        <PartnerCarousel
                          items={p.gallery}
                          label={p.name}
                          overlay={p.offerings.flatMap((o) => o.items)}
                        />
                      </div>
                    </div>

                    {p.offerings.length > 0 && (
                      <div className="mt-9">
                        <h3 className="border-b border-border pb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-gold">
                          Offering
                        </h3>
                        <div className="mt-5 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                          {p.offerings.map((o) => (
                            <div key={o.title}>
                              <h4 className="font-sans text-sm font-semibold uppercase tracking-tight">
                                {o.title}
                              </h4>
                              <ul className="mt-3 space-y-2">
                                {o.items.map((it) => (
                                  <li
                                    key={it}
                                    className="flex gap-2 text-sm leading-relaxed text-muted-foreground"
                                  >
                                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                                    {it}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(p.highlights.length > 0 || p.serves.length > 0) && (
                      <div className="mt-9 grid gap-8 sm:grid-cols-2">
                        {p.highlights.length > 0 && (
                          <div>
                            <h3 className="border-b border-border pb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-gold">
                              Capabilities
                            </h3>
                            <ul className="mt-4 space-y-3">
                              {p.highlights.map((h, hi) => (
                                <li key={h} className="flex gap-3 text-sm text-muted-foreground">
                                  <span className="font-mono text-[11px] text-gold/70">
                                    {String(hi + 1).padStart(2, "0")}
                                  </span>
                                  {h}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {p.serves.length > 0 && (
                          <div>
                            <h3 className="border-b border-border pb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-gold">
                              Commodities served
                            </h3>
                            <div className="mt-4 flex flex-wrap gap-2">
                              {p.serves.map((s) => (
                                <span
                                  key={s}
                                  className="border border-border bg-secondary px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground/70"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden py-16 md:py-24">
          <div aria-hidden className="tech-grid pointer-events-none absolute inset-0 opacity-40" />
          <div className="container-x relative">
            <Reveal>
              <h2 className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold">
                Why these partners
              </h2>
            </Reveal>

            <div className="mt-8 grid divide-y divide-border border-y border-border sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
              {benefits.map((b, i) => (
                <Reveal key={b.title} delay={i * 70}>
                  <div className="h-full p-7 sm:border-r sm:border-border">
                    <b.icon className="h-5 w-5 text-gold" />
                    <h3 className="mt-5 font-sans text-base font-semibold uppercase tracking-tight">
                      {b.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
