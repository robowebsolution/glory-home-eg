"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import type { Category, Manufacturer } from "@/lib/supabase"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { ArrowRight, Factory } from "lucide-react"

interface HdfManufacturerShowcaseProps {
  country: Category
  manufacturers: Manufacturer[]
}

export function HdfManufacturerShowcase({ country, manufacturers }: HdfManufacturerShowcaseProps) {
  const { language, isRTL } = useLanguage()
  const title = language === "ar"
    ? `المصنّعون في ${country.name_ar || country.name}`
    : `Manufacturers in ${country.name}`
  const subtitle = language === "ar"
    ? "اختر شركة لرؤية تشكيلتها المميزة من أرضيات HDF"
    : "Pick a brand to explore its signature HDF collections"
  const cta = language === "ar" ? "عرض المنتجات" : "View products"

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navigation />
      <main className="pt-28 pb-20">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`text-center max-w-4xl mx-auto ${isRTL ? "rtl" : ""}`}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {title}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
              {subtitle}
            </p>
          </motion.div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {manufacturers.map((manufacturer, index) => (
              <motion.div
                key={manufacturer.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Link
                  href={`/categories/hdf/countries/${country.slug}/${manufacturer.slug}`}
                  className="group block h-full"
                >
                  <div className="relative h-[340px] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-800 dark:to-gray-900">
                    {manufacturer.banner_image ? (
                      <Image
                        src={manufacturer.banner_image}
                        alt={manufacturer.name_ar && language === "ar" ? manufacturer.name_ar : manufacturer.name}
                        fill
                        className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                    <div className="relative h-full flex flex-col justify-end p-8">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                          {manufacturer.logo_url ? (
                            <div className="relative h-10 w-10 overflow-hidden rounded-full">
                              <Image
                                src={manufacturer.logo_url}
                                alt={manufacturer.name}
                                fill
                                className="object-contain"
                              />
                            </div>
                          ) : (
                            <Factory className="h-7 w-7 text-white" />
                          )}
                        </div>
                        <h2 className="text-2xl font-bold text-white">
                          {language === "ar" && manufacturer.name_ar ? manufacturer.name_ar : manufacturer.name}
                        </h2>
                      </div>
                      <p className="text-sm text-white/80 line-clamp-3 mb-6">
                        {language === "ar" && manufacturer.description_ar ? manufacturer.description_ar : manufacturer.description || subtitle}
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
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
