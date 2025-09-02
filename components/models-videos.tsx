"use client"
import { motion } from "framer-motion"
import { Play, Volume2, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/language-context"
import Image from "next/image"
import { fetchVideos } from "@/lib/api"
import type { Video } from "@/lib/types"

export function ModelsVideos() {
  const { language } = useLanguage()
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const data = await fetchVideos()
        if (mounted) setVideos(data)
      } catch (e) {
        console.error("Failed to load videos:", e)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const displayedVideos = showAll ? videos : videos.slice(0, 3)

  // Convert YouTube URLs (watch, youtu.be, shorts, embed) or an <iframe ...> snippet to an embeddable URL
  const toYouTubeEmbed = (urlStr: string): string | null => {
    try {
      // If user pasted full <iframe ...> code, extract src
      const trimmed = urlStr.trim()
      if (trimmed.startsWith('<')) {
        const match = trimmed.match(/src=["']([^"']+)["']/i)
        if (match?.[1]) {
          urlStr = match[1]
        }
      }

      const url = new URL(urlStr)
      let id = ""
      const host = url.hostname
      if (host.includes("youtu.be")) {
        id = url.pathname.replace(/^\//, "")
      } else if (host.includes("youtube.com")) {
        if (url.pathname.startsWith("/watch")) {
          id = url.searchParams.get("v") || ""
        } else if (url.pathname.startsWith("/embed/")) {
          id = url.pathname.split("/embed/")[1] || ""
        } else if (url.pathname.startsWith("/shorts/")) {
          id = url.pathname.split("/shorts/")[1] || ""
        }
      }
      if (!id) return null
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
    } catch {
      return null
    }
  }

  // Derive a YouTube thumbnail (hqdefault) from a YouTube URL or <iframe>
  const toYouTubeThumb = (urlStr: string): string | null => {
    try {
      const trimmed = urlStr.trim()
      // Extract src if user pasted an <iframe>
      if (trimmed.startsWith('<')) {
        const match = trimmed.match(/src=["']([^"']+)["']/i)
        if (match?.[1]) {
          urlStr = match[1]
        }
      }

      const url = new URL(urlStr)
      let id = ""
      const host = url.hostname
      if (host.includes("youtu.be")) {
        id = url.pathname.replace(/^\//, "")
      } else if (host.includes("youtube.com")) {
        if (url.pathname.startsWith("/watch")) {
          id = url.searchParams.get("v") || ""
        } else if (url.pathname.startsWith("/embed/")) {
          id = url.pathname.split("/embed/")[1] || ""
        } else if (url.pathname.startsWith("/shorts/")) {
          id = url.pathname.split("/shorts/")[1] || ""
        }
      }
      if (!id) return null
      return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
    } catch {
      return null
    }
  }

  const isUrlOrAbsolutePath = (s: string | null | undefined): boolean => {
    if (!s) return false
    return /^https?:\/\//i.test(s) || s.startsWith('/')
  }

  // Normalize ytimg variant (vi_webp/mq*.webp) to a stable JPG
  const normalizeYouTubeVariantThumb = (t: string): string | null => {
    // vi_webp/<id>/...
    const m = t.match(/ytimg\.com\/vi_webp\/([^\/]+)/i)
    if (m?.[1]) return `https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg`
    // vi/<id>/...
    const m2 = t.match(/ytimg\.com\/vi\/([^\/]+)/i)
    if (m2?.[1]) return `https://i.ytimg.com/vi/${m2[1]}/hqdefault.jpg`
    return null
  }

  const getThumbnailSrc = (video: Video): string => {
    // 1) If the video source is YouTube, always prefer a stable derived thumbnail
    if (video.src) {
      const yt = toYouTubeThumb(String(video.src))
      if (yt) return yt
    }

    // 2) If a thumbnail is provided and is a URL or absolute path
    if (isUrlOrAbsolutePath(video.thumbnail)) {
      const t = String(video.thumbnail)
      // If the provided thumbnail is a volatile YouTube variant (vi_webp/mq*.webp), normalize to a stable one
      const isYtVariant = /https?:\/\/(?:i\d\.)?ytimg\.com\/vi_webp\//i.test(t)
      if (isYtVariant && video.src) {
        const yt = toYouTubeThumb(String(video.src))
        if (yt) return yt
      }
      // If src isn't YouTube or derivation failed, still try to normalize directly from the thumbnail URL
      const normalized = normalizeYouTubeVariantThumb(t)
      if (normalized) return normalized
      return t
    }

    // 3) Fallback to local placeholder
    return "/placeholder.svg"
  }

  const currentVideo = activeIndex !== null ? videos[activeIndex] : null
  const youtubeEmbed = currentVideo?.src ? toYouTubeEmbed(String(currentVideo.src)) : null

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-4 rtl:font-['Tajawal']">
            {language === "ar" ? (
              <>
                شاهد <span className="font-bold">أثاثنا قيد الاستخدام</span>
              </>
            ) : (
              <>
                See Our <span className="font-bold">Furniture in Action</span>
              </>
            )}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto rtl:font-['Tajawal']">
            {language === "ar" 
              ? "شاهد العملاء الحقيقيين وهم يحولون مساحاتهم باستخدام مجموعات الأثاث لدينا"
              : "Watch real customers transform their spaces with our furniture collections"}
          </p>
          
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 rtl:font-['Tajawal']">
            {language === "ar" ? "لا توجد مقاطع فيديو حتى الآن" : "No videos available yet"}
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
              onClick={() => setActiveIndex(index)}
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={getThumbnailSrc(video)}
                  alt={language === "ar" ? (video.title_ar || "") : (video.title_en || "")}
                  width={800}
                  height={256}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  quality={85}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300" />

                {/* Play Button */}
                <motion.div whileHover={{ scale: 1.1 }} className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white transition-colors duration-300">
                  <Play className="h-6 w-6 text-gray-900 ml-1" />
                  </div>
                </motion.div>

                {/* Duration */}
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  {video.duration}
                </div>

                {/* Volume Indicator */}
                <div className="absolute top-4 right-4 bg-black/70 text-white p-2 rounded">
                  <Volume2 className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors rtl:font-['Tajawal']">
                  {language === "ar" ? (video.title_ar || "") : (video.title_en || "")}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
        )}

        {/* Lightbox Modal */}
        {activeIndex !== null && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setActiveIndex(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveIndex(null)}
                aria-label="Close"
                className="absolute -top-10 right-0 text-white/90 hover:text-white transition-colors"
              >
                <X className="w-7 h-7" />
              </button>
              <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
                {youtubeEmbed ? (
                  <iframe
                    key={youtubeEmbed}
                    src={youtubeEmbed}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <video
                    key={(videos[activeIndex]?.src as string) || "video"}
                    src={(videos[activeIndex]?.src as string) || ""}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              <div className="mt-3 text-center">
                <h4 className="text-white text-lg rtl:font-['Tajawal']">
                  {language === 'ar' ? (videos[activeIndex]?.title_ar || "") : (videos[activeIndex]?.title_en || "")}
                </h4>
              </div>
            </motion.div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          {!showAll && videos.length > 3 && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="inline-flex items-center px-5 py-2.5 rounded-md bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 transition-colors"
            >
              {language === 'ar' ? 'عرض المزيد' : 'Show more'}
            </button>
          )}
        </motion.div>
      </div>
    </section>
  )
}
