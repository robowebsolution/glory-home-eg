import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Image as ImageIcon } from 'lucide-react';

interface ImageUrlInputProps {
  value: string | null | undefined;
  onChange: (value: string | null) => void;
}

// Simple URL-based image helper kept for backward compatibility
export function ImageUploader({ value, onChange }: ImageUrlInputProps) {
  return (
    <div className="w-full">
      <div className="w-full border-2 border-dashed rounded-md p-3">
        {value ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="image" className="w-full h-48 object-contain rounded" />
            <div className="flex justify-end mt-2">
              <Button type="button" variant="destructive" size="sm" onClick={() => onChange(null)}>
                <Trash2 className="h-4 w-4 mr-1" /> حذف الصورة
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-center">
            <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground" />
            <Input placeholder="https://example.com/image.jpg" value={value ?? ''} onChange={(e) => onChange(e.target.value || null)} />
            <p className="text-xs text-muted-foreground">ألصق رابط الصورة أعلاه</p>
          </div>
        )}
      </div>
    </div>
  );
}
