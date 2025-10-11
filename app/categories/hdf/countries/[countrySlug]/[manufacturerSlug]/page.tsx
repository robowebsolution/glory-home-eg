import { notFound } from "next/navigation"
import {
  getCachedCategoryBySlug,
  getManufacturerBySlug,
  getProductsByManufacturerSlug,
  getHdfCountries,
  getManufacturersByCountrySlug,
} from "@/lib/supabase"
import { HdfManufacturerProducts } from "@/components/hdf/HdfManufacturerProducts"

export const revalidate = 900

interface PageProps {
  params: Promise<{ countrySlug: string; manufacturerSlug: string }>
}

export async function generateStaticParams() {
  const countries = await getHdfCountries()
  if (!countries || countries.length === 0) {
    return []
  }

  const pairs = await Promise.all(
    countries.map(async (country) => {
      const manufacturers = await getManufacturersByCountrySlug(country.slug)
      return manufacturers.map((manufacturer) => ({
        countrySlug: country.slug,
        manufacturerSlug: manufacturer.slug,
      }))
    })
  )

  return pairs.flat()
}

export default async function Page({ params }: PageProps) {
  const { countrySlug, manufacturerSlug } = await params

  const country = await getCachedCategoryBySlug(countrySlug)
  if (!country) {
    notFound()
  }

  const manufacturer = await getManufacturerBySlug(manufacturerSlug)
  if (!manufacturer || manufacturer.country_category_id !== country.id) {
    notFound()
  }

  const products = await getProductsByManufacturerSlug(manufacturerSlug)

  return <HdfManufacturerProducts country={country} manufacturer={manufacturer} products={products} />
}
