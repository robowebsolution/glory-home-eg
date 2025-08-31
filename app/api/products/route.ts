import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

function isUUID(value: string) {
  // Simple UUID v4 pattern check
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const limit = searchParams.get("limit")

    // If filtering by category slug, we need an inner join on categories
    const selectClause = category && !isUUID(category) ? "*, categories!inner(*)" : "*, categories(*)"

    let query = supabase
      .from("products")
      .select(selectClause)
      .eq("in_stock", true)
      .order("created_at", { ascending: false })

    if (category) {
      if (isUUID(category)) {
        // Treat as category_id
        query = query.eq("category_id", category)
      } else {
        // Treat as category slug via joined table
        query = query.eq("categories.slug", category)
      }
    }

    if (featured === "true") {
      query = query.eq("featured", true)
    }

    if (limit) {
      const limitNum = Number.parseInt(limit, 10)
      if (!isNaN(limitNum) && limitNum > 0) {
        query = query.limit(limitNum)
      }
    }

    const { data: products, error } = await query

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        {
          error: "Failed to fetch products",
          details: error.message,
          products: [],
        },
        { status: 500 },
      )
    }

    // Return empty array if no products found
    return NextResponse.json(products || [])
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
        products: [],
      },
      { status: 500 },
    )
  }
}
