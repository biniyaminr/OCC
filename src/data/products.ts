import coffeeBeans from "@/assets/Coffee_Beans.jpg.asset.json";
import sesame from "@/assets/Sesame.jpg.asset.json";
import soybean from "@/assets/Soybean.jpg.asset.json";
import peanuts from "@/assets/Peanuts.jpg.asset.json";
import lskb from "@/assets/Light_Speckled_Kidney_Beans.jpg.asset.json";
import rskb from "@/assets/Red_Speckled_kidney_Beans.jpg.asset.json";
import rkb from "@/assets/Redkidney_beans.jpg.asset.json";
import chickpeas from "@/assets/Chickpeas.jpg.asset.json";
import sorghum from "@/assets/Sorghum.jpg.asset.json";
import corn from "@/assets/Corn.jpg.asset.json";
import mung from "@/assets/Green_Mung_Bean.jpg.asset.json";
// Origin coffee photography, one distinct lead image per growing region.
import coffee1 from "@/assets/coffee_images_38.jpg.asset.json";
import coffee2 from "@/assets/coffee_images_42.jpg.asset.json";
import coffee3 from "@/assets/coffee_images_43.jpg.asset.json";
import coffee4 from "@/assets/coffee_download_8.jpg.asset.json";
import coffee5 from "@/assets/coffee_download_10.jpg.asset.json";
import coffee6 from "@/assets/coffee_c09b5d34ed5147f6adbedbe39caa86bb.jpg.asset.json";
import coffee7 from "@/assets/coffee_cda6e66d1d6c98e9a7c1304c446ec93e.jpg.asset.json";
import coffee8 from "@/assets/coffee_d6d7ea64d1ec4c6083aae92ede163652.jpg.asset.json";
import coffee9 from "@/assets/coffee_il_570xN.694080479_e6mr.jpg.asset.json";

export const coffeeGallery = [
  coffeeBeans.url,
  coffee1.url,
  coffee2.url,
  coffee3.url,
  coffee4.url,
  coffee5.url,
  coffee6.url,
  coffee7.url,
  coffee8.url,
  coffee9.url,
];

export type Product = {
  slug: string;
  name: string;
  image: string;
  /** Additional pictures added through the content studio. */
  gallery?: string[];
  imagePosition?: string;
  tagline: string;
  overview: string;
  regions: string[];
  specs: { label: string; value: string }[];
  packaging: string[];
  uses: string[];
};

export type Category = {
  id: string;
  icon: string;
  title: string;
  blurb: string;
  products: Product[];
};

