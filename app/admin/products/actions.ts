'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { productSchema } from '@/lib/schemas';

export async function saveProduct(prevState: any, formData: FormData) {
  console.log('--- Starting saveProduct ---');
  try {
    const supabase = await createClient();

    console.log('Initial FormData entries:');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const formObject: { [key: string]: any } = Object.fromEntries(formData.entries());
    const id = formData.get('id') as string | null;

    const mainImageFile = formData.get('main_image');
    if (mainImageFile instanceof File && mainImageFile.size > 0) {
      console.log('Uploading main image...');
      const filePath = `public/${Date.now()}_${mainImageFile.name}`;
      const { error: uploadError } = await supabase.storage.from('product-imgs').upload(filePath, mainImageFile);
      if (uploadError) throw new Error(`Failed to upload main image: ${uploadError.message}`);
      const { data: { publicUrl } } = supabase.storage.from('product-imgs').getPublicUrl(filePath);
      formObject.main_image = publicUrl;
      console.log('Main image uploaded:', publicUrl);
    }

    const galleryImageFiles = formData.getAll('gallery_images').filter(f => f instanceof File && f.size > 0) as File[];
    let newGalleryUrls: string[] = [];
    if (galleryImageFiles.length > 0) {
      console.log(`Uploading ${galleryImageFiles.length} gallery images...`);
      const uploadPromises = galleryImageFiles.map(async (file) => {
        const filePath = `public/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage.from('product-imgs').upload(filePath, file);
        if (uploadError) throw new Error(`Failed to upload gallery image ${file.name}: ${uploadError.message}`);
        const { data: { publicUrl } } = supabase.storage.from('product-imgs').getPublicUrl(filePath);
        return publicUrl;
      });
      newGalleryUrls = await Promise.all(uploadPromises);
      console.log('Gallery images uploaded:', newGalleryUrls);
    }

    const existingGalleryUrls = formData.getAll('existing_gallery_images') as string[];
    console.log('Existing gallery URLs from form:', existingGalleryUrls);

    formObject.gallery_images = [...existingGalleryUrls, ...newGalleryUrls];
    console.log('Final gallery_images array:', formObject.gallery_images);

    console.log('Object before validation:', formObject);
    const validatedFields = productSchema.safeParse(formObject);

    if (!validatedFields.success) {
      console.error('--- VALIDATION FAILED ---');
      console.error('Validation Errors:', validatedFields.error.flatten().fieldErrors);
      return {
        success: false,
        message: 'Invalid data provided. Check server logs for details.',
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    console.log('--- VALIDATION SUCCEEDED ---');
    const { id: validatedId, ...productData } = validatedFields.data;
    console.log('Data to be saved to DB:', productData);

    let error;
    if (id) {
      console.log(`Updating product with ID: ${id}`);
      const { error: updateError } = await supabase.from('products').update(productData).eq('id', id);
      error = updateError;
    } else {
      console.log('Inserting new product');
      const { error: insertError } = await supabase.from('products').insert(productData);
      error = insertError;
    }

    if (error) {
      console.error('--- DATABASE ERROR ---', error);
      throw new Error(error.message);
    }

    console.log('--- DATABASE OPERATION SUCCEEDED ---');
    revalidatePath('/admin/products');
    revalidatePath('/');

    return {
      success: true,
      message: `Product ${id ? 'updated' : 'created'} successfully!`,
    };

  } catch (e: any) {
    console.error('--- FATAL ERROR in saveProduct ---', e);
    return {
      success: false,
      message: `An unexpected error occurred: ${e.message}`,
    };
  }
}

export async function uploadImage(formData: FormData): Promise<{ success: boolean; message: string; url?: string }> {
  const file = formData.get('file') as File;
  if (!file) {
    return { success: false, message: 'No file provided.' };
  }

  try {
    const supabase = await createClient();
    const filePath = `public/${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from('product-imgs')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload Error:', uploadError);
      return { success: false, message: `Failed to upload image: ${uploadError.message}` };
    }

    const { data } = supabase.storage.from('product-imgs').getPublicUrl(filePath);

    return { success: true, message: 'Image uploaded successfully.', url: data.publicUrl };
  } catch (e: any) {
    return { success: false, message: `An unexpected error occurred: ${e.message}` };
  }
}

export async function deleteImage(imageUrl: string): Promise<{ success: boolean; message: string }> {
  if (!imageUrl) return { success: false, message: 'No image URL provided.' };
  
  try {
    const supabase = await createClient();
    // Extract the file path from the full URL
    const url = new URL(imageUrl);
    const filePath = url.pathname.split('/product-imgs/')[1];

    if (!filePath) {
      return { success: false, message: 'Invalid image URL format.' };
    }

    const { error } = await supabase.storage.from('product-imgs').remove([filePath]);

    if (error) {
      console.error('Delete Error:', error);
      return { success: false, message: `Failed to delete image: ${error.message}` };
    }

    return { success: true, message: 'Image deleted successfully.' };

  } catch (e: any) {
     return { success: false, message: `An unexpected error occurred: ${e.message}` };
  }
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from('products').delete().eq('id', productId);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/admin/products');
    return { success: true, message: 'Product deleted successfully!' };
  } catch (e: any) {
    return { success: false, message: `Database Error: ${e.message}` };
  }
}
