import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PartnerProduct } from "@/data/partners";

type Props = {
  items: PartnerProduct[];
  label: string;
  interval?: number;
  overlay?: string[];
};

export function PartnerCarousel({ items, label, interval = 3500, overlay = [] }: Props) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const id = setInterval(() => setI((v) => (v + 1) % items.length), interval);
    return () => clearInterval(id);
  }, [items.length, interval]);

  if (items.length === 0) return null;

  const go = (n: number) => setI((n + items.length) % items.length);

  return (
    <div aria-label={`${label} product gallery`} className="w-full">
      <div className="relative aspect-[4/3] w-full overflow-hidden border border-border bg-secondary">
        {items.map((item, idx) => (
          <div
            key={item.image}
            className={`absolute inset-0 transition-opacity duration-700 ${
              idx === i ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={idx !== i}
          >
            <img
              src={item.image}
              alt={`${item.name} — ${label}`}
              referrerPolicy="no-referrer"
              loading={idx === 0 ? "eager" : "lazy"}
              className="h-full w-full bg-white object-contain p-4"
            />
          </div>
        ))}

        {overlay.length > 0 && (
          <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap gap-2.5 bg-gradient-to-b from-black/60 to-transparent p-4 pb-12">
            <span className="border border-white/30 bg-black/45 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.14em] text-white">
              {label}
            </span>
            <span
              key={overlay[i % overlay.length]}
              className="animate-fade-in border border-gold/60 bg-black/45 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.14em] text-white"
            >
              {overlay[i % overlay.length]}
            </span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white">
            {items[i].name}
          </p>
        </div>

        <button
          type="button"
          onClick={() => go(i - 1)}
          aria-label={`Previous ${label} product`}
          className="absolute left-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center border border-border bg-background/85 text-foreground transition-colors hover:bg-gold hover:text-gold-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => go(i + 1)}
          aria-label={`Next ${label} product`}
          className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center border border-border bg-background/85 text-foreground transition-colors hover:bg-gold hover:text-gold-foreground"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {items.map((item, idx) => (
          <button
            key={item.image}
            type="button"
            onClick={() => go(idx)}
            aria-label={`Show ${item.name}`}
            className={`h-1.5 transition-all ${
              idx === i ? "w-7 bg-gold" : "w-3 bg-border hover:bg-gold/50"
            }`}
          />
        ))}
        <span className="ml-auto font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
