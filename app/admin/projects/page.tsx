import { createClient } from '@/lib/supabase-server';
import { unstable_noStore as noStore } from 'next/cache';
import { ProjectsClientPage } from './ProjectsClientPage';

export default async function AdminProjectsPage() {
  noStore();
  const supabase = await createClient();

  const [{ data: rawProjects, error: projError }, { data: categories, error: catError }] = await Promise.all([
    supabase
      .from('projects')
      .select('id, name_en, name_ar, description_en, description_ar, category_id, project_images(image_url)')
      .order('id', { ascending: false }),
    supabase
      .from('project_categories')
      .select('id, name_en, name_ar')
      .order('id', { ascending: true }),
  ]);

  if (projError || catError) {
    const error = projError || catError;
    console.error('Error loading projects or categories:', error);
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Error Loading Projects</h1>
        <p className="text-red-400">Could not fetch data from the database. Please try again later.</p>
        <pre className="mt-4 text-xs bg-red-900/20 p-4 rounded-md">{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  const projects = (rawProjects || []).map((p: any) => ({
    ...p,
    images: Array.isArray(p.project_images) ? p.project_images.map((x: any) => x.image_url) : [],
    cover: Array.isArray(p.project_images) && p.project_images.length > 0 ? p.project_images[0].image_url : null,
  }));

  return <ProjectsClientPage projects={projects as any[]} categories={(categories as any[]) || []} />;
}
