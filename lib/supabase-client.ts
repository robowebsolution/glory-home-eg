"use client"

import { createBrowserClient } from "@supabase/ssr"

// Create a single instance of the Supabase client for browser use
// This ensures proper cookie handling and session persistence
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return supabaseInstance
}

// Export the client instance
export const supabase = createClient()

// Export a function to check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

// Export configuration status for debugging
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Configured" : "❌ Missing NEXT_PUBLIC_SUPABASE_URL",
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Configured" : "❌ Missing NEXT_PUBLIC_SUPABASE_ANON_KEY",
}
