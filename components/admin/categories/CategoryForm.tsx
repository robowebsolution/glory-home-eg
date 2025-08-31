"use client";

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import type { Category } from '@/lib/types';
import { generateSlug } from '@/lib/utils';


import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required.'),
  name_ar: z.string().min(1, 'Arabic name is required.'),
  slug: z.string().min(1, 'Slug is required.'),
  description: z.string().optional().nullable(),
  description_ar: z.string().optional().nullable(),
  image_url: z.string().url('Must be a valid URL.').optional().or(z.literal('')).nullable(),
  banner_image: z.string().url('Must be a valid URL.').optional().or(z.literal('')).nullable(),
  icon_name: z.string().optional().nullable(),
  sort_order: z.coerce.number().default(0),
  is_featured: z.boolean().default(false),
  parent_id: z.string().uuid().optional().nullable().or(z.literal('')), 
  meta_title_en: z.string().optional().nullable(),
  meta_title_ar: z.string().optional().nullable(),
  meta_description_en: z.string().optional().nullable(),
  meta_description_ar: z.string().optional().nullable(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  onSubmit: (data: CategoryFormData) => void;
  onClose: () => void;
  isPending: boolean;
  category: Category | null;
  allCategories: Category[];
}

export function CategoryForm({ onSubmit, onClose, isPending, category, allCategories }: CategoryFormProps) {
  const { register, handleSubmit, formState: { errors }, reset, control, setValue, watch } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '', name_ar: '', slug: '', description: '', description_ar: '',
      image_url: '', banner_image: '', icon_name: '', sort_order: 0,
      is_featured: false, parent_id: '', meta_title_en: '', meta_title_ar: '',
      meta_description_en: '', meta_description_ar: ''
    }
  });

  const nameValue = watch('name');
  useEffect(() => {
    if (nameValue && !category) { // Only auto-generate for new categories
      setValue('slug', generateSlug(nameValue));
    }
  }, [nameValue, setValue, category]);

  useEffect(() => {
    if (category) {
      const resetData = { ...category };
      Object.keys(resetData).forEach(key => {
        if (resetData[key as keyof typeof resetData] === null) {
          resetData[key as keyof typeof resetData] = '' as any;
        }
      });
      reset(resetData);
    } else {
      reset({
        name: '', name_ar: '', slug: '', description: '', description_ar: '',
        image_url: '', banner_image: '', icon_name: '', sort_order: 0,
        is_featured: false, parent_id: '', meta_title_en: '', meta_title_ar: '',
        meta_description_en: '', meta_description_ar: ''
      });
    }
  }, [category, reset]);

  const processForm = (data: CategoryFormData) => {
    const finalData = { ...data, parent_id: data.parent_id === '' ? null : data.parent_id };
    onSubmit(finalData);
  };

  return (
    <form id="category-form" onSubmit={handleSubmit(processForm)} className="space-y-4 flex-grow overflow-y-auto pr-4">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            {/* Basic Tab */}
            <TabsContent value="basic" className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name (English) <span className="text-red-500">*</span></Label>
                  <Input id="name" {...register('name')} />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="name_ar">Name (Arabic) <span className="text-red-500">*</span></Label>
                  <Input id="name_ar" {...register('name_ar')} />
                  {errors.name_ar && <p className="text-red-500 text-xs mt-1">{errors.name_ar.message}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="slug">Slug <span className="text-red-500">*</span></Label>
                <Input id="slug" {...register('slug')} />
                {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
              </div>
              <div>
                <Label htmlFor="description">Description (English)</Label>
                <Textarea id="description" {...register('description')} />
              </div>
              <div>
                <Label htmlFor="description_ar">Description (Arabic)</Label>
                <Textarea id="description_ar" {...register('description_ar')} />
              </div>
            </TabsContent>

            {/* Advanced Tab */}
            <TabsContent value="advanced" className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="parent_id">Parent Category</Label>
                  <Controller
                      name="parent_id"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={(v) => field.onChange(v === 'none' ? '' : v)} defaultValue={field.value ?? 'none'}>
                          <SelectTrigger><SelectValue placeholder="Select a parent" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {allCategories.filter(c => c.id !== category?.id).map(cat => (
                              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                </div>
                <div>
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input id="sort_order" type="number" {...register('sort_order')} />
                </div>
              </div>
               <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input id="image_url" {...register('image_url')} placeholder="https://..." />
                  {errors.image_url && <p className="text-red-500 text-xs mt-1">{errors.image_url.message}</p>}
              </div>
              <div>
                  <Label htmlFor="banner_image">Banner Image URL</Label>
                  <Input id="banner_image" {...register('banner_image')} placeholder="https://..." />
                  {errors.banner_image && <p className="text-red-500 text-xs mt-1">{errors.banner_image.message}</p>}
              </div>
               <div>
                  <Label htmlFor="icon_name">Icon Name (Lucide)</Label>
                  <Input id="icon_name" {...register('icon_name')} placeholder="e.g., Sofa" />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                 <Controller
                    name="is_featured"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="is_featured"
                      />
                    )}
                  />
                <Label htmlFor="is_featured">Featured Category</Label>
              </div>
            </TabsContent>

            {/* SEO Tab */}
            <TabsContent value="seo" className="space-y-4 py-4">
               <div>
                  <Label htmlFor="meta_title_en">Meta Title (English)</Label>
                  <Input id="meta_title_en" {...register('meta_title_en')} />
              </div>
               <div>
                  <Label htmlFor="meta_title_ar">Meta Title (Arabic)</Label>
                  <Input id="meta_title_ar" {...register('meta_title_ar')} />
              </div>
              <div>
                  <Label htmlFor="meta_description_en">Meta Description (English)</Label>
                  <Textarea id="meta_description_en" {...register('meta_description_en')} />
              </div>
               <div>
                  <Label htmlFor="meta_description_ar">Meta Description (Arabic)</Label>
                  <Textarea id="meta_description_ar" {...register('meta_description_ar')} />
              </div>
            </TabsContent>
          </Tabs>

        </form>
  );
}
