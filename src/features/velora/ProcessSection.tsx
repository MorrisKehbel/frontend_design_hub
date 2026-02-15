import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  color: string;
}

const STEPS: readonly ProcessStep[] = [
  {
    number: "01",
    title: "Discover",
    description:
      "We immerse ourselves in your world — understanding how you live, work, and dream. Every great space begins with deep listening.",
    color: "text-light",
  },
  {
    number: "02",
    title: "Envision",
    description:
      "Organic concepts take shape through iterative design, blending your vision with nature's wisdom into forms that feel inevitable.",
    color: "text-sage",
  },
  {
    number: "03",
    title: "Cultivate",
    description:
      "Every detail is crafted with care — from material sourcing to the final arrangement. Quality reveals itself through patience.",
    color: "text-terracotta",
  },
  {
    number: "04",
    title: "Flourish",
    description:
      "Your space comes alive, evolving and growing with you over time. True design is never finished — it breathes.",
    color: "text-amber",
  },
] as const;

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const stepsContainerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        stepRefs.current.filter(Boolean),
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: stepsContainerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.5,
          ease: "power2.inOut",
          transformOrigin: "top center",
          scrollTrigger: {
            trigger: stepsContainerRef.current,
            start: "top 75%",
            end: "bottom 50%",
            scrub: 1,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative overflow-hidden bg-forest py-24 lg:py-32"
    >
      {/* Decorative blobs on dark bg */}
      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96">
        <div className="blob-shape h-full w-full bg-sage/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div ref={headingRef} className="mx-auto max-w-2xl text-center">
          <p className="mb-4 font-sans text-xs font-bold tracking-[0.25em] uppercase text-terracotta-light">
            Our Journey Together
          </p>
          <h2 className="font-serif text-4xl leading-tight font-light text-cream sm:text-5xl">
            From Seed <span className="italic text-sage-light">to Canopy</span>
          </h2>
          <p className="mt-6 font-sans text-base leading-relaxed text-cream/60">
            Every project follows an organic rhythm&mdash;unfolding naturally
            through stages of deep connection and careful craft.
          </p>
        </div>

        {/* Process Steps */}
        <div ref={stepsContainerRef} className="relative mt-20">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 hidden h-full w-px md:block">
            <div
              ref={lineRef}
              className="h-full w-full bg-linear-to-b from-sage/40 via-terracotta/40 to-amber/40"
            />
          </div>

          <div className="space-y-12 md:space-y-16">
            {STEPS.map((step, i) => (
              <div
                key={step.number}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                className="flex items-start gap-4 sm:gap-6 md:gap-10 md:pl-20"
              >
                {/* Number circle */}
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-cream/10 bg-cream/5 backdrop-blur-sm sm:h-16 sm:w-16">
                  <span
                    className={`font-serif text-lg font-semibold ${step.color}`}
                  >
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <div className="pt-1">
                  <h3
                    className={`font-serif text-xl font-medium ${step.color} sm:text-2xl md:text-3xl`}
                  >
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-lg font-sans text-sm leading-relaxed text-cream/60">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
