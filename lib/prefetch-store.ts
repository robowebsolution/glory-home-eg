import type { Category } from "@/lib/supabase";

let prefetchedCategories: Category[] | null = null;

export function setPrefetchedCategories(data: Category[] | null) {
  prefetchedCategories = Array.isArray(data) ? data : null;
}

export function getPrefetchedCategories(): Category[] | null {
  return prefetchedCategories;
}
