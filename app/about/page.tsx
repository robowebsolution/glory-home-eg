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
  const { t, isRTL } = useLanguage()

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
      {/* Our Story Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
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

      {/* Team Section */}
      

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
