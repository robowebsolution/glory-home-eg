"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/lib/language-context"
import { Wrench, Palette, ShieldCheck } from "lucide-react"
import type { ElementType } from "react"

type TDItem = {
  id: string
  title: { en: string; ar: string }
  desc: { en: string; ar: string }
}

const DRAWINGS: TDItem[] = [
  {
    id: "01",
    title: {
      en: "SOLID WOOD CHASSIS WITHOUT MIDDLE ARM",
      ar: "هيكل خشبي صلب بدون عارضة وسطية",
    },
    desc: {
      en: "Solid wood chassis without middle arm. The inner frame of the door leaf is made entirely of solid wood, with 2 longitudinal stiles, one top rail, and one bottom rail, without a middle rail. There is an extent for a door lock.",
      ar: "هيكل من الخشب الصلب بدون عارضة وسطية. الإطار الداخلي لورقة الباب مصنوع بالكامل من الخشب الصلب، مع قائمتين طوليّتين، عارضة علوية، وعرَضة سفلية، بدون عارضة وسطية. يوجد تدعيم لموضع قفل الباب.",
    },
  },
  {
    id: "02",
    title: {
      en: "SOLID WOOD CHASSIS WITH MIDDLE ARM",
      ar: "هيكل خشبي صلب مع عارضة وسطية",
    },
    desc: {
      en: "The inner frame of the door leaf is made entirely of solid wood, with 2 longitudinal stiles, one top rail, and one bottom rail, with a middle rail. There is an extent for door lock.",
      ar: "الإطار الداخلي لورقة الباب مصنوع بالكامل من الخشب الصلب، مع قائمتين طوليّتين، عارضة علوية، وعرَضة سفلية، مع عارضة وسطية. يوجد تدعيم لموضع قفل الباب.",
    },
  },
  {
    id: "03",
    title: { en: "FINGER JOINT CHASSIS", ar: "هيكل بمفاصل الإصبع (Finger Joint)" },
    desc: {
      en: "The inner frame of the door leaf is made entirely of solid wood connected by a finger joint manner. A finger joint machine connects all rails and stiles.",
      ar: "الإطار الداخلي لورقة الباب مصنوع بالكامل من الخشب الصلب وموصول بطريقة الفينجر جوينت. تقوم آلة Finger Joint بربط جميع العوارض والقوائم.",
    },
  },
  {
    id: "04",
    title: { en: "SOLID WOODEN BLOCKBOARD CORE", ar: "نواة بلوكبورد خشبية صلبة" },
    desc: {
      en: "The core of the door leaf consists of a blockboard without veneer with a thickness ranging from 39 mm to 45 mm, suitable for covering with MDF panels and various types of veneers or laminates.",
      ar: "تتكون نواة ورقة الباب من بلوكبورد بدون قشرة بسماكة تتراوح من 39 مم إلى 45 مم، ومناسبة لتغليفها بألواح MDF وأنواع مختلفة من القشرات أو المواد اللاصقة.",
    },
  },
  {
    id: "05",
    title: { en: "TUBULAR CHIPBOARD CORE", ar: "نواة لوح حبيبي أنبوبي (مجوف)" },
    desc: {
      en: "After manufacturing the chassis, the internal core is filled with tubular chipboard (hollow core) which is covered with MDF panels.",
      ar: "بعد تصنيع الهيكل، تُملأ النواة الداخلية بلوح حبيبي أنبوبي (نواة مجوّفة) ثم تُغطى بألواح MDF.",
    },
  },
  {
    id: "06",
    title: { en: "HALF AND HALF SOLID WOOD CORE", ar: "نواة خشب صلب نصف ونصف" },
    desc: {
      en: "The internal core is filled with 50% solid wood sections and then covered with MDF panels or any other panels.",
      ar: "تُملأ النواة الداخلية بنسبة 50% من قطاعات الخشب الصلب، ثم تُغطى بألواح MDF أو أي ألواح أخرى.",
    },
  },
  {
    id: "07",
    title: { en: "HALF AND HALF TUBULAR CHIPBOARD CORE", ar: "نواة لوح حبيبي أنبوبي نصف ونصف" },
    desc: {
      en: "After manufacturing the chassis, the internal core is filled with 50% hollow chipboard sections with an extent at the middle of the door leaf to ensure that the door lock is installed in solid wood.",
      ar: "بعد تصنيع الهيكل، تُملأ النواة الداخلية بنسبة 50% من قطاعات اللوح الحبيبي المجوف مع تدعيم في منتصف ورقة الباب لضمان تركيب قفل الباب في الخشب الصلب.",
    },
  },
  {
    id: "08",
    title: { en: "FULL SOLID FIBERBOARD", ar: "نواة ألياف خشبية صلبة بالكامل" },
    desc: { en: "The core is completely made of solid fiberboard.", ar: "النواة مصنوعة بالكامل من ألواح ألياف خشبية صلبة." },
  },
  {
    id: "09",
    title: { en: "RECYCLED WOODEN CELLS", ar: "خلايا خشبية معاد تدويرها" },
    desc: {
      en: "In this type, the core is manufactured from recycled wood to produce low-cost doors while maintaining the high manufacturing quality that distinguishes Najjar Company.",
      ar: "في هذا النوع، تُصنع النواة من خشب معاد تدويره لإنتاج أبواب منخفضة التكلفة مع الحفاظ على جودة التصنيع العالية التي تميّز شركة نجّار.",
    },
  },
  {
    id: "10",
    title: { en: "HONEYCOMB CORE", ar: "نواة قرص العسل" },
    desc: {
      en: "It is an inner core material used for different doors and is honeycomb-shaped (hence, named a honeycomb door).",
      ar: "مادة نواة داخلية تُستخدم لأنواع مختلفة من الأبواب، ذات شكل قرص العسل (ومن هنا جاءت التسمية).",
    },
  },
  {
    id: "11",
    title: { en: "CARVING / INLAY OPTIONS", ar: "خيارات الحفر / التطعيم" },
    desc: {
      en: "Customized metal/wood trim inlay, and profile carving, sometimes changing a boring flush door design to a unique and beautiful one.",
      ar: "تطعيمات مخصصة من المعدن/الخشب وحفر للبروفايل، قد تُحوّل أحيانًا بابًا بسيطًا إلى تصميم فريد وجميل.",
    },
  },
]

