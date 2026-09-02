/* @refresh reset */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import heroImage from "@/assets/coffee-farm-hero.jpg";
// The About section needs its own frame — reusing the hero verbatim read as a bug.
import aboutImage from "@/assets/coffee-producer-570.webp";
import { allProducts, categories, type Category, type Product } from "@/data/products";
import { partners, type Partner } from "@/data/partners";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseCredentials } from "@/lib/supabase/env";
import {
  dataUrlToBlob,
  deleteImages,
  getImage,
  isDataImage,
  isImageRef,
  listImageIds,
  makeRef,
  putImage,
  refId,
} from "@/lib/image-store";

const STORAGE_KEY = "occ-site-content-v2";
const SUPABASE_SYNC_KEY = "occ-site-content-supabase-sync";
const SUPABASE_SYNC_EVENT = "occ-site-content-supabase-change";
const SITE_CONTENT_KEY = "site";
const MEDIA_BUCKET = "media";

export type ManagedProductContent = {
  name: string;
  tagline: string;
  overview: string;
  image: string;
  /** Extra pictures shown beside the main image on the product page. */
  gallery?: string[];
  categoryId: string;
  regions: string[];
  custom?: boolean;
  deleted?: boolean;
};

export type ManagedPartnerContent = {
  name: string;
  category: string;
  url: string;
  tagline: string;
  longDescription: string;
  image: string;
  custom?: boolean;
  deleted?: boolean;
};

export type ManagedCategoryContent = {
  title: string;
  blurb: string;
  icon: string;
  custom?: boolean;
  deleted?: boolean;
};

export type SiteContent = {
  brand: {
    shortName: string;
    name: string;
    logo: string;
    footerDescription: string;
  };
  home: {
    hero: {
      eyebrow: string;
      title: string;
      accent: string;
      description: string;
      image: string;
    };
    about: {
      eyebrow: string;
      title: string;
      accent: string;
      description: string;
      image: string;
      imageCaption: string;
    };
    products: {
      eyebrow: string;
      title: string;
      accent: string;
      description: string;
    };
    whyEthiopia: {
      eyebrow: string;
      title: string;
      accent: string;
      description: string;
    };
    whyOcc: {
      eyebrow: string;
      title: string;
      accent: string;
    };
    process: {
      eyebrow: string;
      title: string;
      accent: string;
    };
    contact: {
      eyebrow: string;
      title: string;
      accent: string;
      description: string;
      email: string;
      phone: string;
      address: string;
    };
  };
  products: Record<string, ManagedProductContent>;
  categories: Record<string, ManagedCategoryContent>;
  partners: Record<string, ManagedPartnerContent>;
};

