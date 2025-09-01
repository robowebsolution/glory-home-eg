"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useMemo, useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { fetchReviews, type ApiReview } from "@/lib/api"

export function CustomerFeedback() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [reviews, setReviews] = useState<ApiReview[]>([])
  const { language } = useLanguage()

  useEffect(() => {
    fetchReviews(10)
      .then(setReviews)
      .catch(() => setReviews([]))
  }, [])

  const hasData = reviews.length > 0
  const total = reviews.length || 1

  const displayedText = useMemo(() => {
    if (!hasData) return language === "ar" ? "" : ""
    const r = reviews[currentIndex % total]
    return language === "ar" ? r.comment_ar : r.comment_en
  }, [hasData, reviews, currentIndex, total, language])

  const nextTestimonial = () => setCurrentIndex((prev) => (prev + 1) % total)
  const prevTestimonial = () => setCurrentIndex((prev) => (prev - 1 + total) % total)

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
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
                ماذا يقول <span className="font-bold">عملاؤنا</span>
              </>
            ) : (
              <>
                What Our <span className="font-bold">Customers Say</span>
              </>
            )}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto rtl:font-['Tajawal']">
            {language === "ar" 
              ? "تعليقات حقيقية من عملاء حقيقيين قاموا بتحويل مساحاتهم باستخدام أثاثنا"
              : "Real feedback from real customers who have transformed their spaces with our furniture"}
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-0 shadow-xl dark:bg-gray-700">
              <CardContent className="p-8 md:p-12">
                <div className="text-center">
                  {/* Stars (ثابتة للعرض فقط) */}
                  <div className="flex justify-center mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-6 w-6 ${"fill-yellow-400 text-yellow-400"}`} />
                    ))}
                  </div>

                  {/* Comment */}
                  <blockquote className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 mb-8 leading-relaxed italic rtl:font-['Tajawal'] rtl:not-italic">
                    {hasData ? `"${displayedText}"` : (language === "ar" ? "لا توجد تعليقات بعد" : "No reviews yet")}
                  </blockquote>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-center items-center mt-8 space-x-4 rtl:space-x-reverse">
            <Button
              variant="outline"
              size="sm"
              onClick={prevTestimonial}
              disabled={!hasData || total <= 1}
              className="w-10 h-10 p-0 rounded-full bg-transparent dark:border-gray-600 dark:text-gray-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Dots */}
            <div className="flex space-x-2 rtl:space-x-reverse">
              {Array.from({ length: total }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  disabled={!hasData}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex ? "bg-gray-900 dark:bg-white" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={nextTestimonial}
              disabled={!hasData || total <= 1}
              className="w-10 h-10 p-0 rounded-full bg-transparent dark:border-gray-600 dark:text-gray-300"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
