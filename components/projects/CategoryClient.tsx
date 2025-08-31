"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ProjectGalleryModal from "@/components/projects/ProjectGalleryModal"

export type Category = { id: number; name_en: string; name_ar: string; slug: string }
export type Project = {
  id: number
  name_en: string
  name_ar: string
  description_en?: string | null
  description_ar?: string | null
  category_id: number
  cover: string | null
  images?: string[]
}

export default function CategoryClient({
  category,
  projects,
}: {
  category: Category
  projects: Project[]
}) {
  const { language, isRTL, t } = useLanguage()
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
      {/* Header */}
      <section className="py-10 mt-[100px] sm:py-14 bg-gradient-to-b from-gray-50 to-white dark:from-zinc-900 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between mb-4 ${isRTL ? "rtl" : ""}`}>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {language === "ar" ? category.name_ar : category.name_en}
            </h1>
            <Link href="/projects" className="text-sm text-primary hover:underline">
              {isRTL ? "العودة" : "Back"}
            </Link>
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            {t("projects.subtitle")}
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${isRTL ? "rtl" : ""}`}
          >
            {projects.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: idx * 0.05 }}
                viewport={{ once: true }}
              >
                <Card
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    openGallery(
                      language === "ar" ? p.name_ar : p.name_en,
                      p.images || [],
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
                  <CardContent className="p-5 flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3.25rem]">
                      {language === "ar" ? p.name_ar : p.name_en}
                    </h3>
                    {((language === "ar" ? p.description_ar : p.description_en) || "").trim() && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 min-h-[3.25rem]">
                        {language === "ar" ? p.description_ar : p.description_en}
                      </p>
                    )}
                    <div className={`mt-auto flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{p.images?.length || 1} {isRTL ? "صورة" : "images"}</div>
                      <div className="text-primary text-sm font-medium group-hover:underline">{isRTL ? "عرض الصور" : "View Gallery"}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {projects.length === 0 && (
            <div className="text-center py-16 text-gray-600 dark:text-gray-300">
              {isRTL ? "لا توجد مشاريع في هذه الفئة بعد" : "No projects in this category yet"}
            </div>
          )}
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
