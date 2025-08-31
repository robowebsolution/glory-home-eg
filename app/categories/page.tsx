"use client";

import { Categories } from "@/components/categories";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 overflow-x-hidden">
      <Navigation />
      <main>
     
        {/* Categories Grid */}
        <section className="py-10 md:py-16">
          <Categories />
        </section>
      </main>
      <Footer />
    </div>
  );
}
