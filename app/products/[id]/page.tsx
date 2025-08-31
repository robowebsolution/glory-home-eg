import { notFound } from "next/navigation";
import type { Metadata } from 'next';

// استيراد الدوال من ملف البيانات المركزي
import { 
  getCachedProductById, 
  getAllProductIds 
} from "@/lib/supabase";

// استيراد المكون العميل والواجهات اللازمة
import { ProductClientPage } from "./ProductClientPage"; 
import type { Product } from "@/lib/supabase"; // استيراد الواجهة من المصدر الموحد

// واجهة لتحديد أنواع الـ props
interface ProductPageProps {
  params: Promise<{ id: string }>;
}

// إعادة التحقق من البيانات كل ساعة
export const revalidate = 3600;

// دالة لإنشاء بيانات Meta ديناميكية لتحسين SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getCachedProductById(id);

  if (!product) {
    return {
      title: 'المنتج غير موجود',
    }
  }

  return {
    title: product.name, // اسم المنتج كعنوان للصفحة
    description: product.description, // وصف المنتج لمحركات البحث
    openGraph: { // تحسين العرض عند المشاركة على وسائل التواصل الاجتماعي
      title: product.name,
      description: product.description,
      images: [
        {
          url: product.main_image,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
  };
}

// مكون الخادم الرئيسي للصفحة
export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  // جلب بيانات المنتج باستخدام الدالة المركزية
  // يمكنك أيضًا جلب بيانات أخرى على التوازي مثل المراجعات
  // const [product, reviews] = await Promise.all([
  //   getCachedProductById(id),
  //   getProductReviews(id)
  // ]);
  const product: Product | null = await getCachedProductById(id);

  // إذا لم يتم العثور على المنتج، اعرض صفحة 404
  if (!product) {
    notFound();
  }

  // تمرير البيانات الجاهزة إلى المكون العميل للعرض التفاعلي
  return <ProductClientPage product={product} />;
}

/**
 * دالة لإنشاء المسارات الثابتة (Static Paths) وقت البناء
 * تجعل تحميل صفحات المنتجات فائق السرعة
 */
export async function generateStaticParams() {
  const ids = await getAllProductIds();
  return ids;
}