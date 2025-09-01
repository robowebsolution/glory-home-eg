"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/language-context"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { fetchCustomerImages } from "@/lib/api"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function OurCustomers() {
  const { isRTL } = useLanguage()
  const [customerImages, setCustomerImages] = useState<string[]>([])
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null)
  const customersRef = useRef<HTMLDivElement | null>(null)
  const [showCustomers, setShowCustomers] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
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

  // Mount carousel only when near viewport to reduce initial work
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

  // Re-init carousel when images change and preserve current slide
  useEffect(() => {
    if (!carouselApi) return
    const currentIndex = carouselApi.selectedScrollSnap()
    const t = setTimeout(() => {
      carouselApi.reInit()
      // Restore previous position to avoid jumping to the first slide
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

  const handleLoadMore = async () => {
    try {
      setLoadingMore(true)
      const next = await fetchCustomerImages(PAGE_SIZE, customerImages.length)
      // Deduplicate in case of overlaps
      const merged = Array.from(new Set([...customerImages, ...next]))
      setCustomerImages(merged)
      setHasMore((next?.length || 0) === PAGE_SIZE)
    } finally {
      setLoadingMore(false)
    }
  }

  return (
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
              dir={isRTL ? "rtl" : "ltr"}
              setApi={setCarouselApi}
              opts={{ align: "start", loop: true, containScroll: "trimSnaps", slidesToScroll: 1 }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <CarouselContent>
                {customerImages.map((src, idx) => (
                  <CarouselItem
                    key={idx}
                    className={"basis-full sm:basis-2/3 md:basis-1/2 lg:basis-1/3"}
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
  )
}
