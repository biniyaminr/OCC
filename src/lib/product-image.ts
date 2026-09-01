import type { SyntheticEvent } from "react";
import placeholder from "@/assets/placeholder-product.svg";

/** Branded stand-in for a product with no usable photo. */
export const PRODUCT_IMAGE_FALLBACK = placeholder;

/**
 * A managed record can carry an empty image (cleared in the studio, or an
 * upload whose blob is missing), so every product image resolves through here.
 */
export function productImage(...candidates: (string | undefined)[]) {
  for (const candidate of candidates) {
    if (candidate && candidate.trim()) return candidate;
  }
  return PRODUCT_IMAGE_FALLBACK;
}

/** Swaps a broken URL for the fallback, guarding against a second failure. */
export function onProductImageError(event: SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;
  if (image.dataset["fallbackApplied"] === "true") return;
  image.dataset["fallbackApplied"] = "true";
  image.src = PRODUCT_IMAGE_FALLBACK;
}

/** Descriptive alt text: what it is, where it is from. */
export function productAlt(name: string, categoryTitle: string, region?: string) {
  const origin = region ? `${region}, Ethiopia` : "Ethiopia";
  return `${name} — ${categoryTitle.toLowerCase()} sourced from ${origin}`;
}
