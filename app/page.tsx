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
const Categories = dynamic(() => import("@/components/categories").then(mod => mod.Categories), {
  loading: () => (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-4">
            Categories <span className="font-bold">Loading</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Loading...</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-t-lg"></div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-b-lg">
                <div className="bg-gray-200 dark:bg-gray-700 h-6 w-3/4 rounded mb-4"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-4 w-1/2 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
});
const LatestProjects = dynamic(() => import("@/components/latest-projects").then(mod => mod.LatestProjects));
const OurGloryDoors = dynamic(() => import("@/components/our-glory-doors").then(mod => mod.OurGloryDoors));
const TechnicalDrawings = dynamic(() => import("@/components/technical-drawings").then(mod => mod.TechnicalDrawings));
const ModelsVideos = dynamic(() => import("@/components/models-videos").then(mod => mod.ModelsVideos));
const CustomerFeedback = dynamic(() => import("@/components/customer-feedback").then(mod => mod.CustomerFeedback));
const Footer = dynamic(() => import("@/components/footer").then(mod => mod.Footer));
const OurCustomers = dynamic(() => import("@/components/our-customers").then(mod => mod.OurCustomers));

export default function HomePage() {
  return (
        <div className="min-h-screen bg-white dark:bg-gray-900 overflow-x-hidden">
      <PortfolioPopup />
      <Navigation />
      <main>
        <HeroSection />
        <FeaturedProducts />
        <ModelsVideos />
        <ParallaxSection />
        <LatestProjects />
        <OurGloryDoors />
        <TechnicalDrawings />
        <NewBedrooms />
        <WhoWeAre />
        <AboutCeo />
        <Categories />
        <OurCustomers />
        <CustomerFeedback />
      </main>
      <Footer />
    </div>
  )
}
