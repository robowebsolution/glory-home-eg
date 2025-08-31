"use client";

// الخطوة 1: استيراد الأنواع اللازمة
import React, { useState, useEffect, FC, ElementType } from "react"; 
// import { addToWishlist, removeFromWishlist, buyNowOrder, getUserWishlist } from "@/lib/api";
import { supabase } from "@/lib/supabase-client";
// ✅  1. تم تغيير الاستيراد هنا
import { useToast } from "@/hooks/use-toast";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
   Share2, Star, Shield, Truck, RotateCcw, Award, Play, ChevronLeft, ChevronRight, Eye, Info, Package, Zap, X,
  Phone,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useTheme } from "next-themes";
import { useLanguage } from "@/lib/language-context";
// الخطوة 2: تصحيح مسار استيراد الواجهة
import type { Product } from "@/lib/supabase";

// الخطوة 3: تعريف أنواع (interfaces) واضحة للـ Props والمصفوفات
interface ProductClientPageProps {
  product: Product;
}

interface Indicator {
  icon: ElementType;
  text: string;
}

interface Tab {
  id: string;
  label: string;
  icon: ElementType;
}

interface Specification {
    label: string;
    value: string | number | null;
}

// استخدام FC (Function Component) لتحديد نوع المكون بشكل صريح
export const ProductClientPage: FC<ProductClientPageProps> = ({ product }) => {
  // ✅ 2. تم استدعاء الـ Hook هنا
  const { toast } = useToast();
  const { theme } = useTheme();
  const { isRTL, language } = useLanguage(); 
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  // const [quantity, setQuantity] = useState(product.min_order_quantity || 1);
  // const [isWishlisted, setIsWishlisted] = useState(false);
  // const [wishlistLoading, setWishlistLoading] = useState(false);
  // const [buyNowOpen, setBuyNowOpen] = useState(false);
  // const [buyNowLoading, setBuyNowLoading] = useState(false);
  // const [buyerName, setBuyerName] = useState("");
  // const [buyerPhone, setBuyerPhone] = useState("");
  // const [buyNowSuccess, setBuyNowSuccess] = useState<string | null>(null);
  // const [buyNowError, setBuyNowError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // جلب المستخدم الحالي من supabase
  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  /* // تحقق من حالة المنتج في wishlist عند التحميل
  useEffect(() => {
    async function checkWishlist() {
      if (!user) return;
      const wishlist = await getUserWishlist(user.id);
      setIsWishlisted(Array.isArray(wishlist) && wishlist.some((p: any) => p?.id === product.id));
    }
    checkWishlist();
  }, [user, product.id]); */

  const [activeTab, setActiveTab] = useState('description');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [similarLoading, setSimilarLoading] = useState<boolean>(false);

  // Helpers: normalize image values to strings and decide if next/image can be used
  const ALLOWED_HOSTS = new Set([
    'haevprzeuadrclhiobqo.supabase.co',
    'res.cloudinary.com',
    'images.unsplash.com',
    'picsum.photos',
  ]);
  const toImageUrl = (v: any): string => {
    if (typeof v === 'string') return v;
    if (v && typeof v.value === 'string') return v.value;
    return '';
  };
  const isAllowedNextImage = (src: string) => {
    try {
      if (!src) return false;
      if (src.startsWith('/')) return true;
      const u = new URL(src);
      return u.protocol === 'https:' && ALLOWED_HOSTS.has(u.hostname);
    } catch {
      return false;
    }
  };

  const images = [
    toImageUrl(product.main_image as any),
    ...((product.gallery_images as any[] | undefined)?.map(toImageUrl) || [])
  ].filter((img, index, self): img is string => !!img && self.indexOf(img) === index);
  
  if (images.length === 0) {
    images.push("/placeholder.svg");
  }

  const originalPrice = product.price;
  const salePrice = product.sale_price;
  const isSale = product.is_sale && salePrice != null && originalPrice != null && salePrice < originalPrice;
  const currentPrice = isSale ? salePrice : originalPrice;
  const discountPercentage = isSale
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    : 0;

  /* const updateQuantity = (newQuantity: number) => {
    const min = product.min_order_quantity || 1;
    const max = product.max_order_quantity || product.stock_quantity || 999;
    const validQuantity = Math.max(min, Math.min(max, newQuantity));
    setQuantity(validQuantity);
  }; */

  const nextImage = () => setSelectedImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);

  // Copy current product link to clipboard and show a toast
  const handleShareClick = async () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/products/${product.id}` : '';
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: language === 'ar' ? 'تم نسخ الرابط' : 'Link copied',
        description: language === 'ar' ? 'تم حفظ رابط المنتج في الحافظة.' : 'Product link has been copied to your clipboard.'
      });
    } catch (err) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        toast({
          title: language === 'ar' ? 'تم نسخ الرابط' : 'Link copied',
          description: language === 'ar' ? 'تم حفظ رابط المنتج في الحافظة.' : 'Product link has been copied to your clipboard.'
        });
      } catch (e) {
        toast({
          title: language === 'ar' ? 'تعذر النسخ' : 'Copy failed',
          description: language === 'ar' ? 'يرجى نسخ الرابط يدويًا.' : 'Please copy the link manually.',
          variant: 'destructive'
        });
      }
    }
  };

  // Fetch similar products by category
  useEffect(() => {
    let isCancelled = false;
    async function fetchSimilar() {
      if (!product?.category_id) {
        setSimilarProducts([]);
        return;
      }
      try {
        setSimilarLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*, categories(*)')
          .eq('category_id', product.category_id)
          .eq('in_stock', true)
          .neq('id', product.id)
          .order('featured', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(4);
        if (!isCancelled) {
          if (error) {
            console.error('Error fetching similar products:', error.message);
            setSimilarProducts([]);
          } else {
            setSimilarProducts(data || []);
          }
        }
      } finally {
        if (!isCancelled) setSimilarLoading(false);
      }
    }
    fetchSimilar();
    return () => { isCancelled = true };
  }, [product.id, product.category_id]);

  const trustIndicators: Indicator[] = [
    { icon: Shield, text: language === 'ar' ? 'دفع آمن' : 'Secure Payment' },
    { icon: Truck, text: language === 'ar' ? 'شحن مجاني' : 'Free Shipping' },
    { icon: RotateCcw, text: language === 'ar' ? 'إرجاع سهل' : 'Easy Returns' },
    { icon: Award, text: language === 'ar' ? 'ضمان الجودة' : 'Quality Guarantee' }
  ];

  const tabs: Tab[] = [
    { id: 'description', label: language === 'ar' ? 'الوصف' : 'Description', icon: Info },
    { id: 'specifications', label: language === 'ar' ? 'المواصفات' : 'Specifications', icon: Package },
    { id: 'shipping', label: language === 'ar' ? 'الشحن والإرجاع' : 'Shipping & Returns', icon: Truck },
    
  ];
  
  if (!mounted) {
    return null; 
  }

  /* // ✅ 3. تم تعديل هذه الدالة بالكامل لاستخدام toast() بحرف صغير
  const handleWishlistToggle = async () => {
    if (!user) {
      toast({
        title: language === "ar" ? "سجّل الدخول أولاً" : "Please login first",
        variant: "destructive"
      });
      return;
    }
    setWishlistLoading(true);
    try {
      if (isWishlisted) {
        const res = await removeFromWishlist(user.id, product.id);
        console.log('removeFromWishlist result:', res);
        if (res?.success) {
          setIsWishlisted(false);
          toast({
            title: language === "ar" ? "تمت الإزالة من المفضلة" : "Removed from wishlist",
            variant: "default"
          });
        } else {
          toast({
            title: language === "ar" ? "حدث خطأ أثناء الإزالة" : "Failed to remove",
            variant: "destructive"
          });
        }
      } else {
        const res = await addToWishlist(user.id, product.id);
        console.log('addToWishlist result:', res);
        if (res?.success) {
          setIsWishlisted(true);
          toast({
            title: language === "ar" ? "تمت الإضافة للمفضلة" : "Added to wishlist",
            variant: "default"
          });
        } else {
          toast({
            title: language === "ar" ? "حدث خطأ أثناء الإضافة" : "Failed to add",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error("Wishlist toggle failed:", error);
      toast({
        title: language === "ar" ? "حدث خطأ غير متوقع" : "An unexpected error occurred",
        variant: "destructive"
      });
    } 
    finally {
      setWishlistLoading(false);
    }
  }; */

  /* // ✅ 4. تم تعديل هذه الدالة أيضاً
  const isValidEgyptianPhoneNumber = (phone: string): boolean => {
    const egyptianPhoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;
    return egyptianPhoneRegex.test(phone);
  };

  const handleBuyNow = async () => {
    if (!user || !user.id || !user.email) {
      setBuyNowError(language === "ar" ? "سجّل الدخول أولاً بحساب صالح" : "Please login with a valid account first");
      setBuyNowLoading(false);
      return;
    }
    if (!buyerName || !buyerPhone) {
      setBuyNowError(language === "ar" ? "يرجى إدخال الاسم ورقم الهاتف" : "Please enter name and phone number");
      setBuyNowLoading(false);
      return;
    }
    if (!isValidEgyptianPhoneNumber(buyerPhone)) {
      setBuyNowError(language === "ar" ? "رقم الهاتف غير صالح" : "Invalid phone number");
      setBuyNowLoading(false);
      return;
    }
    setBuyNowLoading(true);
    setBuyNowSuccess(null);
    setBuyNowError(null);
    try {
      const res = await buyNowOrder({
        userId: user.id,
        name: buyerName,
        phone: buyerPhone,
        email: user.email,
        productId: product.id,
        quantity,
        price: currentPrice
      });
      if (res.success) {
        setBuyNowOpen(false);
        toast({
          title: language === "ar" 
          ? "تم تسجيل طلبك بنجاح! سيتواصل معك أحد ممثلي خدمة العملاء لإكمال عملية الشراء." 
            : "Your order has been placed! A customer service representative will contact you to complete the purchase.",
          variant: "default"
        });
        setBuyerName("");
        setBuyerPhone("");
      } else {
        setBuyNowError(language === "ar" ? "حدث خطأ أثناء تنفيذ الطلب" : "Failed to place order");
      }
    } catch {
      setBuyNowError(language === "ar" ? "حدث خطأ غير متوقع" : "Unexpected error");
    } finally {
      setBuyNowLoading(false);
    }
  }; */

  // أعلى الكومبوننت مباشرة بعد المتغيرات:


  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        theme === "dark" 
          ? "bg-gray-950 text-gray-200" 
          : "bg-gray-50 text-gray-800"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
      lang={language}
    >
      <Navigation />
      
      <div className={`fixed top-24 ${isRTL ? 'left-4' : 'right-4'} z-40 flex flex-col items-start gap-2`}>
        {product.is_new && (
          <motion.div initial={{opacity:0, x: isRTL ? -20: 20}} animate={{opacity:1, x:0}} transition={{delay: 0.5}} className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
            <Zap className="w-3 h-3" />{language === 'ar' ? 'جديد' : 'NEW'}
          </motion.div>
        )}
        {product.is_sale && (
          <motion.div initial={{opacity:0, x: isRTL ? -20: 20}} animate={{opacity:1, x:0}} transition={{delay: 0.6}} className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            {language === 'ar' ? `خصم ${discountPercentage}%` : `${discountPercentage}% OFF`}
          </motion.div>
        )}
        {product.featured && (
          <motion.div initial={{opacity:0, x: isRTL ? -20: 20}} animate={{opacity:1, x:0}} transition={{delay: 0.7}} className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />{language === 'ar' ? 'مميز' : 'FEATURED'}
          </motion.div>
        )}
      </div>

      <main className="max-w-7xl mx-auto pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

          {/* Left Column: Image Gallery */}
          <section className="lg:w-1/2 w-full lg:sticky top-28 self-start space-y-4">
            <div className="relative group">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-white dark:bg-gray-800 shadow-2xl">
                <AnimatePresence initial={false}>
                  <motion.div key={selectedImageIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute inset-0">
                    {isAllowedNextImage(images[selectedImageIndex]) ? (
                      <Image
                        src={images[selectedImageIndex]}
                        alt={`${product.name} - image ${selectedImageIndex + 1}`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    ) : (
                      <img
                        src={images[selectedImageIndex]}
                        alt={`${product.name} - image ${selectedImageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
                
                {images.length > 1 && (
                  <>
                    <button onClick={isRTL ? nextImage : prevImage} className={`absolute ${isRTL ? 'right-4':'left-4'} top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900 p-2 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100`}>
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={isRTL ? prevImage : nextImage} className={`absolute ${isRTL ? 'left-4':'right-4'} top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900 p-2 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100`}>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                
                {product.video_url && (
                  <button onClick={() => setShowVideoModal(true)} className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300">
                    <Play className="w-5 h-5" />
                  </button>
                )}

                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                    {selectedImageIndex + 1} / {images.length}
                  </div>
                )}
              </div>
            </div>
            
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button key={idx} onClick={() => setSelectedImageIndex(idx)} className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all duration-300 ${selectedImageIndex === idx ? "ring-2 ring-black shadow-lg scale-105 dark:ring-white" : "ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-gray-300 dark:hover:ring-gray-600"}`} >
                    {isAllowedNextImage(img) ? (
                      <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" sizes="80px" />
                    ) : (
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Right Column: Product Details */}
          <section className="lg:w-1/2 w-full space-y-8">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                  {language === "ar" && product.name_ar ? product.name_ar : product.name}
                </h1>
                <button
                  type="button"
                  onClick={handleShareClick}
                  aria-label={language === 'ar' ? 'مشاركة المنتج' : 'Share product'}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 flex-shrink-0"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <div className="flex">{[...Array(5)].map((_, i) => (<Star key={i} className="w-4 h-4 text-gray-900 dark:text-gray-100 fill-current" />))}</div>
                  <span className="font-medium">4.8 (124 {language === 'ar' ? 'تقييمات' : 'reviews'})</span>
                </div>
                <div className="flex items-center gap-1"><Eye className="w-4 h-4" /><span>2.1k {language === 'ar' ? 'مشاهدات' : 'views'}</span></div>
              </div>

              {currentPrice != null && (
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                    {new Intl.NumberFormat(language === "ar" ? "ar-EG" : "en-US", { style: "currency", currency: "EGP" }).format(currentPrice)}
                  </span>
                  {product.is_sale && originalPrice && (
                    <span className="text-xl font-medium text-gray-400 line-through">
                      {new Intl.NumberFormat(language === "ar" ? "ar-EG" : "en-US", { style: "currency", currency: "EGP" }).format(originalPrice)}
                    </span>
                  )}
                </div>
              )}

              {/* Order Now Button */}
              <a
                href="tel:+201220744418"
                className="block w-full mt-4"
                style={{direction: isRTL ? 'rtl' : 'ltr'}}
              >
                <Button
                  size="lg"
                  className="w-full bg-black hover:bg-gray-900 text-white font-bold py-3 shadow-lg hover:shadow-xl transition-all duration-300 text-lg rounded-xl flex items-center justify-center gap-2"
                  style={{fontFamily: 'inherit'}}
                >
                  <Phone className="w-5 h-5" />
                  {language === 'ar' ? 'اطلبه الآن' : 'Order Now'}
                </Button>
              </a>
            </div>

            
            {/* Elegant Specifications Section */}


            <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-6 border-t border-gray-200 dark:border-gray-800">
              {trustIndicators.map((indicator, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <indicator.icon className="w-5 h-5 text-gray-900 dark:text-gray-100 flex-shrink-0" />
                  <span>{indicator.text}</span>
                </div>
              ))}
            </div>

            {/* Tabs Section */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav className={`flex gap-x-2 sm:gap-x-8 px-4 sm:px-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {tabs.map((tab) => (
                      <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 py-4 px-1 sm:px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id ? 'border-black text-black dark:text-white' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`} >
                        <tab.icon className="w-4 h-4" />{tab.label}
                      </button>
                    ))}
                  </nav>
                </div>
                
                <div className="p-6 sm:p-8 min-h-[200px]">
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                            {activeTab === 'description' && (
                                <div className="space-y-6">
                                    <div className="prose prose-lg dark:prose-invert max-w-none leading-relaxed">
                                        <p>{language === "ar" && product.description_ar ? product.description_ar : product.description}</p>
                                    </div>
                                    {((language === "ar" && product.care_instructions_ar) || product.care_instructions_en) && (
                                        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl mt-8">
                                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                                                <Info className="w-5 h-5" />
                                                {language === 'ar' ? 'تعليمات العناية' : 'Care Instructions'}
                                            </h3>
                                            <p className="text-gray-700 dark:text-gray-300 text-sm">{language === "ar" ? product.care_instructions_ar : product.care_instructions_en}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                            {activeTab === 'specifications' && (
                                <div>
                                  {(typeof product.specifications === 'string' && product.specifications.trim() !== '') ? (
                                    <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                                      {product.specifications}
                                    </div>
                                  ) : (
                                    <p className="text-gray-500">{language === 'ar' ? 'لا توجد مواصفات متاحة.' : 'No specifications available.'}</p>
                                  )}
                                </div>
                              )}
                            {activeTab === 'shipping' && (
                                <div className="space-y-8">
                                    <div className="text-center prose dark:prose-invert max-w-lg mx-auto">
                                        <h2>{language === 'ar' ? 'الشحن والإرجاع' : 'Shipping & Returns'}</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                                        <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                            <Truck className="w-8 h-8 text-gray-900 dark:text-gray-100 mx-auto mb-3" />
                                            <h3 className="font-semibold mb-2">{language === 'ar' ? 'شحن مجاني' : 'Free Shipping'}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{language === 'ar' ? 'للطلبات فوق 50 دولار' : 'On orders over $50'}</p>
                                        </div>
                                        <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                            <Clock className="w-8 h-8 text-gray-900 dark:text-gray-100 mx-auto mb-3" />
                                            <h3 className="font-semibold mb-2">{language === 'ar' ? 'توصيل سريع' : 'Fast Delivery'}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{language === 'ar' ? '2-3 أيام عمل' : '2-3 business days'}</p>
                                        </div>
                                        <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                            <RotateCcw className="w-8 h-8 text-gray-900 dark:text-gray-100 mx-auto mb-3" />
                                            <h3 className="font-semibold mb-2">{language === 'ar' ? 'إرجاع سهل' : 'Easy Returns'}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{language === 'ar' ? 'سياسة إرجاع خلال 30 يومًا' : '30-day return policy'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                        </motion.div>
                    </AnimatePresence>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Similar Products Section */}
      {(similarLoading || similarProducts.length > 0) && (
        <section className="max-w-7xl mx-auto pb-16 px-4 sm:px-6 lg:px-8">
          <div className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {language === 'ar' ? 'منتجات مشابهة' : 'Similar Products'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {language === 'ar' ? 'منتجات من نفس الفئة قد تهمك' : 'Products from the same category you might like'}
            </p>
          </div>

          {similarLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square w-full rounded-2xl bg-gray-200 dark:bg-gray-800" />
                  <div className="h-4 mt-4 rounded bg-gray-200 dark:bg-gray-800 w-3/4" />
                  <div className="h-6 mt-3 rounded bg-gray-200 dark:bg-gray-800 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            similarProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarProducts.map((p) => (
                  <Link key={p.id} href={`/products/${p.id}`} className="group block">
                    <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl transition-all duration-300">
                      <div className="relative aspect-square w-full overflow-hidden">
                        {(() => {
                          const src = toImageUrl(p.main_image as any) || "/placeholder.svg";
                          return isAllowedNextImage(src) ? (
                            <Image
                              src={src}
                              alt={(language === 'ar' && p.name_ar) ? p.name_ar : p.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              sizes="(max-width: 1024px) 50vw, 25vw"
                            />
                          ) : (
                            <img
                              src={src}
                              alt={(language === 'ar' && p.name_ar) ? p.name_ar : p.name}
                              className="w-full h-full object-cover"
                            />
                          );
                        })()}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </div>
                      <div className="p-4">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2">
                          {language === 'ar' && p.name_ar ? p.name_ar : p.name}
                        </h3>
                        {p.price != null && (
                          <div className="mt-2 flex items-baseline gap-2">
                            {p.sale_price != null && p.sale_price < p.price ? (
                              <>
                                <span className="text-lg font-bold text-gray-900 dark:text-white">
                                  {new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US', { style: 'currency', currency: 'EGP' }).format(p.sale_price)}
                                </span>
                                <span className="text-sm text-gray-500 line-through">
                                  {new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US', { style: 'currency', currency: 'EGP' }).format(p.price)}
                                </span>
                              </>
                            ) : (
                              <span className="text-lg font-bold text-gray-900 dark:text-white">
                                {new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US', { style: 'currency', currency: 'EGP' }).format(p.price)}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )
          )}
        </section>
      )}

      <AnimatePresence>
        {showVideoModal && product.video_url && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4" onClick={() => setShowVideoModal(false)}>
                <motion.div initial={{scale: 0.8}} animate={{scale: 1}} exit={{scale: 0.8}} className="relative max-w-4xl w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setShowVideoModal(false)} className="absolute top-2 right-2 z-10 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-all"><X className="w-5 h-5"/></button>
                    <iframe src={product.video_url.replace("watch?v=", "embed/")} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Product Video" />
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
      {/* Popup الشراء الآن 
      <AnimatePresence>
        {buyNowOpen && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
            <motion.div initial={{scale:0.9}} animate={{scale:1}} exit={{scale:0.9}} className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-8 relative flex flex-col gap-4">
              <button onClick={()=>setBuyNowOpen(false)} className="absolute top-3 right-3 bg-gray-100 dark:bg-gray-800 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><X className="w-5 h-5"/></button>
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white text-center">{language === "ar" ? "تأكيد الشراء" : "Confirm Purchase"}</h2>
              <div className="flex items-center gap-4 mb-4">
                <Image src={images[0]} alt={product.name} width={70} height={70} className="rounded-xl object-cover border" />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{language === "ar" && product.name_ar ? product.name_ar : product.name}</div>
                  <div className="text-gray-500 text-sm">{quantity} × {new Intl.NumberFormat(language === "ar" ? "ar-EG" : "en-US", { style: "currency", currency: "EGP" }).format(currentPrice)}</div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <input type="text" className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" placeholder={language === "ar" ? "اسمك الكامل" : "Full Name"} value={buyerName} onChange={e => setBuyerName(e.target.value)} disabled={buyNowLoading} />
                <input type="tel" className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" placeholder={language === "ar" ? "رقم الهاتف" : "Phone Number"} value={buyerPhone} onChange={e => setBuyerPhone(e.target.value)} disabled={buyNowLoading} />
                <input type="email" className="border rounded-lg px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-400" value={user?.email || ""} disabled readOnly />
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="font-medium text-lg">{language === "ar" ? "الإجمالي" : "Total"}:</span>
                <span className="font-bold text-2xl text-blue-600">{new Intl.NumberFormat(language === "ar" ? "ar-EG" : "en-US", { style: "currency", currency: "EGP" }).format(currentPrice * quantity)}</span>
              </div>
              {buyNowError && <div className="text-red-600 text-center mt-2">{buyNowError}</div>}
              {buyNowSuccess && <div className="text-green-600 text-center mt-2">{buyNowSuccess}</div>}
              <Button size="lg" className="w-full mt-4" onClick={handleBuyNow} disabled={buyNowLoading}>{buyNowLoading ? (language === "ar" ? "...جاري التنفيذ" : "Processing...") : (language === "ar" ? "تأكيد الطلب" : "Confirm Order")}</Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence> */}
      <Footer />
    </div>
  );
}