"use client";

import { useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';

import type { ProjectCategory } from '@/lib/types';
import { saveProjectCategory, deleteProjectCategory } from './actions';

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
import { PlusCircle, Search, FolderOpen } from 'lucide-react';
import { ProjectCategoryForm } from '@/components/admin/project-categories/ProjectCategoryForm';
import { ProjectCategoryCard } from '@/components/admin/project-categories/ProjectCategoryCard';

interface ProjectCategoriesClientPageProps {
  categories: ProjectCategory[];
}

export function ProjectCategoriesClientPage({ categories }: ProjectCategoriesClientPageProps) {
  const [isPending, startTransition] = useTransition();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return categories.filter(c =>
      (c.name_en || '').toLowerCase().includes(q) ||
      (c.name_ar || '').toLowerCase().includes(q)
    );
  }, [categories, searchTerm]);

  const handleAdd = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: ProjectCategory) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = (categoryId: string | number) => {
    if (confirm('هل أنت متأكد من حذف فئة المشروع؟ قد يؤثر هذا على المشاريع المرتبطة.')) {
      startTransition(async () => {
        const result = await deleteProjectCategory(categoryId);
        if (result.success) toast.success(result.message);
        else toast.error(result.message);
      });
    }
  };

  const handleFormSubmit = (data: { id?: number; name_en: string; name_ar: string; cover?: string }) => {
    setIsFormOpen(false);
    startTransition(async () => {
      const result = await saveProjectCategory(data, selectedCategory?.id || null);
      if (result.success) toast.success(result.message);
      else {
        toast.error(result.message);
        setIsFormOpen(true);
      }
    });
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">فئات المشاريع</h1>
          <p className="text-muted-foreground">إنشاء وإدارة فئات المشاريع.</p>
        </div>
        <Button onClick={handleAdd}>
          <PlusCircle className="mr-2 h-4 w-4" />
          إضافة فئة مشروع
        </Button>
      </header>

      {/* Search */}
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

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredCategories.length > 0 ? (
          filteredCategories.map(cat => (
            <ProjectCategoryCard
              key={cat.id}
              category={cat}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground">لا توجد فئات</h3>
            <p className="text-muted-foreground mt-2">ابدأ بإضافة فئة مشروع جديدة.</p>
          </div>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCategory ? 'تعديل فئة مشروع' : 'إضافة فئة مشروع'}</DialogTitle>
            <DialogDescription>
              املأ تفاصيل الفئة. انقر على "حفظ" عند الانتهاء.
            </DialogDescription>
          </DialogHeader>

          <ProjectCategoryForm
            key={selectedCategory?.id || 'new-project-category'}
            category={selectedCategory}
            onSubmit={handleFormSubmit}
            isPending={isPending}
            onClose={() => setIsFormOpen(false)}
          />

          <DialogFooter className="flex-shrink-0 pt-4 border-t">
            <DialogClose asChild>
              <Button type="button" variant="outline">إلغاء</Button>
            </DialogClose>
            <Button type="submit" form="project-category-form" disabled={isPending}>
              {isPending ? 'جاري الحفظ...' : 'حفظ الفئة'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
