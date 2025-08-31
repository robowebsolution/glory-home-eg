import type { Metadata } from 'next'
import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
  title: "Glory Home - Modern Furniture Design & 3D Visualization",
  description: "Discover cutting-edge furniture design with 3D visualization technology. Transform your space with Glory Home's modern furniture collections, custom designs, and expert interior solutions.",
  keywords: [
    'modern furniture', 'interior design', '3D visualization', 'custom furniture',
    'home decor', 'furniture Egypt', 'contemporary design', 'space transformation'
  ],
  openGraph: {
    title: "Glory Home - Modern Furniture Design & 3D Visualization",
    description: "Discover cutting-edge furniture design with 3D visualization technology. Transform your space with Glory Home's modern furniture collections.",
    images: [{ url: '/2-7fb9c07a.webp', width: 1200, height: 630, alt: 'Glory Home Furniture Showcase' }],
  },
}

const PortfolioPopup = dynamic(() => import("@/components/portfolio/PortfolioPopup"));
const FeaturedProducts = dynamic(() => import("@/components/featured-products").then(mod => mod.FeaturedProducts));
const ParallaxSection = dynamic(() => import("@/components/parallax-section").then(mod => mod.ParallaxSection));
const NewBedrooms = dynamic(() => import("@/components/new-bedrooms").then(mod => mod.NewBedrooms));
const WhoWeAre = dynamic(() => import("@/components/who-we-are").then(mod => mod.WhoWeAre));
const AboutCeo = dynamic(() => import("@/components/AboutCeo").then(mod => mod.AboutCeo));
const Categories = dynamic(() => import("@/components/categories").then(mod => mod.Categories));
const LatestProjects = dynamic(() => import("@/components/latest-projects").then(mod => mod.LatestProjects));
const Warranty = dynamic(() => import("@/components/warranty").then(mod => mod.Warranty));
const ModelsVideos = dynamic(() => import("@/components/models-videos").then(mod => mod.ModelsVideos));
const CustomerFeedback = dynamic(() => import("@/components/customer-feedback").then(mod => mod.CustomerFeedback));
const Footer = dynamic(() => import("@/components/footer").then(mod => mod.Footer));

export default function HomePage() {
  return (
        <div className="min-h-screen bg-white dark:bg-gray-900 overflow-x-hidden">
      <PortfolioPopup />
      <Navigation />
      <main>
        <HeroSection />
        <FeaturedProducts />
        <ParallaxSection />
        <LatestProjects />
        <NewBedrooms />
        <WhoWeAre />
        <AboutCeo />
        <Categories />
        <Warranty />
        <ModelsVideos />
        <CustomerFeedback />
      </main>
      <Footer />
    </div>
  )
}
