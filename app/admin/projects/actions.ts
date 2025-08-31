'use server';

import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { projectSchema } from '@/lib/schemas';

export async function saveProject(prevState: any, formData: FormData) {
  try {
    const supabase = await createClient();

    const formObject: { [key: string]: any } = Object.fromEntries(formData.entries());
    const idRaw = formData.get('id');
    const id = idRaw ? Number(idRaw) : null;

    // Accept gallery URLs directly from the form
    const galleryUrls = formData.getAll('gallery_images') as string[];

    const payload = {
      id: id ?? undefined,
      name_en: formObject.name_en,
      name_ar: formObject.name_ar,
      description_en: formObject.description_en || null,
      description_ar: formObject.description_ar || null,
      category_id: Number(formObject.category_id),
      gallery_images: galleryUrls,
    };

    const validated = projectSchema.safeParse(payload);
    if (!validated.success) {
      return {
        success: false,
        message: 'Invalid data provided.',
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const { gallery_images, ...projectData } = validated.data;

    // Insert/Update project
    let projectId = id;
    if (projectId) {
      const { error: updateError } = await supabase.from('projects').update(projectData).eq('id', projectId);
      if (updateError) throw new Error(updateError.message);
    } else {
      const { data: inserted, error: insertError } = await supabase
        .from('projects')
        .insert(projectData)
        .select('id')
        .single();
      if (insertError) throw new Error(insertError.message);
      projectId = inserted?.id as number;
    }

    if (!projectId) throw new Error('Missing project id after save.');

    // Replace project images with provided list
    // Delete existing
    await supabase.from('project_images').delete().eq('project_id', projectId);
    // Insert new
    if (gallery_images && gallery_images.length > 0) {
      const rows = gallery_images.map((url) => ({ project_id: projectId!, image_url: url }));
      const { error: imagesError } = await supabase.from('project_images').insert(rows);
      if (imagesError) throw new Error(imagesError.message);
    }

    revalidatePath('/admin/projects');
    revalidatePath('/projects');

    return {
      success: true,
      message: `Project ${id ? 'updated' : 'created'} successfully!`,
    };
  } catch (e: any) {
    return { success: false, message: `An unexpected error occurred: ${e.message}` };
  }
}

export async function deleteProject(projectId: number | string) {
  const supabase = await createClient();
  try {
    const idNum = typeof projectId === 'string' ? Number(projectId) : projectId;
    const { error } = await supabase.from('projects').delete().eq('id', idNum);
    if (error) throw new Error(error.message);
    revalidatePath('/admin/projects');
    revalidatePath('/projects');
    return { success: true, message: 'Project deleted successfully!' };
  } catch (e: any) {
    return { success: false, message: `Database Error: ${e.message}` };
  }
}
