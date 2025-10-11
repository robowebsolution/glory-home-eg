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

interface HdfCountryShowcaseProps {
  countries: Category[]
}

export function HdfCountryShowcase({ countries }: HdfCountryShowcaseProps) {
  const { language, isRTL } = useLanguage()
  const headline = language === "ar" ? "اختر بلد التصنيع" : "Choose a manufacturing country"
  const subheadline = language === "ar"
    ? "استكشف أفضل أنواع أرضيات الـ HDF من مختلف الدول"
    : "Explore premium HDF flooring curated from leading countries"
  const cta = language === "ar" ? "عرض الشركات" : "View manufacturers"

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navigation />
      <main className="pt-28 pb-20">
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`text-center max-w-3xl mx-auto ${isRTL ? "rtl" : ""}`}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {headline}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
              {subheadline}
            </p>
          </motion.div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {countries.map((country, index) => (
              <motion.div
                key={country.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Link href={`/categories/hdf/countries/${country.slug}`} className="group block h-full">
                  <div className="relative h-[320px] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                    <div className="absolute inset-0">
                      {country.image_url ? (
                        <Image
                          src={country.image_url}
                          alt={language === "ar" && country.name_ar ? country.name_ar : country.name}
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
                        {language === "ar" && country.name_ar ? country.name_ar : country.name}
                      </h2>
                      <p className="text-sm text-white/80 line-clamp-2 mb-6">
                        {language === "ar" && country.description_ar ? country.description_ar : country.description}
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