export const defaultSiteContent: SiteContent = {
  brand: {
    shortName: "OCC",
    name: "Oragon Commodity Center",
    logo: "/favicon.png",
    footerDescription:
      "Connecting the world's markets with Ethiopia's agricultural excellence through trusted partnerships, uncompromising quality, transparent trade, and innovative commodity solutions.",
  },
  home: {
    hero: {
      eyebrow: "Ethiopian Agricultural Sourcing",
      title: "Ethiopia's finest harvests,",
      accent: "ready for world markets.",
      description:
        "OCC connects international buyers with traceable Ethiopian commodities through reliable sourcing, rigorous quality control, and export-ready partnerships.",
      image: heroImage,
    },
    about: {
      eyebrow: "About OCC",
      title: "Connecting the world's markets with Ethiopia's",
      accent: "agricultural excellence.",
      description:
        "Oragon Commodity Center exists to connect the world's markets with Ethiopia's agricultural excellence through trusted partnerships, uncompromising quality, transparent trade, and innovative commodity solutions that create lasting value for producers, customers, and future generations.",
      image: aboutImage,
      imageCaption: "Sourced at origin across Ethiopia's highland growing regions.",
    },
    products: {
      eyebrow: "Our Products",
      title: "Export-quality commodities,",
      accent: "sourced with care.",
      description:
        "Four premium commodity groups, each backed by direct producer relationships and rigorous quality control.",
    },
    whyEthiopia: {
      eyebrow: "Why Ethiopia",
      title: "A land built for",
      accent: "exceptional agriculture.",
      description:
        "Altitude, soil and climate combine across Ethiopia's highlands to produce commodities with depth and consistency that few origins can match.",
    },
    whyOcc: {
      eyebrow: "Why Choose OCC",
      title: "Built for buyers who value",
      accent: "reliability.",
    },
    process: {
      eyebrow: "Sourcing Process",
      title: "What happens after",
      accent: "your inquiry.",
    },
    contact: {
      eyebrow: "Contact OCC",
      title: "Let's discuss your",
      accent: "next shipment.",
      description:
        "Share your requirements and our sourcing team will respond within one business day with product availability, specifications and indicative terms.",
      email: "plcoragon@gmail.com",
      phone: "+251 98 177 7779",
      address: "TM5 Building, 2nd Floor, Dembel Area, Addis Ababa, Ethiopia",
    },
  },
  products: Object.fromEntries(
    categories.flatMap((category) =>
      category.products.map((product) => [
        product.slug,
        {
          name: product.name,
          tagline: product.tagline,
          overview: product.overview,
          image: product.image,
          categoryId: category.id,
          regions: product.regions,
        },
      ]),
    ),
  ),
  categories: Object.fromEntries(
    categories.map((category) => [
      category.id,
      { title: category.title, blurb: category.blurb, icon: category.icon },
    ]),
  ),
  partners: Object.fromEntries(
    partners.map((partner) => [
      partner.slug,
      {
        name: partner.name,
        category: partner.category,
        url: partner.url,
        tagline: partner.tagline,
        longDescription: partner.longDescription,
        image: partner.gallery[0]?.image ?? "",
      },
    ]),
  ),
};

/**
 * Records the studio creates before the editor has filled them in. They must
 * never reach the public site, and untouched ones are purged on load so the
 * catalog does not accumulate "New product" entries.
 */
const PLACEHOLDER_PRODUCT = {
  name: "New product",
  tagline: "Add a short product tagline.",
  overview: "Add the full product overview here.",
};
const PLACEHOLDER_PARTNER = {
  name: "New partner",
  tagline: "Add a short partner tagline.",
  longDescription: "Add the complete partner description here.",
};
const PLACEHOLDER_CATEGORY = {
  title: "New category",
  blurb: "Describe what this commodity group covers.",
};

const sameText = (value: string, expected: string) =>
  value.trim().toLowerCase() === expected.toLowerCase();

/** Still carrying the placeholder name — hidden from the public site. */
export function isUnnamedProduct(product: ManagedProductContent) {
  return Boolean(product.custom) && sameText(product.name, PLACEHOLDER_PRODUCT.name);
}

export function isUnnamedPartner(partner: ManagedPartnerContent) {
  return Boolean(partner.custom) && sameText(partner.name, PLACEHOLDER_PARTNER.name);
}

/** Never edited at all — safe to delete outright. */
function isUntouchedProduct(product: ManagedProductContent) {
  return (
    isUnnamedProduct(product) &&
    sameText(product.tagline, PLACEHOLDER_PRODUCT.tagline) &&
    sameText(product.overview, PLACEHOLDER_PRODUCT.overview)
  );
}

function isUntouchedPartner(partner: ManagedPartnerContent) {
  return (
    isUnnamedPartner(partner) &&
    sameText(partner.tagline, PLACEHOLDER_PARTNER.tagline) &&
    sameText(partner.longDescription, PLACEHOLDER_PARTNER.longDescription)
  );
}

