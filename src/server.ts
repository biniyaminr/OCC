import { loadPublicContent } from "./lib/public-content";
import { buildManagedCategories } from "./lib/site-content";
import { absoluteUrl, productPath, sitemapXml } from "./lib/seo";
import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const pathname = new URL(request.url).pathname;
      if (
        (request.method === "GET" || request.method === "HEAD") &&
        ["/robots.txt", "/sitemap.xml"].includes(pathname)
      ) {
        let body: string;
        if (pathname === "/robots.txt") {
          // Allow crawling /admin so crawlers can see its noindex directive.
          body = `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl("/sitemap.xml")}\n`;
        } else {
          const catalog = await loadPublicContent();
          if (!catalog.available)
            return new Response(null, {
              status: 503,
              headers: { "Retry-After": "60", "Cache-Control": "no-store" },
            });
          const products = buildManagedCategories(catalog.content).flatMap(
            (category) => category.products,
          );
          body = sitemapXml([
            "/",
            "/partners",
            ...products.map((product) => productPath(product.slug)),
          ]);
        }
        return new Response(request.method === "HEAD" ? null : body, {
          headers: {
            "Content-Type":
              pathname === "/robots.txt"
                ? "text/plain; charset=utf-8"
                : "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=300",
          },
        });
      }
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const normalized = await normalizeCatastrophicSsrResponse(response);
      if (pathname === "/admin" || pathname.startsWith("/admin/") || normalized.status >= 400) {
        const headers = new Headers(normalized.headers);
        headers.set("X-Robots-Tag", "noindex");
        return new Response(normalized.body, {
          status: normalized.status,
          statusText: normalized.statusText,
          headers,
        });
      }
      return normalized;
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
