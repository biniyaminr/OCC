/**
 * Sends the page back to the top and drops any section hash.
 *
 * Clicking the brand mark while already on the homepage is a no-op as far as
 * the router is concerned — same route, so nothing moves and a stale `#products`
 * stays in the address bar. This does the part the router will not.
 */
export function scrollToTop() {
  if (typeof window === "undefined") return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  if (window.location.hash) {
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }
}
