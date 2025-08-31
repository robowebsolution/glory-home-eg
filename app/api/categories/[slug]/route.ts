import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    // Get category details
    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .single()

    if (categoryError) {
      throw categoryError
    }

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 })
  }
}
