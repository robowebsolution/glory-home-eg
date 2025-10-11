import { createClient } from '@supabase/supabase-js'
import { cache } from 'react'

// =================================================================
// ============== تعريف واجهات البيانات (Types / Interfaces) ==============
// =================================================================

export interface Product {
  id: string;
  name: string;
  name_ar?: string;
  description: string;
  description_ar?: string;
  price: number;
  sale_price?: number;
  main_image: string;
  gallery_images?: string[];
  category_id?: string;
  categories?: Category;
  featured: boolean;
  in_stock: boolean;
  specifications?: Record<string, any>;
  created_at: string;
  updated_at: string;
  min_order_quantity?: number;
  max_order_quantity?: number;
  stock_quantity?: number;
  is_new?: boolean;
  is_sale?: boolean;
  video_url?: string;
  care_instructions_ar?: string;
  care_instructions_en?: string;
  weight?: number;
  dimensions?: string;
  material_ar?: string;
  material_en?: string;
  color_ar?: string;
  color_en?: string;
  warranty_period?: string;
  manufacturer?: Manufacturer | null;
}

export interface Category {
  id: string;
  name: string;
  name_ar?: string;
  slug: string;
  product_count: number;
  description: string;
  description_ar?: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  parent_id?: string | null;
  sort_order?: number | null;
}

export interface Manufacturer {
  id: string;
  name: string;
  name_ar?: string;
  slug: string;
  country_category_id: string | null;
  description?: string | null;
  description_ar?: string | null;
  logo_url?: string | null;
  banner_image?: string | null;
  sort_order?: number | null;
  is_featured?: boolean | null;
  created_at: string;
  updated_at: string;
  country?: Category | null;
}

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

// ... يمكنك إضافة باقي الواجهات هنا (Profile, CartItem, etc.)

// =================================================================
// ============== إعداد عميل Supabase (Client Setup) ==============
// =================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// ملاحظة: لا تقم بتصدير (export) هذا العميل مباشرة للمكونات
// بل قم بتصدير الدوال التي تستخدمه
export const supabase = createClient(supabaseUrl, supabaseAnonKey)


// =================================================================
// ================= دوال جلب البيانات مع التخزين المؤقت =================
// =================================================================

/**
 * دالة لجلب كل الفئات
 */
export const getCachedCategories = cache(async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')
  
  if (error) {
    console.error('Error fetching categories:', error.message)
    return []
  }
  
  return data || []
})

export const getHdfCountries = cache(async (): Promise<Category[]> => {
  const hdfCategory = await getCachedCategoryBySlug('hdf')
  if (!hdfCategory) {
    return []
  }

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('parent_id', hdfCategory.id)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching HDF countries:', error.message)
    return []
  }

  return data || []
})

export const getHdfCountrySlugs = cache(async (): Promise<string[]> => {
  const countries = await getHdfCountries()
  return countries.map((country) => country.slug)
})

export const getManufacturersByCountrySlug = cache(async (countrySlug: string): Promise<Manufacturer[]> => {
  if (!countrySlug) return []

  const country = await getCachedCategoryBySlug(countrySlug)
  if (!country) {
    return []
  }

  const { data, error } = await supabase
    .from('manufacturers')
    .select('*')
    .eq('country_category_id', country.id)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error(`Error fetching manufacturers for country "${countrySlug}":`, error.message)
    return []
  }

  return data || []
})

export const getManufacturerBySlug = cache(async (manufacturerSlug: string): Promise<Manufacturer | null> => {
  if (!manufacturerSlug) return null

  const { data, error } = await supabase
    .from('manufacturers')
    .select('*')
    .eq('slug', manufacturerSlug)
    .maybeSingle()

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error(`Error fetching manufacturer "${manufacturerSlug}":`, error.message)
    }
    return null
  }

  return data ?? null
})

export const getManufacturerSlugsByCountry = cache(async (countrySlug: string): Promise<string[]> => {
  const manufacturers = await getManufacturersByCountrySlug(countrySlug)
  return manufacturers.map((manufacturer) => manufacturer.slug)
})

export const getProductsByManufacturerSlug = cache(async (manufacturerSlug: string): Promise<Product[]> => {
  if (!manufacturerSlug) return []

  const manufacturer = await getManufacturerBySlug(manufacturerSlug)
  if (!manufacturer) {
    return []
  }

  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('manufacturer_id', manufacturer.id)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error(`Error fetching products for manufacturer "${manufacturerSlug}":`, error.message)
    return []
  }

  return data || []
})

export const getCachedProductById = cache(async (id: string): Promise<Product | null> => {
  if (!id) return null;

  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*), manufacturer:manufacturers(*, country:categories(*))')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') { // لا تطبع خطأ إذا كان المنتج غير موجود
      console.error(`Error fetching product with id "${id}":`, error.message);
    }
    return null;
  }

  return data;
});

/**
 * دالة لجلب كل مُعرّفات المنتجات لإنشاء الصفحات الثابتة (generateStaticParams)
 */
export const getAllProductIds = cache(async () => {
  const { data, error } = await supabase.from('products').select('id');

  if (error) {
    console.error('Error fetching product IDs:', error.message);
    return [];
  }

  return data?.map((product) => ({
    id: product.id,
  })) || [];
});


/**
 * دالة لجلب المنتجات المميزة
 */
export const getCachedFeaturedProducts = cache(async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('featured', true)
    .eq('in_stock', true)
    .order('created_at', { ascending: false })
    .limit(8) // يمكنك تعديل العدد حسب الحاجة
  
  if (error) {
    console.error('Error fetching featured products:', error.message)
    return []
  }
  
  return data || []
})

/**
 * دالة لجلب بيانات فئة واحدة باستخدام الـ slug الخاص بها
 */
export const getCachedCategoryBySlug = cache(async (slug: string): Promise<Category | null> => {
  if (!slug) return null;

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    // لا تطبع خطأ إذا كان السبب "not found"، فهذا متوقع
    if (error.code !== 'PGRST116') {
      console.error(`Error fetching category with slug "${slug}":`, error.message)
    }
    return null
  }

  return data
})

/**
 * دالة لجلب منتجات فئة معينة باستخدام الـ slug الخاص بالفئة
 */
export const getCachedProductsByCategorySlug = cache(async (slug: string): Promise<Product[]> => {
  if (!slug) return [];

  const category = await getCachedCategoryBySlug(slug)
  if (!category) {
    return [] // إذا لم توجد الفئة، لا توجد منتجات
  }

  const { data: products, error } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('category_id', category.id)
    .eq('in_stock', true)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error(`Error fetching products for category slug "${slug}":`, error.message)
    return []
  }

  return products || []
})

/**
 * دالة لجلب كل الـ slugs لإنشاء الصفحات الثابتة (generateStaticParams)
 */
export const getAllCategorySlugs = cache(async () => {
  const { data, error } = await supabase.from('categories').select('slug')

  if (error) {
    console.error('Error fetching category slugs:', error.message)
    return []
  }

  return data?.map((category) => ({
    slug: category.slug,
  })) || []
})