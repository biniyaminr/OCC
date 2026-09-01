import { Coffee, Mountain, Sun, Award, Sprout, Ship, ShieldCheck } from "lucide-react";
import { Reveal } from "./Reveal";
import { useSiteContent } from "@/lib/site-content";

const lead = [
  {
    icon: Coffee,
    title: "Birthplace of Arabica",
    text: "The original home of Coffea arabica, with unmatched varietal diversity across eight distinct growing origins.",
  },
  {
    icon: Mountain,
    title: "Fertile volcanic soils",
    text: "Nutrient-rich highland soils shaped by millennia of geological activity give Ethiopian crops their character.",
  },
];

const facts = [
  {
    icon: Sun,
    title: "Diverse climate zones",
    text: "Micro-climates enable year-round production across commodities.",
  },
  {
    icon: Award,
    title: "High-quality products",
    text: "Naturally cultivated, low-input crops with distinct flavour.",
  },
  {
    icon: Sprout,
    title: "Sustainable traditions",
    text: "Smallholder heritage rooted in generational stewardship.",
  },
  {
    icon: Ship,
    title: "Strong export potential",
    text: "Established lanes to Europe, Asia, the Americas and the Gulf.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable supply chains",
    text: "Coordinated sourcing, cleaning, grading and documentation.",
  },
];

export function WhyEthiopia() {
  const { content } = useSiteContent();
  const section = content.home.whyEthiopia;
  return (
    <section id="why-ethiopia" className="section-y relative overflow-hidden bg-background">
      <div aria-hidden className="contour-texture pointer-events-none absolute inset-0" />
      <div aria-hidden className="topo-pattern pointer-events-none absolute inset-0 opacity-60" />
      <div className="container-x relative">
        <Reveal>
          <div className="max-w-2xl">
            <span className="eyebrow">{section.eyebrow}</span>
            <h2 className="mt-4 text-h2 font-medium leading-[1.1] text-foreground">
              {section.title} <span className="italic text-coffee">{section.accent}</span>
            </h2>
            <p className="mt-5 measure leading-relaxed text-muted-foreground">
              {section.description}
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {lead.map((item, i) => (
            <Reveal key={item.title} delay={i * 90} className="lg:col-span-3 xl:col-span-1">
              <article className="flex h-full flex-col justify-between rounded-3xl border border-border bg-card p-8 transition-colors hover:border-primary/40">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary-strong">
                  <item.icon aria-hidden className="h-5 w-5" />
                </span>
                <div className="mt-8">
                  <h3 className="font-display text-h3 text-foreground">{item.title}</h3>
                  <p className="mt-3 measure text-sm leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}

          <Reveal delay={180} className="lg:col-span-3 xl:col-span-1">
            <div className="grid h-full gap-5 sm:grid-cols-2 xl:grid-cols-1">
              {facts.slice(0, 2).map((f) => (
                <FactCard key={f.title} {...f} />
              ))}
            </div>
          </Reveal>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {facts.slice(2).map((f, i) => (
            <Reveal key={f.title} delay={i * 80}>
              <FactCard {...f} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FactCard({ icon: Icon, title, text }: { icon: typeof Sun; title: string; text: string }) {
  return (
    <article className="flex h-full items-start gap-4 rounded-3xl border border-border bg-card/70 p-6 transition-colors hover:border-primary/40">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary-strong">
        <Icon aria-hidden className="h-4.5 w-4.5" />
      </span>
      <div className="min-w-0">
        <h3 className="font-display text-xl text-foreground">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
      </div>
    </article>
  );
}
