"use client"

import { useState, useEffect, FC } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/lib/language-context"
import Link from "next/link"
import { useTheme } from "next-themes"
import Image from "next/image"
import { fetchCategories } from "@/lib/api"

type NavCategory = { id: string; slug: string; name: string; name_ar?: string | null }

export const Navigation: FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  // const [authModalOpen, setAuthModalOpen] = useState(false)
  // const { user, profile, signOut } = useAuth()
  const { language, t, isRTL } = useLanguage()
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  // const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [navCategories, setNavCategories] = useState<NavCategory[]>([])

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    let active = true
    ;(async () => {
      const cats = await fetchCategories()
      if (active && Array.isArray(cats)) {
        // Only keep fields we need for nav
        const mapped = cats
          .filter((c: any) => c && c.slug && c.name)
          .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
          .map((c: any) => ({ id: c.id, slug: c.slug, name: c.name, name_ar: c.name_ar }))
        setNavCategories(mapped)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  // useEffect(() => {
//     async function fetchWishlist() {
//       if (user) {
//         const wishlist = await getUserWishlist(user.id);
//         setWishlistCount(Array.isArray(wishlist) ? wishlist.length : 0);
//       } else {
//         setWishlistCount(0);
//       }
//     }
//     fetchWishlist();
//   }, [user]);
  
  if (!mounted) {
    return null; // or a skeleton loader
  }

  // تحديد الثيم الفعلي (يأخذ في الاعتبار اختيار 'system')
  const currentTheme = theme === "system" ? systemTheme : theme;
  
  // هل يجب أن يكون النص داكنًا؟ نعم، فقط إذا قمنا بالتمرير للأسفل في الوضع الفاتح
  const useDarkText =  currentTheme === 'light';

  // تعريف الألوان الديناميكية
  const textColor = useDarkText ? 'text-black/80' : 'text-black/80';
  const textHoverColor = useDarkText ? 'hover:text-black' : 'hover:text-black';
  const textFadedColor = useDarkText ? 'text-black/80' : 'text-black/80';
  const buttonBgColor = useDarkText ? 'bg-black/5 hover:bg-black/10' : 'bg-white/10 hover:bg-white/20';
  const borderColor = useDarkText ? 'border-black' : 'border-black/20';
  const dropdownBgColor = useDarkText ? 'bg-white/80 dark:bg-white/80' : 'bg-white/80 dark:bg-white/80';
  
  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        className={`fixed top-4 ${isRTL ? "right-4 left-4" : "left-4 right-4"} z-50 transition-all duration-300 bg-white/80 dark:bg-white/80 backdrop-blur-xl shadow-lg rounded-2xl
          ${scrolled
            ? "bg-white/80 dark:bg-white/80 backdrop-blur-xl shadow-lg"
            : "bg-white/80 dark:bg-white/80 backdrop-blur-xl shadow-lg"
          }
        `}
      >
        <div className={`max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 border rounded-2xl transition-colors duration-300 ${borderColor}`}>
          <div className={`flex justify-between items-center h-14 sm:h-16 ${isRTL ? "flex-row-reverse" : ""}`}>
            
            {/* Logo */}
            <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0 relative z-10">
              <Link href="/">
                <Image 
                  src="/logo.webp" 
                  alt="Logo" 
                  width={120} 
                  height={40} 
                  className="h-10 w-auto object-contain"
                />
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className={`hidden lg:flex items-center space-x-6 xl:space-x-8 ${isRTL ? "space-x-reverse" : ""}`}>
              {[
                { href: "/", labelKey: "nav.home" },
                { href: "/about", labelKey: "nav.about" },
                { href: "/projects", labelKey: "nav.projects" },
                { href: "/contact", labelKey: "nav.contact" }
              ].map(item => (
                <motion.div key={item.href} whileHover={{ y: -2, scale: 1.05 }}>
                  <Link href={item.href} className={`transition-all duration-300 font-medium relative group text-sm xl:text-base ${textFadedColor} ${textHoverColor}`}>
                    {t(item.labelKey)}
                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${useDarkText ? 'bg-black' : 'bg-black'}`}></span>
                  </Link>
                </motion.div>
              ))}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className={`flex items-center space-x-1 rounded-xl transition-all duration-300 text-sm xl:text-base ${textColor} ${buttonBgColor} ${isRTL ? "space-x-reverse" : ""}`}>
                    <span className="font-medium">{t("nav.categories")}</span>
                    <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}><ChevronDown className="h-4 w-4" aria-hidden="true" /></motion.div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={`w-56 sm:w-64 backdrop-blur-2xl border rounded-2xl shadow-2xl ${borderColor} ${dropdownBgColor}`}>
                  <div className="grid grid-cols-2 gap-1 p-2">
                    {navCategories.map((category, index) => (
                      <DropdownMenuItem key={category.slug} className={`cursor-pointer rounded-xl transition-all duration-300 p-0 ${useDarkText ? 'hover:bg-black/10' : 'hover:bg-black/10'}`}>
                        <Link href={`/categories/${category.slug}`} className="w-full px-3 py-2 block">
                          <motion.div initial={{ opacity: 0, x: isRTL ? 10 : -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.03 }} className={`text-xs sm:text-sm font-medium ${textColor}`}>
                            {language === "ar" ? (category.name_ar || category.name) : category.name}
                          </motion.div>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className={`flex items-center space-x-4 ${isRTL ? "space-x-reverse" : ""}`}>
                <LanguageToggle />
                <ThemeToggle />
              </div>
            </div>

            

            <div className={`lg:hidden flex items-center space-x-2 ${isRTL ? "space-x-reverse" : ""}`}>
              <LanguageToggle />
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className={`rounded-full ${buttonBgColor} ${textColor}`}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
                aria-controls="mobile-nav"
              >
                <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.3 }}>
                  {isOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
                </motion.div>
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className={`fixed top-20 left-4 right-4 z-40 lg:hidden rounded-b-2xl overflow-hidden backdrop-blur-xl border-x border-b ${borderColor} ${dropdownBgColor}`}
            id="mobile-nav"
          >
            <div className="px-4 sm:px-6 py-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {[
                  { href: "/", labelKey: "nav.home" },
                  { href: "/about", labelKey: "nav.about" },
                  { href: "/projects", labelKey: "nav.projects" },
                  { href: "/contact", labelKey: "nav.contact" }
              ].map(item => (
                <Link key={item.href} href={item.href} className={`block font-medium py-2 px-4 rounded-xl transition-all duration-300 ${textFadedColor} ${textHoverColor} ${useDarkText ? 'hover:bg-black/10' : 'hover:bg-black/10'}`} onClick={() => setIsOpen(false)}>
                  {t(item.labelKey)}
                </Link>
              ))}

              <div className="pt-4 border-t border-black/20">
                <p className={`text-sm font-semibold mb-3 px-4 ${textColor}`}>{t("nav.categories")}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {navCategories.map((category, index) => (
                    <motion.div key={category.slug} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.05 }}>
                      <Link href={`/categories/${category.slug}`} className={`text-sm py-2 px-3 rounded-lg block transition-all duration-300 ${textFadedColor} ${textHoverColor} ${useDarkText ? 'hover:bg-black/10' : 'hover:bg-black/10'}`} onClick={() => setIsOpen(false)}>
                        {language === "ar" ? (category.name_ar || category.name) : category.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* User-related UI commented out */}
              {/* {!user ? (
                <div className="pt-4 border-t border-white/20 space-y-2">
                  <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className={`w-full justify-start ${textColor} ${useDarkText ? 'hover:bg-black/10' : 'hover:bg-white/20'} rounded-xl`}>
                      {t("nav.signin")}
                    </Button>
                  </Link>
                  <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 rounded-xl">
                      {t("nav.signup")}
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="pt-4 border-t border-white/20 space-y-2">
                  <div className={`flex items-center space-x-3 px-4 py-2 ${isRTL ? "space-x-reverse" : ""}`}>
                    <Avatar className="w-8 h-8"><AvatarImage src={profile?.avatar_url || ""} /><AvatarFallback className="text-xs bg-gray-600 text-white">{profile?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}</AvatarFallback></Avatar>
                    <span className={`text-sm ${textColor}`}>{profile?.full_name || user.email?.split("@")[0]}</span>
                  </div>
                  <Button onClick={() => { signOut(); setIsOpen(false); }} variant="ghost" className={`w-full justify-start ${textColor} ${useDarkText ? 'hover:bg-black/10' : 'hover:bg-white/20'} rounded-xl`}>
                    <LogOut className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />{t("nav.signout")}
                  </Button>
                </div>
              )} */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </>
  )
}