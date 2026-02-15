import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Service {
  title: string;
  description: string;
  accent: string;
  textaccent: string;
  iconPath: string;
}

const SERVICES: readonly Service[] = [
  {
    title: "Biophilic Interiors",
    description:
      "Living spaces infused with natural materials, organic geometries, and connections to the outdoors that promote wellness and creative flow.",
    accent: "bg-sage/20",
    textaccent: "hover:text-sage active:text-sage",
    iconPath:
      "M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm-1-11h2v4h-2zm0 6h2v2h-2z",
  },
  {
    title: "Landscape Architecture",
    description:
      "Exterior environments designed as extensions of interior spaces, where built and natural elements merge into seamless living ecosystems.",
    accent: "bg-terracotta/20",
    textaccent: "hover:text-terracotta active:text-terracotta",
    iconPath:
      "M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z",
  },
  {
    title: "Regenerative Design",
    description:
      "Sustainable spaces that give back more than they take, using biomimetic systems and circular material flows to create living architecture.",
    accent: "bg-amber/20",
    textaccent: "hover:text-amber active:text-amber",
    iconPath:
      "M17.66 7.93L12 2.27 6.34 7.93c-3.12 3.12-3.12 8.19 0 11.31A7.98 7.98 0 0012 21.58c2.05 0 4.1-.78 5.66-2.34 3.12-3.12 3.12-8.19 0-11.31zM12 19.59c-1.6 0-3.11-.62-4.24-1.76C6.62 16.69 6 15.19 6 13.59s.62-3.11 1.76-4.24L12 5.1v14.49z",
  },
] as const;

function ServiceIcon({ path }: { path: string }) {
  return (
    <svg
      className="h-7 w-7 text-forest-light"
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={path} />
    </svg>
  );
}

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

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
        cardRefs.current.filter(Boolean),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: gridRef.current,
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
      id="services"
      className="relative overflow-hidden bg-cream bg-cover bg-center bg-no-repeat py-24 lg:py-32"
      style={{
        backgroundImage:
          "url('/sites_assets/velora/Velora_Image_Campaign_Generation2.png')",
      }}
    >
      {/* Organic divider – overlaps from above */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-0 rotate-180">
        <svg
          className="relative block w-[calc(100%+1.3px)] h-10 sm:h-15 lg:h-20"
          viewBox="0 0 1200 80"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,30 C300,70 600,10 900,50 C1050,70 1150,30 1200,40 L1200,80 L0,80 Z"
            fill="var(--color-cream-dark)"
          />
        </svg>
      </div>

      {/* Decorative blobs */}
      <div className="pointer-events-none absolute right-0 top-20 h-64 w-64">
        <div className="blob-shape h-full w-full bg-plum/5 blur-2xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div ref={headingRef} className="mx-auto max-w-2xl text-center">
          <p className="mb-4 font-sans text-xs font-bold tracking-[0.25em] uppercase text-plum">
            What We Cultivate
          </p>
          <h2 className="font-serif text-4xl leading-tight font-light text-cream sm:text-5xl">
            Design That Grows{" "}
            <span className="italic text-cream-dark">With You</span>
          </h2>
          <p className="mt-6 font-sans text-base leading-relaxed text-cream/80">
            Each project is a living collaboration between human intention and
            nature&rsquo;s infinite wisdom.
          </p>
        </div>

        {/* Services Grid */}
        <div
          ref={gridRef}
          className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          {SERVICES.map((service, i) => (
            <div
              key={service.title}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="group relative overflow-hidden rounded-3xl border border-forest/5 bg-cream-dark p-6 transition-all duration-500 hover:border-forest/10 active:border-forest/10 sm:p-8 lg:p-10"
            >
              {/* Accent blob */}
              <div className="absolute -right-8 -top-8 h-32 w-32 transition-all duration-700 opacity-40 group-hover:scale-445 group-hover:opacity-80 group-active:scale-445 group-active:opacity-80">
                <div
                  className={`blob-shape-alt h-full w-full ${service.accent} blur-xl`}
                />
              </div>

              {/* Icon */}
              <div className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-forest/5">
                <ServiceIcon path={service.iconPath} />
              </div>

              {/* Content */}
              <h3 className="relative font-serif text-2xl font-medium text-forest-light">
                {service.title}
              </h3>
              <p className="relative mt-4 font-sans text-sm leading-relaxed text-muted">
                {service.description}
              </p>

              {/* Learn more link */}
              <a
                href="#contact"
                className={`relative mt-6 inline-flex min-h-11 items-center gap-1.5 font-sans text-sm font-medium text-forest transition-colors ${service.textaccent}`}
              >
                Learn more
                <svg
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 group-active:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
      {/* Organic divider */}
      <div className="organic-divider">
        <svg
          viewBox="0 0 1200 80"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,40 C150,80 350,0 600,40 C850,80 1050,0 1200,40 L1200,80 L0,80 Z"
            fill="var(--color-forest)"
          />
        </svg>
      </div>
    </section>
  );
}
