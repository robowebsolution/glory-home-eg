"use client"

import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import type { Manufacturer, Product, Category } from "@/lib/supabase"
import { useLanguage } from "@/lib/language-context"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ProductCard } from "@/components/product-card"

interface HdfManufacturerProductsProps {
  country: Category
  manufacturer: Manufacturer
  products: Product[]
}

export function HdfManufacturerProducts({ country, manufacturer, products }: HdfManufacturerProductsProps) {
  const { language, isRTL } = useLanguage()

  const title = language === "ar"
    ? manufacturer.name_ar || manufacturer.name
    : manufacturer.name

  const subtitle = language === "ar"
    ? `منتجات أرضيات HDF من ${manufacturer.name_ar || manufacturer.name}`
    : `Premium HDF flooring curated by ${manufacturer.name}`

  const countryLabel = language === "ar"
    ? country.name_ar || country.name
    : country.name

  const emptyState = language === "ar"
    ? "لم يتم إضافة منتجات لهذه الشركة بعد."
    : "No products available for this manufacturer yet."

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navigation />
      <main className="pt-24 pb-20">
        <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ${isRTL ? "rtl" : ""}`}
          >
            <div className="relative">
              <div className="absolute inset-0 opacity-30">
                {manufacturer.banner_image ? (
                  <Image
                    src={manufacturer.banner_image}
                    alt={manufacturer.name}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/80 to-black/60" />
              </div>
              <div className="relative z-10 p-10 sm:p-14 flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-end">
                <div className="flex-shrink-0">
                  <div className="h-32 w-32 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/10 flex items-center justify-center overflow-hidden">
                    {manufacturer.logo_url ? (
                      <Image
                        src={manufacturer.logo_url}
                        alt={manufacturer.name}
                        width={110}
                        height={110}
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-3xl text-white/70 font-semibold">{manufacturer.name.charAt(0)}</span>
                    )}
                  </div>
                </div>
                <div className="flex-1 text-white">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Badge className="rounded-full bg-white/15 text-white border-white/20 px-4 py-1 text-sm">
                      {language === "ar" ? "دولة التصنيع" : "Country"}: {countryLabel}
                    </Badge>
                    {manufacturer.is_featured ? (
                      <Badge className="rounded-full bg-amber-400 text-gray-900 font-semibold px-4 py-1 text-sm">
                        {language === "ar" ? "مُميز" : "Featured"}
                      </Badge>
                    ) : null}
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
                    {title}
                  </h1>
                  <p className="text-base sm:text-lg text-white/80 max-w-2xl">
                    {language === "ar" ? manufacturer.description_ar || subtitle : manufacturer.description || subtitle}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="mt-16">
            <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {language === "ar" ? "تشكيلة المنتجات" : "Product Selection"}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === "ar" ? "جميع المنتجات المتاحة ضمن هذه العلامة." : "Discover every available product under this brand."}
                </p>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {language === "ar" ? `${products.length} منتج` : `${products.length} products`}
              </div>
            </div>
            <Separator className="bg-gray-200 dark:bg-gray-800 mb-10" />

            {products.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 py-20 text-center">
                <p className="text-lg text-gray-500 dark:text-gray-400">{emptyState}</p>
              </div>
            ) : (
              <AnimatePresence mode="sync">
                <motion.div
                  key="product-grid"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
                >
                  {products.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
