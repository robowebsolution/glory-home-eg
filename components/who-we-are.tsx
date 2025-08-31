"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"
import { useLanguage } from "@/lib/language-context"

const timeline = [
  {
    year: "2015",
    title: "التأسيس",
    titleEn: "Founded",
    description: "بدأنا برؤية لإحداث ثورة في تصميم الأثاث الحديث",
    descriptionEn: "Started with a vision to revolutionize modern furniture design",
  },
  {
    year: "2018",
    title: "التوسع",
    titleEn: "Expansion",
    description: "افتتحنا أول متجر رئيسي لنا وأطلقنا منصة عبر الإنترنت",
    descriptionEn: "Opened our first flagship store and launched online platform",
  },
  {
    year: "2021",
    title: "الابتكار",
    titleEn: "Innovation",
    description: "قدمنا تقنية التصور ثلاة الأبعاد والواقع المعزز للعملاء",
    descriptionEn: "Introduced 3D visualization and AR technology for customers",
  },
  {
    year: "2025",
    title: "المستقبل",
    titleEn: "Future",
    description: "نقود الصناعة بحلول أثاث مستدامة وذكية",
    descriptionEn: "Leading the industry with sustainable and smart furniture solutions",
  },
]

export function WhoWeAre() {
  const { language, isRTL } = useLanguage() // استخدام سياق اللغة بدلاً من متغير state المحلي

  // إزالة دالة toggleLanguage لأننا نستخدم الآن سياق اللغة العام

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
                من <span className="font-bold">نحن</span>
              </>
            ) : (
              <>
                Who <span className="font-bold">We Are</span>
              </>
            )}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto rtl:font-['Tajawal']">
            {language === "ar" 
              ? "قصة شغف وابتكار وتفاني في صنع أثاث استثنائي يغير طريقة عيش الناس وعملهم."
              : "A story of passion, innovation, and dedication to creating exceptional furniture that transforms the way people live and work."}
          </p>
         
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              alt={language === "ar" ? "قصتنا" : "Our Story"}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-light text-gray-900 dark:text-white rtl:font-['Tajawal']">
              {language === "ar" ? "مهمتنا" : "Our Mission"}
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed rtl:font-['Tajawal']">
              {language === "ar" 
                ? "نؤمن بأن الأثاث الرائع يجب أن يكون أكثر من مجرد وظيفي - يجب أن يلهم ويريح ويعكس الشخصية الفريدة لكل مساحة يتواجد فيها."
                : "We believe that great furniture should be more than just functional—it should inspire, comfort, and reflect the unique personality of every space it inhabits."}
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed rtl:font-['Tajawal']">
              {language === "ar" 
                ? "من خلال التصميم المبتكر والممارسات المستدامة والتكنولوجيا المتطورة، نحن نشكل مستقبل الحياة العصرية، قطعة تلو الأخرى."
                : "Through innovative design, sustainable practices, and cutting-edge technology, we're shaping the future of modern living, one piece at a time."}
            </p>
          </motion.div>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-200 dark:bg-gray-700" />

          <div className="space-y-12">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"} ${language === "ar" && index % 2 === 0 ? "rtl:pl-8 rtl:text-left" : ""} ${language === "ar" && index % 2 !== 0 ? "rtl:pr-8 rtl:text-right" : ""}`}>
                  <Card className="border-0 shadow-lg dark:bg-gray-800">
                    <CardContent className="p-6">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{item.year}</div>
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 rtl:font-['Tajawal']">
                        {language === "ar" ? item.title : item.titleEn}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 rtl:font-['Tajawal']">
                        {language === "ar" ? item.description : item.descriptionEn}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="relative z-10">
                  <div className="w-4 h-4 bg-gray-900 dark:bg-white rounded-full border-4 border-white dark:border-gray-900 shadow-lg" />
                </div>

                <div className="w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
