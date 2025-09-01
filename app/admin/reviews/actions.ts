"use server";

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase-server';

const reviewSchema = z.object({
  comment_ar: z.string().min(1, 'النص العربي مطلوب'),
  comment_en: z.string().min(1, 'English text is required'),
});

// Supports (prevState, formData) from a <form action> or (data, id) from client transitions
export async function saveReview(arg1: any, arg2?: any) {
  const supabase = await createClient();

  let formObject: any;
  if (arg2 && typeof arg2?.entries === 'function') {
    formObject = Object.fromEntries(arg2.entries());
  } else if (arg1 && typeof arg1?.entries === 'function') {
    formObject = Object.fromEntries(arg1.entries());
  } else {
    formObject = { ...(arg1 || {}) };
    if (arg2 !== undefined && arg2 !== null) formObject.id = arg2;
  }

  const validated = reviewSchema.safeParse({
    comment_ar: formObject.comment_ar,
    comment_en: formObject.comment_en,
  });
  if (!validated.success) {
    return {
      success: false,
      message: 'Invalid form data. Please check both comments.',
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const idRaw = formObject.id as string | undefined;

  try {
    if (idRaw) {
      const { error } = await supabase
        .from('reviews')
        .update({ comment_ar: validated.data.comment_ar, comment_en: validated.data.comment_en })
        .eq('id', idRaw);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from('reviews')
        .insert({ comment_ar: validated.data.comment_ar, comment_en: validated.data.comment_en });
      if (error) throw new Error(error.message);
    }

    revalidatePath('/admin/reviews');
    revalidatePath('/');

    return { success: true, message: `Review ${idRaw ? 'updated' : 'created'} successfully!` };
  } catch (e: any) {
    return { success: false, message: `Database Error: ${e.message}` };
  }
}

export async function deleteReview(reviewId: string) {
  const supabase = await createClient();
  try {
    const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
    if (error) throw new Error(error.message);
    revalidatePath('/admin/reviews');
    revalidatePath('/');
    return { success: true, message: 'Review deleted successfully!' };
  } catch (e: any) {
    return { success: false, message: `Database Error: ${e.message}` };
  }
}
