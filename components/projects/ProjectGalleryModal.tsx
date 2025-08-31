"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createPortal } from "react-dom"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

export default function ProjectGalleryModal({
  isOpen,
  images,
  title,
  onClose,
  startIndex = 0,
}: {
  isOpen: boolean
  images: string[]
  title: string
  onClose: () => void
  startIndex?: number
}) {
  const sanitized = useMemo(() => (images || []).filter(Boolean), [images])
  const safeImages = sanitized.length > 0 ? sanitized : ["/fawry.jpg"]
  const [index, setIndex] = useState(Math.min(startIndex, safeImages.length - 1))
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setIndex(Math.min(startIndex, safeImages.length - 1))
  }, [isOpen, startIndex, safeImages.length])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % safeImages.length)
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + safeImages.length) % safeImages.length)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpen, onClose, safeImages.length])

  const prev = () => setIndex((i) => (i - 1 + safeImages.length) % safeImages.length)
  const next = () => setIndex((i) => (i + 1) % safeImages.length)

  if (!mounted) return null

  return createPortal(
    (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={onClose}
              aria-hidden
            />

            <div className="relative z-10 w-full max-w-5xl">
              <div className="rounded-2xl p-[1.5px] bg-gradient-to-br from-primary/40 via-primary/10 to-transparent">
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  className="relative rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 shadow-[0_12px_40px_rgba(0,0,0,0.35)] border border-black/5 dark:border-white/10"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 30, opacity: 0 }}
                >
                  <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-black/5 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70 backdrop-blur">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate pr-10">{title}</h3>
                    <button
                      onClick={onClose}
                      className="p-2 rounded-full bg-zinc-900/80 text-white hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-white/30"
                      aria-label="Close"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="relative">
                    {/* Image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={safeImages[index]}
                      alt={`${title} - ${index + 1}`}
                      className="w-full h-[60vh] sm:h-[70vh] object-contain bg-black"
                    />

                    {/* Controls */}
                    <button
                      onClick={prev}
                      className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-4 p-2 sm:p-3 rounded-full bg-black/60 text-white hover:bg-black/80 shadow-lg backdrop-blur-sm"
                      aria-label="Previous"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={next}
                      className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-4 p-2 sm:p-3 rounded-full bg-black/60 text-white hover:bg-black/80 shadow-lg backdrop-blur-sm"
                      aria-label="Next"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>

                {/* Indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs sm:text-sm px-2 py-1 rounded-full bg-black/60 text-white shadow">
                  {index + 1} / {safeImages.length}
                </div>
                  </div>

              {/* Thumbnails */}
                  {safeImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto p-3 sm:p-4 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm">
                      {safeImages.map((src, i) => (
                        <button
                          key={i}
                          className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden ring-1 transition-transform duration-200 ${
                            i === index
                              ? "ring-primary ring-offset-2 ring-offset-white dark:ring-offset-neutral-900"
                              : "ring-zinc-300/50 dark:ring-white/10 hover:scale-[1.02]"
                          }`}
                          onClick={() => setIndex(i)}
                          aria-label={`Go to image ${i + 1}`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt={`${title} thumb ${i + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    ),
    document.body
  )
}
