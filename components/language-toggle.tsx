"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { Globe } from "lucide-react"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en")
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="bg-gray-200 hover:bg-gray-100 backdrop-blur-sm border border-white/20 rounded-xl w-10 h-10 p-0 text-black relative overflow-hidden group"
      aria-label={language === "en" ? "Switch language to Arabic" : "Switch language to English"}
    >
      <motion.div className="flex items-center justify-center" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Globe className="h-4 w-4" aria-hidden="true" />
      </motion.div>

      {/* Language indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
      >
        {language.toUpperCase()}
      </motion.div>

      {/* Tooltip */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        {language === "en" ? "العربية" : "English"}
      </div>
    </Button>
  )
}
