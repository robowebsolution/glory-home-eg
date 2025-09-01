import { NextResponse } from "next/server"
import { createClient as createServerSupabase } from "@/lib/supabase-server"

export const revalidate = 600 // ISR for 10 minutes

export async function GET() {
  const resHeaders = {
    "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
  }
  try {
    const supabase = await createServerSupabase()
    // Fetch all project categories
    const { data, error } = await supabase
      .from("project_categories")
      .select("id, name_en, name_ar, cover")
      .order("id")

    if (error) {
      return NextResponse.json({ ok: false, error: error.message, categories: [] }, { status: 500, headers: resHeaders })
    }

    return NextResponse.json({ ok: true, categories: data || [] }, { headers: resHeaders })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "unknown error", categories: [] }, { status: 500, headers: resHeaders })
  }
}
