"use client";

import type { Video } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Trash2, Play } from 'lucide-react';
import Image from 'next/image';

interface VideoCardProps {
  video: Video;
  onEdit: (video: Video) => void;
  onDelete: (videoId: string | number) => void;
}

export function VideoCard({ video, onEdit, onDelete }: VideoCardProps) {
  const id = (video.id as string | number | undefined);
  const title = video.title_ar || video.title_en || '';
  const cover = video.thumbnail || '/placeholder.svg';

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <CardContent className="p-0">
        <div className="relative aspect-video bg-muted">
          <Image src={cover} alt={title} fill className="object-cover" />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
              <Play className="h-5 w-5 text-gray-900 ml-1" />
            </div>
          </div>
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
              {video.duration}
            </div>
          )}
        </div>
        <div className="p-4 flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="text-sm font-medium text-foreground">{video.title_ar}</div>
            <div className="text-xs text-muted-foreground">{video.title_en}</div>
          </div>
          <div className="flex-shrink-0 flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white"
              onClick={() => onEdit(video)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8"
              onClick={() => id !== undefined && onDelete(id)}
              disabled={id === undefined}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
