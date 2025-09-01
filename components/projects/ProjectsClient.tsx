"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ProjectGalleryModal from "@/components/projects/ProjectGalleryModal"

export type Category = { id: number; name_en: string; name_ar: string; slug: string; cover?: string | null }
export type Project = {
  id: number
  name_en: string
  name_ar: string
  description_en?: string | null
  description_ar?: string | null
  category_id: number
  cover: string | null
  images: string[]
}

export default function ProjectsClient({ categories, projects }: { categories: Category[]; projects: Project[] }) {
  const { t, isRTL, language } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [galleryTitle, setGalleryTitle] = useState("")
  const [startIndex, setStartIndex] = useState(0)

  const openGallery = (title: string, images: string[], cover?: string | null, idx = 0) => {
    const unique = Array.from(new Set((images || []).filter(Boolean)))
    const list = unique.length > 0 ? unique : cover ? [cover] : []
    setGalleryTitle(title)
    setGalleryImages(list)
    setStartIndex(Math.min(idx, Math.max(0, list.length - 1)))
    setIsOpen(true)
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 pb-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black overflow-hidden">
        <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center ${isRTL ? "rtl" : ""}`}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl sm:text-5xl font-light text-gray-900 dark:text-white mb-4">
              {t("projects.title")} <span className="font-bold">{t("projects.title.bold")}</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t("projects.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between mb-6 ${isRTL ? "rtl" : ""}`}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("categories.title")} <span className="font-bold">{t("categories.title.bold")}</span>
            </h2>
          </div>

          {/* Image-based premium category cards */}
          <div className={`grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 ${isRTL ? "rtl" : ""}`}>
            {categories.map((c, idx) => {
              const img = c.cover || "/2-7fb9c07a.webp"
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/projects/category/${c.slug}`} className="group block">
                    <Card className="relative h-40 sm:h-48 lg:h-56 overflow-hidden border-0 rounded-2xl shadow-md hover:shadow-xl transition-all duration-500">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={language === "ar" ? c.name_ar : c.name_en}
                        className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                      <div className={`absolute inset-x-0 bottom-0 p-4 flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                        <div className="text-white text-lg font-semibold drop-shadow">
                          {language === "ar" ? c.name_ar : c.name_en}
                        </div>
                        <div className="text-white/80 text-sm px-3 py-1 rounded-full bg-white/10 backdrop-blur ring-1 ring-white/20">
                          {isRTL ? "استعرض" : "Explore"}
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Some Projects */}
      <section className="py-6 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between mb-6 ${isRTL ? "rtl" : ""}`}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("projects.title")} <span className="font-bold">{t("projects.title.bold")}</span>
            </h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${isRTL ? "rtl" : ""}`}
          >
            {projects.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                viewport={{ once: true }}
              >
                <Card
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    openGallery(
                      language === "ar" ? p.name_ar : p.name_en,
                      (p as any).images || [],
                      p.cover || null,
                      0
                    )
                  }
                  className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden rounded-2xl group"
                >
                  <div className="relative h-56">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.cover || "/fawry.jpg"}
                      alt={language === "ar" ? p.name_ar : p.name_en}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="backdrop-blur bg-white/20 text-white ring-1 ring-white/30">{t("featured.badge")}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-5 flex flex-col h-[calc(100%-14rem)]">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3.25rem]">
                      {language === "ar" ? p.name_ar : p.name_en}
                    </h3>
                    {((language === "ar" ? p.description_ar : p.description_en) || "").trim() && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 min-h-[3.25rem]">
                        {language === "ar" ? p.description_ar : p.description_en}
                      </p>
                    )}
                    <div className={`mt-auto flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{(p as any).images?.length || 1} {isRTL ? "صورة" : "images"}</div>
                      <div className="text-primary text-sm font-medium group-hover:underline">{isRTL ? "عرض الصور" : "View Gallery"}</div>
                    </div>
                  </CardContent>
                  {/* Removed action button to avoid broken per-project routes for now */}
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gallery Modal */}
      <ProjectGalleryModal
        isOpen={isOpen}
        images={galleryImages}
        title={galleryTitle}
        startIndex={startIndex}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}
