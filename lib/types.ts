// This file will contain all the shared types for the application.

export interface Category {
  id: string; // uuid
  name: string;
  name_ar: string;
}

export interface Product {
  id?: string;
  name: string;
  category_id: string; 
  description: string; 
  price: number; 
  specifications?: string | null; 
  in_stock?: boolean; 
  featured?: boolean; 
  created_at?: string; 
  updated_at?: string; 
  name_ar?: string | null; 
  description_ar?: string | null; 
  meta_title_en?: string | null; 
  meta_title_ar?: string | null; 
  meta_description_en?: string | null; 
  meta_description_ar?: string | null; 
  tags_en?: string[] | null; 
  tags_ar?: string[] | null; 
  weight?: number | null; 
  dimensions?: string | null; 
  material_en?: string | null; 
  material_ar?: string | null; 
  color_en?: string | null; 
  color_ar?: string | null; 
  warranty_period?: string | null; 
  care_instructions_en?: string | null; 
  care_instructions_ar?: string | null; 
  video_url?: string | null; 
  is_new?: boolean; 
  is_sale?: boolean; 
  sale_price?: number | null; 
  stock_quantity?: number; 
  min_order_quantity?: number; 
  max_order_quantity?: number | null; 
  main_image?: string | null; 
  gallery_images?: string[] | null;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const initialProductState: Product = {
    name: '',
    category_id: '',
    description: '', 
    price: 0, 
    specifications: '', 
    in_stock: true, 
    featured: false, 
    name_ar: '', 
    description_ar: '', 
    meta_title_en: '', 
    meta_title_ar: '', 
    meta_description_en: '', 
    meta_description_ar: '', 
    tags_en: [], 
    tags_ar: [], 
    weight: undefined, 
    dimensions: '', 
    material_en: '', 
    material_ar: '', 
    color_en: '', 
    color_ar: '', 
    warranty_period: '', 
    care_instructions_en: '', 
    care_instructions_ar: '', 
    video_url: '', 
    is_new: false, 
    is_sale: false, 
    sale_price: undefined, 
    stock_quantity: 0, 
    min_order_quantity: 1, 
    max_order_quantity: undefined, 
    main_image: null, 
    gallery_images: [],
};

// Projects Admin Types
// Note: IDs may be numeric in the DB. Use string | number to be flexible.
export interface ProjectCategory {
  id: string | number;
  name_en: string;
  name_ar: string;
  cover?: string | null;
}

export interface Customer {
  id?: string | number;
  image_url: string;
  created_at?: string | null;
}

// Admin Reviews type (for Supabase `reviews` table)
export interface Review {
  id?: string; // uuid
  comment_ar: string;
  comment_en: string;
  created_at?: string | null;
}

// Home Videos type (for Supabase `videos` table)
export interface Video {
  id?: string | number;
  title_ar?: string | null;
  title_en?: string | null;
  src: string; // video URL
  thumbnail?: string | null;
  duration?: string | null;
  created_at?: string | null;
}

export interface ProjectItem {
  id?: string | number;
  name_en: string;
  name_ar: string;
  description_en?: string | null;
  description_ar?: string | null;
  category_id: string | number;
  images?: string[]; // convenience field built from project_images
}
