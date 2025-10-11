import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import { ProductsClientPage } from './ProductsClientPage';
import { unstable_noStore as noStore } from 'next/cache';

import type { Category, Manufacturer } from '@/lib/types';

const PAGE_SIZE_DEFAULT = 20;

interface AdminProductsPageProps {
  searchParams?: Promise<{
    page?: string;
    pageSize?: string;
    category?: string;
    query?: string;
  }>;
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  noStore();

  const supabase = await createClient();

  const resolvedSearchParams = searchParams ? await searchParams : {};

  const pageParam = resolvedSearchParams?.page ?? '1';
  const pageSizeParam = resolvedSearchParams?.pageSize ?? String(PAGE_SIZE_DEFAULT);
  const selectedCategory = resolvedSearchParams?.category ?? 'all';
  const rawQuery = resolvedSearchParams?.query?.trim() ?? '';

  const currentPage = Math.max(Number.parseInt(pageParam, 10) || 1, 1);
  const pageSize = Math.min(Math.max(Number.parseInt(pageSizeParam, 10) || PAGE_SIZE_DEFAULT, 5), 100);

  const { data: categoriesData, error: categoriesError } = await supabase
    .from('categories')
    .select('*');

  const { data: manufacturersData, error: manufacturersError } = await supabase
    .from('manufacturers')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize - 1;

  let productsQuery = supabase
    .from('products')
    .select('*, categories(name, name_ar)', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (selectedCategory !== 'all') {
    productsQuery = productsQuery.eq('category_id', selectedCategory);
  }

  if (rawQuery) {
    const escaped = rawQuery.replace(/[%_]/g, '\\$&');
    productsQuery = productsQuery.or(`name.ilike.%${escaped}%,name_ar.ilike.%${escaped}%`);
  }

  const { data: productsData, error: productsError, count: productsCount } = await productsQuery.range(start, end);

  if (currentPage > 1 && productsCount && start >= productsCount) {
    redirect(`/admin/products?page=${Math.max(Math.ceil(productsCount / pageSize), 1)}&pageSize=${pageSize}`);
  }

  let hdfCategory: Category | null = null;
  let hdfCountries: Category[] = [];

  if (categoriesData) {
    hdfCategory = (categoriesData as Category[]).find((cat) => cat.slug === 'hdf') ?? null;

    if (hdfCategory) {
      const { data: countriesData, error: countriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('parent_id', hdfCategory.id)
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

      if (countriesError) {
        console.error('Error loading HDF countries:', countriesError);
      } else {
        hdfCountries = (countriesData as Category[]) ?? [];
      }
    }
  }

  if (productsError || categoriesError || manufacturersError) {
    console.error('Error loading dashboard data:', productsError || categoriesError || manufacturersError);
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Error Loading Data</h1>
        <p className="text-red-400">Could not fetch required data from the database. Please try again later.</p>
        <pre className="mt-4 text-xs bg-red-900/20 p-4 rounded-md">{JSON.stringify(productsError || categoriesError || manufacturersError, null, 2)}</pre>
      </div>
    );
  }

  return (
    <ProductsClientPage
      products={(productsData as any[]) || []}
      categories={(categoriesData as Category[]) || []}
      hdfCategory={hdfCategory}
      hdfCountries={hdfCountries}
      manufacturers={(manufacturersData as Manufacturer[]) || []}
      pagination={{
        page: currentPage,
        pageSize,
        totalCount: productsCount ?? 0,
      }}
    />
  );
}