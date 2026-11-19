import { Reveal } from "./Reveal";
import { useLanguage } from "@/lib/i18n";
import sortingTeam1 from "@/assets/sorting-team-1.webp";
import sortingTest from "@/assets/sorting-test.webp";
import sortingTeam2 from "@/assets/sorting-team-2.webp";

const copy = {
  en: {
    eyebrow: "Quality in practice",
    title: "Sorted by machine,",
    accent: "checked by people.",
    description:
      "We test our lots on AI-assisted optical sorting equipment, so defective and foreign material is removed before export.",
    photos: [
      "Our team with the Vigila AI optical sorter",
      "Running a live batch through the sorter",
      "Reviewing the sorter at the factory",
    ],
  },
  zh: {
    eyebrow: "品质实践",
    title: "机器分选，",
    accent: "人工把关。",
    description: "我们在 AI 辅助的光学色选设备上测试货物，在出口前剔除瑕疵与杂质。",
    photos: [
      "我们的团队与 Vigila AI 光学色选机",
      "在色选机上进行实时批次测试",
      "在工厂现场考察色选设备",
    ],
  },
} as const;

const images = [sortingTeam1, sortingTest, sortingTeam2];

export function QualitySorting() {
  const { language } = useLanguage();
  const t = language === "zh" ? copy.zh : copy.en;
  return (
    <section id="quality-sorting" className="section-y relative overflow-hidden bg-background">
      <div className="container-x relative">
        <Reveal>
          <div className="max-w-2xl">
            <span className="eyebrow">{t.eyebrow}</span>
            <h2 className="mt-4 text-h2 font-medium leading-[1.1] text-foreground">
              {t.title} <span className="italic text-coffee">{t.accent}</span>
            </h2>
            <p className="mt-5 measure leading-relaxed text-muted-foreground">{t.description}</p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {images.map((src, i) => (
            <Reveal key={src} delay={i * 80}>
              <figure className="h-full overflow-hidden rounded-3xl border border-border bg-card">
                <img
                  src={src}
                  alt={t.photos[i]}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover"
                />
                <figcaption className="px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                  {t.photos[i]}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
