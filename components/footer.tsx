"use client"

import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Facebook, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import Link from "next/link"
import Image from "next/image"
// الخطوة 1: استيراد useTheme
import { useTheme } from "next-themes"

export function Footer() {
  const { isRTL, language } = useLanguage()
  // الخطوة 2: الحصول على الثيم الحالي
  const { theme } = useTheme()

  const texts = {
    aboutText: language === 'ar' 
      ? 'جلوري هوم، تأسست عام 2017. نحن مصنع لمنتجات الأثاث والمشغولات الخشبية منذ أكثر من 6 سنوات' 
      : 'GLORY HOME, founded in 2017. We are factory for furniture products and wooden crafts for more than 6 years',
    aboutUs: language === 'ar' ? 'من نحن' : 'About us',
    contactUs: language === 'ar' ? 'تواصل معنا' : 'Contact us',
    downloadPortfolio: language === 'ar' ? 'تحميل أعمالنا' : 'Download Portofolio',
    visitUs: language === 'ar' ? 'قم بزيارة جلوري هوم' : 'Visit Glory Home',
    workTimes: language === 'ar' ? 'أوقات العمل' : 'Times Of Work',
    workHours: language === 'ar' ? 'جميع أيام الأسبوع من 11 صباحًا : 12 صباحًا' : 'All days of the week From 11AM : 12AM',
    payWith: language === 'ar' ? 'يمكنك الدفع بالتقسيط مع :' : 'You Can Pay In Installments With :',
    allBanks: language === 'ar' ? 'التقسيط متاح في جميع البنوك' : 'There are installments available in all banks',
    copyright: language === 'ar' ? 'صنع بحب بواسطة RoboWeb-solutions ' : 'made with love by RoboWeb-solutions'
  };

  const contactDetails = [
    { icon: MapPin, text: "5b central axis 6th October, Giza Egypt" },
    { icon: Phone, text: "01272020575" },
    { icon: Phone, text: "01224577773" },
    { icon: MapPin, text: "45b central axis 6th October - Giza - Egypt" },
    { icon: Mail, text: "info@gloryhome-eg.com" },
  ];
  
  const paymentLogos = [
    { src: "/souhoola.png", alt: "Souhoola" },
    { src: "/forsa-a294033f.webp", alt: "Forsa" },
    { src: "/aman-2dea0ac9.webp", alt: "Aman" },
    { src: "/value-e36957f3.webp", alt: "valU" },
    { src: "/fawry.jpg", alt: "fawry" },
    { src: "/visa_master-f4649b27.webp", alt: "Visa & Mastercard" },
  ];

  return (
    <footer 
      // الخطوة 3: تطبيق الكلاسات الديناميكية
      className="bg-gray-100 dark:bg-black text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-800"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <Link href="/" className="inline-block">
                {/* في الوضع الفاتح، نعرض شعار داكن والعكس صحيح */}
               <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-500 to-gray-300 bg-clip-text text-transparent">
                  Glory Home
                </h1>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              {texts.aboutText}
            </p>
            <div className="space-y-2 pt-2">
                <Link href="/about" className="block text-gray-900 dark:text-white hover:underline underline-offset-4 w-fit">
                    {texts.aboutUs}
                </Link>
                <Link href="/contact" className="block text-gray-900 dark:text-white hover:underline underline-offset-4 w-fit">
                    {texts.contactUs}
                </Link>
            </div>
            {/* تم تعديل الزر ليدعم الوضعين */}
            <Button variant="outline" className="bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-white dark:text-black dark:hover:bg-gray-200 w-full sm:w-auto">
              {texts.downloadPortfolio}
            </Button>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              {texts.visitUs}
            </h4>
            <ul className="space-y-3">
              {contactDetails.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={index} className="flex items-start gap-3">
                    <Icon className="w-5 h-5 mt-1 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    <span className="text-sm">{item.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              {texts.workTimes}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {texts.workHours}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              {texts.payWith}
            </h4>
            <div className="grid grid-cols-3 gap-4">
              {paymentLogos.map((logo) => (
                <div key={logo.alt} className="bg-white rounded-md p-2 flex items-center justify-center border border-gray-200">
                  <Image src={logo.src} alt={logo.alt} width={80} height={40} className="object-contain" />
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                {texts.allBanks}
            </p>
          </div>

        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-10 pt-6">
          <div className={`flex flex-col-reverse sm:flex-row justify-between items-center gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <a href="https://roboweb-offer.netlify.app/" className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors text-center sm:text-left">
              © {new Date().getFullYear()} {texts.copyright}
            </a>
            <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
              <a href="https://www.facebook.com/gloryhome2018" aria-label="Facebook" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="https://www.instagram.com/glory.home.3517/" aria-label="Instagram" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="mailto:info@gloryhome-eg.com" aria-label="Email" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"><Mail className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}