function isUntouchedCategory(category: ManagedCategoryContent) {
  return (
    Boolean(category.custom) &&
    sameText(category.title, PLACEHOLDER_CATEGORY.title) &&
    sameText(category.blurb, PLACEHOLDER_CATEGORY.blurb)
  );
}

/** Drops abandoned placeholder records from stored content. */
export function purgePlaceholders(content: SiteContent): SiteContent {
  const keep = <T,>(records: Record<string, T>, drop: (record: T) => boolean) =>
    Object.fromEntries(Object.entries(records).filter(([, record]) => !drop(record)));
  return {
    ...content,
    products: keep(content.products, isUntouchedProduct),
    partners: keep(content.partners, isUntouchedPartner),
    categories: keep(content.categories, isUntouchedCategory),
  };
}

export type SaveState = "idle" | "saving" | "saved" | "error";

type SiteContentContextValue = {
  content: SiteContent;
  setContent: (content: SiteContent) => void;
  resetContent: () => void;
  ready: boolean;
  saveState: SaveState;
  saveError: string;
};

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

function mergeDefaults<T>(defaults: T, stored: unknown): T {
  if (!stored || typeof stored !== "object" || Array.isArray(stored)) return defaults;
  const result = { ...(defaults as Record<string, unknown>) };
  for (const [key, value] of Object.entries(stored)) {
    const fallback = result[key];
    result[key] =
      fallback && typeof fallback === "object" && !Array.isArray(fallback)
        ? mergeDefaults(fallback, value)
        : value;
  }
  return result as T;
}

function normalizeStoredContent(stored: unknown): SiteContent {
  return purgePlaceholders(mergeDefaults(defaultSiteContent, stored));
}

/** Rewrites every string in the content tree, used to swap image references. */
function mapStrings<T>(value: T, replace: (value: string) => string): T {
  if (typeof value === "string") return replace(value) as unknown as T;
  if (Array.isArray(value)) return value.map((item) => mapStrings(item, replace)) as unknown as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        mapStrings(item, replace),
      ]),
    ) as T;
  }
  return value;
}

function collectStrings(value: unknown, found: Set<string> = new Set()) {
  if (typeof value === "string") found.add(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, found));
  else if (value && typeof value === "object") {
    Object.values(value as Record<string, unknown>).forEach((item) => collectStrings(item, found));
  }
  return found;
}

function announceSupabaseContent(content: SiteContent) {
  try {
    const payload = JSON.stringify({ at: Date.now(), content });
    window.localStorage.setItem(SUPABASE_SYNC_KEY, payload);
    window.dispatchEvent(new CustomEvent(SUPABASE_SYNC_EVENT, { detail: payload }));
  } catch {
    // Cross-tab live preview is best effort; Supabase remains the source of truth.
  }
}

function parseSupabaseContentPayload(raw: string | unknown) {
  const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
  return normalizeStoredContent((parsed as { content?: unknown }).content);
}

function fileExtension(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}

async function uploadSupabaseImages(content: SiteContent): Promise<SiteContent> {
  const uploads = [...collectStrings(content)].filter(isDataImage);
  if (uploads.length === 0) return content;

  const supabase = createClient();
  const urlByData = new Map<string, string>();

  for (const dataUrl of uploads) {
    if (urlByData.has(dataUrl)) continue;
    const blob = await dataUrlToBlob(dataUrl);
    const id =
      globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const path = `content/${id}.${fileExtension(blob.type)}`;
    const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, blob, {
      contentType: blob.type || "image/jpeg",
      upsert: false,
    });
    if (error) throw error;
    const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
    urlByData.set(dataUrl, data.publicUrl);
  }

  return mapStrings(content, (value) => urlByData.get(value) ?? value);
}

async function loadSupabaseContent(): Promise<SiteContent | null> {
  if (!hasSupabaseCredentials()) return null;
  const supabase = createClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", SITE_CONTENT_KEY)
    .maybeSingle();
  if (error) throw error;
  return data?.value ? normalizeStoredContent(data.value) : null;
}

