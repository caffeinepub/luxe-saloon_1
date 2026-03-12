import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { useGetAllGalleryItems } from "../hooks/useQueries";

const GALLERY_GRADIENTS = [
  "linear-gradient(135deg, oklch(0.25 0.04 85), oklch(0.18 0.02 280))",
  "linear-gradient(135deg, oklch(0.20 0.03 280), oklch(0.30 0.06 90))",
  "linear-gradient(135deg, oklch(0.28 0.05 90), oklch(0.16 0.02 285))",
  "linear-gradient(135deg, oklch(0.18 0.02 280), oklch(0.32 0.07 88))",
  "linear-gradient(135deg, oklch(0.30 0.06 85), oklch(0.20 0.03 280))",
  "linear-gradient(135deg, oklch(0.22 0.04 280), oklch(0.26 0.05 85))",
];

const FALLBACK_ITEMS = [
  {
    id: 1n,
    title: "Summer Balayage",
    description: "Sun-kissed honey tones blended seamlessly",
  },
  {
    id: 2n,
    title: "Editorial Updo",
    description: "Intricate braided crown for runway season",
  },
  {
    id: 3n,
    title: "Platinum Transformation",
    description: "Bold platinum achieved in a single session",
  },
  {
    id: 4n,
    title: "Romantic Waves",
    description: "Effortless beachy waves for bridal morning",
  },
  {
    id: 5n,
    title: "Chic Bob",
    description: "Precision asymmetric bob with glass finish",
  },
  {
    id: 6n,
    title: "Deep Burgundy",
    description: "Rich jewel tones with multi-dimensional depth",
  },
];

const SKELETON_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"];

export default function GallerySection() {
  const { data: galleryItems, isLoading } = useGetAllGalleryItems();
  const displayItems =
    galleryItems && galleryItems.length > 0
      ? galleryItems
      : isLoading
        ? []
        : FALLBACK_ITEMS;

  return (
    <section id="gallery" data-ocid="gallery.section" className="py-24 px-6">
      <div className="container max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-gold text-xs uppercase tracking-[0.3em] mb-3">
            Our Work
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
            Gallery
          </h2>
          <div className="section-divider max-w-24 mx-auto" />
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {SKELETON_KEYS.map((k) => (
              <Skeleton key={k} className="aspect-square rounded" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {displayItems.map((item, idx) => (
              <motion.div
                key={item.id.toString()}
                data-ocid={`gallery.item.${idx + 1}`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className={`relative overflow-hidden group cursor-pointer ${
                  idx === 0 || idx === 4 ? "md:row-span-2" : ""
                }`}
                style={{ aspectRatio: idx === 0 || idx === 4 ? "auto" : "1" }}
              >
                <div
                  className="w-full h-full min-h-40"
                  style={{
                    background:
                      GALLERY_GRADIENTS[idx % GALLERY_GRADIENTS.length],
                    minHeight: idx === 0 || idx === 4 ? "280px" : "160px",
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 30% 40%, oklch(0.78 0.12 85 / 0.4) 0%, transparent 60%)",
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/40 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-[400ms]">
                  <h4 className="font-display text-sm text-foreground">
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
