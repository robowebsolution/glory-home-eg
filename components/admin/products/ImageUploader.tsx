import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { deleteImage } from '@/app/admin/products/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, UploadCloud, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
interface ImageUploaderProps {
  value: string | null | undefined;
  onChange: (value: string | null) => void;
  multiple?: boolean;
}

export function ImageUploader({ value, onChange, multiple = false }: ImageUploaderProps) {
  const [isUploading, startUploading] = useTransition();
  const [isDeleting, startDeleting] = useTransition();

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    startUploading(async () => {
      for (const file of Array.from(files)) {
        try {
          // In multiple mode, we don't delete old images, just add new ones.
          if (!multiple && value) {
            await deleteImage(value);
          }

          const filePath = `public/${Date.now()}_${file.name}`;
          const { error: uploadError } = await supabase
            .storage
            .from('product-imgs')
            .upload(filePath, file, { upsert: false });

          if (uploadError) {
            toast.error(`Failed to upload ${file.name}: ${uploadError.message}`);
            continue;
          }

          const { data } = supabase.storage.from('product-imgs').getPublicUrl(filePath);
          onChange(data.publicUrl);
          toast.success(`Successfully uploaded ${file.name}`);
        } catch (e: any) {
          toast.error(`Failed to upload ${file.name}: ${e.message || 'Unknown error'}`);
        }
      }
    });
  };

  const handleDelete = async () => {
    if (!value) return;

    startDeleting(async () => {
      const result = await deleteImage(value);
      if (result.success) {
        onChange(null);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="w-full">
      <div className="w-full h-48 border-2 border-dashed rounded-md flex items-center justify-center relative group">
        {value && typeof value === 'string' && value.length > 0 ? (
          <>
            <Image src={value} alt="Uploaded image" fill className="object-contain rounded-md" />
            <div className="absolute top-2 right-2 z-10">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center space-y-2">
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </>
            ) : (
              <>
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <label htmlFor={multiple ? 'multi-file-upload' : 'file-upload'} className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80">
                  <span>{multiple ? 'Upload images' : 'Upload an image'}</span>
                  <Input id={multiple ? 'multi-file-upload' : 'file-upload'} name={multiple ? 'multi-file-upload' : 'file-upload'} type="file" className="sr-only" onChange={handleFileChange} accept="image/*" disabled={isUploading} multiple={multiple} />
                </label>
                <p className="text-xs text-gray-500">PNG, JPG, GIF (large files supported)</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
