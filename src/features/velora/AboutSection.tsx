import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: "150+", label: "Living Spaces" },
  { value: "12", label: "Years of Practice" },
  { value: "98%", label: "Client Satisfaction" },
] as const;

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const statsContainerRef = useRef<HTMLDivElement>(null);
  const statRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageBlockRef = useRef<HTMLDivElement>(null);

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
            end: "bottom 60%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        textRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        statRefs.current.filter(Boolean),
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statsContainerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        imageBlockRef.current,
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: imageBlockRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden bg-cream-dark py-24 lg:py-32"
    >
      {/* Decorative blob */}
      <div className="pointer-events-none absolute -left-40 top-1/2 h-80 w-80 -translate-y-1/2">
        <div className="blob-shape-alt h-full w-full bg-sage/8 blur-2xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-md lg:max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Image / Visual Block */}
          <div ref={imageBlockRef} className="relative">
            <div className="relative aspect-4/5 overflow-hidden rounded-4xl">
              <div className="absolute inset-0 bg-linear-to-br from-forest via-sage to-terracotta/60" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="blob-shape h-48 w-48 bg-cream/20 blur-sm" />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center sm:p-10">
                <span className="font-serif text-4xl font-light text-cream/90 sm:text-6xl lg:text-7xl">
                  Of the hill,
                </span>
                <span className="mt-2 font-serif text-2xl italic text-cream/70 sm:text-4xl lg:text-5xl">
                  not on it.
                </span>
              </div>
            </div>
            {/* Floating accent */}
            <div className="float-slow absolute -bottom-6 -right-6 hidden h-32 w-32 rounded-full bg-amber/20 blur-2xl sm:block" />
          </div>

          {/* Content */}
          <div>
            <h2
              ref={headingRef}
              className="font-serif text-4xl leading-tight font-light text-forest sm:text-5xl"
            >
              Rooted in Nature,
              <br />
              <span className="italic text-terracotta">Shaped by Purpose</span>
            </h2>
            <div ref={textRef} className="mt-8 space-y-5">
              <p className="font-sans text-base leading-relaxed text-muted">
                At Velora, we believe that the spaces we inhabit shape who we
                become. Our biophilic design philosophy draws from the organic
                patterns found in nature&mdash;flowing water, branching trees,
                unfurling leaves&mdash;to create environments that nurture the
                human spirit.
              </p>
              <p className="font-sans text-base leading-relaxed text-muted">
                Every curve, every material, every play of light is
                intentionally crafted to restore the connection between people
                and the natural world. We don&rsquo;t impose design on
                spaces&mdash;we let it emerge.
              </p>
            </div>

            {/* Stats */}
            <div
              ref={statsContainerRef}
              className="mt-12 grid grid-cols-3 gap-4 sm:gap-8"
            >
              {STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  ref={(el) => {
                    statRefs.current[i] = el;
                  }}
                >
                  <span className="block font-serif text-2xl font-semibold text-forest sm:text-3xl lg:text-4xl">
                    {stat.value}
                  </span>
                  <span className="mt-1 block font-sans text-[10px] tracking-wider text-muted sm:text-xs">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
