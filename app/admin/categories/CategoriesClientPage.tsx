"use client";

import { useState, useTransition, useMemo } from 'react';
import { toast } from 'sonner';
import type { Category } from '@/lib/types';
import { deleteCategory, saveCategory } from './actions';
import type { CategoryFormData } from '@/lib/schemas';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { CategoryForm } from '@/components/admin/categories/CategoryForm';
import { CategoryCard } from '@/components/admin/categories/CategoryCard';
import { PlusCircle, Search, FolderOpen } from 'lucide-react';

interface CategoriesClientPageProps {
  categories: Category[];
}

export function CategoriesClientPage({ categories }: CategoriesClientPageProps) {
  const [isPending, startTransition] = useTransition();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = useMemo(() => {
    return categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.name_ar.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm('هل أنت متأكد أنك تريد حذف هذه الفئة؟ قد يؤثر هذا على المنتجات المرتبطة بها.')) {
      startTransition(async () => {
        const result = await deleteCategory(categoryId);
        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
      });
    }
  };

  const handleFormSubmit = (data: CategoryFormData) => {
    setIsFormOpen(false);
    startTransition(async () => {
      const result = await saveCategory(data, selectedCategory?.id || null);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
        setIsFormOpen(true); // Re-open form on error
      }
    });
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">الفئات</h1>
          <p className="text-muted-foreground">تنظيم منتجاتك عن طريق إنشاء وإدارة الفئات.</p>
        </div>
        <Button onClick={handleAddCategory}>
          <PlusCircle className="mr-2 h-4 w-4" /> 
          إضافة فئة
        </Button>
      </header>

      {/* Search Filter */}
      <div className="pb-4 border-b border-border">
        <div className="relative sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="البحث باسم الفئة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-muted/40 focus:bg-background"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredCategories.length > 0 ? (
          filteredCategories.map(category => (
            <CategoryCard 
              key={category.id} 
              category={category} 
              onEdit={handleEditCategory} 
              onDelete={handleDeleteCategory} 
            />
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground">لم يتم العثور على فئات</h3>
            <p className="text-muted-foreground mt-2">ابدأ بإضافة فئة جديدة لتنظيم منتجاتك.</p>
          </div>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCategory ? 'تعديل الفئة' : 'إضافة فئة جديدة'}</DialogTitle>
            <DialogDescription>
              املأ تفاصيل الفئة. انقر على "حفظ" عند الانتهاء.
            </DialogDescription>
          </DialogHeader>
          <CategoryForm 
            key={selectedCategory?.id || 'new-category'}
            category={selectedCategory}
            allCategories={categories}
            onSubmit={handleFormSubmit}
            isPending={isPending}
            onClose={() => setIsFormOpen(false)}
          />
           <DialogFooter className="flex-shrink-0 pt-4 border-t">
            <DialogClose asChild>
              <Button type="button" variant="outline">إلغاء</Button>
            </DialogClose>
            <Button type="submit" form="category-form" disabled={isPending}>
              {isPending ? 'جاري الحفظ...' : 'حفظ الفئة'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
