import { notFound } from "next/navigation"
import {
  getCachedCategoryBySlug,
  getManufacturersByCountrySlug,
  getHdfCountrySlugs,
} from "@/lib/supabase"
import { HdfManufacturerShowcase } from "@/components/hdf/HdfManufacturerShowcase"

export const revalidate = 1800

interface PageProps {
  params: Promise<{ countrySlug: string }>
}

export async function generateStaticParams() {
  const slugs = await getHdfCountrySlugs()
  return slugs.map((countrySlug) => ({ countrySlug }))
}

export default async function Page({ params }: PageProps) {
  const { countrySlug } = await params
  const country = await getCachedCategoryBySlug(countrySlug)
  if (!country) {
    notFound()
  }

  const manufacturers = await getManufacturersByCountrySlug(countrySlug)

  return <HdfManufacturerShowcase country={country} manufacturers={manufacturers} />
}