export const categories: Category[] = [
  {
    id: "coffee",
    icon: "☕",
    title: "Coffee",
    blurb: "Origin-rich Arabica from Ethiopia's celebrated growing regions.",
    products: [
      {
        slug: "yirgacheffe-coffee",
        name: "Yirgacheffe",
        image: coffeeBeans.url,
        gallery: [coffee1.url, coffee4.url],
        imagePosition: "30% 30%",
        tagline: "Floral, citrus-bright washed Arabica from southern Ethiopia.",
        overview:
          "Grown at 1,700 – 2,200 m in the Gedeo zone, Yirgacheffe is the benchmark for delicate, tea-like Ethiopian coffees. Known for its jasmine aromatics, lemon-citrus acidity and clean, sparkling cup — a specialty favorite worldwide.",
        regions: ["Yirgacheffe", "Gedeo Zone", "Kochere", "Wenago", "Dumerso"],
        specs: [
          { label: "Species", value: "Coffea arabica" },
          { label: "Altitude", value: "1,700 – 2,200 m" },
          { label: "Processing", value: "Washed, Natural" },
          { label: "Grades", value: "G1, G2" },
          { label: "Screen size", value: "14 up" },
          { label: "Moisture", value: "10 – 11.5%" },
        ],
        packaging: ["60 kg jute bags with GrainPro liner", "FCL 20ft: 320 bags"],
        uses: ["Single-origin pour-over", "Specialty espresso", "Premium blends"],
      },
      {
        slug: "sidamo-coffee",
        name: "Sidamo",
        image: coffee1.url,
        gallery: [coffee2.url, coffeeBeans.url],
        imagePosition: "70% 35%",
        tagline: "Balanced, wine-like Arabica with bright acidity.",
        overview:
          "Sidamo coffees are grown across a wide altitude band in southern Ethiopia and are prized for their medium body, wine-like acidity and complex fruit notes ranging from berry to citrus.",
        regions: ["Sidamo", "Sidama Zone", "Bensa", "Aroresa", "Bona Zuria"],
        specs: [
          { label: "Species", value: "Coffea arabica" },
          { label: "Altitude", value: "1,500 – 2,200 m" },
          { label: "Processing", value: "Washed, Natural" },
          { label: "Grades", value: "G1, G2, G3, G4" },
          { label: "Screen size", value: "14 up" },
          { label: "Moisture", value: "10 – 11.5%" },
        ],
        packaging: ["60 kg jute bags with GrainPro liner"],
        uses: ["Specialty espresso", "Filter / pour-over", "Signature blends"],
      },
      {
        slug: "guji-coffee",
        name: "Guji",
        image: coffee2.url,
        gallery: [coffee3.url, coffee5.url],
        imagePosition: "50% 70%",
        tagline: "Bold, fruit-forward Arabica from the Oromia highlands.",
        overview:
          "Once traded under the Sidamo umbrella, Guji has emerged as its own celebrated origin. High-altitude farms deliver intense stone-fruit, berry and floral character with a syrupy body.",
        regions: ["Guji", "Guji Zone", "Shakiso", "Uraga", "Hambela"],
        specs: [
          { label: "Species", value: "Coffea arabica" },
          { label: "Altitude", value: "1,800 – 2,300 m" },
          { label: "Processing", value: "Washed, Natural, Honey" },
          { label: "Grades", value: "G1, G2, G3" },
          { label: "Screen size", value: "14 up" },
          { label: "Moisture", value: "10 – 11.5%" },
        ],
        packaging: ["60 kg jute bags with GrainPro liner"],
        uses: ["Specialty single-origin", "Competition espresso", "Micro-lots"],
      },
      {
        slug: "lekempti-coffee",
        name: "Lekempti (Nekemte)",
        image: coffee3.url,
        gallery: [coffee4.url, coffee6.url],
        imagePosition: "20% 65%",
        tagline: "Sun-dried natural Arabica from western Ethiopia.",
        overview:
          "From the Wollega region in western Ethiopia, Lekempti coffees are typically sun-dried naturals with a fruity, medium-bodied cup and clean acidity — reliable volume for blenders and roasters.",
        regions: ["Lekempti", "Nekemte", "East Wollega", "West Wollega", "Gimbi"],
        specs: [
          { label: "Species", value: "Coffea arabica" },
          { label: "Altitude", value: "1,500 – 2,100 m" },
          { label: "Processing", value: "Natural (sun-dried)" },
          { label: "Grades", value: "G3, G4, G5" },
          { label: "Screen size", value: "14 up" },
          { label: "Moisture", value: "10 – 11.5%" },
        ],
        packaging: ["60 kg jute bags"],
        uses: ["Commercial blends", "Filter coffee", "Roast-and-ground retail"],
      },
      {
        slug: "harar-coffee",
        name: "Harar",
        image: coffee4.url,
        gallery: [coffee5.url, coffee7.url],
        imagePosition: "80% 60%",
        tagline: "Iconic dry-processed Arabica with blueberry and wine notes.",
        overview:
          "Grown on smallholder farms in eastern Ethiopia's Hararghe highlands, Harar is one of the oldest coffee origins in the world. Fully sun-dried, mocha-like character with distinctive blueberry, dark chocolate and wine notes.",
        regions: ["Harar", "East Hararghe", "West Hararghe", "Gemechis", "Girawa"],
        specs: [
          { label: "Species", value: "Coffea arabica" },
          { label: "Altitude", value: "1,500 – 2,100 m" },
          { label: "Processing", value: "Natural (sun-dried)" },
          { label: "Grades", value: "Longberry, Shortberry, Mocha" },
          { label: "Screen size", value: "14 up" },
          { label: "Moisture", value: "10 – 11.5%" },
        ],
        packaging: ["60 kg jute bags"],
        uses: ["Signature naturals", "Espresso blends", "Turkish / mocha style"],
      },
      {
        slug: "jimma-coffee",
        name: "Jimma",
        image: coffee5.url,
        gallery: [coffee6.url, coffee8.url],
        imagePosition: "40% 20%",
        tagline: "Full-bodied Arabica from the birthplace of coffee.",
        overview:
          "Sourced from the forests and highlands of southwestern Ethiopia — the botanical origin of Coffea arabica. Jimma coffees are typically full-bodied with mild acidity and earthy, spice-forward notes.",
        regions: ["Jimma", "Jimma Zone", "Gomma", "Manna"],
        specs: [
          { label: "Species", value: "Coffea arabica" },
          { label: "Altitude", value: "1,400 – 2,000 m" },
          { label: "Processing", value: "Washed, Natural" },
          { label: "Grades", value: "G2, G3, G4, G5" },
          { label: "Screen size", value: "14 up" },
          { label: "Moisture", value: "10 – 11.5%" },
        ],
        packaging: ["60 kg jute bags"],
        uses: ["Commercial blends", "Filter coffee", "Retail roasting"],
      },
      {
        slug: "limmu-coffee",
        name: "Limmu",
        image: coffee6.url,
        gallery: [coffee7.url, coffee9.url],
        imagePosition: "60% 80%",
        tagline: "Clean, wine-like washed Arabica from southwest Ethiopia.",
        overview:
          "Limmu is one of Ethiopia's classic washed origins, delivering a well-balanced cup with wine-like acidity, medium body and a sweet, clean finish — widely used in premium blends.",
        regions: ["Limmu", "Limmu Kossa", "Limmu Seka", "Chora"],
        specs: [
          { label: "Species", value: "Coffea arabica" },
          { label: "Altitude", value: "1,400 – 2,000 m" },
          { label: "Processing", value: "Washed" },
          { label: "Grades", value: "G1, G2, G3" },
          { label: "Screen size", value: "14 up" },
          { label: "Moisture", value: "10 – 11.5%" },
        ],
        packaging: ["60 kg jute bags with GrainPro liner"],
        uses: ["Premium blends", "Specialty espresso", "Filter coffee"],
      },
      {
        slug: "bench-maji-coffee",
        name: "Bench Maji",
        image: coffee7.url,
        gallery: [coffee8.url, coffee9.url],
        imagePosition: "25% 45%",
        tagline: "Forest-grown Arabica from Ethiopia's southwestern frontier.",
        overview:
          "From the remote forests of the Bench Maji zone, this origin offers wild, forest-grown Arabica with earthy sweetness, spice notes and a heavy body — a hidden gem among Ethiopian origins.",
        regions: ["Bench Maji", "Bench Maji Zone", "Sheko", "Mizan Aman", "Guraferda"],
        specs: [
          { label: "Species", value: "Coffea arabica" },
          { label: "Altitude", value: "1,400 – 1,900 m" },
          { label: "Processing", value: "Washed, Natural" },
          { label: "Grades", value: "G2, G3, G4" },
          { label: "Screen size", value: "14 up" },
          { label: "Moisture", value: "10 – 11.5%" },
        ],
        packaging: ["60 kg jute bags"],
        uses: ["Forest-coffee blends", "Filter coffee", "Origin story lots"],
      },
    ],
  },
  {
    id: "oilseeds",
    icon: "🌱",
    title: "Oilseeds",
    blurb: "Premium oilseeds prized by global food manufacturers.",
    products: [
      {
        slug: "sesame-seeds",
        name: "Sesame Seeds",
        image: sesame.url,
        tagline: "Humera & Wollega whitish sesame with high oil content.",
        overview:
          "Ethiopia is one of the world's top sesame origins, prized for its clean, sweet flavor and high oil yield. Cleaned to buyer-defined purity.",
        regions: ["Humera", "Gondar", "Wollega", "Metema"],
        specs: [
          { label: "Type", value: "Whitish / Humera, Wollega mixed" },
          { label: "Purity", value: "98% – 99.95%" },
          { label: "Oil content", value: "≥ 50%" },
          { label: "FFA", value: "≤ 2%" },
          { label: "Moisture", value: "≤ 6%" },
          { label: "Admixture", value: "≤ 0.5%" },
        ],
        packaging: ["50 kg PP bags", "FCL 20ft: 25 MT"],
        uses: ["Tahini & hummus", "Bakery topping", "Oil pressing", "Confectionery"],
      },
      {
        slug: "soybeans",
        name: "Soybeans",
        image: soybean.url,
        tagline: "Non-GMO Ethiopian soybeans for food and feed markets.",
        overview:
          "Naturally cultivated non-GMO soybeans with strong protein content, suited to plant-protein processing, oil crushing, and animal feed.",
        regions: ["Pawe", "Gambella", "Assosa", "Jimma"],
        specs: [
          { label: "Type", value: "Yellow, non-GMO" },
          { label: "Protein", value: "≥ 36%" },
          { label: "Oil content", value: "≥ 18%" },
          { label: "Moisture", value: "≤ 12%" },
          { label: "Foreign matter", value: "≤ 1%" },
          { label: "Split beans", value: "≤ 10%" },
        ],
        packaging: ["50 kg PP bags", "Bulk on request"],
        uses: ["Soy oil", "Soy milk & tofu", "Feed protein meal"],
      },
      {
        slug: "peanuts",
        name: "Peanuts",
        image: peanuts.url,
        tagline: "Java and Roba varieties, hand-sorted for export.",
        overview:
          "Ethiopian groundnuts with sweet flavor and low aflatoxin risk when properly stored. Available blanched or in-skin.",
        regions: ["Eastern Hararghe", "Babile", "Gambella"],
        specs: [
          { label: "Varieties", value: "Java, Roba" },
          { label: "Count / oz", value: "40/50, 50/60, 60/70" },
          { label: "Moisture", value: "≤ 8%" },
          { label: "Aflatoxin", value: "EU / buyer spec compliant" },
          { label: "Foreign matter", value: "≤ 0.5%" },
          { label: "Splits", value: "≤ 2%" },
        ],
        packaging: ["25 kg / 50 kg PP or jute", "Vacuum on request"],
        uses: ["Snack roasting", "Peanut butter", "Confectionery", "Oil pressing"],
      },
    ],
  },
  {
    id: "pulses",
    icon: "🌾",
    title: "Pulses",
    blurb: "Sortex-cleaned pulses ready for international markets.",
    products: [
      {
        slug: "light-speckled-kidney-beans",
        name: "Light Speckled Kidney Beans",
        image: lskb.url,
        tagline: "Sugar / cranberry beans with soft skin and creamy texture.",
        overview:
          "Also known as sugar or cranberry beans. Bright cream background with pink-red speckling, prized in Mediterranean and Middle Eastern markets.",
        regions: ["Arsi", "Bale", "West Shewa"],
        specs: [
          { label: "Type", value: "Light Speckled Sugar Bean" },
          { label: "Purity", value: "99% min" },
          { label: "Moisture", value: "≤ 14%" },
          { label: "Size", value: "180 – 220 seeds / 100 g" },
          { label: "Broken", value: "≤ 1%" },
          { label: "Cleaning", value: "Sortex, machine-cleaned" },
        ],
        packaging: ["25 / 50 kg PP bags", "FCL 20ft: 25 MT"],
        uses: ["Canning", "Retail dry pack", "Ready meals"],
      },
      {
        slug: "red-speckled-kidney-beans",
        name: "Red Speckled Kidney Beans",
        image: rskb.url,
        tagline: "Bold red-and-cream speckle, popular across Africa & Europe.",
        overview:
          "Vibrant speckled kidney beans with firm skin and rich flavor after cooking. A staple across African and European kitchens.",
        regions: ["Arsi", "Bale", "West Shewa", "Sidamo"],
        specs: [
          { label: "Type", value: "Red Speckled Kidney" },
          { label: "Purity", value: "99% min" },
          { label: "Moisture", value: "≤ 14%" },
          { label: "Size", value: "160 – 200 seeds / 100 g" },
          { label: "Broken", value: "≤ 1%" },
          { label: "Cleaning", value: "Sortex" },
        ],
        packaging: ["25 / 50 kg PP bags"],
        uses: ["Canning", "Stews", "Retail dry pack"],
      },
      {
        slug: "red-kidney-beans",
        name: "Red Kidney Beans",
        image: rkb.url,
        tagline: "Deep red, uniform kidneys with excellent cook-out.",
        overview:
          "Uniform dark red kidney beans with clean color and firm shape after canning. Backbone of chili, stews, and salads worldwide.",
        regions: ["Arsi", "Bale", "West Shewa"],
        specs: [
          { label: "Type", value: "Dark Red Kidney" },
          { label: "Purity", value: "99% min" },
          { label: "Moisture", value: "≤ 14%" },
          { label: "Size", value: "180 – 220 seeds / 100 g" },
          { label: "Broken", value: "≤ 1%" },
          { label: "Cleaning", value: "Sortex" },
        ],
        packaging: ["25 / 50 kg PP bags"],
        uses: ["Canning", "Chili", "Salads", "Ready meals"],
      },
      {
        slug: "chickpeas",
        name: "Chickpeas",
        image: chickpeas.url,
        tagline: "Kabuli-type chickpeas with large caliber and creamy taste.",
        overview:
          "Ethiopia is a leading African producer of Kabuli chickpeas. Large-caliber, uniform seeds ideal for canning and hummus manufacturing.",
        regions: ["Shewa", "Gojam", "Wollo"],
        specs: [
          { label: "Type", value: "Kabuli" },
          { label: "Caliber", value: "7 mm, 8 mm, 9 mm, 10 mm+" },
          { label: "Purity", value: "99% min" },
          { label: "Moisture", value: "≤ 13%" },
          { label: "Broken", value: "≤ 1%" },
          { label: "Cleaning", value: "Sortex" },
        ],
        packaging: ["25 / 50 kg PP bags"],
        uses: ["Hummus & tahini", "Canning", "Retail dry pack", "Snacks"],
      },
    ],
  },
  {
    id: "cereals",
    icon: "🌽",
    title: "Cereals",
    blurb: "Staple cereals grown in Ethiopia's fertile lowlands.",
    products: [
      {
        slug: "sorghum",
        name: "Sorghum",
        image: sorghum.url,
        tagline: "White food-grade sorghum for milling and brewing.",
        overview:
          "Clean white sorghum grown in Ethiopia's lowlands. Suited to flour milling, brewing, and animal feed markets.",
        regions: ["Wollo", "Hararghe", "Metema"],
        specs: [
          { label: "Type", value: "White food-grade" },
          { label: "Purity", value: "99% min" },
          { label: "Moisture", value: "≤ 13%" },
          { label: "Broken", value: "≤ 2%" },
          { label: "Foreign matter", value: "≤ 1%" },
          { label: "Test weight", value: "≥ 72 kg/hl" },
        ],
        packaging: ["50 kg PP bags", "Bulk on request"],
        uses: ["Flour & injera", "Brewing malt", "Animal feed"],
      },
      {
        slug: "corn",
        name: "Corn (Maize)",
        image: corn.url,
        tagline: "Yellow food & feed-grade maize, clean and dry.",
        overview:
          "Ethiopian yellow maize suited to feed millers and food processors. Clean, well-dried, and screened for foreign matter.",
        regions: ["Bako", "Jimma", "Wollega"],
        specs: [
          { label: "Type", value: "Yellow dent corn" },
          { label: "Purity", value: "98% min" },
          { label: "Moisture", value: "≤ 13.5%" },
          { label: "Broken", value: "≤ 3%" },
          { label: "Foreign matter", value: "≤ 1%" },
          { label: "Aflatoxin", value: "≤ buyer spec" },
        ],
        packaging: ["50 kg PP bags", "Bulk on request"],
        uses: ["Animal feed", "Milling", "Starch & syrup"],
      },
    ],
  },
];

