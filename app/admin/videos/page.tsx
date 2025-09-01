import { createClient } from '@/lib/supabase-server';
import { unstable_noStore as noStore } from 'next/cache';
import { VideosClientPage } from './VideosClientPage';

export default async function AdminVideosPage() {
  noStore();
  const supabase = await createClient();

  const { data: videos, error } = await supabase
    .from('videos')
    .select('id, title_ar, title_en, src, thumbnail, duration, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading videos:', error);
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Error Loading Videos</h1>
        <p className="text-red-400">Could not fetch videos from the database. Please try again later.</p>
        <pre className="mt-4 text-xs bg-red-900/20 p-4 rounded-md">{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  return <VideosClientPage videos={videos || []} />;
}
