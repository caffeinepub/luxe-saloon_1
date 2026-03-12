import { Facebook, Instagram, MapPin, Phone, Scissors } from "lucide-react";
import { SiX } from "react-icons/si";

export default function Footer() {
  const year = new Date().getFullYear();
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="border-t border-border bg-card/30 py-16 px-6">
      <div className="container max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Scissors className="w-5 h-5 text-gold" />
              <span className="font-display text-xl tracking-widest">
                LUXE <span className="text-gold">SALOON</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Where every visit is a ritual of self-care and luxury. Excellence
              is not our goal — it's our standard.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm tracking-widest uppercase text-gold mb-4">
              Visit Us
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-gold/50 mt-0.5 shrink-0" />
                <span>
                  245 Fifth Avenue, Suite 1200
                  <br />
                  New York, NY 10016
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-gold/50 shrink-0" />
                <span>+1 (212) 555-9800</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm tracking-widest uppercase text-gold mb-4">
              Hours
            </h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex justify-between gap-6">
                <span>Mon – Fri</span>
                <span>9:00 AM – 8:00 PM</span>
              </div>
              <div className="flex justify-between gap-6">
                <span>Saturday</span>
                <span>9:00 AM – 6:00 PM</span>
              </div>
              <div className="flex justify-between gap-6">
                <span>Sunday</span>
                <span>10:00 AM – 4:00 PM</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm tracking-widest uppercase text-gold mb-4">
              Quick Links
            </h4>
            <div className="space-y-2 text-sm">
              {["Services", "Team", "Gallery", "Book Now"].map((label) => (
                <a
                  key={label}
                  href={`#${label.toLowerCase().replace(" ", "")}`}
                  className="block text-muted-foreground hover:text-gold transition-colors"
                >
                  {label}
                </a>
              ))}
              <a
                href="/admin"
                className="block text-muted-foreground hover:text-gold transition-colors"
              >
                Admin
              </a>
            </div>
          </div>
        </div>

        <div className="section-divider mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {year}. Built with ♥ using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline"
            >
              caffeine.ai
            </a>
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Instagram"
              className="text-muted-foreground hover:text-gold transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label="Facebook"
              className="text-muted-foreground hover:text-gold transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label="X / Twitter"
              className="text-muted-foreground hover:text-gold transition-colors"
            >
              <SiX className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
