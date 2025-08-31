"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import type { ProjectCategory } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = z.object({
  id: z.coerce.number().optional(),
  name_en: z.string().min(1, 'English name is required.'),
  name_ar: z.string().min(1, 'Arabic name is required.'),
});

export type ProjectCategoryFormData = z.infer<typeof schema>;

interface ProjectCategoryFormProps {
  category: ProjectCategory | null;
  onSubmit: (data: ProjectCategoryFormData) => void;
  onClose: () => void;
  isPending: boolean;
}

export function ProjectCategoryForm({ category, onSubmit, onClose, isPending }: ProjectCategoryFormProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProjectCategoryFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name_en: '',
      name_ar: '',
    }
  });

  useEffect(() => {
    if (category) {
      reset({ id: Number(category.id), name_en: category.name_en || '', name_ar: category.name_ar || '' });
    } else {
      reset({ name_en: '', name_ar: '' });
    }
  }, [category, reset]);

  return (
    <form id="project-category-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex-grow overflow-y-auto pr-4">
      {category?.id != null && (
        <input type="hidden" value={String(category.id)} {...register('id')} />
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name_en">Name (English) <span className="text-red-500">*</span></Label>
          <Input id="name_en" {...register('name_en')} />
          {errors.name_en && <p className="text-red-500 text-xs mt-1">{errors.name_en.message}</p>}
        </div>
        <div>
          <Label htmlFor="name_ar">Name (Arabic) <span className="text-red-500">*</span></Label>
          <Input id="name_ar" {...register('name_ar')} />
          {errors.name_ar && <p className="text-red-500 text-xs mt-1">{errors.name_ar.message}</p>}
        </div>
      </div>
    </form>
  );
}
