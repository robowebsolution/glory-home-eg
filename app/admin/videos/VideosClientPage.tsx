"use client";
import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Video } from '@/lib/types';
import { saveVideo, deleteVideo } from './actions';
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
import { VideoForm } from '../../../components/admin/videos/VideoForm';
import { VideoCard } from '../../../components/admin/videos/VideoCard';

interface VideosClientPageProps {
  videos: Video[];
}

export function VideosClientPage({ videos }: VideosClientPageProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return videos;
    return videos.filter((v) =>
      (v.title_ar || '').toLowerCase().includes(q) ||
      (v.title_en || '').toLowerCase().includes(q)
    );
  }, [videos, searchTerm]);

  const handleAdd = () => {
    setSelectedVideo(null);
    setIsFormOpen(true);
  };

  const handleEdit = (video: Video) => {
    setSelectedVideo(video);
    setIsFormOpen(true);
  };

  const onSubmit = (data: { title_ar: string; title_en: string; src: string; thumbnail?: string; duration?: string }) => {
    startTransition(() => {
      (async () => {
        try {
          const formData = new FormData();
          if (selectedVideo?.id !== undefined && selectedVideo?.id !== null) formData.append('id', String(selectedVideo.id));
          formData.append('title_ar', data.title_ar);
          formData.append('title_en', data.title_en);
          formData.append('src', data.src);
          if (data.thumbnail !== undefined) formData.append('thumbnail', data.thumbnail);
          if (data.duration !== undefined) formData.append('duration', data.duration);
          const res = await saveVideo(null, formData);
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

  const handleDelete = (id: string | number) => {
    if (!confirm('هل أنت متأكد من حذف الفيديو؟')) return;
    startTransition(() => {
      (async () => {
        try {
          const res = await deleteVideo(id);
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">الفيديوهات</h1>
          <p className="text-muted-foreground">إدارة مقاطع الفيديو المعروضة في الصفحة الرئيسية.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" />
            إضافة فيديو
          </Button>
        </div>
      </header>

      <div className="flex items-center gap-4 flex-wrap pb-4 border-b border-border">
        <div className="relative flex-grow sm:flex-grow-0 sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="البحث في عناوين الفيديو..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-muted/40 focus:bg-background"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {filtered.length > 0 ? (
          filtered.map((v) => (
            <VideoCard key={String(v.id)} video={v} onEdit={handleEdit} onDelete={handleDelete} />
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <h3 className="text-xl font-semibold text-foreground">لا توجد عناصر</h3>
            <p className="text-muted-foreground mt-2">أضف مقاطع الفيديو لعرضها في القسم الخاص بها.</p>
          </div>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedVideo ? 'تعديل الفيديو' : 'إضافة فيديو جديد'}</DialogTitle>
            <DialogDescription>
              أدخل العناوين وروابط الفيديو والصورة المصغرة والمدة (اختياري) ليظهر في قسم الفيديوهات.
            </DialogDescription>
          </DialogHeader>
          <VideoForm
            key={String(selectedVideo?.id ?? 'new')}
            video={selectedVideo}
            onSubmit={onSubmit}
            isPending={isPending}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">إلغاء</Button>
            </DialogClose>
            <Button type="submit" form="video-form" disabled={isPending}>
              {isPending ? 'جاري الحفظ...' : 'حفظ'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
