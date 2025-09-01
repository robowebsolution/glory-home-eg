"use client";

import type { Review } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Trash2 } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
  onEdit: (review: Review) => void;
  onDelete: (reviewId: string) => void;
}

function truncate(text: string, len = 140) {
  if (!text) return '';
  return text.length > len ? text.slice(0, len) + '…' : text;
}

export function ReviewCard({ review, onEdit, onDelete }: ReviewCardProps) {
  const id = review.id as string | undefined;
  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-2 text-sm">
            <div>
              <div className="text-xs text-muted-foreground mb-1">AR</div>
              <p className="text-foreground leading-relaxed">{truncate(review.comment_ar)}</p>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">EN</div>
              <p className="text-foreground leading-relaxed">{truncate(review.comment_en)}</p>
            </div>
          </div>
          <div className="flex-shrink-0 flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white"
              onClick={() => onEdit(review)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8"
              onClick={() => id && onDelete(id)}
              disabled={!id}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {review.created_at && (
          <div className="text-[10px] text-muted-foreground mt-3">{new Date(review.created_at).toLocaleString()}</div>
        )}
      </CardContent>
    </Card>
  );
}
