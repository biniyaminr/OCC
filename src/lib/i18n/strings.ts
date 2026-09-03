export type Language = "en" | "zh";

export const LANGUAGES: { code: Language; label: string; aria: string }[] = [
  { code: "en", label: "EN", aria: "Switch to English" },
  { code: "zh", label: "中文", aria: "切换到中文" },
];

/**
 * Interface chrome only — buttons, labels, headings that live in components.
 * Catalog copy is translated separately in `content.ts`, because it also has
 * to survive the studio overriding it.
 */
export const UI = {
  // -- navigation ---------------------------------------------------------
  "nav.about": { en: "About", zh: "关于我们" },
  "nav.commodities": { en: "Commodities", zh: "产品" },
  "nav.whyEthiopia": { en: "Why Ethiopia", zh: "为何选择埃塞俄比亚" },
  "nav.whyOcc": { en: "Why OCC", zh: "为何选择 OCC" },
  "nav.howItWorks": { en: "How It Works", zh: "合作流程" },
  "nav.partners": { en: "Partners", zh: "合作伙伴" },
  "nav.contact": { en: "Contact OCC", zh: "联系 OCC" },
  "nav.main": { en: "Main", zh: "主导航" },
  "nav.mobile": { en: "Mobile", zh: "移动导航" },
  "nav.menu": { en: "Site menu", zh: "网站菜单" },
  "nav.openMenu": { en: "Open menu", zh: "打开菜单" },
  "nav.closeMenu": { en: "Close menu", zh: "关闭菜单" },
  "nav.home": { en: "go to homepage", zh: "返回首页" },

  // -- hero / general actions --------------------------------------------
  "action.exploreCommodities": { en: "Explore Commodities", zh: "浏览产品" },
  "action.learnAboutOcc": { en: "Learn about OCC", zh: "了解 OCC" },
  "action.learnMore": { en: "Learn more", zh: "了解更多" },
  "action.viewDetails": { en: "View details", zh: "查看详情" },
  "action.viewProduct": { en: "View product", zh: "查看产品" },
  "action.allProducts": { en: "All products", zh: "全部产品" },
  "action.browseProducts": { en: "Browse products", zh: "浏览产品" },
  "action.browseFullCatalog": { en: "Browse the full catalog", zh: "浏览完整产品目录" },
  "action.sendInquiry": { en: "Send Inquiry", zh: "发送询价" },
  "action.close": { en: "Close", zh: "关闭" },

  // -- search -------------------------------------------------------------
  "search.placeholder": {
    en: "Search products, origins, or categories...",
    zh: "搜索产品、产地或类别…",
  },
  "search.placeholderShort": { en: "Search products or origins", zh: "搜索产品或产地" },
  "search.label": { en: "Search products", zh: "搜索产品" },
  "search.clear": { en: "Clear search", zh: "清除搜索" },
  "search.view": { en: "View", zh: "查看" },
  "search.empty": {
    en: 'No products found for "{query}". Try "coffee", "sesame", or "chickpeas".',
    zh: "未找到与“{query}”相关的产品。可尝试“咖啡”、“芝麻”或“鹰嘴豆”。",
  },

  // -- catalog ------------------------------------------------------------
  "catalog.filterLabel": { en: "Filter products by category", zh: "按类别筛选产品" },
  "catalog.all": { en: "All", zh: "全部" },
  "catalog.featuredEyebrow": { en: "Featured Commodities", zh: "精选产品" },
  "catalog.featuredTitleLead": { en: "A living catalog of", zh: "埃塞俄比亚丰收的" },
  "catalog.featuredTitleAccent": { en: "Ethiopia's harvest", zh: "鲜活目录" },
  "catalog.rotationNote": {
    en: "Eleven export lots in rotation.",
    zh: "十一款出口批次轮播展示。",
  },
  "catalog.rotationTail": {
    en: "to filter by commodity group.",
    zh: "以按产品类别筛选。",
  },
  "catalog.previous": { en: "Previous commodity", zh: "上一个产品" },
  "catalog.next": { en: "Next commodity", zh: "下一个产品" },
  "catalog.pause": { en: "Pause slideshow", zh: "暂停轮播" },
  "catalog.play": { en: "Play slideshow", zh: "播放轮播" },
  "catalog.showSlide": { en: "Show {name}", zh: "显示 {name}" },
  "catalog.exportGrade": { en: "Export Grade", zh: "出口级" },

  // -- product detail -----------------------------------------------------
  "product.specifications": { en: "Specifications", zh: "规格参数" },
  "product.packaging": { en: "Packaging", zh: "包装" },
  "product.applications": { en: "Applications", zh: "用途" },
  "product.sourcingRegions": { en: "Sourcing Regions", zh: "产地区域" },
  "product.sourcingIntro": {
    en: "Sourced directly from cooperatives and farms across:",
    zh: "直接采购自以下地区的合作社与农场：",
  },
  "product.requestQuoteFor": { en: "Request Quote for {name}", zh: "为 {name} 申请报价" },
  "product.readyToImport": { en: "Ready to import?", zh: "准备进口？" },
  "product.readyBody": {
    en: "Share your target volume, destination port and required grade — we'll respond within one business day.",
    zh: "请告知目标数量、目的港与所需等级，我们将在一个工作日内回复。",
  },
  "product.notFound": { en: "Product not found", zh: "未找到该产品" },
  "product.notFoundBody": {
    en: "The product you're looking for isn't in our catalog.",
    zh: "您查找的产品不在我们的目录中。",
  },
  "product.relatedTitle": { en: "More from this category", zh: "同类其他产品" },
  "product.downloadDatasheet": { en: "Download data sheet", zh: "下载技术资料" },
  "product.home": { en: "Home", zh: "首页" },
  "product.products": { en: "Products", zh: "产品" },

  // -- request for quote --------------------------------------------------
  "rfq.title": { en: "Request for Quote", zh: "报价申请" },
  "rfq.intro": {
    en: "Share your requirement and we'll respond with availability, specification and indicative FOB Djibouti terms.",
    zh: "请提交您的需求，我们将回复供货情况、规格以及吉布提离岸价参考条款。",
  },
  "rfq.commodity": { en: "Commodity", zh: "产品" },
  "rfq.fullName": { en: "Full name", zh: "姓名" },
  "rfq.company": { en: "Company", zh: "公司名称" },
  "rfq.businessEmail": { en: "Business email", zh: "企业邮箱" },
  "rfq.destinationCountry": { en: "Destination country", zh: "目的国" },
  "rfq.volume": { en: "Volume (MT)", zh: "数量（公吨）" },
  "rfq.volumeHint": { en: "e.g. 25 MT / month", zh: "例如：25 公吨/月" },
  "rfq.incoterm": { en: "Incoterm", zh: "贸易术语" },
  "rfq.grade": { en: "Required grade / specification", zh: "所需等级 / 规格" },
  "rfq.gradeHint": {
    en: "e.g. Grade 1, washed, screen 14 up",
    zh: "例如：一级、水洗、14 目以上",
  },
  "rfq.notes": { en: "Additional notes", zh: "补充说明" },
  "rfq.submit": { en: "Submit RFQ", zh: "提交报价申请" },
  "rfq.sending": { en: "Sending…", zh: "提交中…" },
  "rfq.close": { en: "Close request for quote", zh: "关闭报价申请" },
  "rfq.successTitle": { en: "RFQ submitted", zh: "报价申请已提交" },
  "rfq.successBody": {
    en: "Our sourcing team will respond on {name} within one business day.",
    zh: "我们的采购团队将在一个工作日内就 {name} 与您联系。",
  },

  // -- contact form -------------------------------------------------------
  "contact.fullName": { en: "Full name", zh: "姓名" },
  "contact.companyName": { en: "Company name", zh: "公司名称" },
  "contact.country": { en: "Country", zh: "国家" },
  "contact.businessEmail": { en: "Business email", zh: "企业邮箱" },
  "contact.phone": { en: "Phone or WhatsApp", zh: "电话或 WhatsApp" },
  "contact.productOfInterest": { en: "Product of interest", zh: "感兴趣的产品" },
  "contact.selectProduct": { en: "Select a product…", zh: "请选择产品…" },
  "contact.multipleOther": { en: "Multiple / Other", zh: "多种 / 其他" },
  "contact.quantity": { en: "Estimated quantity", zh: "预计数量" },
  "contact.message": { en: "Message or specifications", zh: "留言或规格要求" },
  "contact.optional": { en: "Optional", zh: "选填" },
  "contact.submit": { en: "Send inquiry", zh: "发送询价" },
  "contact.sending": { en: "Sending…", zh: "发送中…" },
  "contact.receivedTitle": { en: "Inquiry received", zh: "询价已收到" },
  "contact.receivedBody": {
    en: "Thank you. Our sourcing team will reply within one business day.",
    zh: "感谢您的来信。我们的采购团队将在一个工作日内回复。",
  },
  "contact.sendAnother": { en: "Send another inquiry", zh: "再发送一条询价" },
  "contact.email": { en: "Email", zh: "邮箱" },
  "contact.phoneLabel": { en: "Phone", zh: "电话" },
  "contact.headOffice": { en: "Head office", zh: "总部" },
  "contact.errName": { en: "Please enter your full name.", zh: "请输入您的姓名。" },
  "contact.errCompany": { en: "Please enter your company name.", zh: "请输入您的公司名称。" },
  "contact.errEmail": { en: "Please enter your business email.", zh: "请输入您的企业邮箱。" },
  "contact.errEmailFormat": {
    en: "Please enter a valid email address.",
    zh: "请输入有效的邮箱地址。",
  },
  "contact.errProduct": { en: "Please select a product of interest.", zh: "请选择感兴趣的产品。" },
  "contact.errMessage": { en: "Please describe your requirement.", zh: "请描述您的需求。" },

  // -- overview / partners / footer --------------------------------------
  "overview.eyebrow": { en: "At a glance", zh: "概览" },
  "overview.label": { en: "Homepage overview", zh: "首页概览" },
  "overview.portfolio": { en: "Portfolio", zh: "产品组合" },
  "overview.origin": { en: "Origin", zh: "原产地" },
  "overview.assurance": { en: "Assurance", zh: "质量保证" },
  "overview.delivery": { en: "Delivery", zh: "交付" },
  "partners.eyebrow": { en: "Our Partners", zh: "合作伙伴" },
  "partners.titleLead": { en: "Machinery partners powering", zh: "为埃塞俄比亚农产品加工" },
  "partners.titleAccent": { en: "Ethiopian agro-processing.", zh: "提供动力的机械伙伴。" },
  "footer.quickLinks": { en: "Quick Links", zh: "快速链接" },
  "footer.productCategories": { en: "Product Categories", zh: "产品类别" },
  "footer.contact": { en: "Contact", zh: "联系方式" },
  "footer.tagline": {
    en: "Sourcing Ethiopia's finest — for the world.",
    zh: "甄选埃塞俄比亚优质农产，供应全球。",
  },
  "footer.rights": { en: "All rights reserved.", zh: "版权所有。" },
} as const;

export type UIKey = keyof typeof UI;

export function translate(key: UIKey, language: Language, vars?: Record<string, string>) {
  const entry = UI[key] as { en: string; zh: string } | undefined;
  // Fall back to English rather than showing a raw key if a phrase is missing.
  let text = entry ? (entry[language] ?? entry.en) : key;
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replaceAll(`{${name}}`, value);
    }
  }
  return text;
}
