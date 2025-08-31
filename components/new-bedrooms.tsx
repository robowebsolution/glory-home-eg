"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import Link from "next/link"

export function NewBedrooms() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const { language, isRTL } = useLanguage() // استخدام سياق اللغة بدلاً من متغير state المحلي

  // إزالة دالة toggleLanguage لأننا نستخدم الآن سياق اللغة العام

  return (
    <section ref={ref} className="py-20 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
         
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-6 rtl:font-['Tajawal']">
              {language === "ar" ? (
                <>
                  غرف النوم <span className="font-bold">الجديدة</span>
                </>
              ) : (
                <>
                  New <span className="font-bold">Bedrooms</span>
                </>
              )}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed rtl:font-['Tajawal']">
              {language === "ar" 
                ? "استمتع بمزيج مثالي من الراحة والأناقة مع أحدث مجموعة غرف النوم لدينا. تم تصميم كل قطعة لإنشاء ملاذ للراحة والاسترخاء."
                : "Experience the perfect blend of comfort and style with our latest bedroom collection. Each piece is designed to create a sanctuary of rest and relaxation."}
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-2 h-2 bg-gray-900 dark:bg-white rounded-full" />
                <span className="text-gray-700 dark:text-gray-300 rtl:font-['Tajawal']">
                  {language === "ar" ? "مواد وحرفية ممتازة" : "Premium materials and craftsmanship"}
                </span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-2 h-2 bg-gray-900 dark:bg-white rounded-full" />
                <span className="text-gray-700 dark:text-gray-300 rtl:font-['Tajawal']">
                  {language === "ar" ? "تصاميم وتشطيبات قابلة للتخصيص" : "Customizable designs and finishes"}
                </span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-2 h-2 bg-gray-900 dark:bg-white rounded-full" />
                <span className="text-gray-700 dark:text-gray-300 rtl:font-['Tajawal']">
                  {language === "ar" ? "خيارات مستدامة وصديقة للبيئة" : "Sustainable and eco-friendly options"}
                </span>
              </div>
            </div>
            <Link href="/categories/bedrooms"> 
            <Button size="lg" className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 rtl:font-['Tajawal']">
              {language === "ar" ? "استكشف غرف النوم" : "Explore Bedrooms"}
            </Button>
            </Link>
          </motion.div>

          <motion.div style={{ y, opacity }} className="relative z-0">
            <div className="relative">
              <motion.img
                src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt={language === "ar" ? "غرفة نوم عصرية" : "Modern Bedroom"}
                className="w-full h-96 object-cover rounded-lg shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
