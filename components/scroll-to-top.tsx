"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function ScrollToTopOnRouteChange() {
  const pathname = usePathname()

  useEffect(() => {
    // Always jump to top when the route (pathname) changes
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" })
    } catch {
      window.scrollTo(0, 0)
    }
  }, [pathname])

  return null
}