export const galleryMungBean = mung.url;

// Flat lookups
export const allProducts: (Product & { categoryId: string; categoryTitle: string })[] =
  categories.flatMap((c) =>
    c.products.map((p) => ({ ...p, categoryId: c.id, categoryTitle: c.title })),
  );

export function findProduct(slug: string) {
  return allProducts.find((p) => p.slug === slug);
}

// Filterable tags used by the product grid
export const productTags = [
  "Specialty Coffee",
  "Commercial Coffee",
  "Oilseeds",
  "Pulses",
  "Cereals",
] as const;

export type ProductTag = (typeof productTags)[number];

const specialtyCoffeeSlugs = new Set([
  "yirgacheffe-coffee",
  "sidamo-coffee",
  "guji-coffee",
  "limmu-coffee",
]);

export function getProductTag(categoryId: string, slug: string): ProductTag {
  if (categoryId === "coffee") {
    return specialtyCoffeeSlugs.has(slug) ? "Specialty Coffee" : "Commercial Coffee";
  }
  if (categoryId === "oilseeds") return "Oilseeds";
  if (categoryId === "pulses") return "Pulses";
  return "Cereals";
}

export function getSpec(product: Product, label: string): string | undefined {
  return product.specs.find((s) => s.label.toLowerCase() === label.toLowerCase())?.value;
}

