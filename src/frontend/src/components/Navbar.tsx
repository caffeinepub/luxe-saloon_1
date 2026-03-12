import { Button } from "@/components/ui/button";
import { Menu, Scissors, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Our Team", href: "#team" },
  { label: "Gallery", href: "#gallery" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="container max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a
            href="/"
            data-ocid="nav.link"
            className="flex items-center gap-2 group"
          >
            <Scissors className="w-5 h-5 text-gold transition-transform group-hover:rotate-12" />
            <span className="font-display text-xl tracking-widest text-foreground">
              LUXE <span className="text-gold">SALOON</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => scrollTo(link.href)}
                data-ocid="nav.link"
                className="text-sm tracking-wider text-muted-foreground hover:text-foreground transition-colors uppercase font-medium"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="/admin"
              data-ocid="nav.link"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
            >
              Admin
            </a>
            <Button
              onClick={() => scrollTo("#book")}
              data-ocid="nav.primary_button"
              className="bg-primary text-primary-foreground hover:opacity-90 px-5 text-sm tracking-widest uppercase"
            >
              Book Now
            </Button>
          </div>

          <button
            type="button"
            className="md:hidden text-foreground p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-background/98 backdrop-blur-md border-b border-border"
          >
            <nav className="container max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => scrollTo(link.href)}
                  data-ocid="nav.link"
                  className="text-left text-base text-muted-foreground hover:text-foreground py-2 uppercase tracking-widest transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <a
                href="/admin"
                data-ocid="nav.link"
                onClick={() => setMobileOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground py-2 uppercase tracking-widest"
              >
                Admin
              </a>
              <Button
                onClick={() => scrollTo("#book")}
                data-ocid="nav.primary_button"
                className="bg-primary text-primary-foreground mt-2 uppercase tracking-widest"
              >
                Book Now
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
