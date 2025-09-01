"use server";

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase-server';

const videoSchema = z.object({
  title_ar: z
    .string()
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v : null)),
  title_en: z
    .string()
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v : null)),
  src: z.string().min(1, 'رابط الفيديو مطلوب'),
  thumbnail: z.string().optional(),
  duration: z.string().optional(),
});

// Supports (prevState, formData) from a <form action> or (data, id) from client transitions
export async function saveVideo(arg1: any, arg2?: any) {
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

  const validated = videoSchema.safeParse({
    title_ar: formObject.title_ar,
    title_en: formObject.title_en,
    src: formObject.src,
    thumbnail: formObject.thumbnail || undefined,
    duration: formObject.duration || undefined,
  });

  if (!validated.success) {
    return {
      success: false,
      message: 'Invalid form data. Please check all fields.',
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const idRaw = formObject.id as string | number | undefined;

  try {
    if (idRaw) {
      const { error } = await supabase
        .from('videos')
        .update({
          title_ar: validated.data.title_ar,
          title_en: validated.data.title_en,
          src: validated.data.src,
          thumbnail: validated.data.thumbnail ?? null,
          duration: validated.data.duration ?? null,
        })
        .eq('id', idRaw);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from('videos')
        .insert({
          title_ar: validated.data.title_ar,
          title_en: validated.data.title_en,
          src: validated.data.src,
          thumbnail: validated.data.thumbnail ?? null,
          duration: validated.data.duration ?? null,
        });
      if (error) throw new Error(error.message);
    }

    revalidatePath('/admin/videos');
    revalidatePath('/');
    revalidatePath('/api/videos');

    return { success: true, message: `Video ${idRaw ? 'updated' : 'created'} successfully!` };
  } catch (e: any) {
    return { success: false, message: `Database Error: ${e.message}` };
  }
}

export async function deleteVideo(videoId: string | number) {
  const supabase = await createClient();
  try {
    const { error } = await supabase.from('videos').delete().eq('id', videoId);
    if (error) throw new Error(error.message);
    revalidatePath('/admin/videos');
    revalidatePath('/');
    revalidatePath('/api/videos');
    return { success: true, message: 'Video deleted successfully!' };
  } catch (e: any) {
    return { success: false, message: `Database Error: ${e.message}` };
  }
}
