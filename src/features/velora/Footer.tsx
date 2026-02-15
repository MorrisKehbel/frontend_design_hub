const FOOTER_LINKS = {
  studio: [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Process", href: "#process" },
  ],
  connect: [
    { label: "Contact", href: "#contact" },
    { label: "Instagram", href: "#" },
    { label: "LinkedIn", href: "#" },
  ],
} as const;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-forest text-cream/80">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
        <div className="grid grid-cols-2 gap-12 sm:grid-cols-3 place-items-center">
          {/* Brand */}
          <div className="col-span-3 md:col-span-1">
            <span className="font-serif text-3xl font-semibold text-cream">
              Velora
            </span>
            <p className="mt-4 md:max-w-xs font-sans text-sm leading-relaxed text-cream/60">
              Biophilic design studio creating living spaces where architecture
              and nature converge.
            </p>
          </div>

          {/* Studio Links */}
          <div>
            <h4 className="font-sans text-xs font-bold tracking-widest uppercase text-cream/40">
              Studio
            </h4>
            <ul className="mt-4 flex flex-col gap-3">
              {FOOTER_LINKS.studio.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-sans text-sm text-cream/60 transition-colors hover:text-terracotta-light active:text-terracotta-light"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Links */}
          <div>
            <h4 className="font-sans text-xs font-bold tracking-widest uppercase text-cream/40">
              Connect
            </h4>
            <ul className="mt-4 flex flex-col gap-3">
              {FOOTER_LINKS.connect.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-sans text-sm text-cream/60 transition-colors hover:text-terracotta-light active:text-terracotta-light"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-8 md:flex-row">
          <p className="font-sans text-xs text-cream/40">
            &copy; {currentYear} Velora Studio. All rights reserved.
          </p>
          <p className="font-sans text-xs text-cream/40">
            Designed with reverence for the natural world.
          </p>
        </div>
      </div>
    </footer>
  );
}
