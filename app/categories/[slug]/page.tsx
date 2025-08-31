import { CategoryPage } from "@/components/category-page"
import { 
  getCachedCategoryBySlug, 
  getCachedProductsByCategorySlug, 
  getAllCategorySlugs 
} from "@/lib/supabase" // استيراد الدوال من الملف المركزي
import { notFound } from "next/navigation"
import type { Metadata } from 'next'

// واجهة لتحديد أنواع الـ props التي ستستقبلها الصفحة
interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

// إعادة التحقق من البيانات كل ساعة لتحديث المحتوى
export const revalidate = 3600;

// (اختياري ولكن موصى به) دالة لإنشاء بيانات Meta ديناميكية (SEO)
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCachedCategoryBySlug(slug);

  if (!category) {
    return {
      title: 'الفئة غير موجودة',
      description: 'لم نتمكن من العثور على الفئة التي تبحث عنها.'
    }
  }

  return {
    title: category.name, // عنوان الصفحة في المتصفح
    description: category.description, // وصف الصفحة لمحركات البحث
    alternates: { canonical: `/categories/${slug}` },
    openGraph: {
      title: category.name,
      description: category.description,
      images: [{ url: '/logo.webp', width: 1200, height: 630, alt: category.name }],
    },
  }
}

// مكون الصفحة الرئيسي (Server Component)
export default async function Page({ params }: CategoryPageProps) {
  const { slug } = await params

  // استخدام Promise.all لجلب البيانات على التوازي لتحسين الأداء
  const [category, products] = await Promise.all([
    getCachedCategoryBySlug(slug),
    getCachedProductsByCategorySlug(slug)
  ]);

  // إذا لم يتم العثور على الفئة، يتم عرض صفحة 404
  if (!category) {
    notFound()
  }

  // تمرير البيانات للمكون العميل الذي سيعرضها
  return <CategoryPage category={category} products={products} />
}

/**
 * دالة لإنشاء المسارات الثابتة (Static Paths) وقت البناء
 * هذا يجعل تحميل صفحات الفئات سريعًا جدًا.
 */
export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs()
  return slugs
}