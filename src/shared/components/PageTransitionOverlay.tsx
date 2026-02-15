import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { usePageTransition } from "../context/PageTransitionContext";

const COLUMN_COUNT = 8;

function lerpColor(a: string, b: string, t: number): string {
  const parse = (hex: string) => {
    let h = hex.replace("#", "");
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ];
  };
  // Fallback
  if (!a || !b) return "rgb(0,0,0)";

  const [r1, g1, b1] = parse(a);
  const [r2, g2, b2] = parse(b);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const bl = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

export default function PageTransitionOverlay() {
  const { phase, config, onCoverComplete, onRevealComplete } =
    usePageTransition();
  const containerRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  const onCoverCompleteRef = useRef(onCoverComplete);
  const onRevealCompleteRef = useRef(onRevealComplete);

  useEffect(() => {
    onCoverCompleteRef.current = onCoverComplete;
    onRevealCompleteRef.current = onRevealComplete;
  }, [onCoverComplete, onRevealComplete]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".transition-col", { yPercent: 100, visibility: "hidden" });
    }, containerRef);
    ctxRef.current = ctx;
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!config || config.colors.length < 3 || !ctxRef.current) return;

    ctxRef.current.add(() => {
      const cols = gsap.utils.toArray<HTMLElement>(".transition-col");

      if (cols.length > 0) {
        cols.forEach((col, i) => {
          const t = i / (COLUMN_COUNT - 1);

          const colorTop = lerpColor(config.colors[0], config.colors[1], t);

          const colorBottom = lerpColor(config.colors[1], config.colors[2], t);

          col.style.setProperty("--col-top", colorTop);
          col.style.setProperty("--col-bottom", colorBottom);
        });
      }

      if (phase === "covering") {
        gsap.to(cols, {
          yPercent: 0,
          duration: 0.8,
          ease: "expo.inOut",
          visibility: "visible",
          stagger: { amount: 0.25, from: "start" },
          overwrite: "auto",
          onComplete: () => onCoverCompleteRef.current(),
        });
      }

      if (phase === "revealing") {
        gsap.to(cols, {
          yPercent: -100,
          duration: 0.8,
          ease: "expo.inOut",
          stagger: { amount: 0.25, from: "start" },
          overwrite: "auto",
          onComplete: () => {
            gsap.set(cols, { yPercent: 100, visibility: "hidden" });
            onRevealCompleteRef.current();
          },
        });
      }
    });
  }, [phase, config]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-9999 flex h-full w-full"
      aria-hidden="true"
      style={{ filter: "drop-shadow(0px 10px 20px rgba(0,0,0,0.15))" }}
    >
      {Array.from({ length: COLUMN_COUNT }, (_, i) => (
        <div
          key={i}
          className="transition-col relative h-full flex-1"
          style={{
            width: `calc(${100 / COLUMN_COUNT}% + 1px)`,
            marginLeft: i === 0 ? 0 : "-1px",
            opacity: 1,
            zIndex: i,
            background: `linear-gradient(to bottom, var(--col-top), var(--col-bottom))`,
            boxShadow: "inset 0 1px 1px rgba(255,255,255,0.15)",
          }}
        />
      ))}
    </div>
  );
}
