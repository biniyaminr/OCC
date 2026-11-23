import { Reveal } from "./Reveal";
import { useLanguage } from "@/lib/i18n";
import sortingTeam1 from "@/assets/sorting-team-1.webp";
import sortingTest from "@/assets/sorting-test.webp";
import sortingTeam2 from "@/assets/sorting-team-2.webp";

const copy = {
  en: {
    eyebrow: "Quality in practice",
    title: "Optical sorting,",
    accent: "tested in the field.",
    description:
      "Optical colour sorting removes discoloured, defective and foreign material before a lot is exported. These photos and videos show the Hawit AI colour sorter being tested by Degma (Gessi brand) in Argentina on beans, wheat and small grains.",
    photos: [
      "The Degma / Gessi team with the Hawit AI colour sorter in Argentina",
      "Running a test batch of beans through the sorter",
      "The Degma / Gessi and Hawit teams beside the Hawit sorter",
    ],
    videosTitle: "Videos",
    video1: "Diego Loria (Degma, Gessi brand) on testing the Hawit sorter in Argentina",
    video1Note: "In Spanish, with English subtitles.",
    video2: "A Hawit colour sorter running at the factory",
    video2Note: "Machine sound only, no speech.",
    transcript: "Read the transcript",
    transcriptText: [
      "Good morning, how is everyone? This is Diego Loria from the company Degma, of the Gessi brand.",
      "Today we are using the Hawit machine, a colour sorter we have tested on different products used or grown in Argentina: beans, wheat, adzuki beans, white beans, black beans, and we even tested it with small grains.",
      "We have had very good results, thanks also to the training from the Hawit team, who gave us both advice and technical support to set it up properly.",
    ],
  },
  zh: {
    eyebrow: "品质实践",
    title: "光学色选，",
    accent: "实地检验。",
    description:
      "光学色选可在货物出口前剔除变色、瑕疵与杂质。以下照片和视频展示了 Degma（Gessi 品牌）在阿根廷用豆类、小麦和小粒谷物测试 Hawit AI 色选机。",
    photos: [
      "Degma / Gessi 团队与 Hawit AI 色选机（阿根廷）",
      "用色选机进行豆类批次测试",
      "Degma / Gessi 与 Hawit 团队在 Hawit 色选机旁",
    ],
    videosTitle: "视频",
    video1: "Diego Loria（Degma，Gessi 品牌）介绍在阿根廷测试 Hawit 色选机",
    video1Note: "西班牙语原声，附英文字幕。",
    video2: "Hawit 色选机在工厂运行",
    video2Note: "仅机器声音，无讲话。",
    transcript: "查看文字稿",
    transcriptText: [
      "大家早上好。我是 Gessi 品牌旗下 Degma 公司的 Diego Loria。",
      "今天我们正在使用 Hawit 品牌的色选机。我们用它测试了阿根廷常用及本地出产的多种物料：豆类、小麦、红小豆、白芸豆、黑豆，甚至还测试了小粒谷物。",
      "我们取得了非常好的效果，这也要感谢 Hawit 团队的培训，他们为设备调试提供了咨询和技术支持。",
    ],
  },
} as const;

const images = [sortingTeam1, sortingTest, sortingTeam2];

export function QualitySorting() {
  const { language } = useLanguage();
  const isZh = language === "zh";
  const t = isZh ? copy.zh : copy.en;
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

        <h3 className="mt-14 font-display text-2xl font-medium text-foreground">{t.videosTitle}</h3>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Reveal>
            <figure className="h-full overflow-hidden rounded-3xl border border-border bg-card">
              <video
                key={language}
                controls
                playsInline
                preload="metadata"
                poster="/videos/vigila-test-argentina.jpg"
                className="mx-auto max-h-[560px] w-full bg-black object-contain"
              >
                <source src="/videos/vigila-test-argentina.mp4" type="video/mp4" />
                <track
                  kind="subtitles"
                  src="/videos/vigila-test-argentina.en.vtt"
                  srcLang="en"
                  label="English"
                  default
                />
                <track
                  kind="subtitles"
                  src="/videos/vigila-test-argentina.es.vtt"
                  srcLang="es"
                  label="Español"
                />
              </video>
              <figcaption className="px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                <span className="text-foreground">{t.video1}</span>
                <span className="block">{t.video1Note}</span>
                <details className="mt-3">
                  <summary className="cursor-pointer text-coffee">{t.transcript}</summary>
                  <div className="mt-2 space-y-2">
                    {t.transcriptText.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </details>
              </figcaption>
            </figure>
          </Reveal>
          <Reveal delay={80}>
            <figure className="h-full overflow-hidden rounded-3xl border border-border bg-card">
              <video
                controls
                playsInline
                preload="metadata"
                poster="/videos/hawit-sorter-running.jpg"
                className="mx-auto max-h-[560px] w-full bg-black object-contain"
              >
                <source src="/videos/hawit-sorter-running.mp4" type="video/mp4" />
              </video>
              <figcaption className="px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                <span className="text-foreground">{t.video2}</span>
                <span className="block">{t.video2Note}</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