async function persistNormalizedTables(content: SiteContent) {
  const supabase = createClient();
  const now = new Date().toISOString();

  const categoryRows = Object.entries(content.categories).map(([id, category], index) => ({
    id,
    title: category.title,
    blurb: category.blurb,
    icon: category.icon || "📦",
    sort_order: index,
    deleted: Boolean(category.deleted),
    updated_at: now,
  }));

  const productRows = Object.entries(content.products).map(([slug, product], index) => ({
    slug,
    category_id: product.categoryId || null,
    name: product.name,
    tagline: product.tagline,
    overview: product.overview,
    image: product.image || null,
    gallery: product.gallery ?? [],
    regions: product.regions ?? [],
    sort_order: index,
    deleted: Boolean(product.deleted),
    updated_at: now,
  }));

  const partnerRows = Object.entries(content.partners).map(([slug, partner], index) => ({
    slug,
    name: partner.name,
    category: partner.category,
    url: partner.url,
    tagline: partner.tagline,
    long_description: partner.longDescription,
    image: partner.image || null,
    sort_order: index,
    deleted: Boolean(partner.deleted),
    updated_at: now,
  }));

  if (categoryRows.length) {
    const { error } = await supabase.from("categories").upsert(categoryRows, { onConflict: "id" });
    if (error) throw error;
  }

  const results = await Promise.all([
    productRows.length
      ? supabase.from("products").upsert(productRows, { onConflict: "slug" })
      : Promise.resolve({ error: null }),
    partnerRows.length
      ? supabase.from("partners").upsert(partnerRows, { onConflict: "slug" })
      : Promise.resolve({ error: null }),
  ]);

  const error = results.find((result) => result.error)?.error;
  if (error) throw error;
}

