import BookingSection from "../components/BookingSection";
import Footer from "../components/Footer";
import GallerySection from "../components/GallerySection";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import ServicesSection from "../components/ServicesSection";
import TeamSection from "../components/TeamSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <TeamSection />
        <GallerySection />
        <BookingSection />
      </main>
      <Footer />
    </div>
  );
}
