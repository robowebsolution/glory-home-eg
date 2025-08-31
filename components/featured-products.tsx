"use client"

import { useEffect, useState } from "react"
import type { Product } from "@/lib/supabase"
import { fetchProducts } from "@/lib/api"
import { fetchCategories } from "@/lib/api"
import type { Category } from "@/lib/supabase"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useRouter } from "next/navigation"
import Image from "next/image"

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t, language, isRTL } = useLanguage()
  const router = useRouter() // إضافة استخدام الراوتر للتنقل

  // دالة للتنقل إلى صفحة المنتج
  const navigateToProduct = (productId: string) => {
    router.push(`/products/${productId}`)
  }

  useEffect(() => {
    async function loadFeaturedProductsAndCategories() {
      try {
        setLoading(true)
        setError(null)
        // جلب المنتجات والفئات بالتوازي
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts({ featured: true, limit: 4 }),
          fetchCategories()
        ])
        setProducts(Array.isArray(productsData) ? productsData : [])
        setCategories(Array.isArray(categoriesData) ? categoriesData : [])
      } catch (error) {
        console.error("Error loading featured products or categories:", error)
        setError("Failed to load featured products")
        setProducts([])
        setCategories([])
      } finally {
        setLoading(false)
      }
    }
    loadFeaturedProductsAndCategories()
  }, [])

  if (loading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 sm:mb-16 ${isRTL ? "rtl" : ""}`}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-4">
              {t("featured.title")} <span className="font-bold">{t("featured.title.bold")}</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t("featured.loading")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-64 sm:h-80 rounded-lg mb-4"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-6 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error || products.length === 0) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`text-center mb-12 sm:mb-16 ${isRTL ? "rtl" : ""}`}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-4">
              {t("featured.title")} <span className="font-bold">{t("featured.title.bold")}</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {error ? t("featured.error") : t("featured.subtitle")}
            </p>
            {error && (
              <Button
                onClick={() => window.location.reload()}
                className="mt-4 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900"
              >
                {t("featured.tryagain")}
              </Button>
            )}
          </motion.div>

          {!error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[...Array(4)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="group cursor-pointer border-0 shadow-none hover:shadow-2xl dark:hover:shadow-gray-800/25 transition-all duration-500 bg-white dark:bg-gray-800">
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden">
                        <div className="w-full h-64 sm:h-80 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-400 dark:text-gray-500">{t("featured.comingsoon")}</span>
                        </div>
                      </div>
                      <div className="p-4 sm:p-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t("featured.title")}</p>
                        <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-2">
                          {t("featured.newcollection")}
                        </h3>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                          {t("featured.comingsoon")}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className={`text-center mb-12 sm:mb-16 ${isRTL ? "rtl" : ""}`}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-4">
            {t("featured.title")} <span className="font-bold">{t("featured.title.bold")}</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t("featured.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card 
                className="group cursor-pointer overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all duration-300"
                onClick={() => navigateToProduct(product.id)}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                      className="w-full h-64 sm:h-80 relative overflow-hidden"
                    >
                      <Image
                        src={product.main_image || "/placeholder.svg"}
                        alt={language === "ar" && product.name_ar ? product.name_ar : product.name}
                        fill
                        className="object-cover"
                        loading="lazy"
                        quality={85}
                      />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/40 transition-all duration-300" />
                    
                    {product.featured && (
                      <div className={`absolute top-4 ${isRTL ? "right-4" : "left-4"} bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
                        {t("featured.badge")}
                      </div>
                    )}
                  </div>

                  <div className="p-4 sm:p-5">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 truncate">
                      {language === "ar" && product.name_ar ? product.name_ar : product.name}
                    </h3>
                    
                    {product.in_stock && (
                      <div className="inline-block bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 text-xs font-semibold px-3 py-1 rounded-full">
                        {t("stock.in_stock")}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