const regionToSlug: Record<string, string> = {
  Yirgacheffe: "yirgacheffe-coffee",
  "Gedeo Zone": "yirgacheffe-coffee",
  Kochere: "yirgacheffe-coffee",
  Wenago: "yirgacheffe-coffee",
  Dumerso: "yirgacheffe-coffee",
  Sidamo: "sidamo-coffee",
  "Sidama Zone": "sidamo-coffee",
  Bensa: "sidamo-coffee",
  Aroresa: "sidamo-coffee",
  "Bona Zuria": "sidamo-coffee",
  Guji: "guji-coffee",
  "Guji Zone": "guji-coffee",
  Shakiso: "guji-coffee",
  Uraga: "guji-coffee",
  Hambela: "guji-coffee",
  Lekempti: "lekempti-coffee",
  Nekemte: "lekempti-coffee",
  "East Wollega": "lekempti-coffee",
  "West Wollega": "lekempti-coffee",
  Gimbi: "lekempti-coffee",
  Harar: "harar-coffee",
  "East Hararghe": "harar-coffee",
  "West Hararghe": "harar-coffee",
  Gemechis: "harar-coffee",
  Girawa: "harar-coffee",
  Jimma: "jimma-coffee",
  "Jimma Zone": "jimma-coffee",
  Gomma: "jimma-coffee",
  Manna: "jimma-coffee",
  Limmu: "limmu-coffee",
  "Limmu Kossa": "limmu-coffee",
  "Limmu Seka": "limmu-coffee",
  Chora: "limmu-coffee",
  "Bench Maji": "bench-maji-coffee",
  "Bench Maji Zone": "bench-maji-coffee",
  Sheko: "bench-maji-coffee",
  "Mizan Aman": "bench-maji-coffee",
  Guraferda: "bench-maji-coffee",
};

export function getRegionProductSlug(region: string): string | null {
  return regionToSlug[region] ?? null;
}
