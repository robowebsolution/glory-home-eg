"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import type { Category } from "@/lib/supabase"
import { fetchCategories, fetchProductIdsByCategory } from "@/lib/api"
import { isSupabaseConfigured } from "@/lib/supabase-client"
import { motion, useReducedMotion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import {
  Bed,
  Sofa,
  ChefHat,
  Shirt,
  Baby,
  UtensilsCrossed,
  DoorOpen,
  Lightbulb,
  Table,
  FileText,
  Wallpaper,
  Crown,
  MoreHorizontal,
  AlertTriangle,
} from "lucide-react"

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t, language, isRTL } = useLanguage()
  const prefersReducedMotion = useReducedMotion()

  const categoryIcons = {
    bedrooms: Bed,
    "sofa-and-l-shape": Sofa,
    kitchens: ChefHat,
    "dressing-rooms": Shirt,
    "children-rooms": Baby,
    "dining-tables": UtensilsCrossed,
    doors: DoorOpen,
    chandeliers: Lightbulb,
    tables: Table,
    hdf: FileText,
    wallpapers: Wallpaper,
    cornish: Crown,
    others: MoreHorizontal,
  }

  // الكود الخاص بالبيانات الافتراضية والحالات يبقى كما هو
  // ... (تم حذفه للاختصار)
  const defaultCategories: Category[] = [
    { id: "1", name: "BedRooms", name_ar: "غرف النوم", slug: "bedrooms", product_count: 0, description: "", description_ar: "", image_url: "", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "2", name: "Sofa & L-Shape", name_ar: "الكنب والأشكال L", slug: "sofa-and-l-shape", product_count: 0, description: "", description_ar: "", image_url: "", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "3", name: "Kitchens", name_ar: "المطابخ", slug: "kitchens", product_count: 0, description: "", description_ar: "", image_url: "", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "4", name: "Dining Tables", name_ar: "طاولات الطعام", slug: "dining-tables", product_count: 0, description: "", description_ar: "", image_url: "", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "5", name: "Chandeliers", name_ar: "الثريات", slug: "chandeliers", product_count: 0, description: "", description_ar: "", image_url: "", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ]

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        if (!isSupabaseConfigured()) {
          setCategories(defaultCategories);
          setError("Database not connected - showing default categories");
          return;
        }

        const [categoriesData, productIdPairs] = await Promise.all([
          fetchCategories(),
          fetchProductIdsByCategory(),
        ]);

        let finalCategories: Category[] = [];

        if (Array.isArray(categoriesData) && categoriesData.length > 0) {
          const countsByCategory = (productIdPairs || []).reduce((acc: Record<string, number>, p: { id: string; category_id: string }) => {
            acc[p.category_id] = (acc[p.category_id] || 0) + 1
            return acc
          }, {} as Record<string, number>)

          finalCategories = categoriesData.map(category => ({
            ...category,
            product_count: countsByCategory[category.id] || 0,
          }))
        } else {
          finalCategories = defaultCategories;
          setError("No categories found in database - showing defaults");
        }
        setCategories(finalCategories);

      } catch (error) {
        console.error("Failed to load data:", error);
        setError("Failed to load categories - showing defaults");
        setCategories(defaultCategories);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);
  // ...

  // كود التحميل والخطأ يبقى كما هو
  if (loading) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${isRTL ? "rtl" : ""}`}>
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-4">
              {t("categories.title")} <span className="font-bold">{t("categories.title.bold")}</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{t("categories.loading")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-t-lg"></div>
                <div className="p-6 bg-white dark:bg-gray-800 rounded-b-lg">
                  <div className="bg-gray-200 dark:bg-gray-700 h-6 w-3/4 rounded mb-4"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-4 w-1/2 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          viewport={{ once: true, amount: 0.2 }}
          className={`text-center mb-16 ${isRTL ? "rtl" : ""}`}
        >
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-4">
            {t("categories.title")} <span className="font-bold">{t("categories.title.bold")}</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{t("categories.subtitle")}</p>
          {error && (
            <div className={`mt-4 flex items-center justify-center space-x-2 text-yellow-600 dark:text-yellow-400 ${isRTL ? "space-x-reverse" : ""}`}>
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </motion.div>

        {/* ======================================================== */}
        {/*           هنا يبدأ التعديل الرئيسي لشكل البطاقات          */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {categories.map((category, index) => {
            const IconComponent = categoryIcons[category.slug as keyof typeof categoryIcons] || MoreHorizontal
            return (
              <motion.div
                key={category.id}
                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true, amount: 0.15 }}
                className="h-full"
              >
                <Link href={`/categories/${category.slug}`} className="block h-full">
                  <Card className="h-full flex flex-col rounded-2xl shadow-md hover:shadow-xl dark:bg-gray-800 border-gray-200 dark:border-gray-700 group overflow-hidden transition-all duration-300">
                    
                    {/* 1. حاوية الصورة أو الأيقونة */}
                    <div className="relative w-full h-48 overflow-hidden">
                      {category.image_url ? (
                        <img
                          src={category.image_url}
                          alt={language === "ar" && category.name_ar ? category.name_ar : category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        // في حال عدم وجود صورة، نعرض أيقونة
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                          <IconComponent className="h-20 w-20 text-gray-400 dark:text-gray-500" />
                        </div>
                      )}
                    </div>

                    {/* 2. حاوية المحتوى النصي */}
                    <CardContent className="p-5 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {language === "ar" && category.name_ar ? category.name_ar : category.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 min-h-[40px]">
                        {language === "ar" && category.description_ar ? category.description_ar : category.description}
                      </p>
                      
                      {/* هذا العنصر سينزل للأسفل تلقائياً بفضل mt-auto */}
                      <span className="inline-block mt-auto text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full w-fit">
                        {category.product_count || 0} {t("categories.items")}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}