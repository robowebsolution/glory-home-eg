"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/lib/language-context"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Layers, Boxes, PanelsTopLeft, Factory, Hammer } from "lucide-react"
import Link from "next/link"

// Our Glory Doors Section
// - Bilingual (EN/AR) with RTL support
// - Dark/Light mode friendly
// - Organized door types with clear grouping
// - Placeholder images (replace later per type)

type DoorGroup = {
  key: string
  title: { en: string; ar: string }
  subtitle?: { en: string; ar: string }
  items: Array<{ en: string; ar: string }>
  image: string
}

const groups: DoorGroup[] = [
  {
    key: "commercial",
    title: { en: "Commercial Doors", ar: "أبواب تجارية" },
    subtitle: {
      en: "Door Types & Materials – Glory Home",
      ar: "أنواع الأبواب والخامات – جلوري هوم",
    },
    items: [
      { en: "MDF & Melamine", ar: "إم دي إف & ميلامين" },
      { en: "Honeycomb Core", ar: "نواة خلية النحل" },
      { en: "Finger Joint Chassis with Middle Arm", ar: "شاسيه فينجر جوينت بذراع أوسط" },
      { en: "Double Blockboard Frame with PVC", ar: "إطار بلوكبورد مزدوج مع PVC" },
      { en: "Plywood with PVC for Architraves", ar: "كونتر مع PVC للوزرات" },
    ],
    image: "/commercial doors.png",
  },
  {
    key: "flush",
    title: { en: "Flush Wood Doors", ar: "أبواب فلاش خشبية" },
    items: [
      { en: "Natural Veneer Doors", ar: "أبواب بقشرة طبيعية" },
      { en: "Laminated Doors", ar: "أبواب مغطاة بطبقة ميلامين/لامينت" },
      { en: "Painted & Engraved Doors", ar: "أبواب مطلية ومحفورة" },
      { en: "Fancy Melamine Designs (40+ options)", ar: "تصاميم ميلامين فاخرة (أكثر من 40 خيار)" },
      { en: "Carving / Inlay Options (metal & wood trims)", ar: "حفر/تطعيم (حليات معدنية وخشبية)" },
    ],
    image: "/flush wood.jpg",
  },
  {
    key: "paneled",
    title: { en: "Paneled Doors", ar: "أبواب بانيل" },
    items: [
      { en: "Classic panel designs with a modern touch", ar: "تصاميم كلاسيكية بلمسة عصرية" },
      { en: "MDF panels with blockboard frames", ar: "بانيلات MDF مع إطارات بلوكبورد" },
    ],
    image: "/PANELED-DOORS.jpg",
  },
  {
    key: "structures",
    title: { en: "Core & Chassis Systems", ar: "أنظمة النواة والشاسيه" },
    items: [
      { en: "Solid Wood Chassis Without Middle Arm", ar: "شاسيه خشب صلب بدون ذراع أوسط" },
      { en: "Solid Wood Chassis With Middle Arm", ar: "شاسيه خشب صلب بذراع أوسط" },
      { en: "Finger Joint Chassis", ar: "شاسيه فينجر جوينت" },
      { en: "Solid Wooden Blockboard Core", ar: "نواة بلوكبورد خشبية صلبة" },
      { en: "Tubular Chipboard Core (Hollow) with MDF panels", ar: "نواة شيب بورد أنبوبي (فارغ) مع بانيلات MDF" },
      { en: "Half & Half Solid Wood Core", ar: "نواة نصف ونصف خشب صلب" },
      { en: "Half & Half Tubular Chipboard Core (solid lock section)", ar: "نواة نصف ونصف شيب بورد أنبوبي (قسم قفل صلب)" },
      { en: "Full Solid Fiberboard Core", ar: "نواة فايبر بورد صلبة بالكامل" },
      { en: "Honeycomb Core", ar: "نواة خلية النحل" },
    ],
    image: "/fancy doors.jpg",
  },
]

const groupIcon: Record<string, any> = {
  commercial: Factory,
  flush: Layers,
  paneled: PanelsTopLeft,
  structures: Boxes,
}

