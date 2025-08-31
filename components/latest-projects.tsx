"use client"

import * as React from "react"
import { motion } from "framer-motion"
import ProjectGalleryModal from "@/components/projects/ProjectGalleryModal"
import { ProjectCard } from "./projects/ProjectCard"
import ScrollStack, { ScrollStackItem } from './ScrollStack'
import { useLanguage } from "@/lib/language-context"
import Link from "next/link"

// Simple client component to fetch latest projects and render vertical stacking cards
type SimpleProject = { titleEn: string; titleAr: string; images: string[]; thumb: string }

export function LatestProjects() {
  const [projects, setProjects] = React.useState<SimpleProject[]>([])
  const [openIdx, setOpenIdx] = React.useState<number | null>(null)
  const { language, isRTL } = useLanguage()

  React.useEffect(() => {
    let aborted = false

    async function load() {
      try {
        const res = await fetch("/api/projects?limit=4&random=1", { next: { revalidate: 300 } })
        const json = await res.json()
        if (aborted) return
        const items: any[] = Array.isArray(json?.projects) ? json.projects : []
        const list: SimpleProject[] = items.map((p) => {
          const titleEn: string = p?.name_en || p?.title || "Project"
          const titleAr: string = p?.name_ar || titleEn
          const imgs: string[] = Array.isArray(p?.images) && p.images.length > 0
            ? p.images.filter(Boolean)
            : (p?.cover ? [p.cover] : [])
          const thumb = imgs[0] || p?.cover || "/fawry.jpg"
          return { titleEn, titleAr, images: imgs.length > 0 ? imgs : [thumb], thumb }
        })
        const sliced = list.slice(0, 4)
        setProjects(sliced)
      } catch {
        if (aborted) return
        // Fallback demo projects to ensure the section still works
        const fallback: SimpleProject[] = [
          {
            titleEn: "Modern Workspace",
            titleAr: "مساحة عمل عصرية",
            images: ["https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2000&auto=format&fit=crop", "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop"],
            thumb: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2000&auto=format&fit=crop",
          },
          {
            titleEn: "Warm Living Room",
            titleAr: "غرفة معيشة دافئة",
            images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2000&auto=format&fit=crop", "https://images.unsplash.com/photo-1600585154340-1e53b8b6b9a7?q=80&w=2000&auto=format&fit=crop"],
            thumb: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2000&auto=format&fit=crop",
          },
          {
            titleEn: "Minimal Bedroom",
            titleAr: "غرفة نوم مينيمال",
            images: ["https://images.unsplash.com/photo-1600585154340-1e53b8b6b9a7?q=80&w=2000&auto=format&fit=crop", "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d35?q=80&w=2000&auto=format&fit=crop"],
            thumb: "https://images.unsplash.com/photo-1600585154340-1e53b8b6b9a7?q=80&w=2000&auto=format&fit=crop",
          },
        ]
        setProjects(fallback)
      }
    }

    load()
    return () => { aborted = true }
  }, [])

  const sectionTitle = language === 'ar' ? 'أحدث مشاريعنا' : 'Our Latest Projects'
  const sectionSubtitle = language === 'ar' ? 'اسحب لأسفل لاستكشاف أعمالنا' : 'Scroll down to explore our recent work'
  const ctaText = language === 'ar' ? 'شوف كل المشاريع' : 'See all projects'
  // Ensure the section is tall enough to finish the stack and reveal the CTA
  const cardsCount = projects.length || 0
  const containerMinHeightVh = React.useMemo(() => {
    const base = 220 // baseline section height in vh
    const perExtra = 40 // extra per card after 3
    const extra = Math.max(0, cardsCount - 3) * perExtra
    return Math.min(340, base + extra)
  }, [cardsCount])

  return (
    <section className="relative bg-gray-50 dark:bg-neutral-950 isolate overflow-hidden py-12 md:py-16 mb-24 md:mb-32" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Section Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-white/10 py-8">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {sectionTitle}
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {sectionSubtitle}
          </motion.p>
        </div>
      </div>

      {/* Stacking Cards Container */}
      <div
        className="relative max-w-7xl mx-auto"
        style={{ minHeight: `${containerMinHeightVh}vh` }}
      >
        <ScrollStack >
          {projects.map((project, index) => (
            <ScrollStackItem key={index}>
              <ProjectCard
                project={project}
                index={index} 
                isRTL={isRTL}
                language={language}
                onClick={() => setOpenIdx(index)}
              />
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>

      {/* CTA: View all projects */}
      <div className="container mx-auto px-4 mt-8 pt-4 pb-12 text-center relative z-30">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-colors"
        >
          {ctaText}
          <svg
            className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Gallery Modal */}
      {openIdx !== null && projects[openIdx] && (
        <ProjectGalleryModal
          isOpen={openIdx !== null}
          title={isRTL ? projects[openIdx].titleAr : projects[openIdx].titleEn}
          images={projects[openIdx].images}
          onClose={() => setOpenIdx(null)}
        />
      )}
    </section>
  )
}

export default LatestProjects