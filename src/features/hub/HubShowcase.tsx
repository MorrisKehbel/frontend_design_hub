import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTransitionNavigate } from "../../shared/hooks/useTransitionNavigate";

gsap.registerPlugin(ScrollTrigger);

const FORTHCOMING_CARDS = [
  { gradient: "from-pebble/50 to-sand" },
  { gradient: "from-stone/15 to-pebble/30" },
] as const;

export default function HubShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const philosophyRef = useRef<HTMLParagraphElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const navigateWithTransition = useTransitionNavigate();

  const handleVeloraClick = useCallback(() => {
    navigateWithTransition({
      targetRoute: "/velora",
      colors: ["#1b3a2d", "#2a5a42", "#8baf9c"],
    });
  }, [navigateWithTransition]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section heading
      gsap.fromTo(
        headingRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: headingRef.current, start: "top 85%" },
        },
      );

      // Horizontal rule
      gsap.fromTo(
        ruleRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: { trigger: ruleRef.current, start: "top 85%" },
        },
      );

      // Philosophy text
      gsap.fromTo(
        philosophyRef.current,
        { y: 14, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: philosophyRef.current, start: "top 85%" },
        },
      );

      // Project cards stagger
      gsap.fromTo(
        cardRefs.current.filter(Boolean),
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: gridRef.current, start: "top 80%" },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="px-6 py-20 md:py-28 lg:py-36">
      <div className="mx-auto max-w-5xl">
        <h2
          ref={headingRef}
          className="font-serif text-2xl font-light tracking-[0.08em] text-ink md:text-3xl"
        >
          Selected Works
        </h2>
        <div ref={ruleRef} className="mt-4 h-px w-10 origin-left bg-wood/40" />

        <p
          ref={philosophyRef}
          className="mt-10 max-w-md font-sans text-sm leading-relaxed text-ink-muted md:mt-12 md:text-[15px]"
        >
          Dedicated to the silent art of making things work beautifully and
          bringing creative visions to life.
        </p>

        {/* Projects grid */}
        <div
          ref={gridRef}
          className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 lg:gap-10"
        >
          <div
            ref={(el) => {
              cardRefs.current[0] = el;
            }}
            role="link"
            tabIndex={0}
            onClick={handleVeloraClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleVeloraClick();
              }
            }}
            className="group block cursor-pointer"
          >
            <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-black transition-transform duration-500 group-hover:scale-[1.02] group-active:scale-[0.99]">
              <video
                autoPlay
                muted
                playsInline
                className="h-full w-full object-cover"
                poster="/sites_assets/velora/Velora_Video_Campaign_Generation_poster.webp"
              >
                <source
                  src="/sites_assets/velora/Velora_Video_Campaign_Generation_web.mp4"
                  type="video/mp4"
                />
              </video>
              <div className="absolute inset-0 bg-linear-to-br from-[#1b3a2d] via-[#2a5a42] to-[#8baf9c] opacity-60" />
              {/* Decorative leaf circle inside the card */}
              <div className="absolute inset-0 flex h-full items-center justify-center">
                <div className="h-16 w-16 rounded-full border border-white/30 transition-transform duration-700 group-hover:scale-110 md:h-20 md:w-20" />
              </div>
            </div>

            <span className="mt-4 block font-sans text-[10px] font-medium tracking-[0.18em] uppercase text-stone">
              Organic / Biophilic
            </span>
            <h3 className="mt-1.5 font-serif text-lg font-light tracking-wide text-ink md:text-xl">
              Velora
            </h3>
            <p className="mt-1 font-sans text-sm leading-relaxed text-ink-muted">
              Where architecture and nature converge
            </p>
            <span className="mt-3 inline-flex items-center gap-1 font-sans text-xs font-medium text-wood transition-colors duration-300 group-hover:text-clay">
              View Project
              <svg
                className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </div>

          {/* Forthcoming projects */}
          {FORTHCOMING_CARDS.map((card, i) => (
            <div
              key={i}
              ref={(el) => {
                cardRefs.current[i + 1] = el;
              }}
              aria-disabled="true"
            >
              <div
                className={`aspect-4/3 rounded-lg bg-linear-to-br ${card.gradient}`}
              />
              <span className="mt-4 block font-sans text-[10px] font-medium tracking-[0.18em] uppercase text-pebble">
                Forthcoming
              </span>
              <h3 className="mt-1.5 font-serif text-lg font-light tracking-wide text-pebble md:text-xl">
                &mdash;
              </h3>
              <p className="mt-1 font-sans text-sm text-pebble">
                In contemplation
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
