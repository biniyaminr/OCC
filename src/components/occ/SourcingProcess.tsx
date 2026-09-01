import { Reveal } from "./Reveal";
import { useSiteContent } from "@/lib/site-content";

const steps = [
  {
    n: "01",
    title: "Tell us what you need",
    text: "Share commodity, grade, volume and destination port through the inquiry form.",
  },
  {
    n: "02",
    title: "Confirm product & specs",
    text: "We match your requirement to available lots and confirm specifications.",
  },
  {
    n: "03",
    title: "Review quality & terms",
    text: "Samples, grading details and indicative commercial terms are agreed.",
  },
  {
    n: "04",
    title: "Prepare export documentation",
    text: "Phytosanitary, quality, origin and customs paperwork is completed.",
  },
  {
    n: "05",
    title: "Coordinate shipment",
    text: "Packing, cleaning and FOB Djibouti loading are scheduled and tracked.",
  },
];

export function SourcingProcess() {
  const { content } = useSiteContent();
  const section = content.home.process;
  return (
    <section id="process" className="section-y bg-beige">
      <div className="container-x">
        <Reveal>
          <div className="max-w-2xl">
            <span className="eyebrow">{section.eyebrow}</span>
            <h2 className="mt-4 text-h2 font-medium leading-[1.1] text-foreground">
              {section.title} <span className="italic text-coffee">{section.accent}</span>
            </h2>
          </div>
        </Reveal>

        <ol className="mt-14 grid gap-6 md:grid-cols-3 lg:grid-cols-5">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 80}>
              <li className="relative h-full rounded-3xl border border-border bg-card p-6">
                <span className="font-display text-3xl text-primary-strong">{s.n}</span>
                <h3 className="mt-4 font-display text-xl text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
