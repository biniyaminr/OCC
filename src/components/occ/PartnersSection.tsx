import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { partners } from "@/data/partners";

export function PartnersSection() {
  return (
    <section id="partners" className="relative overflow-hidden bg-background py-24 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 55% at 80% 0%, color-mix(in oklab, var(--gold) 22%, transparent), transparent 70%), radial-gradient(55% 50% at 10% 100%, color-mix(in oklab, var(--primary) 14%, transparent), transparent 70%)",
        }}
      />
      <div className="container-x relative">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-strong">
              Our Partners
            </span>
            <h2 className="mt-4 font-display text-4xl font-medium md:text-5xl">
              Machinery partners powering
              <span className="italic text-primary-strong"> Ethiopian agro-processing.</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              OCC works alongside trusted equipment manufacturers who supply the sorting and
              processing technology behind export-grade quality.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {partners.map((p, i) => (
            <Reveal key={p.slug} delay={i * 100}>
              <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                <div className="flex flex-col gap-3 bg-primary-strong p-8 text-primary-foreground">
                  <span className="w-fit rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]">
                    {p.category}
                  </span>
                  <h3 className="font-display text-3xl font-medium">{p.name}</h3>
                  <p className="text-sm leading-relaxed text-primary-foreground/80">{p.tagline}</p>
                </div>
                <div className="flex flex-1 flex-col bg-beige p-8">
                  <p className="text-sm leading-relaxed text-foreground/80">{p.description}</p>
                  <ul className="mt-6 space-y-2.5">
                    {p.highlights.slice(0, 3).map((h) => (
                      <li
                        key={h}
                        className="flex items-start gap-2.5 text-sm text-muted-foreground"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-wrap items-center gap-4 pt-8">
                    <Link
                      to="/partners"
                      hash={p.slug}
                      className="inline-flex items-center gap-2 rounded-full bg-primary-strong px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                      Learn more
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer external"
                      aria-label={`Visit the ${p.name} website (opens in a new tab)`}
                      className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary-strong hover:underline"
                    >
                      {p.domain}
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-12 text-center">
            <Link
              to="/partners"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              View all partners
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
