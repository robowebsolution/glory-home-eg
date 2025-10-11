import { createClient } from '@/lib/supabase-server'
import { unstable_noStore as noStore } from 'next/cache'

import type { Category } from '@/lib/types'
import { FutecManagementClientPage } from '@/app/admin/futec/FutecManagementClientPage'

export const revalidate = 0

export default async function AdminFutecManagementPage() {
  noStore()

  const supabase = await createClient()

  const [{ data: futecCategoryData, error: futecCategoryError }] = await Promise.all([
    supabase
      .from('categories')
      .select('*')
      .eq('slug', 'futec')
      .maybeSingle(),
  ])

  if (futecCategoryError) {
    console.error('Error loading Futec category:', futecCategoryError)
  }

  const futecCategory = (futecCategoryData as Category | null) ?? null

  let futecCollections: Category[] = []
  if (futecCategory) {
    const { data: collectionsData, error: collectionsError } = await supabase
      .from('categories')
      .select('*')
      .eq('parent_id', futecCategory.id)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })

    if (collectionsError) {
      console.error('Error loading Futec collections:', collectionsError)
    } else {
      futecCollections = (collectionsData as Category[]) ?? []
    }
  }

  return (
    <FutecManagementClientPage
      futecCategory={futecCategory}
      futecCollections={futecCollections}
    />
  )
}
