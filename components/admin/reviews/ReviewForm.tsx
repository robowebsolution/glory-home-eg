"use client";

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Review } from '@/lib/types';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const schema = z.object({
  comment_ar: z.string().min(1, 'النص العربي مطلوب'),
  comment_en: z.string().min(1, 'English text is required'),
});

type FormValues = z.infer<typeof schema>;

interface ReviewFormProps {
  review: Review | null;
  onSubmit: (data: FormValues) => void;
  isPending?: boolean;
}

export function ReviewForm({ review, onSubmit, isPending }: ReviewFormProps) {
  const defaultValues = useMemo<FormValues>(() => ({
    comment_ar: review?.comment_ar ?? '',
    comment_en: review?.comment_en ?? '',
  }), [review]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form id="review-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="comment_ar">التعليق (AR)</Label>
        <Textarea id="comment_ar" rows={4} placeholder="اكتب تعليق العميل بالعربية" {...register('comment_ar')} />
        {errors.comment_ar && (
          <p className="text-sm text-destructive mt-1">{errors.comment_ar.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment_en">Comment (EN)</Label>
        <Textarea id="comment_en" rows={4} placeholder="Write the customer review in English" {...register('comment_en')} />
        {errors.comment_en && (
          <p className="text-sm text-destructive mt-1">{errors.comment_en.message}</p>
        )}
      </div>
    </form>
  );
}
