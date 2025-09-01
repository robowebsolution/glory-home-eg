"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Award, Globe, Heart, Lightbulb, Leaf, Target, Star, ArrowRight, CheckCircle } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { AboutCeo } from "@/components/AboutCeo"
import Link from "next/link"
import Image from "next/image"

import { useEffect, useRef, useState } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { fetchCustomerImages } from "@/lib/api"

const stats = [
  { number: "15+", labelKey: "about.stats.experience", icon: Award },
  { number: "10K+", labelKey: "about.stats.customers", icon: Users },
  { number: "500+", labelKey: "about.stats.designs", icon: Lightbulb },
  { number: "50+", labelKey: "about.stats.countries", icon: Globe },
]

const values = [
  {
    icon: Heart,
    titleKey: "about.values.passion",
    descKey: "about.values.passion.desc",
  },
  {
    icon: Leaf,
    titleKey: "about.values.sustainability",
    descKey: "about.values.sustainability.desc",
  },
  {
    icon: Star,
    titleKey: "about.values.excellence",
    descKey: "about.values.excellence.desc",
  },
  {
    icon: Target,
    titleKey: "about.values.innovation",
    descKey: "about.values.innovation.desc",
  },
]

const team = [
  {
    name: "Sarah Johnson",
    role: "Founder & CEO",
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    bioKey: "about.team.sarah",
  },
  {
    name: "Michael Chen",
    role: "Head of Design",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    bioKey: "about.team.michael",
  },
  {
    name: "Emily Rodriguez",
    role: "Sustainability Director",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    bioKey: "about.team.emily",
  },
  {
    name: "David Thompson",
    role: "Technology Director",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    bioKey: "about.team.david",
  },
]

const milestones = [
  {
    year: "2009",
    titleKey: "about.journey.2009",
    descKey: "about.journey.2009.desc",
  },
  {
    year: "2012",
    titleKey: "about.journey.2012",
    descKey: "about.journey.2012.desc",
  },
  {
    year: "2015",
    titleKey: "about.journey.2015",
    descKey: "about.journey.2015.desc",
  },
  {
    year: "2018",
    titleKey: "about.journey.2018",
    descKey: "about.journey.2018.desc",
  },
  {
    year: "2021",
    titleKey: "about.journey.2021",
    descKey: "about.journey.2021.desc",
  },
  {
    year: "2025",
    titleKey: "about.journey.2025",
    descKey: "about.journey.2025.desc",
  },
]

