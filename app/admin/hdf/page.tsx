import { createClient } from '@/lib/supabase-server'
import { unstable_noStore as noStore } from 'next/cache'

import type { Category, Manufacturer } from '@/lib/types'
import { HdfManagementClientPage } from '@/app/admin/hdf/HdfManagementClientPage'

export const revalidate = 0

export default async function AdminHdfManagementPage() {
  noStore()

  const supabase = await createClient()

  const [{ data: hdfCategoryData, error: hdfCategoryError }] = await Promise.all([
    supabase
      .from('categories')
      .select('*')
      .eq('slug', 'hdf')
      .maybeSingle(),
  ])

  if (hdfCategoryError) {
    console.error('Error loading HDF category:', hdfCategoryError)
  }

  const hdfCategory = (hdfCategoryData as Category | null) ?? null

  let hdfCountries: Category[] = []
  if (hdfCategory) {
    const { data: countriesData, error: countriesError } = await supabase
      .from('categories')
      .select('*')
      .eq('parent_id', hdfCategory.id)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })

    if (countriesError) {
      console.error('Error loading HDF countries:', countriesError)
    } else {
      hdfCountries = (countriesData as Category[]) ?? []
    }
  }

  const { data: manufacturersData, error: manufacturersError } = await supabase
    .from('manufacturers')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (manufacturersError) {
    console.error('Error loading manufacturers:', manufacturersError)
  }

  const manufacturers = (manufacturersData as Manufacturer[]) ?? []

  return (
    <HdfManagementClientPage
      hdfCategory={hdfCategory}
      hdfCountries={hdfCountries}
      manufacturers={manufacturers}
    />
  )
}
