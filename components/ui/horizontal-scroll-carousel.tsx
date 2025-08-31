"use client"

import * as React from "react"
import { motion, useTransform, useScroll } from "framer-motion"
import { useLanguage } from "@/lib/language-context"

export interface HorizontalScrollCarouselProps {
  images: string[]
  labels?: string[]
  onItemClick?: (index: number) => void
  heightClass?: string // override height (defaults to h-[180vh])
  title?: string
  subtitle?: string
  className?: string
}

export const HorizontalScrollCarousel: React.FC<HorizontalScrollCarouselProps> = ({ images, labels, onItemClick, heightClass, title, subtitle, className }) => {
  const targetRef = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  })
  const { isRTL } = useLanguage()

  const x = useTransform(scrollYProgress, [0, 1], isRTL ? ["-5%", "95%"] : ["5%", "-95%"])

  return (
    <section ref={targetRef} dir={isRTL ? 'rtl' : 'ltr'} className={`relative ${heightClass || 'h-[180vh]'} w-full ${className || ""}`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 sm:h-20 md:h-24 bg-gradient-to-b from-background to-transparent z-[1]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 sm:h-20 md:h-24 bg-gradient-to-t from-background to-transparent z-[1]" />
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {(title || subtitle) && (
          <div className="pointer-events-none absolute top-8 left-1/2 -translate-x-1/2 z-10 text-center px-4">
            {title && (
              <h3 className={`text-2xl sm:text-4xl font-extrabold ${isRTL ? 'tracking-normal' : 'tracking-tight'} text-foreground drop-shadow`}>
                {title}
              </h3>
            )}
            {subtitle && <p className="mt-1 text-sm sm:text-base text-muted-foreground drop-shadow">{subtitle}</p>}
          </div>
        )}
        <motion.div style={{ x }} className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} gap-4 sm:gap-5 md:gap-6 px-4 sm:px-6`}>
          {images.map((src, idx) => (
            <Card
              key={`${src}-${idx}`}
              src={src}
              label={labels?.[idx]}
              onClick={onItemClick ? () => onItemClick(idx) : undefined}
              rtl={isRTL}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

const Card: React.FC<{ src: string; label?: string; onClick?: () => void; rtl?: boolean }> = ({ src, label, onClick, rtl }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label ? `Open ${label} gallery` : 'Open project gallery'}
      className="group relative w-[78vw] h-[52vw] sm:w-[280px] sm:h-[200px] md:w-[360px] md:h-[260px] lg:w-[420px] lg:h-[300px] overflow-hidden rounded-2xl bg-muted shadow-lg ring-1 ring-border hover:ring-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={label || 'project image'} className="h-full w-full object-cover transform-gpu transition-transform duration-500 will-change-transform group-hover:scale-105" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-60 group-hover:opacity-80 transition-opacity" />
      {label && (
        <div className={`absolute bottom-3 left-4 right-4 ${rtl ? 'text-right' : 'text-left'}`}>
          <span className="inline-block max-w-full truncate text-white/95 text-sm md:text-base font-semibold drop-shadow" dir={rtl ? 'rtl' : 'ltr'}>
            {label}
          </span>
        </div>
      )}
    </button>
  )
}
