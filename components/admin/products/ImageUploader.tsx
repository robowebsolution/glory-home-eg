import { useTransition } from 'react';
import { toast } from 'sonner';
import { deleteImage } from '@/app/admin/products/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

const MAX_FILE_SIZE = 512 * 1024; // 0.5 MB in bytes

interface ImageUploaderProps {
  value: string | null | undefined;
  onChange: (value: string | null) => void;
  multiple?: boolean;
  onOversize?: () => void; // optional callback to switch to Links tab
}

export function ImageUploader({
  value,
  onChange,
  multiple = false,
  onOversize,
}: ImageUploaderProps) {
  const [isUploading, startUploading] = useTransition();
  const [isDeleting, startDeleting] = useTransition();

  const isSupabaseUrl = (url: string) => {
    try {
      const u = new URL(url);
      return u.hostname.includes('supabase.co') && u.pathname.includes('/product-imgs/');
    } catch {
      return false;
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    startUploading(async () => {
      for (const file of Array.from(files)) {
        try {
          if (file.size > MAX_FILE_SIZE) {
            toast.error(`"${file.name}" Ø£ÙƒØ¨Ø± Ù…Ù† 0.5 Ù…ÙŠØ¬Ø§Ø¨Ø§ÙŠØª. Ù…Ù† ÙØ¶Ù„Ùƒ Ø§Ø³ØªØ®Ø¯Ù… ØªØ¨ÙˆÙŠØ¨ Ø§Ù„Ø±ÙˆØ§Ø¨Ø· ÙˆØ§Ù„ØµÙ‚ Ø±Ø§Ø¨Ø· Cloudinary.`);
            onOversize?.();
            continue;
          }

          // In multiple mode, we don't delete old images, just add new ones.
          if (!multiple && value && isSupabaseUrl(value)) {
            await deleteImage(value);
          }

          const filePath = `public/${Date.now()}_${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from('product-imgs')
            .upload(filePath, file, { upsert: false });

          if (uploadError) {
            toast.error(`ÙØ´Ù„ Ø±ÙØ¹ ${file.name}: ${uploadError.message}`);
            continue;
          }

          const { data } = supabase.storage.from('product-imgs').getPublicUrl(filePath);
          onChange(data.publicUrl);
          toast.success(`ØªÙ… Ø±ÙØ¹ ${file.name} Ø¨Ù†Ø¬Ø§Ø­`);
        } catch (e: any) {
          toast.error(`ÙØ´Ù„ Ø±ÙØ¹ ${file.name}: ${e?.message || 'Ø®Ø·Ø£ ØºÙŠØ± Ù…Ø¹Ø±ÙˆÙ'}`);
        }
      }
    });
  };

  const handleDelete = async () => {
    if (!value) return;

    startDeleting(async () => {
      if (isSupabaseUrl(value)) {
        const result = await deleteImage(value);
        if (result.success) {
          onChange(null);
          toast.success('ØªÙ… Ø­Ø°Ù Ø§Ù„ØµÙˆØ±Ø©');
        } else {
          toast.error('ÙØ´Ù„ Ø­Ø°Ù Ø§Ù„ØµÙˆØ±Ø©');
        }
      } else {
        // Ø±Ø§Ø¨Ø· Ø®Ø§Ø±Ø¬ÙŠ (Ù…Ø«Ù„ Cloudinary) â€” Ø¥Ø²Ø§Ù„Ø© Ù…Ø­Ù„ÙŠÙ‹Ø§ ÙÙ‚Ø·
        onChange(null);
        toast.success('ØªÙ… Ø¥Ø²Ø§Ù„Ø© Ø§Ù„ØµÙˆØ±Ø©');
      }
    });
  };

  return (
    <div className="w-full">
      <div className="relative flex h-48 w-full items-center justify-center rounded-md border-2 border-dashed group">
        {value && typeof value === 'string' && value.length > 0 ? (
          <>
            <Image
              src={value}
              alt="ØµÙˆØ±Ø© Ù…Ø±ÙÙˆØ¹Ø©"
              fill
              sizes="(max-width: 768px) 100vw, 24rem"
              className="rounded-md object-contain"
            />
            <div className="absolute right-2 top-2 z-10">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-2 text-center">
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Ø¬Ø§Ø±ÙŠ Ø§Ù„Ø±ÙØ¹...</p>
              </>
            ) : (
              <>
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <label
                  htmlFor={multiple ? 'multi-file-upload' : 'file-upload'}
                  className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80"
                >
                  <span>{multiple ? 'Ø±ÙØ¹ ØµÙˆØ±' : 'Ø±ÙØ¹ ØµÙˆØ±Ø©'}</span>
                  <Input
                    id={multiple ? 'multi-file-upload' : 'file-upload'}
                    name={multiple ? 'multi-file-upload' : 'file-upload'}
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    accept="image/*"
                    disabled={isUploading}
                    multiple={multiple}
                  />
                </label>
                <p className="text-xs text-gray-500">
                  Ø§Ù„Ø­Ø¯ Ø§Ù„Ø£Ù‚ØµÙ‰ 0.5 Ù…ÙŠØ¬Ø§Ø¨Ø§ÙŠØª Ù„ÙƒÙ„ ØµÙˆØ±Ø© (PNG, JPG, GIF)
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
