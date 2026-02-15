import { lazy, Suspense, useEffect, useRef, useState } from "react";
import gsap from "gsap";

const OrganicScene = lazy(() => import("../../shared/three/OrganicScene"));

const HERO_VIDEO_SRC =
  "/sites_assets/velora/Velora_Video_Campaign_Generation_web.mp4";
const HERO_POSTER_SRC =
  "/sites_assets/velora/Velora_Video_Campaign_Generation_poster.webp";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        headingRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2 },
      )
        .fromTo(
          subtextRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          "-=0.6",
        )
        .fromTo(
          ctaRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.4",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onCanPlay = () => {
      setVideoReady(true);
      video.play().catch(() => {
        /* autoplay blocked — video stays on poster */
      });
    };

    video.addEventListener("canplay", onCanPlay);
    // Defer the actual video load until after initial paint
    requestAnimationFrame(() => {
      video.src = HERO_VIDEO_SRC;
      video.load();
    });

    return () => video.removeEventListener("canplay", onCanPlay);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden bg-forest"
    >
      {/* Background video */}
      <video
        ref={videoRef}
        poster={HERO_POSTER_SRC}
        muted
        playsInline
        preload="none"
        className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${videoReady ? "opacity-100" : "opacity-0"}`}
      />

      {/* Semi-transparent overlay for text readability */}
      <div className="pointer-events-none absolute inset-0 bg-forest/40" />

      {/* Three.js particle scene — fullscreen layer */}
      <div className="absolute inset-0 z-1">
        <Suspense fallback={null}>
          <OrganicScene />
        </Suspense>
      </div>

      {/* Text content */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-center px-6 py-32 lg:px-12">
        <p className="mb-4 font-sans text-xs font-bold tracking-[0.25em] uppercase text-terracotta-light">
          Biophilic Design Studio
        </p>
        <h1
          ref={headingRef}
          className="font-serif text-5xl leading-[1.1] font-light text-cream sm:text-6xl lg:text-7xl xl:text-8xl"
        >
          Spaces
          <br />
          That <span className="italic text-terracotta-light">Breathe</span>
        </h1>
        <p
          ref={subtextRef}
          className="mt-6 max-w-md font-sans text-base leading-relaxed text-cream/70 sm:text-lg"
        >
          We design living environments where organic forms and human wellbeing
          converge&mdash;creating spaces that feel alive.
        </p>
        <div ref={ctaRef} className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#about"
            className="group inline-flex items-center gap-2 rounded-full bg-cream-dark px-8 py-3.5 font-sans text-sm font-medium text-forest transition-all duration-300 hover:bg-cream hover:shadow-lg hover:shadow-cream/10 hover:text-forest-light active:scale-95 active:bg-cream"
          >
            Explore Our Vision
            <svg
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
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
          <a
            href="#services"
            className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-8 py-3.5 font-sans text-sm font-medium text-cream transition-all duration-300 hover:border-cream/50 hover:bg-cream/10 active:scale-95 active:bg-cream/15"
          >
            Our Services
          </a>
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
            fill="var(--color-cream-dark)"
          />
        </svg>
      </div>
    </section>
  );
}
