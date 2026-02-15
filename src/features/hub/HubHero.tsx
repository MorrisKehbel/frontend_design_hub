import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HubHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const ensoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ensoEls = ensoRefs.current.filter(Boolean);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Entrance sequence
      tl.fromTo(
        ensoEls,
        { scale: 0.85, opacity: 0, rotation: -10 },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 1.6,
          ease: "power2.out",
        },
      )
        .fromTo(
          labelRef.current,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          0.4,
        )
        .fromTo(
          ruleRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.5, ease: "power2.inOut" },
          0.6,
        )
        .fromTo(
          titleRef.current,
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9 },
          0.7,
        )
        .fromTo(
          subtitleRef.current,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          1.1,
        )
        .fromTo(
          scrollRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.4 },
          1.5,
        );

      // Continuous: slow enso rotation
      gsap.to(ensoEls, {
        rotation: 360,
        duration: 180,
        repeat: -1,
        ease: "none",
      });

      // Continuous: scroll indicator pulse
      gsap.to(scrollLineRef.current, {
        scaleY: 0.5,
        duration: 1.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6"
    >
      {/* Enso circle — zen ambient element */}
      <div
        ref={(el) => {
          ensoRefs.current[0] = el;
        }}
        className="pointer-events-none absolute h-56 w-56 rounded-full border border-wood/[0.12] opacity-0 sm:h-72 sm:w-72 md:h-80 md:w-80 lg:h-96 lg:w-96"
        aria-hidden="true"
      />

      {/* Secondary subtle circle — offset for depth */}
      <div
        ref={(el) => {
          ensoRefs.current[1] = el;
        }}
        className="pointer-events-none absolute -translate-x-8 -translate-y-6 h-40 w-40 rounded-full border border-moss/[0.06] opacity-0 sm:h-52 sm:w-52 md:h-60 md:w-60 lg:h-72 lg:w-72"
        style={{ animationDelay: "0.3s" }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 text-center">
        <p
          ref={labelRef}
          className="font-sans text-[11px] font-medium tracking-[0.25em] uppercase text-stone opacity-0 md:text-xs"
        >
          Design Collection
        </p>

        <div
          ref={ruleRef}
          className="mx-auto my-5 h-px w-10 origin-center bg-wood/40 md:my-7 md:w-14"
        />

        <h1
          ref={titleRef}
          className="font-serif text-5xl font-light tracking-widest text-ink opacity-0 sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl"
        >
          Atelier
        </h1>

        <p
          ref={subtitleRef}
          className="mx-auto mt-4 max-w-xs font-sans text-sm leading-relaxed text-ink-muted opacity-0 md:mt-6 md:max-w-sm md:text-base"
        >
          A curated exploration of design language
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 flex flex-col items-center gap-2 opacity-0 md:bottom-12"
      >
        <span className="font-sans text-[9px] font-medium tracking-[0.2em] uppercase text-stone/60 md:text-[10px]">
          Scroll
        </span>
        <div
          ref={scrollLineRef}
          className="h-6 w-px origin-top bg-stone/30 md:h-8"
        />
      </div>
    </section>
  );
}
