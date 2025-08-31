import { NextResponse } from "next/server"
import { createClient as createServerSupabase } from "@/lib/supabase-server"

export const revalidate = 600 // cache for 10 minutes on the edge

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const categoryId = searchParams.get("category_id")
  const limitParam = searchParams.get("limit")
  const limit = Math.min(parseInt(limitParam || "8", 10) || 8, 50)
  const random = searchParams.get("random") === "1" || searchParams.get("random") === "true"

  const resHeaders = {
    "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
  }

  try {
    const supabase = await createServerSupabase()

    let query = supabase
      .from("projects")
      .select("id, name_en, name_ar, description_en, description_ar, category_id, created_at, project_images(image_url)")
      // order/limit applied conditionally below

    if (categoryId) {
      query = query.eq("category_id", Number(categoryId))
    }

    if (random) {
      // Fetch a larger pool then shuffle server-side
      query = query.limit(Math.max(limit * 3, Math.min(limit + 6, 50)))
    } else {
      query = query.order("created_at", { ascending: false }).limit(limit)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ ok: false, error: error.message, projects: [] }, { status: 500, headers: resHeaders })
    }

    // Normalize images (first image as cover)
    let projects = (data || []).map((p: any) => ({
      ...p,
      cover: p.project_images && p.project_images.length > 0 ? p.project_images[0].image_url : null,
      images: (p.project_images || []).map((img: any) => img.image_url),
    }))

    if (random) {
      projects = projects.sort(() => Math.random() - 0.5).slice(0, limit)
    }

    return NextResponse.json({ ok: true, projects }, { headers: resHeaders })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "unknown error", projects: [] }, { status: 500, headers: resHeaders })
  }
}
