import { useState } from "react";

/** Commodity glyph drawn in --coffee, used when a product has no photograph. */
function CommodityMark({ categoryId }: { categoryId: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (categoryId === "coffee") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden className="h-10 w-10">
        <ellipse cx="24" cy="24" rx="13" ry="18" {...common} />
        <path d="M24 6c-6 9-6 27 0 36" {...common} />
      </svg>
    );
  }
  if (categoryId === "oilseeds") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden className="h-10 w-10">
        <path d="M24 8c8 6 11 15 8 23-3 7-13 9-19 4S6 19 14 13" {...common} />
        <path d="M24 41V19" {...common} />
      </svg>
    );
  }
  if (categoryId === "pulses") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden className="h-10 w-10">
        <ellipse cx="18" cy="20" rx="9" ry="7" transform="rotate(-25 18 20)" {...common} />
        <ellipse cx="30" cy="30" rx="9" ry="7" transform="rotate(-25 30 30)" {...common} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" aria-hidden className="h-10 w-10">
      <path d="M24 42V14" {...common} />
      <path d="M24 20c-6-2-9-6-9-11 5 0 9 3 9 8M24 20c6-2 9-6 9-11-5 0-9 3-9 8" {...common} />
      <path d="M24 32c-6-2-9-6-9-11 5 0 9 3 9 8M24 32c6-2 9-6 9-11-5 0-9 3-9 8" {...common} />
    </svg>
  );
}

/**
 * A product picture that can never render as an empty grey box: when there is
 * no usable source, it falls back to a branded beige block carrying the
 * commodity mark and the product name.
 */
export function ProductImage({
  src,
  alt,
  name,
  categoryId,
  width = 800,
  height = 800,
  eager = false,
  imageClassName = "",
  objectPosition,
}: {
  src: string | undefined;
  alt: string;
  name: string;
  categoryId: string;
  width?: number;
  height?: number;
  eager?: boolean;
  imageClassName?: string;
  objectPosition?: string;
}) {
  const usable = Boolean(src && src.trim());
  const [broken, setBroken] = useState(false);

  if (!usable || broken) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="flex h-full w-full flex-col items-center justify-center gap-3 bg-beige px-4 text-coffee"
      >
        <CommodityMark categoryId={categoryId} />
        <span className="text-center font-display text-lg leading-tight">{name}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      decoding={eager ? "sync" : "async"}
      onError={() => setBroken(true)}
      style={objectPosition ? { objectPosition } : undefined}
      className={`h-full w-full object-cover ${imageClassName}`}
    />
  );
}
