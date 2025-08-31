import { z } from 'zod';

const booleanFromString = z.preprocess((val) => {
  if (typeof val === 'string') return val === 'true';
  return val;
}, z.boolean());

const jsonFromString = (schema: z.ZodTypeAny) => z.preprocess((val) => {
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch {
      return val; // Let the inner schema handle the error
    }
  }
  return val;
}, schema);

export const productSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  name: z.string().min(1, 'Name is required.'),
  name_ar: z.string().min(1, 'Arabic name is required.'),
  description: z.string().optional().nullable(),
  description_ar: z.string().optional().nullable(),
  price: z.preprocess(
    (val) => (val === '' || val === null ? null : val),
    z.coerce.number().nullable().optional()
  ),
  specifications: z.string().optional().nullable(), // Changed from array to text
  in_stock: booleanFromString.default(true), // Renamed from is_active
  featured: booleanFromString.default(false), // Renamed from is_featured
  category_id: z.string().uuid('A valid category must be selected.').optional().nullable(),
  
  // SEO Fields
  meta_title_en: z.string().optional().nullable(),
  meta_title_ar: z.string().optional().nullable(),
  meta_description_en: z.string().optional().nullable(),
  meta_description_ar: z.string().optional().nullable(),

  // Tags - now split into two fields
  tags_en: jsonFromString(z.array(z.string()).optional().default([])),
  tags_ar: jsonFromString(z.array(z.string()).optional().default([])),

  // Physical Properties
  weight: z.coerce.number().optional().nullable(),
  dimensions: z.string().optional().nullable(),
  material_en: z.string().optional().nullable(),
  material_ar: z.string().optional().nullable(),
  color_en: z.string().optional().nullable(),
  color_ar: z.string().optional().nullable(),

  // Additional Info
  warranty_period: z.string().optional().nullable(),
  care_instructions_en: z.string().optional().nullable(),
  care_instructions_ar: z.string().optional().nullable(),
  video_url: z.string().url().or(z.literal('')).optional().nullable(),

  // Flags
  is_new: booleanFromString.default(false),
  is_sale: booleanFromString.default(false),

  // Sale and Stock
  sale_price: z.preprocess(
    (val) => (val === '' || val === null ? null : val),
    z.coerce.number().nullable().optional()
  ),
  stock_quantity: z.coerce.number().int().default(0), // Renamed from quantity
  min_order_quantity: z.coerce.number().int().optional().nullable(),
  max_order_quantity: z.coerce.number().int().optional().nullable(),

  // Media
  main_image: z.string().url().or(z.literal('')).optional().nullable(),
  gallery_images: z.preprocess(
    (val) => {
      if (!Array.isArray(val)) return [];
      return val.map(item => {
        if (typeof item === 'object' && item !== null && 'value' in item) {
          return item.value;
        }
        return item;
      });
    },
    z.array(z.union([z.string(), z.any()])).optional().default([])
  ),
});

export type ProductFormData = z.infer<typeof productSchema>;

// Projects
export const projectSchema = z.object({
  id: z.coerce.number().optional().nullable(),
  name_en: z.string().min(1, 'English name is required.'),
  name_ar: z.string().min(1, 'Arabic name is required.'),
  description_en: z.string().optional().nullable(),
  description_ar: z.string().optional().nullable(),
  category_id: z.coerce.number({ invalid_type_error: 'A valid category is required.' }),
  gallery_images: z.preprocess(
    (val) => {
      if (!Array.isArray(val)) return [];
      return val.map((item: any) => {
        if (typeof item === 'object' && item !== null && 'value' in item) {
          return (item as any).value;
        }
        return item;
      });
    },
    z.array(z.union([z.string(), z.any()])).optional().default([])
  ),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
