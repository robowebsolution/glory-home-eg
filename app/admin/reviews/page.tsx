import { createClient } from '@/lib/supabase-server';
import { unstable_noStore as noStore } from 'next/cache';
import { ReviewsClientPage } from './ReviewsClientPage';

export default async function AdminReviewsPage() {
  noStore();
  const supabase = await createClient();

  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('id, comment_ar, comment_en, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading reviews:', error);
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Error Loading Reviews</h1>
        <p className="text-red-400">Could not fetch reviews from the database. Please try again later.</p>
        <pre className="mt-4 text-xs bg-red-900/20 p-4 rounded-md">{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  return <ReviewsClientPage reviews={reviews || []} />;
}
