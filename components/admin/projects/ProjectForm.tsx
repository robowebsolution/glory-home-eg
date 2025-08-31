"use client";

import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import type { ProjectFormData } from '@/lib/schemas';
import { projectSchema } from '@/lib/schemas';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// Using URL inputs for images (no uploads)

interface ProjectCategory { id: number; name_en: string; name_ar: string }
interface ProjectItem { id?: number; name_en: string; name_ar: string; description_en?: string | null; description_ar?: string | null; category_id: number; images?: string[]; cover?: string | null }

interface ProjectFormProps {
  project: ProjectItem | null;
  categories: ProjectCategory[];
  onSubmit: (data: ProjectFormData) => void;
  isPending: boolean;
}

export function ProjectForm({ project, categories, onSubmit, isPending }: ProjectFormProps) {
  const sanitizedDefaults = {
    id: project?.id ?? undefined,
    name_en: project?.name_en ?? '',
    name_ar: project?.name_ar ?? '',
    description_en: project?.description_en ?? '',
    description_ar: project?.description_ar ?? '',
    category_id: project?.category_id ?? (categories[0]?.id ?? ''),
    gallery_images: project?.images?.map(url => ({ value: url })) ?? [],
  } as any;

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: sanitizedDefaults,
  });

  const { handleSubmit, control } = form;

  const { fields: galleryFields, append: appendGallery, remove: removeGallery } = useFieldArray({ control, name: 'gallery_images' as any });

  return (
    <Form {...form}>
      <form id="project-form" onSubmit={handleSubmit(onSubmit, (errors) => console.error('Validation errors', errors))} className="flex-grow overflow-hidden flex flex-col">
        <Tabs defaultValue="basic" className="flex-grow flex flex-col overflow-hidden">
          <TabsList className="flex-shrink-0">
            <TabsTrigger value="basic">الأساسيات</TabsTrigger>
            <TabsTrigger value="media">الصور</TabsTrigger>
          </TabsList>
          <div className="flex-grow overflow-y-auto p-4 space-y-6">
            <TabsContent value="basic" className="space-y-4 m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="name_en" render={({ field }) => (<FormItem><FormLabel>الاسم (EN) <span className="text-red-500">*</span></FormLabel><FormControl><Input placeholder="e.g. Villa Project" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="name_ar" render={({ field }) => (<FormItem><FormLabel>الاسم (AR) <span className="text-red-500">*</span></FormLabel><FormControl><Input dir="rtl" placeholder="مثال: مشروع فيلا" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <FormField control={form.control} name="description_en" render={({ field }) => (<FormItem><FormLabel>الوصف (EN)</FormLabel><FormControl><Textarea placeholder="Project description..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="description_ar" render={({ field }) => (<FormItem><FormLabel>الوصف (AR)</FormLabel><FormControl><Textarea dir="rtl" placeholder="وصف المشروع..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="category_id" render={({ field }) => (
                <FormItem>
                  <FormLabel>الفئة <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={(v) => field.onChange(Number(v))} defaultValue={field.value ? String(field.value) : ''}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر فئة" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(c => (
                        <SelectItem key={c.id} value={String(c.id)}>{c.name_ar || c.name_en}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </TabsContent>

            <TabsContent value="media" className="space-y-6 m-0">
              <div>
                <Label>روابط صور المعرض</Label>
                <div className="space-y-3 pt-2">
                  {galleryFields.map((f, index) => (
                    <div key={f.id} className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name={`gallery_images.${index}.value` as any}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="https://..." {...field} value={(field.value as any) ?? ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="button" variant="destructive" onClick={() => removeGallery(index)}>حذف</Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => appendGallery({ value: '' } as any)}>إضافة رابط صورة</Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </form>
    </Form>
  );
}
