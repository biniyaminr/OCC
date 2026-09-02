import { Facebook, Instagram, Mail } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useSiteContent } from "@/lib/site-content";
import { scrollToTop } from "@/lib/scroll";

export function SiteFooter() {
  const { content } = useSiteContent();
  const contact = content.home.contact;
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  // On the homepage the router has nowhere to go, so scroll up ourselves.
  const onBrandClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/") return;
    event.preventDefault();
    scrollToTop();
  };

  return (
    <footer className="on-dark bg-[oklch(0.16_0.02_45)] text-white/80">
      <div className="container-x py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link
              to="/"
              onClick={onBrandClick}
              aria-label={`${content.brand.shortName} — go to homepage`}
              className="flex items-center gap-2.5 rounded-xl transition-opacity hover:opacity-80"
            >
              <img
                src={content.brand.logo}
                alt={`${content.brand.shortName} ${content.brand.name} logo`}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="leading-tight">
                <p className="font-display text-xl font-semibold text-white">
                  {content.brand.shortName}
                </p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/60">
                  {content.brand.name}
                </p>
              </div>
            </Link>
            <p className="mt-6 text-sm leading-relaxed text-white/70">
              {content.brand.footerDescription}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Product Categories
            </h4>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                ["Coffee", "/#coffee"],
                ["Oilseeds", "/#oilseeds"],
                ["Pulses", "/#pulses"],
                ["Cereals", "/#cereals"],
              ].map(([l, h]) => (
                <li key={l}>
                  <a href={h} className="text-white/70 hover:text-gold transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Quick Links
            </h4>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                ["About OCC", "/#about"],
                ["Why Ethiopia", "/#why-ethiopia"],
                ["Why Choose OCC", "/#why-occ"],
                ["Partners", "/partners"],

                ["Contact", "/#contact"],
              ].map(([l, h]) => (
                <li key={l}>
                  <a href={h} className="text-white/70 hover:text-gold transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Contact</h4>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              <li>{contact.address}</li>
              <li>
                <a href={`mailto:${contact.email}`} className="hover:text-gold">
                  {contact.email}
                </a>
              </li>
              <li>
                <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`} className="hover:text-gold">
                  {contact.phone}
                </a>
              </li>
            </ul>

            <div className="mt-6 flex gap-3">
              {[
                {
                  Icon: Facebook,
                  label: "Oragon Commodity Center on Facebook",
                  href: "https://web.facebook.com/profile.php?id=61592879844431",
                },
                {
                  Icon: Instagram,
                  label: "Oragon Commodity Center on Instagram",
                  href: "https://www.instagram.com/oragontrading/",
                },
                {
                  Icon: Mail,
                  label: "Email Oragon Commodity Center",
                  href: `mailto:${contact.email}`,
                },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  {...(href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/70 transition-all hover:border-gold hover:text-gold"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/50">
          <p>
            © {new Date().getFullYear()} {content.brand.name}. All rights reserved.
          </p>
          <p>Sourcing Ethiopia's finest — for the world.</p>
        </div>
      </div>
    </footer>
  );
}
