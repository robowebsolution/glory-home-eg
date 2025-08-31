"use server";

import { z } from 'zod';
import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

const projectCategorySchema = z.object({
  id: z.coerce.number().optional(),
  name_en: z.string().min(1, 'English name is required.'),
  name_ar: z.string().min(1, 'Arabic name is required.'),
});

export async function saveProjectCategory(arg1: any, arg2?: any) {
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

  const validatedFields = projectCategorySchema.safeParse(formObject);

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid form data. Please check the errors.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { id, ...categoryData } = validatedFields.data as { id?: number; name_en: string; name_ar: string };

  try {
    let error;
    if (id) {
      // Update
      const { error: updateError } = await supabase.from('project_categories').update(categoryData).eq('id', id);
      error = updateError;
    } else {
      // Insert
      const { error: insertError } = await supabase.from('project_categories').insert(categoryData);
      error = insertError;
    }

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/admin/project-categories');
    revalidatePath('/projects');
    return { success: true, message: `Project category ${id ? 'updated' : 'created'} successfully!` };

  } catch (e: any) {
    return { success: false, message: `Database Error: ${e.message}` };
  }
}

export async function deleteProjectCategory(categoryId: string | number) {
  const supabase = await createClient();

  try {
    const idNum = typeof categoryId === 'string' ? Number(categoryId) : categoryId;
    const { error } = await supabase.from('project_categories').delete().eq('id', idNum);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/admin/project-categories');
    revalidatePath('/projects');
    return { success: true, message: 'Project category deleted successfully!' };
  } catch (e: any) {
    return { success: false, message: `Database Error: ${e.message}` };
  }
}
