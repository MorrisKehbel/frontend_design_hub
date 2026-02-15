import { useCallback, useEffect, useState } from "react";
import { useTransitionNavigate } from "../../shared/hooks/useTransitionNavigate";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigateWithTransition = useTransitionNavigate();

  const handleReturnClick = useCallback(() => {
    navigateWithTransition({
      targetRoute: "/",
      colors: ["#1b3a2d", "#2a5a42", "#8baf9c"],
    });
  }, [navigateWithTransition]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 lg:top-5 left-1/2 -translate-x-1/2 z-50 w-full lg:max-w-4xl transition-all duration-500 p-2 lg:p-0.5 rounded-full ${scrolled ? "lg:bg-linear-to-b from-forest-light/10 via-forest/20 to-forest/20 lg:backdrop-blur-lg" : "lg:bg-transparent"}`}
    >
      <div
        className={`w-full h-full transition-all duration-500 rounded-lg lg:rounded-full ${
          scrolled
            ? "bg-forest/40 ring ring-cream/10 lg:bg-forest/20 backdrop-blur-md shadow"
            : "bg-forest/30 lg:bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-6">
          {/* Logo */}
          <a
            href="#hero"
            className="flex items-center font-serif text-2xl leading-none font-bold tracking-wide transition-all text-amber-light hover:text-amber"
          >
            Velora
          </a>

          {/* Desktop Navigation */}
          <ul className="hidden items-center gap-10 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="relative font-sans text-sm font-medium tracking-wide text-cream/80 transition-colors duration-300 hover:text-cream after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-amber-light after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <button
            type="button"
            onClick={handleReturnClick}
            className="hidden rounded-full bg-forest px-6 py-2.5 font-sans text-sm font-medium text-cream transition-all duration-300 hover:bg-forest-light hover:shadow-lg md:inline-block cursor-pointer"
          >
            Return to Overview
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex flex-col items-center justify-center gap-1.5 md:hidden"
            aria-label="Toggle navigation menu"
          >
            <span
              className={`block h-0.5 w-6 bg-cream transition-all duration-300 ${
                mobileOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-cream transition-all duration-300 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-cream transition-all duration-300 ${
                mobileOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out md:hidden ${
            mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-cream/80 p-6 backdrop-blur-md rounded-bl-lg rounded-br-lg">
            <ul className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block font-sans text-base font-medium text-forest transition-all duration-300 hover:text-forest-light active:text-forest-light active:scale-95"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    handleReturnClick();
                  }}
                  className="rounded-full bg-forest px-8 py-3.5 font-sans text-sm font-medium text-cream transition-all duration-300 hover:bg-forest-light hover:shadow-lg hover:shadow-black/20 active:scale-95 active:bg-forest-light cursor-pointer"
                >
                  Return to Overview
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
