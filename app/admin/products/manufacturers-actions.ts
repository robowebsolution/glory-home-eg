"use server"

import { z } from 'zod'
import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

const manufacturerSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Name is required.'),
  name_ar: z.string().optional().nullable(),
  slug: z.string().min(1, 'Slug is required.'),
  country_category_id: z.string().uuid('A valid country must be selected.').nullable(),
  description: z.string().optional().nullable(),
  description_ar: z.string().optional().nullable(),
  logo_url: z.string().url('Must be a valid URL.').optional().or(z.literal('')).nullable(),
  banner_image: z.string().url('Must be a valid URL.').optional().or(z.literal('')).nullable(),
  sort_order: z.coerce.number().int().optional().default(0),
  is_featured: z.boolean().optional().default(false),
})

type ManufacturerFormData = z.infer<typeof manufacturerSchema>

const toNullIfEmpty = (value: any) => (value === '' ? null : value)

export async function saveManufacturer(data: Partial<ManufacturerFormData>, id?: string | null) {
  const supabase = await createClient()

  const payload = {
    ...data,
    id: id ?? data.id,
  }

  const validation = manufacturerSchema.safeParse({ ...payload, id: id ?? data.id })

  if (!validation.success) {
    return {
      success: false,
      message: 'Invalid manufacturer data.',
      errors: validation.error.flatten().fieldErrors,
    }
  }

  const { id: manufacturerId, ...rest } = validation.data

  const manufacturerData = {
    ...rest,
    country_category_id: toNullIfEmpty(rest.country_category_id),
    description: toNullIfEmpty(rest.description),
    description_ar: toNullIfEmpty(rest.description_ar),
    logo_url: toNullIfEmpty(rest.logo_url),
    banner_image: toNullIfEmpty(rest.banner_image),
    is_featured: !!rest.is_featured,
  }

  try {
    if (manufacturerData.slug) {
      const { data: existing, error: slugError } = await supabase
        .from('manufacturers')
        .select('id')
        .eq('slug', manufacturerData.slug)
        .maybeSingle()

      if (slugError) {
        throw new Error(slugError.message)
      }

      if (existing && (!manufacturerId || existing.id !== manufacturerId)) {
        return {
          success: false,
          message: 'Slug already exists. Please choose another one.',
        }
      }
    }

    let error

    if (manufacturerId) {
      const { error: updateError } = await supabase
        .from('manufacturers')
        .update(manufacturerData)
        .eq('id', manufacturerId)
      error = updateError
    } else {
      const { error: insertError } = await supabase
        .from('manufacturers')
        .insert(manufacturerData)
      error = insertError
    }

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath('/admin/products')
    revalidatePath('/categories/hdf')

    return {
      success: true,
      message: `Manufacturer ${manufacturerId ? 'updated' : 'created'} successfully!`,
    }
  } catch (error: any) {
    return {
      success: false,
      message: `Database Error: ${error.message}`,
    }
  }
}

export async function deleteManufacturer(manufacturerId: string) {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from('manufacturers')
      .delete()
      .eq('id', manufacturerId)

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath('/admin/products')
    revalidatePath('/categories/hdf')

    return {
      success: true,
      message: 'Manufacturer deleted successfully!',
    }
  } catch (error: any) {
    return {
      success: false,
      message: `Database Error: ${error.message}`,
    }
  }
}