async function persistSupabaseContent(content: SiteContent): Promise<SiteContent> {
  const supabase = createClient();
  const prepared = await uploadSupabaseImages(content);
  await persistNormalizedTables(prepared);
  const { error } = await supabase.from("site_content").upsert(
    {
      key: SITE_CONTENT_KEY,
      value: prepared,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );
  if (error) throw error;
  return prepared;
}

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContentState] = useState(defaultSiteContent);
  const [ready, setReady] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveError, setSaveError] = useState("");
  const savedVersion = useRef(0);
  const dirtyVersion = useRef(0);
  // Maps `idb:<id>` references to the object URL used while the app is running.
  const urlByRef = useRef(new Map<string, string>());
  const refByUrl = useRef(new Map<string, string>());
  // Only images uploaded in this tab are ever garbage collected, so a second
  // tab's upload can never be deleted out from under it.
  const ownedIds = useRef(new Set<string>());
  const useSupabase = hasSupabaseCredentials();

  const setContent = useCallback((next: SiteContent) => {
    dirtyVersion.current += 1;
    setContentState(next);
  }, []);

  /** Turns stored `idb:` references into object URLs the browser can render. */
  const hydrate = useCallback(async (raw: string) => {
    const stored = normalizeStoredContent(JSON.parse(raw));
    const refs = [...collectStrings(stored)].filter(isImageRef);
    await Promise.all(
      refs.map(async (ref) => {
        if (urlByRef.current.has(ref)) return;
        try {
          const blob = await getImage(refId(ref));
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          urlByRef.current.set(ref, url);
          refByUrl.current.set(url, ref);
        } catch {
          // A missing image falls back to the empty placeholder below.
        }
      }),
    );
    return mapStrings(stored, (value) =>
      isImageRef(value) ? (urlByRef.current.get(value) ?? "") : value,
    );
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const remote = await loadSupabaseContent();
        if (remote) {
          if (!cancelled) setContentState(remote);
          return;
        }
        const raw = useSupabase ? null : window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const restored = await hydrate(raw);
          if (!cancelled) setContentState(restored);
        }
      } catch {
        // Keep defaults if browser storage is unavailable or malformed.
      } finally {
        if (!cancelled) setReady(true);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [hydrate]);

  useEffect(() => {
    if (!ready) return;
    if (dirtyVersion.current === savedVersion.current) return;
    let cancelled = false;
    const versionToSave = dirtyVersion.current;

    const persist = async () => {
      setSaveState("saving");
      let toStore = content;
      try {
        if (useSupabase) {
          const stored = await persistSupabaseContent(content);
          if (cancelled) return;
          setSaveError("");
          setSaveState("saved");
          savedVersion.current = Math.max(savedVersion.current, versionToSave);
          if (stored !== content) setContentState(stored);
          announceSupabaseContent(stored);
          return;
        }

        // Newly uploaded images arrive as data URLs; move them into IndexedDB
        // so the JSON kept in localStorage stays small.
        const uploads = [...collectStrings(content)].filter(isDataImage);
        const refByDataUrl = new Map<string, string>();
        for (const dataUrl of uploads) {
          const id =
            globalThis.crypto?.randomUUID?.() ??
            `${Date.now()}-${Math.random().toString(36).slice(2)}`;
          const blob = await dataUrlToBlob(dataUrl);
          await putImage(id, blob);
          const ref = makeRef(id);
          const url = URL.createObjectURL(blob);
          urlByRef.current.set(ref, url);
          refByUrl.current.set(url, ref);
          refByDataUrl.set(dataUrl, ref);
          ownedIds.current.add(id);
        }
        if (cancelled) return;

        toStore = mapStrings(content, (value) => {
          const asRef = refByUrl.current.get(value) ?? refByDataUrl.get(value);
          return asRef ?? value;
        });
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));

        // Drop images this tab uploaded that no record points at any more.
        const live = new Set([...collectStrings(toStore)].filter(isImageRef).map(refId));
        const orphans = [...ownedIds.current].filter((id) => !live.has(id));
        await deleteImages(orphans);
        orphans.forEach((id) => {
          const ref = makeRef(id);
          const url = urlByRef.current.get(ref);
          if (url) URL.revokeObjectURL(url);
          urlByRef.current.delete(ref);
          refByUrl.current.delete(url ?? "");
          ownedIds.current.delete(id);
        });

        if (cancelled) return;
        setSaveError("");
        setSaveState("saved");
        savedVersion.current = Math.max(savedVersion.current, versionToSave);
        // Swap the in-memory data URLs for object URLs so the next save is cheap.
        if (refByDataUrl.size > 0) {
          setContentState((current) =>
            mapStrings(current, (value) => {
              const ref = refByDataUrl.get(value);
              return ref ? (urlByRef.current.get(ref) ?? value) : value;
            }),
          );
        }
      } catch (error) {
        if (cancelled) return;
        if (useSupabase) {
          setSaveError(
            error instanceof Error
              ? `Database save failed: ${error.message}`
              : "Database save failed.",
          );
          setSaveState("error");
          return;
        }
        // IndexedDB may be blocked (private mode); fall back to inline data URLs.
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
          setSaveError("");
          setSaveState("saved");
          savedVersion.current = Math.max(savedVersion.current, versionToSave);
        } catch {
          setSaveError(
            error instanceof Error && error.name === "QuotaExceededError"
              ? "Browser storage is full. Remove or replace a few images, then try again."
              : "This change could not be saved in your browser.",
          );
          setSaveState("error");
        }
      }
    };

    const timer = window.setTimeout(() => void persist(), 250);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [content, ready]);

  useEffect(() => {
    const syncFromPayload = (raw: string | unknown) => {
      try {
        setContentState(parseSupabaseContentPayload(raw));
      } catch {
        // Ignore malformed changes from another tab.
      }
    };

    const syncSameTab = (event: Event) => {
      if (!useSupabase) return;
      syncFromPayload((event as CustomEvent).detail);
    };

    const syncAcrossTabs = (event: StorageEvent) => {
      if (useSupabase) {
        if (event.key !== SUPABASE_SYNC_KEY || !event.newValue) return;
        syncFromPayload(event.newValue);
        return;
      }
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      void hydrate(event.newValue)
        .then(setContentState)
        .catch(() => {
          // Ignore malformed changes from another tab.
        });
    };
    window.addEventListener("storage", syncAcrossTabs);
    window.addEventListener(SUPABASE_SYNC_EVENT, syncSameTab);
    return () => {
      window.removeEventListener("storage", syncAcrossTabs);
      window.removeEventListener(SUPABASE_SYNC_EVENT, syncSameTab);
    };
  }, [hydrate]);

  /** Restores the shipped content and clears every uploaded image. */
  const resetContent = useCallback(() => {
    setContent(defaultSiteContent);
    if (useSupabase) return;
    void (async () => {
      try {
        await deleteImages(await listImageIds());
      } catch {
        // Nothing to clean up when IndexedDB is unavailable.
      }
      urlByRef.current.forEach((url) => URL.revokeObjectURL(url));
      urlByRef.current.clear();
      refByUrl.current.clear();
      ownedIds.current.clear();
    })();
  }, []);

  const value = useMemo(
    () => ({
      content,
      setContent,
      resetContent,
      ready,
      saveState,
      saveError,
    }),
    [content, ready, saveState, saveError, resetContent],
  );

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  const value = useContext(SiteContentContext);
  if (!value) throw new Error("useSiteContent must be used inside SiteContentProvider");
  return value;
}

