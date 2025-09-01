"use client";

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Video } from '@/lib/types';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const schema = z.object({
  title_ar: z.string().optional(),
  title_en: z.string().optional(),
  src: z.string().min(1, 'رابط الفيديو مطلوب'),
  thumbnail: z.string().optional(),
  duration: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface VideoFormProps {
  video: Video | null;
  onSubmit: (data: FormValues) => void;
  isPending?: boolean;
}

export function VideoForm({ video, onSubmit, isPending }: VideoFormProps) {
  const defaultValues = useMemo<FormValues>(() => ({
    title_ar: video?.title_ar ?? '',
    title_en: video?.title_en ?? '',
    src: video?.src ?? '',
    thumbnail: video?.thumbnail ?? '',
    duration: video?.duration ?? '',
  }), [video]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form id="video-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title_ar">العنوان (AR)</Label>
        <Input id="title_ar" placeholder="أدخل العنوان بالعربية" {...register('title_ar')} />
        {errors.title_ar && (
          <p className="text-sm text-destructive mt-1">{errors.title_ar.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="title_en">Title (EN)</Label>
        <Input id="title_en" placeholder="Enter English title" {...register('title_en')} />
        {errors.title_en && (
          <p className="text-sm text-destructive mt-1">{errors.title_en.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="src">رابط الفيديو</Label>
        <Input id="src" placeholder="https://... أو رابط من مخزن Supabase" {...register('src')} />
        {errors.src && (
          <p className="text-sm text-destructive mt-1">{errors.src.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="thumbnail">الصورة المصغرة (اختياري)</Label>
        <Input id="thumbnail" placeholder="https://..." {...register('thumbnail')} />
        {errors.thumbnail && (
          <p className="text-sm text-destructive mt-1">{errors.thumbnail.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">المدة (اختياري)</Label>
        <Input id="duration" placeholder="مثال: 2:45" {...register('duration')} />
        {errors.duration && (
          <p className="text-sm text-destructive mt-1">{errors.duration.message}</p>
        )}
      </div>
    </form>
  );
}
