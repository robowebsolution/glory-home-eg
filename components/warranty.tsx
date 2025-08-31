"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Truck, Headphones, Award } from "lucide-react"
import { useState } from "react"
import { useLanguage } from "@/lib/language-context"

const warranties = [
  {
    icon: Shield,
    title: "ضمان مدى الحياة",
    titleEn: "Lifetime Warranty",
    description: "تغطية شاملة لجميع المكونات الهيكلية وعيوب الصناعة",
    descriptionEn: "Comprehensive coverage on all structural components and craftsmanship defects",
  },
  {
    icon: Truck,
    title: "توصيل مجاني",
    titleEn: "Free Delivery",
    description: "خدمة توصيل وإعداد مجانية لجميع الطلبات",
    descriptionEn: "Complimentary white-glove delivery and setup service for all orders",
  },
  {
    icon: Headphones,
    title: "دعم على مدار الساعة",
    titleEn: "24/7 Support",
    description: "خدمة عملاء ودعم فني على مدار الساعة عندما تحتاج إليه",
    descriptionEn: "Round-the-clock customer service and technical support whenever you need it",
  },
  {
    icon: Award,
    title: "ضمان الجودة",
    titleEn: "Quality Guarantee",
    description: "ضمان الرضا لمدة 30 يومًا مع إرجاع واستبدال بدون متاعب",
    descriptionEn: "30-day satisfaction guarantee with hassle-free returns and exchanges",
  },
]

export function Warranty() {
  const { language, isRTL } = useLanguage() // استخدام سياق اللغة بدلاً من متغير state المحلي

  // إزالة دالة toggleLanguage لأننا نستخدم الآن سياق اللغة العام

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
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
                <span className="font-bold">وعدنا</span> لكم
              </>
            ) : (
              <>
                Our <span className="font-bold">Promise</span>
              </>
            )}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto rtl:font-['Tajawal']">
            {language === "ar" 
              ? "نحن ندعم كل قطعة نصنعها بضمانات شاملة وخدمة استثنائية"
              : "We stand behind every piece we create with comprehensive warranties and exceptional service"}
          </p>
          
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {warranties.map((item, index) => {
            const IconComponent = item.icon
            return (
              <motion.div
                key={language === "ar" ? item.title : item.titleEn}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full dark:bg-gray-800">
                  <CardContent className="p-8 text-center">
                    <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }} className="mb-6">
                      <div className="w-16 h-16 bg-gray-900 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 rtl:font-['Tajawal']">
                      {language === "ar" ? item.title : item.titleEn}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed rtl:font-['Tajawal']">
                      {language === "ar" ? item.description : item.descriptionEn}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
