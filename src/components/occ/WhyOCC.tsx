import { Handshake, BadgeCheck, Users, FileCheck, MessageSquare, Globe2 } from "lucide-react";
import { Reveal } from "./Reveal";
import { useLocalizedContent } from "@/lib/site-content";

const features = [
  {
    icon: Handshake,
    title: "Trusted sourcing partner",
    text: "A dependable Ethiopian counterpart for importers, roasters and food manufacturers worldwide.",
  },
  {
    icon: BadgeCheck,
    title: "Premium quality assurance",
    text: "Every lot cleaned, graded and inspected against international export standards.",
  },
  {
    icon: Users,
    title: "Direct producer relationships",
    text: "We work with cooperatives and farms at origin — no unnecessary intermediaries.",
  },
  {
    icon: FileCheck,
    title: "Export-ready documentation",
    text: "Complete phytosanitary, quality, origin and customs paperwork for smooth clearance.",
  },
  {
    icon: MessageSquare,
    title: "Reliable communication",
    text: "Responsive account handling across time zones, from first inquiry to delivery.",
  },
  {
    icon: Globe2,
    title: "Long-term partnerships",
    text: "We build multi-season relationships that reward consistency and mutual trust.",
  },
];

export function WhyOCC() {
  const content = useLocalizedContent();
  const section = content.home.whyOcc;
  return (
    <section
      id="why-occ"
      className="on-dark surface-dark section-y relative overflow-hidden text-white"
    >
      <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:32px_32px]" />
      <div className="container-x relative">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow-on-dark">{section.eyebrow}</span>
            <h2 className="mt-4 text-h2 font-medium leading-[1.1]">
              {section.title}
              <span className="italic text-gold"> {section.accent}</span>
            </h2>
          </div>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((f, i) => {
            const wide =
              f.title === "Trusted sourcing partner" || f.title === "Export-ready documentation";
            return (
              <Reveal key={f.title} delay={i * 80} className={wide ? "md:col-span-2" : ""}>
                <div className="group h-full rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-gold/12 text-gold transition-transform duration-300 group-hover:scale-110">
                    <f.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 font-display text-2xl font-medium text-white">{f.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">{f.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
