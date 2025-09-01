import { NextResponse } from "next/server"
import { createClient as createServerSupabase } from "@/lib/supabase-server"

export const revalidate = 600 // cache videos for 10 minutes

export async function GET() {
  const resHeaders = {
    "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
  }

  try {
    const supabase = await createServerSupabase()
    const { data, error } = await supabase
      .from("videos")
      .select("id, title_ar, title_en, src, thumbnail, duration, created_at")
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ ok: false, error: error.message, videos: [] }, { status: 500, headers: resHeaders })
    }

    return NextResponse.json({ ok: true, videos: data || [] }, { headers: resHeaders })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "unknown error", videos: [] }, { status: 500, headers: resHeaders })
  }
}
