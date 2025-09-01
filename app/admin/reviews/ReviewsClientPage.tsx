"use client";

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Review } from '@/lib/types';
import { saveReview, deleteReview } from './actions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { ReviewForm } from '@/components/admin/reviews/ReviewForm';
import { ReviewCard } from '@/components/admin/reviews/ReviewCard';

interface ReviewsClientPageProps {
  reviews: Review[];
}

export function ReviewsClientPage({ reviews }: ReviewsClientPageProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return reviews;
    return reviews.filter((r) =>
      (r.comment_ar || '').toLowerCase().includes(q) ||
      (r.comment_en || '').toLowerCase().includes(q)
    );
  }, [reviews, searchTerm]);

  const handleAdd = () => {
    setSelectedReview(null);
    setIsFormOpen(true);
  };

  const handleEdit = (review: Review) => {
    setSelectedReview(review);
    setIsFormOpen(true);
  };

  const onSubmit = (data: { comment_ar: string; comment_en: string }) => {
    startTransition(() => {
      (async () => {
        try {
          const formData = new FormData();
          if (selectedReview?.id) formData.append('id', String(selectedReview.id));
          formData.append('comment_ar', data.comment_ar);
          formData.append('comment_en', data.comment_en);
          const res = await saveReview(null, formData);
          if (res.success) {
            toast.success(res.message);
            setIsFormOpen(false);
            router.refresh();
          } else {
            toast.error(res.message);
          }
        } catch (e) {
          toast.error('حدث خطأ غير متوقع.');
        }
      })();
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm('هل أنت متأكد من حذف التعليق؟')) return;
    startTransition(() => {
      (async () => {
        try {
          const res = await deleteReview(id);
          if (res.success) {
            toast.success(res.message);
            router.refresh();
          } else toast.error(res.message);
        } catch {
          toast.error('حدث خطأ أثناء الحذف.');
        }
      })();
    });
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">ريفيوهات العملاء</h1>
          <p className="text-muted-foreground">إدارة تعليقات العملاء المعروضة في الصفحة الرئيسية.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" />
            إضافة تعليق
          </Button>
        </div>
      </header>

      <div className="flex items-center gap-4 flex-wrap pb-4 border-b border-border">
        <div className="relative flex-grow sm:flex-grow-0 sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="البحث في نص التعليق..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-muted/40 focus:bg-background"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {filtered.length > 0 ? (
          filtered.map((r) => (
            <ReviewCard key={String(r.id)} review={r} onEdit={handleEdit} onDelete={handleDelete} />
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <h3 className="text-xl font-semibold text-foreground">لا توجد عناصر</h3>
            <p className="text-muted-foreground mt-2">أضف تعليقات العملاء لعرضها في القسم الخاص بها.</p>
          </div>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedReview ? 'تعديل التعليق' : 'إضافة تعليق جديد'}</DialogTitle>
            <DialogDescription>
              أدخل التعليق بالعربية والإنجليزية ليظهر في قسم آراء العملاء بالصفحة الرئيسية.
            </DialogDescription>
          </DialogHeader>
          <ReviewForm
            key={String(selectedReview?.id ?? 'new')}
            review={selectedReview}
            onSubmit={onSubmit}
            isPending={isPending}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">إلغاء</Button>
            </DialogClose>
            <Button type="submit" form="review-form" disabled={isPending}>
              {isPending ? 'جاري الحفظ...' : 'حفظ'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
