"use client"

import { useEffect } from "react"
import { fetchCategories } from "@/lib/api"
import { getPrefetchedCategories, setPrefetchedCategories } from "@/lib/prefetch-store"
import { isSupabaseConfigured } from "@/lib/supabase-client"

export function PrefetchCategories() {
  useEffect(() => {
    let cancelled = false

    async function run() {
      try {
        // Skip if already prefetched or Supabase not configured
        if (getPrefetchedCategories() || !isSupabaseConfigured()) return
        const data = await fetchCategories()
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setPrefetchedCategories(data as any)
        }
      } catch {
        // silent fail – prefetch is opportunistic
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [])

  return null
}
