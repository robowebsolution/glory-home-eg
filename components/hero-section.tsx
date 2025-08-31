"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowDown, MoveRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useEffect, useRef } from "react"
import Link from "next/link"
export function HeroSection() {
  const { t, isRTL } = useLanguage()
  const targetRef = useRef(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // تأثير parallax مع حركة الماوس
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  // Ensure video starts playback when ready (some browsers may delay with preload none/metadata)
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const tryPlay = () => { try { v.play() } catch {}
    }
    if (v.readyState >= 2) {
      tryPlay()
      return
    }
    v.addEventListener('canplay', tryPlay, { once: true })
    return () => v.removeEventListener('canplay', tryPlay)
  }, [])

  // Upgrade preload to auto when hero enters viewport to ensure playback
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (!('IntersectionObserver' in window)) return
    const io = new IntersectionObserver((entries) => {
      const e = entries[0]
      if (e && e.isIntersecting) {
        try {
          v.preload = 'auto'
          // Reload to honor new preload hint and start buffering
          v.load()
          v.play().catch(() => {})
        } catch {}
        io.disconnect()
      }
    }, { root: null, threshold: 0.25 })
    io.observe(v)
    return () => io.disconnect()
  }, [])

  // تحديد اتجاه الحركة للسهم
  const arrowTransformClass = isRTL ? "group-hover:-translate-x-1 mr-2" : "group-hover:translate-x-1 ml-2"

  return (
    <section ref={targetRef} className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        {/* High-priority poster image to be the discoverable LCP element */}
        <Image
          src="/placeholder.jpg"
          alt=""
          fill
          className="object-cover z-0"
          priority
          fetchPriority="high"
          sizes="100vw"
        />
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 z-10 w-full h-full object-cover"
          poster="/placeholder.jpg"
          width={1200}
          height={675}
          aria-hidden="true"
          onLoadedData={() => {
            try {
              if (videoRef.current) {
                videoRef.current.muted = true
                // Some browsers require setting playsInline at runtime
                ;(videoRef.current as any).playsInline = true
                videoRef.current.play()
              }
            } catch {}
          }}
        >
          {/* يمكنك اختيار فيديو من هنا: https://coverr.co/ */}
          <source type="video/mp4" src='/hero-video.mp4' />
        </video>
        <div className="absolute inset-0 z-20 bg-black/50" aria-hidden="true" />
      </div>

      {/* Content */}
      <motion.div style={{ y }} className={`relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 ${isRTL ? "rtl" : ""}`}>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 leading-tight tracking-tight"
        >
          {t("hero.title")} <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">{t("hero.title.bold")}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto"
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? "sm:flex-row-reverse" : ""}`}
        >
          <Link href="/categories">
          <Button size="lg" className="group bg-white text-black hover:bg-gray-200 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl w-full sm:w-auto px-8 py-6 text-base">
            {t("hero.explore")}
            <MoveRight className={`h-5 w-5 transition-transform duration-300 ${arrowTransformClass}`} aria-hidden="true" />
          </Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Modern Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <ArrowDown className="h-6 w-6 text-white/70" aria-hidden="true" />
        </motion.div>
      </motion.div>
    </section>
  )
}