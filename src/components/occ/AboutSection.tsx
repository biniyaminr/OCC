import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { useLocalizedContent } from "@/lib/site-content";

const stats = [
  { k: "10+", v: "Product categories" },
  { k: "20+", v: "Export destinations" },
  { k: "100%", v: "Origin traceability" },
];

export function AboutSection() {
  const content = useLocalizedContent();
  const about = content.home.about;
  return (
    <section id="about" className="section-hairline section-y relative bg-background">
      <div className="container-x">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-20">
          <Reveal>
            <div>
              <span className="eyebrow">{about.eyebrow}</span>
              <h2 className="mt-4 text-h2 font-medium leading-[1.1] text-foreground">
                {about.title} <span className="italic text-coffee">{about.accent}</span>
              </h2>
              <p className="mt-6 measure leading-relaxed text-muted-foreground">
                {about.description}
              </p>

              <a
                href="#why-occ"
                className="group mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary-strong"
              >
                Learn about OCC
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>

              <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-8">
                {stats.map((s) => (
                  <div key={s.v} className="min-w-0">
                    <dt className="font-display text-[clamp(2rem,1.4rem+1.6vw,2.9rem)] font-semibold leading-none text-primary-strong">
                      {s.k}
                    </dt>
                    <dd className="mt-2 text-[0.72rem] font-semibold uppercase leading-snug tracking-[0.14em] text-muted-foreground">
                      {s.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative overflow-hidden rounded-3xl border border-border">
              <img
                src={about.image}
                alt="Ethiopian highland coffee farm at harvest time"
                width={1920}
                height={1088}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover object-[38%_center] lg:aspect-[3/4]"
              />

              <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(to_top,rgba(18,14,13,0.55),transparent_55%)]"
              />
              <p className="absolute inset-x-0 bottom-0 p-6 text-sm text-white/90">
                {about.imageCaption}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
