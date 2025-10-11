"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import type { Category } from "@/lib/supabase"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface FutecCategoryShowcaseProps {
  category: Category
  subcategories: Category[]
}

export function FutecCategoryShowcase({
  category,
  subcategories,
}: FutecCategoryShowcaseProps) {
  const { language, isRTL } = useLanguage()

  const headline = language === "ar"
    ? category.name_ar ?? "مجموعات Futec"
    : category.name ?? "Futec Collections"
  const subheadline = language === "ar"
    ? category.description_ar ?? "استكشف مجموعات Futec الفاخرة في مكان واحد."
    : category.description ?? "Explore luxurious Futec collections curated for your projects."

  const noCollectionsLabel = language === "ar" ? "لا توجد مجموعات حالياً." : "No collections available yet."
  const cta = language === "ar" ? "عرض المنتجات" : "View products"

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navigation />
      <main className="pt-28 pb-24">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`text-center max-w-3xl mx-auto ${isRTL ? "rtl" : ""}`}
          >
            <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-primary/10 text-primary mb-4">
              {language === "ar" ? "مجموعات Futec" : "Futec Collections"}
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {headline}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
              {subheadline}
            </p>
          </motion.div>

          {subcategories.length === 0 ? (
            <div className="mt-16 text-center text-muted-foreground">
              {noCollectionsLabel}
            </div>
          ) : (
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {subcategories.map((subcategory, index) => {
                const localizedName = language === "ar" && subcategory.name_ar ? subcategory.name_ar : subcategory.name
                const localizedDescription =
                  language === "ar" && subcategory.description_ar
                    ? subcategory.description_ar
                    : subcategory.description

                return (
                  <motion.div
                    key={subcategory.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                  >
                    <Link href={`/categories/${subcategory.slug}`} className="group block h-full">
                      <div className="relative h-[320px] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                        <div className="absolute inset-0">
                          {subcategory.banner_image || subcategory.image_url ? (
                            <Image
                              src={subcategory.banner_image || subcategory.image_url!}
                              alt={localizedName}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-700"
                              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                              priority={index === 0}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-600" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                        </div>
                        <div className="relative h-full flex flex-col justify-end p-8">
                          <h2 className="text-3xl font-bold text-white mb-3">
                            {localizedName}
                          </h2>
                          <p className="text-sm text-white/80 line-clamp-2 mb-6">
                            {localizedDescription || (language === "ar" ? "تعرف على تفاصيل هذه المجموعة." : "Discover the details of this collection.")}
                          </p>
                          <Button
                            variant="secondary"
                            className="w-fit rounded-full px-6 py-5 bg-white/90 text-gray-900 font-semibold shadow-lg group-hover:bg-white"
                          >
                            <span className="flex items-center gap-2">
                              {cta}
                              <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${isRTL ? "-scale-x-100" : ""}`} />
                            </span>
                          </Button>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
