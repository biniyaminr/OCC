import { useCallback, useEffect, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, Minus, Plus, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const MIN = 1;
const MAX = 4;
const STEP = 1.6;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const LABELS = {
  en: {
    close: "Close",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    previous: "Previous photo",
    next: "Next photo",
    hint: "Double-tap or pinch to zoom · drag to move",
  },
  zh: {
    close: "关闭",
    zoomIn: "放大",
    zoomOut: "缩小",
    previous: "上一张",
    next: "下一张",
    hint: "双击或双指缩放 · 拖动查看细节",
  },
};

type View = { scale: number; x: number; y: number };
const RESET: View = { scale: 1, x: 0, y: 0 };

export type ZoomLightboxLabels = {
  close: string;
  zoomIn: string;
  zoomOut: string;
  previous: string;
  next: string;
  hint: string;
};

/**
 * Full-screen photo viewer with zoom: double-click / double-tap to zoom at a
 * point, pinch or mouse wheel to zoom, drag to pan, +/− buttons and keyboard
 * (+, −, 0, ←, →, Esc).
 */
export function ZoomLightbox({
  images,
  captions,
  index,
  open,
  onOpenChange,
  onIndexChange,
  labels: labelsProp,
}: {
  images: string[];
  captions: string[];
  index: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIndexChange: (index: number) => void;
  labels?: ZoomLightboxLabels;
}) {
  const { language } = useLanguage();
  const labels = labelsProp ?? (language === "zh" ? LABELS.zh : LABELS.en);
  const [view, setView] = useState<View>(RESET);
  const [animate, setAnimate] = useState(true);
  const stage = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{
    startDist: number;
    startScale: number;
    startView: View;
    startMid: { x: number; y: number };
    moved: boolean;
  } | null>(null);
  const lastTap = useRef(0);

  useEffect(() => setView(RESET), [index, open]);

  // Keep the photo inside the stage: never pan past its edges.
  const bound = useCallback((v: View): View => {
    const el = stage.current;
    if (!el || v.scale <= 1) return RESET;
    const maxX = (el.clientWidth * (v.scale - 1)) / 2;
    const maxY = (el.clientHeight * (v.scale - 1)) / 2;
    return { scale: v.scale, x: clamp(v.x, -maxX, maxX), y: clamp(v.y, -maxY, maxY) };
  }, []);

  // Zoom so the point (cx, cy), relative to the stage centre, stays put.
  const zoomAt = useCallback(
    (next: number, cx = 0, cy = 0, from?: View) => {
      setView((cur) => {
        const base = from ?? cur;
        const scale = clamp(next, MIN, MAX);
        const k = scale / base.scale;
        return bound({ scale, x: cx - (cx - base.x) * k, y: cy - (cy - base.y) * k });
      });
    },
    [bound],
  );

  const local = (clientX: number, clientY: number) => {
    const r = stage.current!.getBoundingClientRect();
    return { x: clientX - r.left - r.width / 2, y: clientY - r.top - r.height / 2 };
  };

  const go = (n: number) => onIndexChange((n + images.length) % images.length);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...pointers.current.values()];
    setAnimate(false);
    if (pts.length === 2) {
      const [a, b] = pts;
      gesture.current = {
        startDist: Math.hypot(a.x - b.x, a.y - b.y),
        startScale: view.scale,
        startView: view,
        startMid: local((a.x + b.x) / 2, (a.y + b.y) / 2),
        moved: true,
      };
    } else if (pts.length === 1) {
      gesture.current = {
        startDist: 0,
        startScale: view.scale,
        startView: view,
        startMid: { x: e.clientX, y: e.clientY },
        moved: false,
      };
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId) || !gesture.current) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...pointers.current.values()];
    const g = gesture.current;
    if (pts.length === 2 && g.startDist) {
      const [a, b] = pts;
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const mid = local((a.x + b.x) / 2, (a.y + b.y) / 2);
      const scale = clamp((g.startScale * dist) / g.startDist, MIN, MAX);
      const k = scale / g.startView.scale;
      setView(
        bound({
          scale,
          x: mid.x - (g.startMid.x - g.startView.x) * k,
          y: mid.y - (g.startMid.y - g.startView.y) * k,
        }),
      );
    } else if (pts.length === 1) {
      const dx = e.clientX - g.startMid.x;
      const dy = e.clientY - g.startMid.y;
      if (Math.abs(dx) + Math.abs(dy) > 6) g.moved = true;
      if (g.startView.scale > 1)
        setView(bound({ ...g.startView, x: g.startView.x + dx, y: g.startView.y + dy }));
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const g = gesture.current;
    pointers.current.delete(e.pointerId);
    setAnimate(true);
    if (pointers.current.size > 0) {
      // Pinch ended with one finger still down: continue as a pan from here.
      const [p] = [...pointers.current.values()];
      gesture.current = {
        startDist: 0,
        startScale: view.scale,
        startView: view,
        startMid: p,
        moved: true,
      };
      return;
    }
    gesture.current = null;
    if (!g) return;
    // Swipe between photos when not zoomed.
    const dx = e.clientX - g.startMid.x;
    if (g.startView.scale === 1 && !g.startDist && Math.abs(dx) > 50 && e.pointerType !== "mouse") {
      go(dx < 0 ? index + 1 : index - 1);
      return;
    }
    if (g.moved) return;
    // Double tap / double click toggles zoom at that point.
    const now = Date.now();
    if (now - lastTap.current < 300) {
      const p = local(e.clientX, e.clientY);
      if (view.scale > 1) setView(RESET);
      else zoomAt(2.5, p.x, p.y, RESET);
      lastTap.current = 0;
    } else lastTap.current = now;
  };

  // Wheel / trackpad pinch zoom (needs a non-passive listener).
  useEffect(() => {
    const el = stage.current;
    if (!open || !el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setAnimate(false);
      const r = el.getBoundingClientRect();
      const cx = e.clientX - r.left - r.width / 2;
      const cy = e.clientY - r.top - r.height / 2;
      setView((cur) => {
        const scale = clamp(
          cur.scale * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0025)),
          MIN,
          MAX,
        );
        const k = scale / cur.scale;
        return bound({ scale, x: cx - (cx - cur.x) * k, y: cy - (cy - cur.y) * k });
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  });

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") go(index - 1);
    else if (e.key === "ArrowRight") go(index + 1);
    else if (e.key === "+" || e.key === "=") zoomAt(view.scale * STEP);
    else if (e.key === "-" || e.key === "_") zoomAt(view.scale / STEP);
    else if (e.key === "0") setView(RESET);
    else return;
    e.preventDefault();
    setAnimate(true);
  };

  const btn =
    "grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-black/45 text-white backdrop-blur transition-colors hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-35 disabled:hover:border-white/25 disabled:hover:text-white";

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-black data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          onKeyDown={onKeyDown}
          aria-describedby={undefined}
          className="fixed inset-0 z-[60] flex flex-col bg-black text-white outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0"
        >
          <DialogPrimitive.Title className="sr-only">{captions[index]}</DialogPrimitive.Title>

          <div className="flex items-center justify-between gap-3 p-3 sm:p-4">
            <p className="font-mono text-[11px] tabular-nums text-white/80">
              {String(index + 1).padStart(2, "0")}{" "}
              <span className="text-white/45">/ {String(images.length).padStart(2, "0")}</span>
              <span className="ml-3 hidden text-white/45 sm:inline">
                {Math.round(view.scale * 100)}%
              </span>
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className={btn}
                aria-label={labels.zoomOut}
                disabled={view.scale <= MIN}
                onClick={() => {
                  setAnimate(true);
                  zoomAt(view.scale / STEP);
                }}
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                type="button"
                className={btn}
                aria-label={labels.zoomIn}
                disabled={view.scale >= MAX}
                onClick={() => {
                  setAnimate(true);
                  zoomAt(view.scale * STEP);
                }}
              >
                <Plus className="h-4 w-4" />
              </button>
              <DialogPrimitive.Close className={btn} aria-label={labels.close}>
                <X className="h-5 w-5" />
              </DialogPrimitive.Close>
            </div>
          </div>

          <div
            ref={stage}
            className={`relative min-h-0 flex-1 touch-none select-none overflow-hidden ${
              view.scale > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
            }`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <img
              src={images[index]}
              alt={captions[index]}
              draggable={false}
              className="absolute inset-0 h-full w-full object-contain will-change-transform"
              style={{
                transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})`,
                transition: animate ? "transform 220ms ease-out" : "none",
              }}
            />
            <button
              type="button"
              onClick={() => go(index - 1)}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label={labels.previous}
              className={`${btn} absolute left-3 top-1/2 -translate-y-1/2`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label={labels.next}
              className={`${btn} absolute right-3 top-1/2 -translate-y-1/2`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4 text-center">
            <p className="text-sm leading-relaxed text-white">{captions[index]}</p>
            <p className="mt-1 text-xs text-white/50">{labels.hint}</p>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
