export type PartnerProduct = {
  name: string;
  image: string;
};

export type PartnerOffering = {
  title: string;
  items: string[];
};

export type Partner = {
  slug: string;
  name: string;
  category: string;
  url: string;
  domain: string;
  tagline: string;
  description: string;
  longDescription: string;
  highlights: string[];
  serves: string[];
  offerings: PartnerOffering[];
  gallery: PartnerProduct[];
};

export const partners: Partner[] = [
  {
    slug: "wintone-machinery",
    name: "Wintone Machinery",
    category: "Grain & Seed Processing Equipment",
    url: "https://www.wintone-machinery.com/",
    domain: "wintone-machinery.com",
    tagline: "Cleaning, grading, hulling & turnkey processing lines",
    description:
      "Wintone manufactures grain and seed cleaning, grading, destoning, hulling and packing equipment, and engineers complete turnkey processing lines for cereals, pulses, oilseeds and sesame.",
    longDescription:
      "Wintone Machinery supplies the full upstream side of a processing plant: pre-cleaners, destoners, gravity separators, graders, hullers, polishers and automated weighing and bagging systems. Their engineering teams design complete turnkey lines sized to a plant's target tonnage, covering layout, fabrication, commissioning and operator handover — a natural fit for Ethiopian coffee, sesame, chickpea, kidney bean, cereal, and grain processors scaling toward export volumes.",
    highlights: [
      "Seed cleaning, destoning & gravity separation",
      "Hulling, polishing & grading equipment",
      "Turnkey processing line design and commissioning",
      "Automated weighing, bagging & packing systems",
    ],
    serves: ["Coffee", "Sesame", "Pulses", "Cereals", "Oilseeds", "The whole line of grain"],
    offerings: [
      {
        title: "Processing lines",
        items: [
          "Coffee hulling & processing lines",
          "Wheat flour milling lines",
          "Rice milling & whitening lines",
          "Barley pearling & processing lines",
          "Sorghum & millet processing lines",
          "Maize / corn grits & flour lines",
          "Sesame cleaning, hulling & drying lines",
          "Pulse (bean, lentil, chickpea) dehulling & splitting lines",
        ],
      },
      {
        title: "Standalone machines",
        items: [
          "Air-screen pre-cleaners & vibrating separators",
          "Destoners and gravity separators",
          "Sunflower & soybean dehullers",
          "Peeling, splitting and polishing machines",
          "Grain dryers and elevators/conveyors",
          "Automatic weighing, bagging & packing units",
        ],
      },
      {
        title: "Engineering services",
        items: [
          "Plant layout & capacity engineering",
          "Fabrication, installation & commissioning",
          "Operator training and handover",
          "Spare parts and technical support",
        ],
      },
    ],
    gallery: [
      { name: "Green Coffee Beans Cleaning Plant", image: "https://www.wintone-machinery.com/d/file/plants/beans_processing_plants/7a44c84670ec002df94d18920a802863.jpg" },
      { name: "Processing Plants for Spelt, Wheat, Barley and Rye", image: "https://www.wintone-machinery.com/d/file/plants/wheat_processing_plants/smalla45b661d102a360d2c283422861e9ee31625707793.jpg" },
      { name: "Complete Rice Milling Plant", image: "https://www.wintone-machinery.com/d/file/plants/rice_processing_plants/14c743842cbbafae5dd8d5ed023e476b.jpg" },
      { name: "50 Ton Automatic Rice Mill Plant", image: "https://www.wintone-machinery.com/d/file/plants/rice_processing_plants/3f45dfbac8679b9d2dc0c5392ddbd859.jpg" },
      { name: "Barley Processing Plant", image: "https://www.wintone-machinery.com/d/file/p/110503457b3665021f682f7f7d83a801.jpg" },
      { name: "Sorghum Processing Plant", image: "https://www.wintone-machinery.com/d/file/plants/sorghum_processing_plants/d036c79d244a2e23202faee1a185f76a.jpg" },
      { name: "Millet Processing Plant", image: "https://www.wintone-machinery.com/d/file/plants/millet_processing_plants/c757122a95300efe6578f38644940423.jpg" },
      { name: "Buckwheat Processing Plant", image: "https://www.wintone-machinery.com/d/file/plants/buckwheat_processing_plants/93260310248343f66fead2d14a4ed6e2.jpg" },
      { name: "Instant Oat Flakes Production Line", image: "https://www.wintone-machinery.com/d/file/plants/oat_processing_plants/57916d0fd9f9108d277d31edbdd93396.jpg" },
      { name: "Sesame Cleaning Processing Plant", image: "https://www.wintone-machinery.com/d/file/plants/oilseed_processing_plants/67b399b0fac185db7e077298953ee0bd.jpg" },
      { name: "Soybean Cleaning & Peeling Plant", image: "https://www.wintone-machinery.com/d/file/plants/beans_processing_plants/65468ab1b87a7610ad350f1566b2b0eb.jpg" },
      { name: "Lentil Processing Plant", image: "https://www.wintone-machinery.com/d/file/plants/beans_processing_plants/e874aaeeed9eac2678ab5b9b02655bbb.jpg" },
      { name: "Dry Pea Processing Plant", image: "https://www.wintone-machinery.com/d/file/plants/beans_processing_plants/ee634f1e09d3ef53574fefed1bafe5e1.jpg" },
      { name: "Black Gram / Mung Bean Processing Plant", image: "https://www.wintone-machinery.com/d/file/plants/beans_processing_plants/11179f26fd904d55db4bba932768cdb7.jpg" },
      { name: "Grain & Pulses Cleaning Plant", image: "https://www.wintone-machinery.com/d/file/plants/beans_processing_plants/small5ee7c04408555b374a3fe7546850d485.jpg" },
      { name: "120TPD Pulses & Seeds Cleaning Plant", image: "https://www.wintone-machinery.com/d/file/p/273b707c6e0e32aa362c0e44d1180302.jpg" },
      { name: "80-100TPD Corn Grits & Flour Production Line", image: "https://www.wintone-machinery.com/d/file/plants/corn_processing_plants/ebaa1fecfb621b4c95ed7cb66b543eb1.jpg" },
      { name: "50TPD Complete Maize Flour Milling Plant", image: "https://www.wintone-machinery.com/d/file/p/c96880a955234b150786401a27cde64f.jpg" },
      { name: "20TPD Small Scale Maize Milling Plant", image: "https://www.wintone-machinery.com/d/file/plants/corn_processing_plants/00cd9e946370d5f6c406c31425f3c177.jpg" },
      { name: "300-500 Ton Maize Processing Plant", image: "https://www.wintone-machinery.com/d/file/plants/corn_processing_plants/c67443ab6357bc7c2d839452c1945d34.jpg" },
      { name: "240Ton/24H Precooked Corn Flour Line", image: "https://www.wintone-machinery.com/d/file/plants/corn_processing_plants/357605c1158648948e490d7075df1b5b.jpg" },
      { name: "MTPS Mung Bean & Urad Dal Peeling Machine", image: "https://www.wintone-machinery.com/d/file/p/9f3480f0fea0f21e7657fa6ea5e023c5.jpg" },
      { name: "Sunflower Seed Dehulling Machine", image: "https://www.wintone-machinery.com/d/file/p/a9c7edf68ad8b589362b40f64cba4c7a.jpg" },
      { name: "YTH 35*2 Soybean / Peas Peeling Machine", image: "https://www.wintone-machinery.com/d/file/p/2ad21d50d77d6c428599f8df2ec5f143.jpg" },
      { name: "TQLS-85 Grain Cleaning & Destoning Machine", image: "https://www.wintone-machinery.com/d/file/p/a1d4158c798235d85cd50c5290061724.jpg" },
      { name: "5XFZ-25SC Air-screen Cleaner with Gravity Table", image: "https://www.wintone-machinery.com/d/file/machines/clean/2ef61547dcaa8e059c85e35e10f173eb.jpg" },
      { name: "MTPS Lentil Peeling & Splitting Machine", image: "https://www.wintone-machinery.com/d/file/p/ee31096f1b090a200091886b049a661b.jpg" },
      { name: "NF Double Grain Flour Milling Machine", image: "https://www.wintone-machinery.com/d/file/machines/grits_mill/025f4ad680a011f02cdfcf70a186cbcc.jpg" },
    ],
  },
  {
    slug: "hawit-sorter",
    name: "Hawit Sorter",
    category: "Optical Sorting Machinery",
    url: "https://www.hawitsorter.com/",
    domain: "hawitsorter.com",
    tagline: "Optical sorting & grain processing machinery",
    description:
      "Hawit designs and manufactures intelligent optical sorters and processing lines for coffee, pulses, oilseeds and cereals — helping exporters and processors hit consistent export-grade purity at commercial throughput.",
    longDescription:
      "Hawit builds intelligent colour and shape sorting systems used across Ethiopian coffee washing stations, pulse cleaning plants and oilseed processors. Their machines remove discoloured, defective and foreign material at high throughput, so lots arrive at the port already matching the specification buyers signed for. Alongside the equipment, Hawit provides installation, operator training, calibration and spare-part support on the ground in Ethiopia.",
    highlights: [
      "Colour & shape optical sorters",
      "Coffee, pulses, oilseeds & grain lines",
      "Installation, training & after-sales support",
      "Spare parts and service in Ethiopia",
    ],
    serves: ["Coffee", "Pulses", "Oilseeds", "Cereals", "The whole line of grain"],
    offerings: [
      {
        title: "Optical sorters by crop",
        items: [
          "Coffee bean colour sorters (green & roasted)",
          "Rice and paddy colour sorters",
          "Pulses, beans & dal colour sorters",
          "Peanut and groundnut sorters",
          "Sesame and oilseed sorters",
          "Wheat, barley & sorghum sorters",
        ],
      },
      {
        title: "Machine platforms",
        items: [
          "Chute-type CCD colour sorters",
          "Belt-type sorters for fragile products",
          "Infrared & multispectral sorters",
          "Shape and size sorting systems",
          "Mini sorters for small processors",
          "Stone, glass & foreign-material separators",
        ],
      },
      {
        title: "Support",
        items: [
          "Installation and calibration in Ethiopia",
          "Operator training programmes",
          "Preventive maintenance contracts",
          "Local spare-part stock",
        ],
      },
    ],
    gallery: [
      { name: "S Model Color Sorter — 10 Chutes, 630 Channels", image: "https://www.hawitsorter.com/storage/uploads/images/202605/16/1778917141_GdJU4PpYN8.png" },
      { name: "S Model Rice Color Sorter — 7 Chutes, 441 Channels", image: "https://www.hawitsorter.com/storage/uploads/images/202605/18/1779094039_auawVFXBJF.jpg" },
      { name: "G Model Rice Color Sorter — 8 Chutes, 504 Channels", image: "https://www.hawitsorter.com/storage/uploads/images/202303/16/1678942552_12CiGq7IMA.jpg" },
      { name: "G Model Rice Color Sorter — 10 Chutes, 630 Channels", image: "https://www.hawitsorter.com/storage/uploads/images/202605/18/1779087809_2uHMlaIslE.jpg" },
      { name: "Single Line Rice Sorter — 12 Chutes, 756 Channels", image: "https://www.hawitsorter.com/storage/uploads/images/202605/19/1779153828_wlPzXhGcdf.jpg" },
      { name: "ST Model Multifunction Grain Color Sorter", image: "https://www.hawitsorter.com/storage/uploads/images/202303/16/1678956917_b5kiGcfO3z.jpg" },
      { name: "Multifunction Color Sorter — G Plus Model", image: "https://www.hawitsorter.com/storage/uploads/images/202401/29/1706516804_XceHXBrHua.jpg" },
      { name: "64-Channel Mini Color Sorter", image: "https://www.hawitsorter.com/storage/uploads/images/202303/18/1679120984_zwCJbg9GdM.jpg" },
      { name: "Pulses & Dals Color Sorter", image: "https://www.hawitsorter.com/storage/uploads/images/202605/19/1779161094_o0pk8mdKBd.jpg" },
      { name: "Peanut Color Sorter", image: "https://www.hawitsorter.com/storage/uploads/images/202605/19/1779159930_YLfBbdEMlp.jpg" },
      { name: "Infrared Color Sorter", image: "https://www.hawitsorter.com/storage/uploads/images/202605/19/1779158510_hppt0qzr7e.jpg" },
      { name: "Plastic Color Sorter", image: "https://www.hawitsorter.com/storage/uploads/images/202605/19/1779157201_wIlMvzRXCW.jpg" },
      { name: "Belt Color Sorter", image: "https://www.hawitsorter.com/storage/uploads/images/202303/23/1679536797_a8wyZQlsoc.jpg" },
      { name: "Stone & Glass Color Sorter", image: "https://www.hawitsorter.com/storage/uploads/images/202303/22/1679452449_KeoEpShgxj.jpg" },
      { name: "Cashew Color Sorter Installed On Site", image: "https://www.hawitsorter.com/storage/uploads/images/202603/30/1774851821_LrsUXhoMYb.jpg" },
      { name: "Sorter Installed at a Rice Mill in Thailand", image: "https://www.hawitsorter.com/storage/uploads/images/202303/24/1679626412_65WFO3WgU6.jpg" },
      { name: "Infrared Sorter Installed in Turkey", image: "https://www.hawitsorter.com/storage/uploads/images/202304/03/1680488005_UgrdCzHCZi.jpg" },
      { name: "Sorter Installed in India", image: "https://www.hawitsorter.com/storage/uploads/images/202303/24/1679626157_3KLiFUOihz.jpg" },
    ],
  },
];
