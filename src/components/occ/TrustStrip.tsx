import { ScanLine, Users, Clock } from "lucide-react";

const items = [
  { icon: ScanLine, label: "Origin traceable" },
  { icon: Users, label: "Direct producer relationships" },
  { icon: Clock, label: "Response within one business day" },
];

export function TrustStrip() {
  return (
    <section aria-label="What OCC offers buyers" className="border-b border-border bg-card">
      <div className="container-x py-6">
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-4">
          {items.map(({ icon: Icon, label }) => (
            <li key={label} className="flex min-w-0 items-center gap-3">
              <Icon aria-hidden className="h-4.5 w-4.5 shrink-0 text-primary-strong" />
              <span className="text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
