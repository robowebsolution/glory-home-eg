"use server";

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase-server';

const customerSchema = z.object({
  image_url: z.string().url('Must be a valid URL.'),
});

// Supports (prevState, formData) from a <form action> or (data, id) from client transitions
export async function saveCustomer(arg1: any, arg2?: any) {
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

  const validated = customerSchema.safeParse({ image_url: formObject.image_url });
  if (!validated.success) {
    return {
      success: false,
      message: 'Invalid form data. Please check the image URL.',
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const idRaw = formObject.id as string | number | undefined;
  const idValue = typeof idRaw === 'string' && !Number.isNaN(Number(idRaw)) ? Number(idRaw) : (idRaw ?? undefined);

  try {
    if (idValue !== undefined) {
      const { error } = await supabase
        .from('customers')
        .update({ image_url: validated.data.image_url })
        .eq('id', idValue);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from('customers')
        .insert({ image_url: validated.data.image_url });
      if (error) throw new Error(error.message);
    }

    revalidatePath('/admin/customers');
    revalidatePath('/about');

    return { success: true, message: `Customer ${idValue ? 'updated' : 'created'} successfully!` };
  } catch (e: any) {
    return { success: false, message: `Database Error: ${e.message}` };
  }
}

export async function deleteCustomer(customerId: string | number) {
  const supabase = await createClient();
  const idValue = typeof customerId === 'string' && !Number.isNaN(Number(customerId)) ? Number(customerId) : customerId;
  try {
    const { error } = await supabase.from('customers').delete().eq('id', idValue);
    if (error) throw new Error(error.message);
    revalidatePath('/admin/customers');
    revalidatePath('/about');
    return { success: true, message: 'Customer deleted successfully!' };
  } catch (e: any) {
    return { success: false, message: `Database Error: ${e.message}` };
  }
}

// Bulk insert multiple image URLs
export async function saveCustomersBulk(prevState: any, formData: FormData) {
  const supabase = await createClient();

  // Accept either multiple fields named "image_urls" or a single textarea named "bulk_text"
  const fromMulti = formData.getAll('image_urls').map(String).filter(Boolean);
  const bulkTextRaw = formData.get('bulk_text');
  const fromText = typeof bulkTextRaw === 'string'
    ? bulkTextRaw.split(/[\n,\s]+/).map((s) => s.trim()).filter(Boolean)
    : [];

  // Merge and de-duplicate
  const urls = Array.from(new Set([...
    fromMulti,
    ...fromText,
  ]));

  const arraySchema = z.array(z.string().url()).min(1, 'Provide at least one valid URL.');
  const validated = arraySchema.safeParse(urls);
  if (!validated.success) {
    return {
      success: false,
      message: 'Invalid URLs provided. Ensure all lines are valid URLs.',
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    const rows = validated.data.map((u) => ({ image_url: u }));
    const { error } = await supabase.from('customers').insert(rows);
    if (error) throw new Error(error.message);

    revalidatePath('/admin/customers');
    revalidatePath('/about');
    return { success: true, message: `Inserted ${rows.length} customer image${rows.length > 1 ? 's' : ''}.` };
  } catch (e: any) {
    return { success: false, message: `Database Error: ${e.message}` };
  }
}
