import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data: categories, error } = await supabase.from("categories").select("*").order("name")

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        {
          error: "Failed to fetch categories",
          details: error.message,
          categories: [],
        },
        { status: 500 },
      )
    }

    // Return empty array if no categories found
    return NextResponse.json(categories || [])
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
        categories: [],
      },
      { status: 500 },
    )
  }
}
