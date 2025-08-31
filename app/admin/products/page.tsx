import { createClient } from '@/lib/supabase-server';
import { ProductsClientPage } from './ProductsClientPage';
import { unstable_noStore as noStore } from 'next/cache';

export default async function AdminProductsPage() {
  noStore(); // Ensures fresh data on every request, preventing caching issues.

  const supabase = await createClient();

  // Fetch products and categories in parallel for efficiency
  const [productsResult, categoriesResult] = await Promise.all([
    supabase
      .from('products')
      .select('*, categories(name, name_ar)')
      .order('created_at', { ascending: false }),
    supabase
      .from('categories')
      .select('*')
  ]);

  const { data: productsData, error: productsError } = productsResult;
  const { data: categoriesData, error: categoriesError } = categoriesResult;

  if (productsError || categoriesError) {
    console.error('Error loading dashboard data:', productsError || categoriesError);
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Error Loading Data</h1>
        <p className="text-red-400">Could not fetch required data from the database. Please try again later.</p>
        <pre className="mt-4 text-xs bg-red-900/20 p-4 rounded-md">{JSON.stringify(productsError || categoriesError, null, 2)}</pre>
      </div>
    );
  }

  return <ProductsClientPage products={productsData || []} categories={categoriesData || []} />;
}