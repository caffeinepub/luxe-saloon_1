import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useGetAllServices } from "../hooks/useQueries";

const SERVICE_SKELETON_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"];

const FALLBACK_SERVICES = [
  {
    id: 1n,
    name: "Signature Haircut",
    category: "Hair",
    description:
      "Precision cut tailored to your face shape and lifestyle, with a luxurious scalp massage.",
    price: 8500n,
    duration: 60n,
  },
  {
    id: 2n,
    name: "Color & Highlights",
    category: "Color",
    description:
      "Bespoke color formulations using premium organic dyes for luminous, lasting results.",
    price: 15000n,
    duration: 120n,
  },
  {
    id: 3n,
    name: "Keratin Treatment",
    category: "Treatment",
    description:
      "Smoothing treatment that eliminates frizz and restores silky shine for up to 6 months.",
    price: 22000n,
    duration: 180n,
  },
  {
    id: 4n,
    name: "Bridal Styling",
    category: "Styling",
    description:
      "Complete bridal hair design including trial session, day-of styling, and floral accents.",
    price: 35000n,
    duration: 240n,
  },
  {
    id: 5n,
    name: "Deep Conditioning",
    category: "Treatment",
    description:
      "Intensive moisture restoration using argan oil and Moroccan butter blends.",
    price: 6500n,
    duration: 45n,
  },
  {
    id: 6n,
    name: "Balayage",
    category: "Color",
    description:
      "Hand-painted highlights for a sun-kissed, natural gradient effect.",
    price: 18000n,
    duration: 150n,
  },
];

const FALLBACK_CATEGORIES = ["All", "Hair", "Color", "Treatment", "Styling"];

export default function ServicesSection() {
  const { data: services, isLoading } = useGetAllServices();
  const [activeCategory, setActiveCategory] = useState("All");

  const hasServices = services && services.length > 0;

  const categories: string[] = hasServices
    ? ["All", ...Array.from(new Set(services.map((s) => s.category)))]
    : FALLBACK_CATEGORIES;

  const allServices = hasServices
    ? services
    : isLoading
      ? []
      : FALLBACK_SERVICES;

  const displayServices =
    activeCategory === "All"
      ? allServices
      : allServices.filter((s) => s.category === activeCategory);

  return (
    <section id="services" data-ocid="services.section" className="py-24 px-6">
      <div className="container max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-gold text-xs uppercase tracking-[0.3em] mb-3">
            What We Offer
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
            Our Services
          </h2>
          <div className="section-divider max-w-24 mx-auto" />
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              data-ocid="services.tab"
              className={`px-5 py-2 text-xs uppercase tracking-wider transition-all duration-300 border ${
                activeCategory === cat
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-border text-muted-foreground hover:border-gold/50 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICE_SKELETON_KEYS.map((k) => (
              <Skeleton key={k} className="h-56 w-full rounded" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayServices.map((service, idx) => (
              <motion.div
                key={service.id.toString()}
                data-ocid={`services.item.${idx + 1}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.07 }}
                className="glass-card p-6 group hover:border-gold/30 transition-all duration-300 hover:shadow-gold"
              >
                <div className="flex items-start justify-between mb-4">
                  <Badge className="bg-gold/10 text-gold border-gold/30 text-xs uppercase tracking-wider">
                    {service.category}
                  </Badge>
                  <span className="font-display text-2xl text-gold">
                    ${(Number(service.price) / 100).toFixed(0)}
                  </span>
                </div>
                <h3 className="font-display text-xl text-foreground mb-2 group-hover:text-gold transition-colors">
                  {service.name}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
                <div className="flex items-center gap-1 text-muted-foreground text-xs">
                  <Clock className="w-3 h-3" />
                  <span>{Number(service.duration)} min</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
