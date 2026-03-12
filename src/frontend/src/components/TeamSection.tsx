import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { useGetAllStylists } from "../hooks/useQueries";

const STYLIST_PHOTOS = [
  "/assets/generated/stylist-1.dim_400x400.jpg",
  "/assets/generated/stylist-2.dim_400x400.jpg",
  "/assets/generated/stylist-3.dim_400x400.jpg",
];

const SKELETON_KEYS = ["sk-1", "sk-2", "sk-3"];

export default function TeamSection() {
  const { data: stylists, isLoading } = useGetAllStylists();

  const displayStylists =
    stylists && stylists.length > 0
      ? stylists
      : isLoading
        ? []
        : [
            {
              id: 1n,
              name: "Isabella Laurent",
              bio: "With 12 years of luxury salon experience, Isabella specializes in transformative color work and editorial styling for high-profile clientele.",
              specialties: [
                "Color Specialist",
                "Editorial Styling",
                "Balayage",
              ],
            },
            {
              id: 2n,
              name: "Marcus Chen",
              bio: "Marcus trained in Paris and Tokyo, bringing an international perspective to his precision cutting techniques and avant-garde styling.",
              specialties: ["Precision Cuts", "Keratin", "Men's Grooming"],
            },
            {
              id: 3n,
              name: "Sophia Reyes",
              bio: "Sophia's passion lies in bridal and occasion styling. Her ability to translate a client's vision into reality has made her our most requested specialist.",
              specialties: ["Bridal", "Updos", "Blowouts"],
            },
          ];

  return (
    <section
      id="team"
      data-ocid="team.section"
      className="py-24 px-6 bg-card/20"
    >
      <div className="container max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-gold text-xs uppercase tracking-[0.3em] mb-3">
            The Artists
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
            Meet Our Team
          </h2>
          <div className="section-divider max-w-24 mx-auto" />
        </motion.div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {SKELETON_KEYS.map((k) => (
              <Skeleton key={k} className="h-96 rounded" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {displayStylists.map((stylist, idx) => (
              <motion.div
                key={stylist.id.toString()}
                data-ocid={`team.item.${idx + 1}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="group"
              >
                <div
                  className="relative overflow-hidden mb-6"
                  style={{ aspectRatio: "3/4" }}
                >
                  <img
                    src={STYLIST_PHOTOS[idx % STYLIST_PHOTOS.length]}
                    alt={stylist.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-display text-xl text-foreground">
                      {stylist.name}
                    </h3>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {stylist.bio}
                </p>
                <div className="flex flex-wrap gap-2">
                  {stylist.specialties.map((spec) => (
                    <Badge
                      key={spec}
                      className="bg-transparent border border-gold/30 text-gold/70 text-xs"
                    >
                      {spec}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
