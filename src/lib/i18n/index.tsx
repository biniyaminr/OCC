import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { translate, type Language, type UIKey } from "./strings";
import { CATEGORY_ZH, PRODUCT_ZH, SPEC_LABEL_ZH } from "./catalog";
import { HOME_ZH } from "./home";

export { LANGUAGES, type Language, type UIKey } from "./strings";

const STORAGE_KEY = "occ-language";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: UIKey, vars?: Record<string, string>) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readStored(): Language {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "zh") return stored;
    // First visit: honour the browser, since a Chinese buyer should not have
    // to hunt for the switch.
    if (navigator.language?.toLowerCase().startsWith("zh")) return "zh";
  } catch {
    // Storage unavailable — English it is.
  }
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Always start English so the server and the first client render agree;
  // the stored choice is applied straight after mount.
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    setLanguageState(readStored());
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  }, [language]);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // A rejected write only costs the preference on the next visit.
    }
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t: (key, vars) => translate(key, language, vars),
    }),
    [language, setLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used inside LanguageProvider");
  return value;
}

/** Shorthand for components that only need the translator. */
export function useT() {
  return useLanguage().t;
}

// ---------------------------------------------------------------- catalog --

const pick = (translated: string | undefined, original: string) =>
  translated && translated.trim() ? translated : original;

export function localizeProductFields<
  T extends { slug: string; name: string; tagline: string; overview: string },
>(product: T, language: Language): T {
  if (language !== "zh") return product;
  const zh = PRODUCT_ZH[product.slug];
  if (!zh) return product;
  return {
    ...product,
    name: pick(zh.name, product.name),
    tagline: pick(zh.tagline, product.tagline),
    overview: pick(zh.overview, product.overview),
  };
}

export function localizeCategoryFields<T extends { id: string; title: string; blurb: string }>(
  category: T,
  language: Language,
): T {
  if (language !== "zh") return category;
  const zh = CATEGORY_ZH[category.id];
  if (!zh) return category;
  return {
    ...category,
    title: pick(zh.title, category.title),
    blurb: pick(zh.blurb, category.blurb),
  };
}

export function localizeSpecLabel(label: string, language: Language) {
  return language === "zh" ? (SPEC_LABEL_ZH[label] ?? label) : label;
}

/** Overlays Chinese homepage copy, leaving untranslated fields in English. */
export function localizeHomeSection<T extends Record<string, unknown>>(
  section: keyof typeof HOME_ZH,
  value: T,
  language: Language,
): T {
  if (language !== "zh") return value;
  const zh = HOME_ZH[section] as Record<string, string> | undefined;
  if (!zh) return value;
  const merged: Record<string, unknown> = { ...value };
  for (const [field, translated] of Object.entries(zh)) {
    if (translated && typeof merged[field] === "string") merged[field] = translated;
  }
  return merged as T;
}