/**
 * Builds the public catalog from the managed content: overrides are applied,
 * deleted records drop out, and every product lands in the category the editor
 * assigned it — including built-in products moved to a different group.
 */
export function buildManagedCategories(content: SiteContent): Category[] {
  const activeCategories: Category[] = [
    ...categories
      .filter((category) => !content.categories[category.id]?.deleted)
      .map((category) => ({ ...category, ...(content.categories[category.id] ?? {}) })),
    ...Object.entries(content.categories)
      .filter(([, category]) => category.custom && !category.deleted)
      .map(([id, category]) => ({
        id,
        title: category.title,
        blurb: category.blurb,
        icon: category.icon,
        products: [],
      })),
  ];
  const grouped = new Map<string, Product[]>(activeCategories.map((category) => [category.id, []]));
  const fallbackId = activeCategories[0]?.id ?? categories[0]!.id;
  const listFor = (categoryId: string) => grouped.get(categoryId) ?? grouped.get(fallbackId)!;

  for (const base of allProducts) {
    const override = content.products[base.slug];
    if (override?.deleted) continue;
    const categoryId = override?.categoryId ?? base.categoryId;
    listFor(grouped.has(categoryId) ? categoryId : fallbackId).push({
      ...base,
      ...override,
      // An emptied or unresolvable override must not blank out the photo.
      image: override?.image?.trim() ? override.image : base.image,
    });
  }
  for (const [slug, product] of Object.entries(content.products)) {
    if (!product.custom || product.deleted || isUnnamedProduct(product)) continue;
    listFor(grouped.has(product.categoryId) ? product.categoryId : fallbackId).push(
      toProduct(slug, product),
    );
  }

  return activeCategories.map((category) => ({
    ...category,
    ...(content.categories[category.id] ?? {}),
    products: grouped.get(category.id) ?? [],
  }));
}

export function useManagedCategories(): Category[] {
  const { content } = useSiteContent();
  return useMemo(() => buildManagedCategories(content), [content]);
}

export type ResolvedProduct = Product & {
  categoryId: string;
  categoryTitle: string;
};

/** Flat catalog for search and the inquiry form's product picker. */
export function useManagedProducts(): ResolvedProduct[] {
  const managedCategories = useManagedCategories();
  return useMemo(
    () =>
      managedCategories.flatMap((category) =>
        category.products.map((product) => ({
          ...product,
          categoryId: category.id,
          categoryTitle: category.title,
        })),
      ),
    [managedCategories],
  );
}

