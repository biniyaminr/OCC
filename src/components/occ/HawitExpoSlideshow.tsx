import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Pause, Play } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { ZoomLightbox } from "./ZoomLightbox";
import expo1 from "@/assets/hawit-expo-1.webp";
import expo2 from "@/assets/hawit-expo-2.webp";
import expo3 from "@/assets/hawit-expo-3.webp";
import expo4 from "@/assets/hawit-expo-4.webp";
import expo5 from "@/assets/hawit-expo-5.webp";
import expo6 from "@/assets/hawit-expo-6.webp";

const images = [expo1, expo2, expo3, expo4, expo5, expo6];

const copy = {
  en: {
    heading: "At the exhibition",
    label: "Hawit MIA AI colour sorter at an agricultural exhibition",
    captions: [
      "The Hawit MIA AI colour sorter on the Servis Yug stand",
      "Visitors at the stand beside the running sorter",
      "Buyers and engineers discussing the MIA sorter",
      "Going through sorted samples and specifications with visitors",
      "Setting up a sort on the touchscreen while visitors check the output",
      "A busy stand throughout the show",
    ],
    previous: "Previous photo",
    next: "Next photo",
    pause: "Pause slideshow",
    play: "Play slideshow",
    show: (n: number) => `Show photo ${n}`,
    enlarge: "View full screen and zoom",
  },
  zh: {
    heading: "展会现场",
    label: "Hawit MIA AI 色选机亮相农业展会",
    captions: [
      "Servis Yug 展台上的 Hawit MIA AI 色选机",
      "访客在运行中的色选机旁参观",
      "采购商与工程师交流 MIA 色选机",
      "与访客一起查看分选样品和技术参数",
      "在触摸屏上设置分选，访客现场查看分选结果",
      "展会期间展台人气旺盛",
    ],
    previous: "上一张",
    next: "下一张",
    pause: "暂停播放",
    play: "播放",
    show: (n: number) => `显示第 ${n} 张`,
    enlarge: "全屏查看并缩放",
  },
};

const HOLD_MS = 4500;
const pad = (n: number) => String(n).padStart(2, "0");

export function HawitExpoSlideshow() {
  const { language } = useLanguage();
  const t = language === "zh" ? copy.zh : copy.en;
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [zoomOpen, setZoomOpen] = useState(false);
  const resumeAfterZoom = useRef(false);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
  }, []);

  const go = useCallback((n: number) => setI((n + images.length) % images.length), []);

  useEffect(() => {
    if (!playing || zoomOpen) return;
    const id = setInterval(() => {
      if (document.visibilityState === "visible") setI((v) => (v + 1) % images.length);
    }, HOLD_MS);
    return () => clearInterval(id);
  }, [playing, zoomOpen, i]);

  const openZoom = () => {
    resumeAfterZoom.current = playing;
    setPlaying(false);
    setZoomOpen(true);
  };

  const btn =
    "grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur transition-colors hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold";

  return (
    <div>
      <h3 className="border-b border-border pb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-gold">
        {t.heading}
      </h3>
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={t.label}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") go(i - 1);
          if (e.key === "ArrowRight") go(i + 1);
        }}
        className="mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <div
          className="relative aspect-[4/3] w-full overflow-hidden bg-charcoal"
          onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = (e.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
            if (Math.abs(dx) > 40) go(dx < 0 ? i + 1 : i - 1);
            touchX.current = null;
          }}
        >
          {images.map((src, index) => {
            const active = index === i;
            return (
              <div
                key={src}
                aria-hidden={!active}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  active ? "opacity-100" : "opacity-0"
                }`}
              >
                {/* Blurred fill keeps portrait shots from leaving empty bars. */}
                <img
                  src={src}
                  alt=""
                  aria-hidden
                  loading={index === 0 ? "eager" : "lazy"}
                  className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-2xl"
                />
                <img
                  src={src}
                  alt={active ? t.captions[index] : ""}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="relative h-full w-full cursor-zoom-in object-contain"
                  onClick={active ? openZoom : undefined}
                />
              </div>
            );
          })}

          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(to_top,rgba(18,14,13,0.75),transparent)]"
          />

          <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-4">
            <p className="rounded-full bg-black/35 px-3 py-1 font-mono text-[11px] tabular-nums text-white/85 backdrop-blur">
              {pad(i + 1)} <span className="text-white/45">/ {pad(images.length)}</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openZoom}
                aria-label={t.enlarge}
                title={t.enlarge}
                className={btn}
              >
                <Maximize2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setPlaying((v) => !v)}
                aria-label={playing ? t.pause : t.play}
                className={btn}
              >
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => go(i - 1)}
                aria-label={t.previous}
                className={btn}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => go(i + 1)} aria-label={t.next} className={btn}>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <p
            aria-live="polite"
            className="pointer-events-none absolute inset-x-0 bottom-0 px-5 pb-4 text-sm leading-relaxed text-white"
          >
            {t.captions[i]}
          </p>
        </div>

        <div className="mt-3 grid grid-cols-6 gap-2">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => go(index)}
              aria-label={t.show(index + 1)}
              aria-current={index === i}
              className={`relative aspect-square overflow-hidden border transition-all ${
                index === i
                  ? "border-gold opacity-100"
                  : "border-border opacity-55 hover:opacity-90"
              }`}
            >
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>
      <ZoomLightbox
        images={images}
        captions={t.captions}
        index={i}
        open={zoomOpen}
        onOpenChange={(open) => {
          setZoomOpen(open);
          if (!open && resumeAfterZoom.current) setPlaying(true);
        }}
        onIndexChange={go}
      />
    </div>
  );
}
