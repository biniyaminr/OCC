import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useManagedProducts } from "@/lib/site-content";
import { onProductImageError, productImage } from "@/lib/product-image";

export function ProductSearchBar() {
  const navigate = useNavigate({ from: "/" });
  const allProducts = useManagedProducts();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // The full placeholder is clipped on a 390px viewport, so narrow screens get
  // a shorter one. Matches Tailwind's `sm` breakpoint.
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 639px)");
    const sync = () => setCompact(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allProducts
      .filter((p) => {
        const hay = [p.name, p.categoryTitle, p.tagline, p.slug, ...p.regions]
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      })
      .slice(0, 8);
  }, [query, allProducts]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [matches.length]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!matches.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % matches.length);
      setOpen(true);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + matches.length) % matches.length);
      setOpen(true);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = matches[activeIndex >= 0 ? activeIndex : 0];
      if (target) {
        navigate({ to: "/products/$slug", params: { slug: target.slug } });
        setOpen(false);
        setQuery("");
      }
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <div className="pointer-events-none absolute left-4 text-muted-foreground sm:left-5">
          <Search className="h-5 w-5" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => query.trim() && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={
            compact ? "Search products or origins" : "Search products, origins, or categories..."
          }
          className="h-14 w-full rounded-full border border-white/30 bg-white/95 pl-12 pr-11 text-[0.95rem] text-foreground shadow-lg backdrop-blur transition-all placeholder:text-muted-foreground/70 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 sm:pl-14 sm:pr-12 sm:text-base"
          aria-label="Search products"
          aria-autocomplete="list"
          aria-controls={open ? "search-results" : undefined}
          aria-expanded={open}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-4 grid h-6 w-6 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:right-5"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {open && query.trim() && (
        <div
          id="search-results"
          role="listbox"
          className="absolute top-full z-50 mt-3 w-full overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl"
        >
          {matches.length > 0 ? (
            <ul className="max-h-[320px] overflow-y-auto py-2">
              {matches.map((p, i) => (
                <li key={p.slug} role="option" aria-selected={i === activeIndex}>
                  <Link
                    to="/products/$slug"
                    params={{ slug: p.slug }}
                    onClick={() => {
                      setQuery("");
                      setOpen(false);
                      setActiveIndex(-1);
                    }}
                    className={`flex items-center justify-between px-5 py-3 transition-colors ${
                      i === activeIndex ? "bg-primary/10 text-primary-strong" : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={productImage(p.image)}
                        alt=""
                        onError={onProductImageError}
                        className="h-10 w-10 rounded-lg object-cover"
                        loading="lazy"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{p.name}</span>
                        <span className="text-xs text-muted-foreground">{p.categoryTitle}</span>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-primary-strong">View</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-5 py-4 text-sm text-muted-foreground">
              No products found for "{query}". Try "coffee", "sesame", or "chickpeas".
            </div>
          )}
        </div>
      )}
    </div>
  );
}