export default function AboutPage() {
  const { t, isRTL, language } = useLanguage()

  const customersRef = useRef<HTMLDivElement | null>(null)
  const [showCustomers, setShowCustomers] = useState(false)
  const [customerImages, setCustomerImages] = useState<string[]>([])
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null)
  const [isHovering, setIsHovering] = useState(false)
  const PAGE_SIZE = 12

  // Fetch initial page when section is visible
  useEffect(() => {
    if (!showCustomers) return
    let cancelled = false
    fetchCustomerImages(PAGE_SIZE, 0)
      .then((res) => {
        if (cancelled) return
        setCustomerImages(res)
        setHasMore((res?.length || 0) === PAGE_SIZE)
      })
      .catch(() => {
        if (cancelled) return
        setCustomerImages([])
        setHasMore(false)
      })
    return () => { cancelled = true }
  }, [showCustomers])

  useEffect(() => {
    const el = customersRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowCustomers(true)
          obs.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const handleLoadMore = async () => {
    try {
      setLoadingMore(true)
      const next = await fetchCustomerImages(PAGE_SIZE, customerImages.length)
      const merged = Array.from(new Set([...customerImages, ...next]))
      setCustomerImages(merged)
      setHasMore((next?.length || 0) === PAGE_SIZE)
    } finally {
      setLoadingMore(false)
    }
  }

  // Re-init carousel when images change and preserve current slide
  useEffect(() => {
    if (!carouselApi) return
    const currentIndex = carouselApi.selectedScrollSnap()
    const t = setTimeout(() => {
      carouselApi.reInit()
      try {
        carouselApi.scrollTo(currentIndex, true)
      } catch {}
    }, 0)
    return () => clearTimeout(t)
  }, [carouselApi, customerImages.length])

  // Lightweight autoplay without external plugin
  useEffect(() => {
    if (!carouselApi) return
    const interval = setInterval(() => {
      if (!isHovering) {
        try {
          carouselApi.scrollNext()
        } catch {}
      }
    }, 2500)
    return () => clearInterval(interval)
  }, [carouselApi, isHovering])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2 }}
            className="w-full h-full bg-cover bg-center opacity-20"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
            }}
          />
        </div>

        <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center ${isRTL ? "rtl" : ""}`}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-gray-900 dark:text-white mb-6">
              {t("about.title")} <span className="font-bold">{t("about.title.bold")}</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              {t("about.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <motion.div
                  key={stat.labelKey}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">{stat.number}</div>
                  <div className="text-gray-600 dark:text-gray-300">{t(stat.labelKey)}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
      <AboutCeo/>

      {/* CEO Video Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`text-center mb-10 ${isRTL ? 'rtl' : ''}`}
          >
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 dark:text-white mb-4">
              {language === 'ar' ? 'الرئيسة التنفيذية' : 'The CEO'}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              {language === 'ar'
                ? 'منح ادوارد سولو سفير جمهورية ألبانيا وسيرجي تيرتنتييف سفير بيلاروس ومنير الإسلام سفير بنجلاديش، الدكتورة ميرنا مجدي الرئيس التنفيذي \"جلوري هوم Glory Home\"، درع التكريم لاختيارها ضمن الشخصيات الأكثر تأثيرًا خلال عام 2023.'
                : 'Edward Sulo, Ambassador of the Republic of Albania, Sergey Tertentiev, Ambassador of Belarus, and Monirul Islam, Ambassador of Bangladesh, presented Dr. Merna Magdy, CEO of Glory Home, with an honorary shield in recognition of being selected among the most influential figures of 2023.'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="relative group">
              <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5">
                <div className="relative w-full pt-[56.25%] bg-black">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src="https://www.youtube.com/embed/WTbZH8wH7aM?si=HSxwJyX9Hq_uDSFe"
                    title={language === 'ar' ? 'فيديو الرئيسة التنفيذية' : 'CEO Video'}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </motion.div>
        </div>
      </section>
      {/* Our Story Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800" style={{ contentVisibility: 'auto', containIntrinsicSize: '1000px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isRTL ? "lg:grid-cols-2" : ""}`}>
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-light text-gray-900 dark:text-white mb-6">
                {t("about.story.title")} <span className="font-bold">{t("about.story.title.bold")}</span>
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>{t("about.story.p1")}</p>
                <p>{t("about.story.p2")}</p>
                <p>{t("about.story.p3")}</p>
              </div>
              <div className={`mt-8 flex flex-wrap gap-4 ${isRTL ? "justify-start" : ""}`}>
                <div className={`flex items-center space-x-2 ${isRTL ? "space-x-reverse" : ""}`}>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">{t("about.story.sustainable")}</span>
                </div>
                <div className={`flex items-center space-x-2 ${isRTL ? "space-x-reverse" : ""}`}>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">{t("about.story.warranty")}</span>
                </div>
                <div className={`flex items-center space-x-2 ${isRTL ? "space-x-reverse" : ""}`}>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">{t("about.story.shipping")}</span>
                </div>
              </div>
            </motion.div>
              
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Our Workshop"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`text-center mb-16 ${isRTL ? "rtl" : ""}`}
          >
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 dark:text-white mb-4">
              {t("about.values.title")} <span className="font-bold">{t("about.values.title.bold")}</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{t("about.values.subtitle")}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <motion.div
                  key={value.titleKey}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t(value.titleKey)}</h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t(value.descKey)}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Our Customers / عملائنا - Carousel Section */}
      <section ref={customersRef} className="py-20 bg-gray-50 dark:bg-gray-800" style={{ contentVisibility: 'auto', containIntrinsicSize: '600px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`text-center mb-10 ${isRTL ? "rtl" : ""}`}
          >
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 dark:text-white">
              {isRTL ? "عملاؤنا" : "Our Customers"}
            </h2>
          </motion.div>

          {showCustomers && customerImages.length > 0 ? (
            <div className="relative">
              <Carousel
                className="w-full"
                opts={{ align: "start", loop: true }}
                dir={isRTL ? "rtl" : "ltr"}
                setApi={setCarouselApi}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {customerImages.map((src, idx) => (
                    <CarouselItem
                      key={idx}
                      className="pl-2 md:pl-4 basis-full sm:basis-2/3 md:basis-1/2 lg:basis-1/3"
                    >
                      <div className="group relative h-56 sm:h-64 md:h-72 overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg">
                        <Image
                          src={src}
                          alt={`Customer ${idx + 1}`}
                          fill
                          sizes="(max-width: 640px) 66vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          quality={70}
                          loading={idx === 0 ? "eager" : "lazy"}
                          priority={idx === 0}
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
              </Carousel>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <div className="w-full rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-gray-900/60 py-16 text-center">
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {isRTL ? "لا يوجد صور بعد" : "There is no images yet"}
                </p>
              </div>
            </div>
          )}

          {/* Load More */}
          {showCustomers && customerImages.length > 0 && hasMore && (
            <div className="mt-8 flex justify-center">
              <Button onClick={handleLoadMore} disabled={loadingMore} variant="outline">
                {loadingMore ? (isRTL ? "جاري التحميل..." : "Loading...") : (isRTL ? "عرض المزيد" : "Load more")}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`text-center mb-16 ${isRTL ? "rtl" : ""}`}
          >
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 dark:text-white mb-4">
              {t("about.journey.title")} <span className="font-bold">{t("about.journey.title.bold")}</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{t("about.journey.subtitle")}</p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-blue-500 to-purple-600" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`flex items-center ${
                    isRTL
                      ? index % 2 === 0
                        ? "flex-row"
                        : "flex-row-reverse"
                      : index % 2 === 0
                        ? "flex-row"
                        : "flex-row-reverse"
                  }`}
                >
                  <div
                    className={`w-1/2 ${
                      isRTL
                        ? index % 2 === 0
                          ? "pl-8 text-left"
                          : "pr-8 text-right"
                        : index % 2 === 0
                          ? "pr-8 text-right"
                          : "pl-8 text-left"
                    }`}
                  >
                    <Card className="border-0 shadow-lg">
                      <CardContent className="p-6">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">{milestone.year}</div>
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {t(milestone.titleKey)}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300">{t(milestone.descKey)}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full border-4 border-white dark:border-gray-900 shadow-lg" />
                  </div>

                  <div className="w-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center ${isRTL ? "rtl" : ""}`}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{t("about.cta.title")}</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">{t("about.cta.subtitle")}</p>
            <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? "sm:flex-row-reverse" : ""}`}>
              <Link href={'/categories'}>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 group">
                  {t("about.cta.explore")}
                  <ArrowRight
                    className={`h-4 w-4 group-hover:translate-x-1 transition-transform ${isRTL ? "mr-2 group-hover:-translate-x-1" : "ml-2"}`}
                  />
                </Button>
              </Link>
              <Link href={'/contact'}>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                  {t("about.cta.contact")}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
