import { createClient } from '@/lib/supabase-server';
import { unstable_noStore as noStore } from 'next/cache';
import { ProjectCategoriesClientPage } from './ProjectCategoriesClientPage';

export default async function AdminProjectCategoriesPage() {
  noStore();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('project_categories')
    .select('id, name_en, name_ar, cover')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error loading project categories:', error);
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Error Loading Project Categories</h1>
        <p className="text-red-400">Could not fetch project category data. Please try again later.</p>
        <pre className="mt-4 text-xs bg-red-900/20 p-4 rounded-md">{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  return <ProjectCategoriesClientPage categories={(data as any[]) || []} />;
}