type Feature = {
  icon: ElementType
  title: { en: string; ar: string }
  desc: { en: string; ar: string }
}

const FEATURES: Feature[] = [
  {
    icon: Wrench,
    title: { en: "Quick Installation", ar: "تركيب سريع" },
    desc: {
      en: "Our doors are easy to install, saving you time and effort.",
      ar: "أبوابنا سهلة التركيب، مما يوفر عليك الوقت والجهد.",
    },
  },
  {
    icon: Palette,
    title: { en: "Customizable Designs", ar: "تصاميم قابلة للتخصيص" },
    desc: {
      en: "Unique finishes to enhance your door's beauty and durability.",
      ar: "تشطيبات فريدة لتعزيز جمال بابك ومتانته.",
    },
  },
  {
    icon: ShieldCheck,
    title: { en: "5 Years Warranty", ar: "ضمان 5 سنوات" },
    desc: {
      en: "Our furniture is backed by a 5-year warranty, giving you peace of mind and assurance in your investment.",
      ar: "منتجاتنا مدعومة بضمان لمدة 5 سنوات، مما يمنحك راحة بال وثقة في استثمارك.",
    },
  },
]

export function TechnicalDrawings() {
  const { language, isRTL } = useLanguage()
  const heading = language === "ar" ? "الرسومات الفنية" : "TECHNICAL DRAWINGS"

  return (
    <section id="technical-drawings" dir={isRTL ? "rtl" : "ltr"} className="relative py-24 bg-gray-50 dark:bg-neutral-950">
      {/* Decorative background: soft gradient blobs + subtle grid */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 blur-3xl opacity-70" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 blur-3xl opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,theme(colors.gray.100/.6),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,theme(colors.white/.05),transparent_60%)]" />
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
          >
            {heading}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-gray-400/50 to-transparent dark:via-white/20"
          />
        </div>

        {/* Cards Grid */
        }
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {DRAWINGS.map((item, idx) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: idx * 0.04 }}
              className="relative group rounded-2xl border border-gray-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-sm shadow-sm overflow-hidden"
            >
              {/* Accent gradient strip */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-neutral-300 dark:to-white opacity-60" />

              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Number badge */}
                  <div className="shrink-0 rounded-full bg-gray-900 text-white dark:bg-white dark:text-black h-12 w-12 flex items-center justify-center font-semibold tracking-wider shadow-sm">
                    {item.id}
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 leading-snug">
                      {language === "ar" ? item.title.ar : item.title.en}
                    </h3>
                    <p className="mt-2 text-sm md:text-[15px] leading-relaxed text-gray-600 dark:text-gray-300">
                      {language === "ar" ? item.desc.ar : item.desc.en}
                    </p>
                  </div>
                </div>

                {/* Hover action line */}
                <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-gray-300/70 to-transparent dark:via-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Hover lift effect */}
              <div className="absolute inset-0 -z-10 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 rounded-2xl bg-gradient-to-br from-gray-100 to-white dark:from-white/[0.06] dark:to-white/[0.02]" />
            </motion.article>
          ))}
        </div>

        {/* Feature highlights under the section */}
        <div className="mt-16">
          <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-gray-400/50 to-transparent dark:via-white/15" />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="group rounded-2xl border border-gray-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 h-12 w-12 rounded-full bg-gray-900 text-white dark:bg-white dark:text-black flex items-center justify-center shadow-sm">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {language === "ar" ? f.title.ar : f.title.en}
                      </h4>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        {language === "ar" ? f.desc.ar : f.desc.en}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TechnicalDrawings
