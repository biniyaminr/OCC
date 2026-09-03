import { Link, useRouterState } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { useSiteContent } from "@/lib/site-content";
import { scrollToTop } from "@/lib/scroll";
import { LANGUAGES, useLanguage, type UIKey } from "@/lib/i18n";

type NavItem = { key: UIKey; href: string; route?: boolean };

const nav: NavItem[] = [
  { key: "nav.about", href: "#about" },
  { key: "nav.commodities", href: "#products" },
  { key: "nav.whyEthiopia", href: "#why-ethiopia" },
  { key: "nav.whyOcc", href: "#why-occ" },
  { key: "nav.howItWorks", href: "#process" },
  { key: "nav.partners", href: "/partners", route: true },
];

const sectionIds = [...nav.filter((n) => !n.route).map((n) => n.href.replace("#", "")), "contact"];

function headerOffset() {
  return window.innerWidth >= 1024 ? 78 : 68;
}

export function SiteHeader() {
  const { content } = useSiteContent();
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isPartnersPage = pathname === "/partners";

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape closes the drawer, and Tab is kept inside it while it is open.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const focusable = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((el) => el.offsetParent !== null);

    focusable()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        closeButtonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !panel?.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // A route change must never leave the drawer hanging open.
  useEffect(() => setOpen(false), [pathname]);

  // Scroll-aware state: solid header + single active section
  useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => {
      setScrolled(window.scrollY > 20);
      if (pathname !== "/") return;

      const line = headerOffset() + Math.min(160, window.innerHeight * 0.2);
      let current = "";

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= line && rect.bottom > line) {
          current = id;
          break;
        }
        if (rect.top <= line) current = id;
      }

      // Bottom of page: last section wins
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
        const last = [...sectionIds].reverse().find((id) => document.getElementById(id));
        if (last) current = last;
      }

      setActiveHash(current ? `#${current}` : "");
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  const solid = scrolled || isPartnersPage || open;

  const hrefFor = (n: (typeof nav)[number]) =>
    n.route ? n.href : pathname === "/" ? n.href : `/${n.href}`;

  const isActive = (n: (typeof nav)[number]) =>
    n.route ? pathname.startsWith(n.href) : activeHash === n.href;

  const onBrandClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      setOpen(false);
      if (pathname !== "/") return; // let the router navigate
      event.preventDefault();
      setActiveHash("");
      scrollToTop();
    },
    [pathname],
  );

  const onAnchorClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
      if (pathname !== "/") return;
      const el = document.getElementById(hash.replace("#", ""));
      if (!el) return;
      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY - headerOffset();
      window.scrollTo({
        top,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
      setActiveHash(hash);
      history.replaceState(null, "", hash);
      setOpen(false);
    },
    [pathname],
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "border-b border-border bg-background/95 shadow-[0_1px_20px_rgba(33,21,15,0.06)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-x grid h-[4.25rem] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 lg:h-[4.875rem]">
        <Link
          to="/"
          onClick={onBrandClick}
          aria-label={`${content.brand.shortName} — ${t("nav.home")}`}
          className="flex min-w-0 items-center gap-3 rounded-xl"
        >
          <img
            src={content.brand.logo}
            alt={content.brand.name}
            width={96}
            height={96}
            className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-border lg:h-12 lg:w-12"
          />
          <span className="flex min-w-0 flex-col leading-tight">
            <span
              className={`font-display text-xl font-semibold tracking-tight lg:text-[1.4rem] ${
                solid ? "text-foreground" : "text-white"
              }`}
            >
              {content.brand.shortName}
            </span>
            <span
              className={`truncate text-[0.62rem] uppercase tracking-[0.18em] ${
                solid ? "text-muted-foreground" : "text-white/75"
              }`}
            >
              {content.brand.name}
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <nav aria-label={t("nav.main")} className="hidden items-center gap-1 lg:flex">
            {nav.map((n) => {
              const active = isActive(n);
              const base = solid
                ? "text-foreground/75 hover:text-primary-strong"
                : "text-white/85 hover:text-gold";
              const cls = `relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                active ? "bg-primary/12 text-primary-strong" : base
              }`;
              return n.route ? (
                <Link
                  key={n.href}
                  to={n.href}
                  className={cls}
                  aria-current={active ? "page" : undefined}
                >
                  {t(n.key)}
                </Link>
              ) : (
                <a
                  key={n.href}
                  href={hrefFor(n)}
                  onClick={(e) => onAnchorClick(e, n.href)}
                  className={cls}
                  aria-current={active ? "true" : undefined}
                >
                  {t(n.key)}
                </a>
              );
            })}
          </nav>

          <div
            role="group"
            aria-label="Language"
            className={`hidden items-center gap-0.5 rounded-full border p-0.5 lg:inline-flex ${
              solid ? "border-border bg-card" : "border-white/25 bg-white/10 backdrop-blur"
            }`}
          >
            {LANGUAGES.map((option) => {
              const active = language === option.code;
              return (
                <button
                  key={option.code}
                  type="button"
                  lang={option.code === "zh" ? "zh-CN" : "en"}
                  onClick={() => setLanguage(option.code)}
                  aria-label={option.aria}
                  aria-pressed={active}
                  className={`rounded-full px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                    active
                      ? "bg-primary-strong text-primary-foreground"
                      : solid
                        ? "text-foreground/70 hover:text-primary-strong"
                        : "text-white/80 hover:text-white"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <a
            href="/#contact"
            onClick={(e) => onAnchorClick(e, "#contact")}
            className="hidden min-h-[2.75rem] items-center rounded-full bg-primary-strong px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover lg:inline-flex"
          >
            {t("nav.contact")}
          </a>

          <button
            ref={closeButtonRef}
            type="button"
            aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className={`grid h-11 w-11 place-items-center rounded-full lg:hidden ${
              solid ? "text-foreground" : "text-white"
            }`}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          ref={panelRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={t("nav.menu")}
          className="fixed inset-x-0 bottom-0 top-[4.25rem] z-50 overflow-y-auto overscroll-contain border-t border-border bg-background shadow-2xl lg:hidden"
        >
          <nav aria-label={t("nav.mobile")} className="container-x flex flex-col gap-1 py-6">
            {nav.map((n) => {
              const active = isActive(n);
              return n.route ? (
                <Link
                  key={n.href}
                  to={n.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-2xl px-4 py-4 font-display text-2xl ${
                    active ? "bg-primary/12 text-primary-strong" : "text-foreground hover:bg-muted"
                  }`}
                >
                  {t(n.key)}
                </Link>
              ) : (
                <a
                  key={n.href}
                  href={hrefFor(n)}
                  onClick={(e) => {
                    onAnchorClick(e, n.href);
                    setOpen(false);
                  }}
                  className={`rounded-2xl px-4 py-4 font-display text-2xl ${
                    active ? "bg-primary/12 text-primary-strong" : "text-foreground hover:bg-muted"
                  }`}
                >
                  {t(n.key)}
                </a>
              );
            })}
            <a
              href="/#contact"
              onClick={(e) => {
                onAnchorClick(e, "#contact");
                setOpen(false);
              }}
              className="mt-4 rounded-full bg-primary-strong px-5 py-4 text-center text-sm font-semibold text-primary-foreground"
            >
              {t("nav.contact")}
            </a>
            <div role="group" aria-label="Language" className="mt-6 flex items-center gap-2">
              {LANGUAGES.map((option) => {
                const active = language === option.code;
                return (
                  <button
                    key={option.code}
                    type="button"
                    lang={option.code === "zh" ? "zh-CN" : "en"}
                    onClick={() => setLanguage(option.code)}
                    aria-label={option.aria}
                    aria-pressed={active}
                    className={`flex-1 rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors ${
                      active
                        ? "border-primary bg-primary-strong text-primary-foreground"
                        : "border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <p className="mt-8 text-sm text-muted-foreground">
              TM5 Building, 2nd Floor, Dembel Area, Addis Ababa, Ethiopia
            </p>
          </nav>
        </div>
      )}
    </header>
  );
}
