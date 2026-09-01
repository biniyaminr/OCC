import { ArrowDownRight } from "lucide-react";

const overviewItems = [
  {
    number: "01",
    eyebrow: "Portfolio",
    title: "Explore the harvest",
    description: "Coffee, oilseeds, pulses and cereals selected for export markets.",
    href: "#products",
  },
  {
    number: "02",
    eyebrow: "Origin",
    title: "Understand Ethiopia",
    description: "See how altitude, soil and producer knowledge shape every crop.",
    href: "#why-ethiopia",
  },
  {
    number: "03",
    eyebrow: "Assurance",
    title: "Why buyers choose OCC",
    description: "Traceability, quality control and responsive coordination at origin.",
    href: "#why-occ",
  },
  {
    number: "04",
    eyebrow: "Delivery",
    title: "Follow the sourcing path",
    description: "From your first specification to export documents and shipment.",
    href: "#process",
  },
];

export function PageOverview() {
  return (
    <section
      id="overview"
      aria-labelledby="overview-heading"
      className="on-dark surface-dark border-b border-white/10 text-white"
    >
      <div className="container-x py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,2.28fr)] lg:gap-12">
          <div>
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold">
              At a glance
            </span>
            <h2
              id="overview-heading"
              className="mt-3 max-w-sm font-display text-3xl leading-tight text-white md:text-4xl"
            >
              Your route from <span className="italic text-gold">origin to market.</span>
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              Use this guide to move quickly through OCC&apos;s products, sourcing standards and
              export process.
            </p>
          </div>

          <nav aria-label="Homepage overview" className="grid sm:grid-cols-2">
            {overviewItems.map((item) => (
              <a
                key={item.number}
                href={item.href}
                className="group relative border-t border-white/15 py-6 pr-4 transition-colors hover:border-gold sm:px-6 sm:first:border-r sm:nth-3:border-r lg:first:border-r lg:nth-3:border-r"
              >
                <div className="flex items-start justify-between gap-5">
                  <span className="font-display text-2xl text-white/35 transition-colors group-hover:text-gold">
                    {item.number}
                  </span>
                  <ArrowDownRight
                    aria-hidden
                    className="h-5 w-5 text-white/35 transition-all group-hover:translate-x-1 group-hover:translate-y-1 group-hover:text-gold"
                  />
                </div>
                <p className="mt-7 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-gold">
                  {item.eyebrow}
                </p>
                <h3 className="mt-2 font-display text-2xl text-white">{item.title}</h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/60">
                  {item.description}
                </p>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
