"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Play, Volume2, X } from "lucide-react"
import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import Image from "next/image"

const videos = [
  {
    id: 1,
    title: "إعداد غرفة المعيشة العصرية",
    titleEn: "Modern Living Room Setup",
    src: "/models-video-1.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    duration: "2:45",
  },
  {
    id: 2,
    title: "تحويل غرفة النوم",
    titleEn: "Bedroom Transformation",
    src: "/models-video-2.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    duration: "3:20",
  },
  {
    id: 3,
    title: "عملية تصميم المطبخ",
    titleEn: "Kitchen Design Process",
    src: "/models-video-3.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    duration: "4:15",
  },
]

export function ModelsVideos() {
  const { language, isRTL } = useLanguage() // استخدام سياق اللغة بدلاً من متغير state المحلي

  // إزالة دالة toggleLanguage لأننا نستخدم الآن سياق اللغة العام
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video, index) => (
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
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={language === "ar" ? video.title : video.titleEn}
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
                  {language === "ar" ? video.title : video.titleEn}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

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
                <video
                  key={videos[activeIndex].src}
                  src={videos[activeIndex].src}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="mt-3 text-center">
                <h4 className="text-white text-lg rtl:font-['Tajawal']">
                  {language === 'ar' ? videos[activeIndex].title : videos[activeIndex].titleEn}
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
         
        </motion.div>
      </div>
    </section>
  )
}
