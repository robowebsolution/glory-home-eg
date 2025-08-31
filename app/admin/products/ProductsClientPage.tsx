"use client";

import { useState, useTransition, useMemo } from 'react';
import { toast } from 'sonner';
import type { Product, Category } from '@/lib/types';
import { deleteProduct, saveProduct } from './actions';
import type { ProductFormData } from '@/lib/schemas';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { ProductForm } from '@/components/admin/products/ProductForm';
import { ProductCard } from '@/components/admin/products/ProductCard';
import { PlusCircle, Search } from 'lucide-react';


type ProductWithCategory = Product & { categories: Pick<Category, 'name' | 'name_ar'> | null };

interface ProductsClientPageProps {
  products: ProductWithCategory[];
  categories: Category[];
}

export function ProductsClientPage({ products, categories }: ProductsClientPageProps) {
  const [isPending, startTransition] = useTransition();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
      const matchesSearch = (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (product.name_ar || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, searchTerm, selectedCategory]);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: ProductFormData) => {
    startTransition(() => {
      (async () => {
        try {
          const formData = new FormData();
          if (selectedProduct?.id) {
            formData.append('id', selectedProduct.id);
          }

          Object.keys(data).forEach(keyStr => {
            const key = keyStr as keyof ProductFormData;
            const value = data[key];

            if (value === null || value === undefined) return;

            if (key === 'gallery_images') {
              if (Array.isArray(value)) {
                value.forEach((item: any) => {
                  // item can be:
                  // - File (from a native input somewhere)
                  // - string URL
                  // - object { value: string | File } from our form field array
                  if (item instanceof File) {
                    formData.append('gallery_images', item);
                  } else if (typeof item === 'string') {
                    if (item) formData.append('existing_gallery_images', item);
                  } else if (item && typeof item === 'object') {
                    const v = (item as any).value;
                    if (v instanceof File) {
                      formData.append('gallery_images', v);
                    } else if (typeof v === 'string' && v) {
                      formData.append('existing_gallery_images', v);
                    }
                  }
                });
              }
            } else if (key === 'tags_en' || key === 'tags_ar') {
              if (Array.isArray(value)) {
                const plainValues = value.map(item => item.value).filter(Boolean);
                if (plainValues.length > 0) {
                  formData.append(key, JSON.stringify(plainValues));
                }
              }
            } else if (typeof value === 'boolean') {
              formData.append(key, value.toString());
            } else {
              formData.append(key, value as string | Blob);
            }
          });

          const result = await saveProduct(null, formData);

          if (result.success) {
            toast.success(result.message);
            setIsFormOpen(false);
          } else {
            toast.error(result.message);
          }
        } catch (error) {
          toast.error("An unexpected error occurred. Please try again.");
        }
      })();
    });
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      startTransition(() => {
        (async () => {
          try {
            const result = await deleteProduct(productId);
            if (result.success) {
              toast.success(result.message);
            } else {
              toast.error(result.message);
            }
          } catch (error) {
            toast.error("An unexpected error occurred during deletion.");
          }
        })();
      });
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">المنتجات</h1>
          <p className="text-muted-foreground">إدارة جميع منتجات متجرك.</p>
        </div>
        <Button onClick={handleAddProduct}>
          <PlusCircle className="mr-2 h-4 w-4" /> 
          إضافة منتج
        </Button>
      </header>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap pb-4 border-b border-border">
        <div className="relative flex-grow sm:flex-grow-0 sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="البحث باسم المنتج..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-muted/40 focus:bg-background"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[200px] bg-muted/40 focus:bg-background">
            <SelectValue placeholder="فلترة حسب الفئة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الفئات</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name_ar || cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-12">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onEdit={handleEditProduct} 
              onDelete={handleDeleteProduct} 
            />
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <h3 className="text-xl font-semibold text-foreground">لم يتم العثور على منتجات</h3>
            <p className="text-muted-foreground mt-2">لا توجد منتجات تطابق معايير البحث الحالية.</p>
          </div>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl h-[95vh] flex flex-col" scroll-lock-disabled="true">
          <DialogHeader>
            <DialogTitle>{selectedProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</DialogTitle>
            <DialogDescription>
              املأ تفاصيل المنتج. انقر على "حفظ" عند الانتهاء.
            </DialogDescription>
          </DialogHeader>
          <ProductForm 
            key={selectedProduct?.id || 'new-product'}
            product={selectedProduct}
            categories={categories}
            onSubmit={handleFormSubmit}
            isPending={isPending}
          />
          <DialogFooter className="flex-shrink-0 pt-4 border-t">
            <DialogClose asChild>
              <Button type="button" variant="outline">إلغاء</Button>
            </DialogClose>
            <Button type="submit" form="product-form" disabled={isPending}>
              {isPending ? 'جاري الحفظ...' : 'حفظ المنتج'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
