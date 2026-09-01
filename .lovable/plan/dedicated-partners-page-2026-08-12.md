# Dedicated Partners Page

Add a standalone `/partners` page (a real content page, not a landing page) and add Wintone Machinery as a second partner alongside Hawit Sorter.

## New route: `/partners`

File: `src/routes/partners.tsx` (`createFileRoute("/partners")`), using the same shell as the homepage — `SiteHeader`, `main`, `SiteFooter` — so it feels like part of the site.

Page content:
1. Compact page header (no full-viewport hero): title "Our Partners", short intro paragraph, breadcrumb back to Home.
2. Partner detail blocks — one per partner, alternating layout, each with: name, category badge, tagline, longer description, capability list, and an external link button.
3. "Why our partners matter" benefits grid (technology, capacity, local service, export standards) reused from the existing section styling.
4. Closing CTA: "Are you a machinery manufacturer?" linking to `/#contact`.

## Partners covered

- **Hawit Sorter** — https://www.hawitsorter.com/ — optical sorting and grain processing machinery (existing content, expanded).
- **Wintone Machinery** — https://www.wintone-machinery.com/ — grain and seed cleaning, grading, hulling and processing equipment; complete turnkey processing lines for cereals, pulses, oilseeds and sesame.

Both external links: `target="_blank"` with `rel="noopener noreferrer external"` and descriptive aria-labels.

## Shared partner data

Move the partner list out of the component into `src/data/partners.ts` (typed) so the homepage section and the new page stay in sync.

## Homepage section

`PartnersSection.tsx` stays on the homepage but becomes a shorter teaser: heading, both partner cards in a two-column grid, and a "View all partners" link to `/partners`. Full detail lives on the new page.

## Navigation

- Header: "Partners" changes from the `/#partners` anchor to a `<Link to="/partners">`.
- Footer: same change in the quick links.

## SEO

`/partners` gets its own `head()`: unique title ("Partners — Oragon Commodity Center"), description, og:title, og:description, og:type, twitter:card. Single `<h1>` on the page.

## Technical notes

- No backend, no new dependencies; styling uses existing semantic tokens (primary/gold/beige) and the `Reveal` animation component.
- Fully responsive: partner blocks stack to a single column on mobile.