export function resolveManagedProduct(
  slug: string,
  content: SiteContent,
): ResolvedProduct | undefined {
  const stored = content.products[slug];
  if (stored?.deleted) return undefined;
  const original = allProducts.find((product) => product.slug === slug);
  // An unfinished studio record has no public page.
  if (!original && (!stored?.custom || isUnnamedProduct(stored))) return undefined;
  const categoryId = stored?.categoryId ?? original?.categoryId ?? categories[0]!.id;
  const managed = buildManagedCategories(content);
  // A product whose category was removed falls back to the first live group.
  const category = managed.find((item) => item.id === categoryId) ?? managed[0] ?? categories[0]!;
  const base = original ? { ...original, ...stored } : toProduct(slug, stored!);
  return {
    ...base,
    image: stored?.image?.trim() ? stored.image : (original?.image ?? base.image),
    gallery: (stored?.gallery ?? base.gallery ?? []).filter((item) => item.trim()),
    categoryId: category.id,
    categoryTitle: category.title,
  };
}

/**
 * Filter chips for the catalog. Coffee keeps its specialty/commercial split;
 * every other group — including ones added in the studio — uses its own title.
 */
export function categoryTags(managed: Category[]): string[] {
  return managed.flatMap((category) =>
    category.id === "coffee" ? ["Specialty Coffee", "Commercial Coffee"] : [category.title],
  );
}

export function tagOf(category: Category, product: Product): string {
  if (category.id !== "coffee") return category.title;
  return specialtyCoffee.has(product.slug) ? "Specialty Coffee" : "Commercial Coffee";
}

const specialtyCoffee = new Set([
  "yirgacheffe-coffee",
  "sidamo-coffee",
  "guji-coffee",
  "limmu-coffee",
]);

export function resolveManagedPartners(content: SiteContent): Partner[] {
  const original = partners
    .filter((partner) => !content.partners[partner.slug]?.deleted)
    .map((partner) => {
      const override = content.partners[partner.slug];
      if (!override) return partner;
      return {
        ...partner,
        ...override,
        gallery: partner.gallery.map((item, index) =>
          index === 0 ? { ...item, name: override.name, image: override.image } : item,
        ),
      };
    });
  const custom = Object.entries(content.partners)
    .filter(([, partner]) => partner.custom && !partner.deleted && !isUnnamedPartner(partner))
    .map(([slug, partner]): Partner => ({
      slug,
      name: partner.name,
      category: partner.category,
      url: partner.url,
      domain: safeDomain(partner.url),
      tagline: partner.tagline,
      description: partner.tagline,
      longDescription: partner.longDescription,
      highlights: [],
      serves: [],
      offerings: [],
      gallery: partner.image ? [{ name: partner.name, image: partner.image }] : [],
    }));
  return [...original, ...custom];
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Renames a record key while keeping the surrounding order intact. */
export function renameRecordKey<T>(
  records: Record<string, T>,
  from: string,
  to: string,
): Record<string, T> {
  if (from === to) return records;
  return Object.fromEntries(
    Object.entries(records).map(([key, value]) => [key === from ? to : key, value]),
  );
}

export function isSlugTaken(records: Record<string, unknown>, slug: string, ignore: string) {
  return slug !== ignore && slug in records;
}

function toProduct(slug: string, product: ManagedProductContent): Product {
  return {
    slug,
    name: product.name,
    image: product.image,
    gallery: product.gallery ?? [],
    tagline: product.tagline,
    overview: product.overview,
    regions: product.regions,
    specs: [{ label: "Availability", value: "Contact OCC for current specifications" }],
    packaging: ["Packaging available to buyer requirements"],
    uses: ["Contact OCC for recommended applications"],
  };
}

function safeDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
