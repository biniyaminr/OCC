import heroImage from "@/assets/coffee-farm-hero.jpg";
import type { ResolvedProduct } from "@/lib/site-content";

export const SITE_NAME = "Oragon Commodity Center";
// Existing public origin. Set VITE_SITE_URL when moving to a custom domain.
export function siteOrigin(
  value = import.meta.env.VITE_SITE_URL || "https://www.oragontradingplc.com",
) {
  const url = new URL(value);
  if (
    !/^https?:$/.test(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "VITE_SITE_URL must be an http(s) origin without a path, query or credentials.",
    );
  }
  return url.origin;
}

export function absoluteUrl(path: string) {
  return new URL(path, `${siteOrigin()}/`).href;
}

export function publicImage(image?: string) {
  if (!image || /^(?:data:|blob:|idb:)/i.test(image)) return undefined;
  try {
    const url = new URL(image, `${siteOrigin()}/`);
    return /^https?:$/.test(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}

export function jsonLd(value: unknown) {
  return { type: "application/ld+json", children: JSON.stringify(value).replace(/</g, "\\u003c") };
}

export function seoHead({
  title,
  description,
  path,
  image = heroImage,
  imageAlt = "Ethiopian coffee farm — Oragon Commodity Center",
  schema = [],
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  schema?: unknown[];
}) {
  const url = absoluteUrl(path);
  const photo = publicImage(image);
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:type", content: "website" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { name: "twitter:card", content: photo ? "summary_large_image" : "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      ...(photo
        ? [
            { property: "og:image", content: photo },
            { property: "og:image:alt", content: imageAlt },
            { name: "twitter:image", content: photo },
            { name: "twitter:image:alt", content: imageAlt },
          ]
        : []),
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: schema.map(jsonLd),
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: SITE_NAME,
    alternateName: "OCC",
    url: absoluteUrl("/"),
    logo: absoluteUrl("/favicon.png"),
  };
}

export function breadcrumbSchema(name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name, item: absoluteUrl(path) },
    ],
  };
}

export function productPath(slug: string) {
  return `/products/${encodeURIComponent(slug)}`;
}

export function productHead(product: ResolvedProduct) {
  const path = productPath(product.slug);
  return seoHead({
    title: `${product.name} — Ethiopian ${product.categoryTitle} | OCC`,
    description: product.tagline || product.overview.slice(0, 160),
    path,
    image: product.image,
    imageAlt: `${product.name} — ${product.categoryTitle}`,
    schema: [
      breadcrumbSchema(product.name, path),
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": absoluteUrl(`${path}#product`),
        name: product.name,
        description: product.overview || product.tagline,
        url: absoluteUrl(path),
        category: product.categoryTitle,
        image: [product.image, ...(product.gallery ?? [])].map(publicImage).filter(Boolean),
        additionalProperty: product.specs.map(({ label, value }) => ({
          "@type": "PropertyValue",
          name: label,
          value,
        })),
        // Quote-based catalog: no invented prices, stock, ratings or reviews.
      },
    ],
  });
}

export function sitemapXml(paths: string[]) {
  const escapeXml = (value: string) =>
    value.replace(
      /[<>&"']/g,
      (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[char]!,
    );
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...new Set(paths)].map((path) => `  <url><loc>${escapeXml(absoluteUrl(path))}</loc></url>`).join("\n")}\n</urlset>\n`;
}
