import { createClient } from '@/lib/supabase-server';
import { CategoriesClientPage } from './CategoriesClientPage';
import { unstable_noStore as noStore } from 'next/cache';

export default async function AdminCategoriesPage() {
  noStore(); // Ensures fresh data on every request

  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error loading categories:', error);
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Error Loading Categories</h1>
        <p className="text-red-400">Could not fetch category data from the database. Please try again later.</p>
        <pre className="mt-4 text-xs bg-red-900/20 p-4 rounded-md">{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  return <CategoriesClientPage categories={categories || []} />;
}
