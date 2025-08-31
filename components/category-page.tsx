"use client"

import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Filter, Grid, List } from "lucide-react"
import { useState } from "react"
import type { Product, Category } from "@/lib/supabase"
import { useLanguage } from "@/lib/language-context"

interface CategoryPageProps {
  category: Category
  products: Product[]
}

export function CategoryPage({ category, products }: CategoryPageProps) {
  const { language } = useLanguage()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"name" | "price" | "newest">("newest")
  const [filteredProducts, setFilteredProducts] = useState(products)

  const sortProducts = (products: Product[], sortBy: string) => {
    const sorted = [...products]
    switch (sortBy) {
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case "price":
        return sorted.sort((a, b) => a.price - b.price)
      case "newest":
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      default:
        return sorted
    }
  }

  const handleSortChange = (newSortBy: "name" | "price" | "newest") => {
    setSortBy(newSortBy)
    setFilteredProducts(sortProducts(filteredProducts, newSortBy))
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2 }}
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: category.image_url ? `url('${category.image_url}')` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              filter: "brightness(0.7)",
            }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4"
          >
            {language === "ar" ? category.name_ar : category.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-200 mb-6"
          >
            {language === 'ar' ? category.description_ar || `استكشف مجموعتنا من ${category.name_ar || category.name}` : category.description || `Explore our collection of ${category.name}`}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-gray-300"
          >
            {products.length} Products Available
          </motion.div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value as "name" | "price" | "newest")}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="newest">Newest</option>
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">View:</span>
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-gray-900 text-white" : "bg-white text-gray-600"}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-gray-900 text-white" : "bg-white text-gray-600"}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">No products found</h3>
              <p className="text-gray-600">Check back soon for new arrivals in this category.</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                  : "space-y-6"
              }
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ProductCard product={product} viewMode={viewMode} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
