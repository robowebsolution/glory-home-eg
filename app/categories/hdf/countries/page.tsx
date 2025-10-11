import { getHdfCountries } from "@/lib/supabase"
import { HdfCountryShowcase } from "@/components/hdf/HdfCountryShowcase"

export const revalidate = 3600

export default async function Page() {
  const countries = await getHdfCountries()
  return <HdfCountryShowcase countries={countries} />
}
