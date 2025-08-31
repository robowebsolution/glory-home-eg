"use server";

import { z } from 'zod';
import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

// Validate all fields supported by the CategoryForm and DB schema
const categorySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Category name is required.'),
  name_ar: z.string().min(1, 'Category Arabic name is required.'),
  slug: z.string().min(1, 'Slug is required.'),
  description: z.string().optional().nullable(),
  description_ar: z.string().optional().nullable(),
  image_url: z.string().url('Must be a valid URL.').optional().or(z.literal('')).nullable(),
  banner_image: z.string().url('Must be a valid URL.').optional().or(z.literal('')).nullable(),
  icon_name: z.string().optional().nullable(),
  sort_order: z.coerce.number().int().optional().default(0),
  is_featured: z.boolean().optional().default(false),
  // parent_id is UUID or null (the form may send empty string -> we normalize later)
  parent_id: z.string().uuid().optional().nullable().or(z.literal('')),
  meta_title_en: z.string().optional().nullable(),
  meta_title_ar: z.string().optional().nullable(),
  meta_description_en: z.string().optional().nullable(),
  meta_description_ar: z.string().optional().nullable(),
});

export async function saveCategory(arg1: any, arg2?: any) {
  const supabase = await createClient();

  // Support being called either with (prevState, formData) from a <form action>
  // or with (data, id) from a client component via startTransition.
  let formObject: any;
  if (arg2 && typeof arg2?.entries === 'function') {
    // Called as (prevState, formData)
    formObject = Object.fromEntries(arg2.entries());
  } else if (arg1 && typeof arg1?.entries === 'function') {
    // Defensive: in case only FormData is passed
    formObject = Object.fromEntries(arg1.entries());
  } else {
    // Called as (data, id)
    formObject = { ...(arg1 || {}) };
    if (arg2 !== undefined && arg2 !== null) {
      formObject.id = arg2;
    }
  }

  // Validate inputs
  const validatedFields = categorySchema.safeParse(formObject);

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid form data. Please check the errors.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { id, ...rest } = validatedFields.data;

  // Sanitize: convert empty strings to null for nullable string fields, and normalize parent_id
  const toNullIfEmpty = (v: any) => (v === '' ? null : v);
  const categoryData: Record<string, any> = {
    ...rest,
    description: toNullIfEmpty(rest.description),
    description_ar: toNullIfEmpty(rest.description_ar),
    image_url: toNullIfEmpty(rest.image_url),
    banner_image: toNullIfEmpty(rest.banner_image),
    icon_name: toNullIfEmpty(rest.icon_name),
    meta_title_en: toNullIfEmpty(rest.meta_title_en),
    meta_title_ar: toNullIfEmpty(rest.meta_title_ar),
    meta_description_en: toNullIfEmpty(rest.meta_description_en),
    meta_description_ar: toNullIfEmpty(rest.meta_description_ar),
    parent_id: toNullIfEmpty(rest.parent_id),
    sort_order: typeof rest.sort_order === 'number' ? rest.sort_order : 0,
    is_featured: !!rest.is_featured,
  };

  try {
    // Ensure slug uniqueness (for create and when slug changes)
    if (categoryData.slug) {
      const { data: existing, error: slugCheckError } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categoryData.slug)
        .maybeSingle();
      if (slugCheckError) {
        throw new Error(slugCheckError.message);
      }
      if (existing && (!id || existing.id !== id)) {
        return {
          success: false,
          message: 'Slug already exists. Please choose a different slug.',
        };
      }
    }

    let error;
    if (id) {
      // Update
      const { error: updateError } = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', id);
      error = updateError;
    } else {
      // Insert
      const { error: insertError } = await supabase
        .from('categories')
        .insert(categoryData);
      error = insertError;
    }

    if (error) {
      throw new Error(error.message);
    }

    // Revalidate admin list and common consumer paths
    revalidatePath('/admin/categories');
    revalidatePath('/');
    revalidatePath('/categories');
    if (categoryData.slug) {
      revalidatePath(`/categories/${categoryData.slug}`);
    }
    return { success: true, message: `Category ${id ? 'updated' : 'created'} successfully!` };

  } catch (e: any) {
    return { success: false, message: `Database Error: ${e.message}` };
  }
}

export async function deleteCategory(categoryId: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from('categories').delete().eq('id', categoryId);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/admin/categories');
    return { success: true, message: 'Category deleted successfully!' };
  } catch (e: any) {
    return { success: false, message: `Database Error: ${e.message}` };
  }
}
