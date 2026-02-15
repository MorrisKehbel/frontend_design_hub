import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CtaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const trimmed = email.trim();
    if (!trimmed) {
      setError("Please enter your email address.");
      return;
    }
    if (!EMAIL_PATTERN.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitted(true);
    setEmail("");
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative overflow-hidden pt-32 pb-24 lg:pt-40 lg:pb-32"
    >
      <img
        src="/sites_assets/velora/Velora_Image_Campaign_Generation.webp"
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* Organic divider — forest wave overlaying the background image */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-0 rotate-180">
        <svg
          className="relative block w-[calc(100%+1.3px)] h-10 sm:h-15 lg:h-20"
          viewBox="0 0 1200 80"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,30 C300,70 600,10 900,50 C1050,70 1150,30 1200,40 L1200,80 L0,80 Z"
            fill="var(--color-forest)"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center lg:px-12">
        <div ref={contentRef}>
          <p className="mb-4 font-sans text-xs font-bold tracking-[0.25em] uppercase text-terracotta-light">
            Begin the Conversation
          </p>
          <h2 className="font-serif text-4xl leading-tight font-light text-cream sm:text-5xl lg:text-6xl">
            Ready to Let Your
            <br />
            Space <span className="italic text-terracotta-light">Breathe</span>?
          </h2>
          <p className="mx-auto mt-6 max-w-lg font-sans text-base leading-relaxed text-cream/80">
            Every living space has a story waiting to unfold. Share your vision
            with us, and together we&rsquo;ll cultivate something extraordinary.
          </p>
          {/* Email Form */}
          {submitted ? (
            <div className="flex flex-col items-center justify-center mt-10 rounded-2xl border border-cream/20 bg-white/10 backdrop-blur-sm p-8 h-30">
              <div className="flex items-center justify-center gap-3">
                <svg
                  className="h-6 w-6 text-cream"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="font-serif text-xl text-cream">
                  Thank you for your interest
                </span>
              </div>
              <p className="mt-3 font-sans text-sm text-cream/70">
                This is a design showcase. In a live project, your message would
                be on its way to the studio.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center justify-center mx-auto mt-10 max-w-md gap-3 sm:flex-row h-30"
              noValidate
            >
              <div className="flex-1">
                <label htmlFor="cta-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="cta-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="your@email.com"
                  autoComplete="email"
                  className="w-full rounded-full border border-cream/20 bg-white/10 px-6 py-3.5 font-sans text-base text-cream placeholder:text-cream/50 outline-none transition-all focus:border-cream/40 focus:ring-2 focus:ring-cream/20 sm:text-sm"
                />
              </div>
              <button
                type="submit"
                className="shrink-0 rounded-full bg-forest px-8 py-3.5 font-sans text-sm font-medium text-cream transition-all duration-300 hover:bg-forest-light hover:shadow-lg hover:shadow-black/20 active:scale-95 active:bg-forest-light cursor-pointer"
              >
                Get in Touch
              </button>
            </form>
          )}
          {error ? (
            <p className="mt-6 font-sans text-xs text-terracotta">{error}</p>
          ) : (
            <p className="mt-6 font-sans text-xs text-cream/60">
              This is a showcase demo &mdash; no data is collected or stored.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
