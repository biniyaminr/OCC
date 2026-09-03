/**
 * Chinese copy for catalog content.
 *
 * The studio edits English — that is the source of truth and what Supabase
 * stores. These translations overlay it when the reader picks 中文, falling
 * back to the English field whenever a translation is absent, so a newly
 * created product still renders (in English) rather than disappearing.
 */
export type CatalogText = { name?: string; tagline?: string; overview?: string };

export const CATEGORY_ZH: Record<string, { title?: string; blurb?: string }> = {
  coffee: {
    title: "咖啡",
    blurb: "来自埃塞俄比亚著名产区、风味浓郁的阿拉比卡咖啡。",
  },
  oilseeds: {
    title: "油料作物",
    blurb: "含油量高、经出口级清理的芝麻、大豆与花生。",
  },
  pulses: {
    title: "豆类",
    blurb: "颗粒饱满、分级严格的鹰嘴豆与各类芸豆。",
  },
  cereals: {
    title: "谷物",
    blurb: "适用于食品与饲料的高原高粱与玉米。",
  },
};

export const PRODUCT_ZH: Record<string, CatalogText> = {
  "yirgacheffe-coffee": {
    name: "耶加雪菲",
    tagline: "来自埃塞俄比亚南部、花香与柑橘调明亮的水洗阿拉比卡。",
    overview:
      "生长于盖迪奥（Gedeo）地区海拔 1,700–2,200 米，耶加雪菲是细腻、茶感埃塞俄比亚咖啡的标杆。以茉莉花香、柠檬柑橘酸质与干净明亮的口感著称，深受全球精品市场喜爱。",
  },
  "sidamo-coffee": {
    name: "西达摩",
    tagline: "均衡、酒香明显、酸质明亮的阿拉比卡。",
    overview:
      "西达摩咖啡生长于埃塞俄比亚南部广泛的海拔带，以中等醇厚度、酒香般的酸质，以及从莓果到柑橘的复杂果味著称。",
  },
  "guji-coffee": {
    name: "古吉",
    tagline: "来自奥罗米亚高原、果味浓郁奔放的阿拉比卡。",
    overview:
      "古吉曾被归入西达摩体系，如今已成为独立的知名产区。高海拔庄园带来浓郁的核果、莓果与花香，口感如糖浆般顺滑。",
  },
  "lekempti-coffee": {
    name: "利姆（内克姆特）",
    tagline: "来自埃塞俄比亚西部的日晒阿拉比卡。",
    overview:
      "产自埃塞俄比亚西部沃莱加（Wollega）地区，利姆咖啡通常为日晒处理，果味明显、醇厚度中等、酸质干净，是拼配商与烘焙商稳定的批量来源。",
  },
  "harar-coffee": {
    name: "哈拉尔",
    tagline: "标志性的日晒阿拉比卡，带蓝莓与酒香。",
    overview:
      "产自埃塞俄比亚东部哈拉尔盖（Hararghe）高原的小农庄园，哈拉尔是世界上最古老的咖啡产区之一。全日晒处理，具有摩卡般的特征与独特的蓝莓、黑巧克力和酒香。",
  },
  "jimma-coffee": {
    name: "吉马",
    tagline: "产量稳定、性价比突出的西南部阿拉比卡。",
    overview:
      "吉马是埃塞俄比亚产量最大的咖啡产区之一，提供水洗与日晒两种处理方式，口感均衡、醇厚度中等，适合规模化拼配与商业烘焙。",
  },
  "limmu-coffee": {
    name: "利姆",
    tagline: "来自吉马地区的水洗高原阿拉比卡。",
    overview:
      "利姆以水洗处理著称，酸质柔和、带香料与葡萄酒气息，杯测干净平衡，是精品与优质商业market常见的选择。",
  },
  "bench-maji-coffee": {
    name: "本奇马吉",
    tagline: "来自西南森林产区的野生原生阿拉比卡。",
    overview:
      "本奇马吉位于埃塞俄比亚西南部森林地带，咖啡多在半野生环境中生长，风味带有独特的草本与热带果调，可追溯性强。",
  },
  "sesame-seeds": {
    name: "芝麻",
    tagline: "白色、高含油量的出口级芝麻。",
    overview:
      "产自胡梅拉（Humera）与沃莱加地区的白芝麻，含油量高、杂质率低，广泛用于榨油、烘焙与芝麻酱加工。",
  },
  soybeans: {
    name: "大豆",
    tagline: "非转基因、蛋白含量高。",
    overview: "埃塞俄比亚大豆为非转基因品种，蛋白质含量高，适用于食品加工、榨油与饲料生产。",
  },
  peanuts: {
    name: "花生",
    tagline: "带皮、经出口级清理。",
    overview: "带皮花生经机械清理与分级，适用于榨油、休闲食品与花生酱加工。",
  },
  "light-speckled-kidney-beans": {
    name: "浅色花芸豆",
    tagline: "糖豆品种。",
    overview: "浅色花芸豆（糖豆）颗粒均匀、色泽一致，经机器清理与人工挑选，符合出口标准。",
  },
  "red-speckled-kidney-beans": {
    name: "红花芸豆",
    tagline: "蔓越莓 / 波罗蒂豆类型。",
    overview: "红花芸豆属蔓越莓豆类型，花纹清晰、颗粒饱满，广泛用于罐头与家庭烹饪市场。",
  },
  "red-kidney-beans": {
    name: "红芸豆",
    tagline: "深红色、人工分级。",
    overview: "深红色芸豆经人工分级，颜色均匀、破损率低，适用于罐头加工与零售包装。",
  },
  chickpeas: {
    name: "鹰嘴豆",
    tagline: "卡布里型，颗粒饱满、粒径均匀。",
    overview:
      "埃塞俄比亚卡布里（Kabuli）鹰嘴豆颗粒大、色泽浅，粒径分级严格，适用于鹰嘴豆泥、罐头与休闲食品加工。",
  },
  sorghum: {
    name: "高粱",
    tagline: "来自高原的食品与饲料级白高粱。",
    overview: "白高粱产自埃塞俄比亚高原，颗粒洁净、单宁含量低，适用于食品加工、酿造与饲料配方。",
  },
  corn: {
    name: "玉米",
    tagline: "饲料与制粉级。",
    overview: "黄玉米经清理与干燥，水分可控，适用于饲料生产与玉米粉加工。",
  },
};

/** Spec labels recur across products, so they translate as a small lookup. */
export const SPEC_LABEL_ZH: Record<string, string> = {
  Species: "品种",
  Altitude: "海拔",
  Processing: "处理方式",
  Grades: "等级",
  "Screen size": "筛网目数",
  Moisture: "水分",
  Purity: "纯度",
  "Oil content": "含油量",
  Admixture: "杂质率",
  "Foreign matter": "异物",
  Protein: "蛋白质",
  Caliber: "粒径",
  Size: "规格",
  Variety: "品种",
  Colour: "色泽",
  Color: "色泽",
  Availability: "供货情况",
  Origin: "产地",
};
