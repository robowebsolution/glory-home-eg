import { createClient } from '@/lib/supabase-server';
import { unstable_noStore as noStore } from 'next/cache';
import { CustomersClientPage } from './CustomersClientPage';

export default async function AdminCustomersPage() {
  noStore();
  const supabase = await createClient();

  const { data: customers, error } = await supabase
    .from('customers')
    .select('id, image_url, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading customers:', error);
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Error Loading Customers</h1>
        <p className="text-red-400">Could not fetch customers from the database. Please try again later.</p>
        <pre className="mt-4 text-xs bg-red-900/20 p-4 rounded-md">{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  return <CustomersClientPage customers={customers || []} />;
}
