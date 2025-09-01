"use client";

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Customer } from '@/lib/types';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const schema = z.object({
  image_url: z.string().url('الرابط يجب أن يكون صالحاً'),
});

type FormValues = z.infer<typeof schema>;

interface CustomerFormProps {
  customer: Customer | null;
  onSubmit: (data: FormValues) => void;
  isPending?: boolean;
}

export function CustomerForm({ customer, onSubmit, isPending }: CustomerFormProps) {
  const defaultValues = useMemo<FormValues>(() => ({
    image_url: customer?.image_url ?? '',
  }), [customer]);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const url = watch('image_url');

  return (
    <form id="customer-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="image_url">رابط الصورة</Label>
        <Input id="image_url" placeholder="https://example.com/image.jpg" {...register('image_url')} />
        {errors.image_url && (
          <p className="text-sm text-destructive mt-1">{errors.image_url.message}</p>
        )}
        <p className="text-xs text-muted-foreground">استخدم رابطاً مباشراً للصورة.</p>
      </div>

      {url ? (
        <div>
          <div className="text-sm text-muted-foreground mb-2">معاينة</div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="Preview"
            className="w-full h-48 object-contain rounded-md border border-border bg-muted"
          />
        </div>
      ) : null}
    </form>
  );
}
