"use client";

import { useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';

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
  DialogClose,
} from '@/components/ui/dialog';
import { PlusCircle, Search } from 'lucide-react';

import { ProjectForm } from '@/components/admin/projects/ProjectForm';
import { ProjectCard } from '@/components/admin/projects/ProjectCard';
import { deleteProject, saveProject } from './actions';
import type { ProjectFormData } from '@/lib/schemas';

interface ProjectCategory { id: number; name_en: string; name_ar: string }
interface ProjectItem { id?: number; name_en: string; name_ar: string; description_en?: string | null; description_ar?: string | null; category_id: number; images?: string[]; cover?: string | null }

interface ProjectsClientPageProps {
  projects: ProjectItem[];
  categories: ProjectCategory[];
}

export function ProjectsClientPage({ projects, categories }: ProjectsClientPageProps) {
  const [isPending, startTransition] = useTransition();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');

  const filteredProjects = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return projects.filter(p => {
      const matchesCategory = selectedCategory === 'all' || p.category_id === selectedCategory;
      const matchesSearch = (p.name_en || '').toLowerCase().includes(q) || (p.name_ar || '').toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [projects, searchTerm, selectedCategory]);

  const handleAdd = () => {
    setSelectedProject(null);
    setIsFormOpen(true);
  };

  const handleEdit = (project: ProjectItem) => {
    setSelectedProject(project);
    setIsFormOpen(true);
  };

  const handleDelete = (projectId: number | string) => {
    if (confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
      startTransition(async () => {
        const result = await deleteProject(projectId);
        if (result.success) toast.success(result.message);
        else toast.error(result.message);
      });
    }
  };

  const handleFormSubmit = (data: ProjectFormData) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        if (selectedProject?.id) formData.append('id', String(selectedProject.id));

        Object.keys(data).forEach(keyStr => {
          const key = keyStr as keyof ProjectFormData;
          const value = (data as any)[key];
          if (value === null || value === undefined) return;
          if (key === 'gallery_images') {
            if (Array.isArray(value)) {
              // Expecting array of { value: string } or strings
              value.forEach((item: any) => {
                const url = typeof item === 'string' ? item : (item?.value ?? '');
                if (url) formData.append('gallery_images', url);
              });
            }
          } else {
            formData.append(key, value as any);
          }
        });

        const result = await saveProject(null, formData);
        if (result.success) {
          toast.success(result.message);
          setIsFormOpen(false);
        } else {
          toast.error(result.message);
        }
      } catch (e) {
        toast.error('حدث خطأ غير متوقع.');
      }
    });
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">المشاريع</h1>
          <p className="text-muted-foreground">إدارة جميع مشاريعك.</p>
        </div>
        <Button onClick={handleAdd}>
          <PlusCircle className="mr-2 h-4 w-4" />
          إضافة مشروع
        </Button>
      </header>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap pb-4 border-b border-border">
        <div className="relative flex-grow sm:flex-grow-0 sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="البحث باسم المشروع..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-muted/40 focus:bg-background"
          />
        </div>
        <Select value={String(selectedCategory)} onValueChange={(v) => setSelectedCategory(v === 'all' ? 'all' : Number(v))}>
          <SelectTrigger className="w-full sm:w-[200px] bg-muted/40 focus:bg-background">
            <SelectValue placeholder="فلترة حسب الفئة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الفئات</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={String(cat.id)}>{cat.name_ar || cat.name_en}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-12">
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <h3 className="text-xl font-semibold text-foreground">لا توجد مشاريع</h3>
            <p className="text-muted-foreground mt-2">لا توجد مشاريع تطابق معايير البحث الحالية.</p>
          </div>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl h-[95vh] flex flex-col" scroll-lock-disabled="true">
          <DialogHeader>
            <DialogTitle>{selectedProject ? 'تعديل المشروع' : 'إضافة مشروع جديد'}</DialogTitle>
            <DialogDescription>املأ تفاصيل المشروع. انقر على "حفظ" عند الانتهاء.</DialogDescription>
          </DialogHeader>
          <ProjectForm
            key={selectedProject?.id || 'new-project'}
            project={selectedProject}
            categories={categories}
            onSubmit={handleFormSubmit}
            isPending={isPending}
          />
          <DialogFooter className="flex-shrink-0 pt-4 border-t">
            <DialogClose asChild>
              <Button type="button" variant="outline">إلغاء</Button>
            </DialogClose>
            <Button type="submit" form="project-form" disabled={isPending}>
              {isPending ? 'جاري الحفظ...' : 'حفظ المشروع'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
