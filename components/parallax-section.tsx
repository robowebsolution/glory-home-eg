"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import Link from "next/link"

export function ParallaxSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const { language, isRTL } = useLanguage()

  // Avoid preloading large offscreen background to reduce LCP/SI contention
  // The image will load when the section nears viewport naturally

  return (
    <section ref={ref} className="relative h-screen overflow-hidden">
      {/* Parallax Background */}
      <motion.div
        
        className="absolute inset-0 w-full h-[120%] bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1631049552240-59c37f38802b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />

      {/* Content */}
      <motion.div style={{ opacity }} className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-white/10 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 mb-6">
              <Play className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              <span className="text-white text-sm sm:text-base font-medium rtl:font-['Tajawal']">
                {language === "ar" ? "استمتع بالتجربة المختلفة" : "Experience the Difference"}
              </span>
            </div>
            
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight rtl:font-['Tajawal']"
          >
            {language === "ar" ? "مصنوع" : "Crafted for"}
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {language === "ar" ? "للكمال" : "Perfection"}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-6 sm:mb-8 font-light max-w-3xl mx-auto leading-relaxed rtl:font-['Tajawal']"
          >
            {language === "ar" 
              ? "كل قطعة تحكي قصة من الحرفية الدقيقة والتصميم المبتكر والالتزام الثابت بالجودة التي تحول المنازل إلى بيوت."
              : "Every piece tells a story of meticulous craftsmanship, innovative design, and unwavering commitment to quality that transforms houses into homes."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/about">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 group w-full sm:w-auto rtl:font-['Tajawal']"
            >
              {language === "ar" ? "اكتشف قصتنا" : "Discover Our Story"}
              <ArrowRight className="ml-2 rtl:mr-2 rtl:ml-0 h-4 w-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </Button>
            </Link>
            <Link href="/contact">  
              <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm w-full sm:w-auto rtl:font-['Tajawal']"
            >
              {language === "ar" ? " تواصل معنا" : "Contact Us"}
            </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16"
          >
            {[
              { number: "10K+", label: language === "ar" ? "عميل سعيد" : "Happy Customers" },
              { number: "500+", label: language === "ar" ? "تصميم فريد" : "Unique Designs" },
              { number: "15+", label: language === "ar" ? "سنوات من الخبرة" : "Years Experience" },
            ].map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-sm sm:text-base text-gray-300 rtl:font-['Tajawal']">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