export function OurGloryDoors() {
  const { language, isRTL } = useLanguage()

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative py-24 bg-white dark:bg-gray-950"
    >
      {/* Decorative background: soft blobs + subtle grid */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-28 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 blur-3xl opacity-70" />
        <div className="absolute -bottom-28 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 blur-3xl opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(transparent,transparent,rgba(0,0,0,0.03))] dark:bg-[radial-gradient(transparent,transparent,rgba(255,255,255,0.03))]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white rtl:font-['Tajawal']">
            {language === "ar" ? (
              <>
                أبواب <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">جلوري</span>
              </>
            ) : (
              <>
                Our Glory <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">Doors</span>
              </>
            )}
          </h2>
          <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300 rtl:font-['Tajawal']">
            {language === "ar"
              ? "أنواع الأبواب والخامات – حلول مبتكرة وعصرية بمظهر أنيق"
              : "Door Types & Materials – Innovative, modern and elegant solutions"}
          </p>
          <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400 rtl:font-['Tajawal']">
            {language === "ar"
              ? "يمكنك لاحقًا تحويل العناصر إلى روابط أو إضافة وصف موجز لكل نوع"
              : "You can later turn items into links or add short descriptions for each type."}
          </div>
        </div>

        {/* Tabs Controller */}
        <Tabs defaultValue={groups[0]?.key} className="w-full">
          <div className="sticky top-2 z-10 mb-8">
            <TabsList className="mx-auto flex max-w-full flex-wrap gap-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur border border-gray-200 dark:border-gray-800">
              {groups.map((g) => {
                const Icon = groupIcon[g.key] ?? Hammer
                return (
                  <TabsTrigger key={g.key} value={g.key} className="data-[state=active]:shadow data-[state=active]:ring-1 data-[state=active]:ring-gray-300 dark:data-[state=active]:ring-gray-700">
                    <Icon className="h-4 w-4 opacity-70" />
                    <span className="mx-2 rtl:font-['Tajawal']">{language === "ar" ? g.title.ar : g.title.en}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </div>

          {groups.map((g, gi) => (
            <TabsContent key={g.key} value={g.key} className="focus:outline-none">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Group Hero Card */}
              <motion.div
                className="lg:col-start-1"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Card className="overflow-hidden border-gray-200/70 dark:border-gray-800/70 bg-white/70 dark:bg-gray-900/70 backdrop-blur mb-8">
                  <div className="relative h-72 md:h-96 xl:h-[32rem] w-full">
                    <motion.img
                      src={g.image}
                      alt={language === "ar" ? g.title.ar : g.title.en}
                      className="h-full w-full object-contain"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute inset-0 p-6 flex items-end">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {(() => {
                            const Icon = groupIcon[g.key] ?? Hammer
                            return <Icon className="h-5 w-5 text-white/90" />
                          })()}
                          <span className="text-white/90 text-sm rtl:font-['Tajawal']">{language === "ar" ? "مجموعة" : "Group"}</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-semibold text-white rtl:font-['Tajawal']">
                          {language === "ar" ? g.title.ar : g.title.en}
                        </h3>
                        {g.subtitle && (
                          <p className="text-white/80 text-sm mt-1 rtl:font-['Tajawal']">
                            {language === "ar" ? g.subtitle.ar : g.subtitle.en}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Items Text Grid (no images) */}
              <div className="relative lg:col-start-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {g.items.map((item, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -3 }}
                      transition={{ type: "spring", stiffness: 280, damping: 22 }}
                      className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur p-4 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        {(() => {
                          const Icon = groupIcon[g.key] ?? Hammer
                          return <Icon className="h-5 w-5 text-gray-900 dark:text-white opacity-80 mt-0.5" />
                        })()}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-semibold text-gray-900 dark:text-white rtl:font-['Tajawal']">
                              {language === "ar" ? item.ar : item.en}
                            </h4>
                            <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">#{idx + 1}</Badge>
                          </div>
                          {/* Optional description can be added here later */}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* CTA: See all doors (match projects CTA style) */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/categories/doors"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-colors"
          >
            {language === "ar" ? "عرض كل الأبواب" : "See all doors"}
            <svg
              className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
