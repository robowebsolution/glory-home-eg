"use client";
import { useEffect, useState, useTransition, useRef } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { z } from 'zod';
import { toast } from 'sonner';
import { saveProduct } from '@/app/admin/products/actions';
import type { Product, Category } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, PlusCircle, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { Form,FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { productSchema, type ProductFormData } from '@/lib/schemas';
import { generateSlug } from '@/lib/utils';

interface ProductFormProps {
  product: Product | null;
  categories: Category[];
  onSubmit: (data: ProductFormData) => void;
  isPending: boolean;
}

export function ProductForm({ product, categories, onSubmit, isPending }: ProductFormProps) {
  // To prevent type errors between nullable DB values and non-nullable form fields,
  // we sanitize the product data, converting nulls to empty strings or default values.
  const sanitizedDefaultValues = {
    ...product,
    name: product?.name ?? '',
    name_ar: product?.name_ar ?? '',
    description: product?.description ?? '',
    description_ar: product?.description_ar ?? '',
    specifications: product?.specifications ?? '',
    meta_title_en: product?.meta_title_en ?? '',
    meta_title_ar: product?.meta_title_ar ?? '',
    meta_description_en: product?.meta_description_en ?? '',
    meta_description_ar: product?.meta_description_ar ?? '',
    video_url: product?.video_url ?? '',
    warranty_period: product?.warranty_period ?? '',
    tags_en: product?.tags_en ?? [],
    tags_ar: product?.tags_ar ?? [],
    gallery_images: product?.gallery_images?.map(url => ({ value: url })) ?? [],
  };

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: sanitizedDefaultValues,
  });

  const { handleSubmit, control, setValue, watch } = form;

  const { fields: tagsEnFields, append: appendTagEn, remove: removeTagEn } = useFieldArray({ control, name: 'tags_en' });
  const { fields: tagsArFields, append: appendTagAr, remove: removeTagAr } = useFieldArray({ control, name: 'tags_ar' });
  const { fields: galleryFields, append: appendGallery, remove: removeGallery, update: updateGallery, move: moveGallery, replace: replaceGallery } = useFieldArray({ control, name: 'gallery_images' });

  const [galleryUrlInput, setGalleryUrlInput] = useState('');
  // Control media sub-tabs (storage vs links)
  const [mediaSubTab, setMediaSubTab] = useState<'storage' | 'links'>('storage');
  const switchToLinks = () => setMediaSubTab('links');

  // Helpers for Links UX
  // Extract URLs robustly from arbitrary text (handles spaces/newlines and avoids over-splitting)
  const extractUrls = (text: string) => {
    const matches = text.match(/https?:\/\/[^\s'"<>]+/gi) || [];
    return matches.map((s) => s.trim()).filter(Boolean);
  };

  const isLikelyImageUrl = (url: string) => {
    try {
      const u = new URL(url);
      return /\.(png|jpe?g|gif|webp|avif|bmp|svg)(\?.*)?$/i.test(u.pathname) || url.startsWith('data:image/');
    } catch {
      return false;
    }
  };

  const addUrls = (urls: string[]) => {
    // Deduplicate against existing and within the batch
    const existing = new Set(galleryFields.map((f: any) => f.value));
    const uniqueBatch: string[] = [];
    urls.forEach((u) => {
      if (!existing.has(u) && !uniqueBatch.includes(u)) uniqueBatch.push(u);
    });

    // Soft limit to avoid accidental explosions
    const MAX_ADD = 20;
    const limited = uniqueBatch.slice(0, MAX_ADD);
    const truncated = uniqueBatch.length - limited.length;

    const added: string[] = [];
    const invalid: string[] = [];
    limited.forEach((url) => {
      if (isLikelyImageUrl(url)) {
        appendGallery({ value: url });
        added.push(url);
      } else {
        appendGallery({ value: url });
        invalid.push(url);
      }
    });
    if (added.length) toast.success(`${added.length} image URL(s) added`);
    if (invalid.length) toast.warning(`${invalid.length} URL(s) may not be images`);
    if (truncated > 0) toast.info(`Limited to ${MAX_ADD} URLs. Skipped ${truncated} more.`);
  };

  const addSingleOrMultiple = (text: string) => {
    const urls = extractUrls(text);
    if (urls.length === 0 && text.trim()) {
      // If user typed a raw URL without protocol, try to coerce
      const maybe = text.trim();
      const withProto = maybe.startsWith('http') ? maybe : `https://${maybe}`;
      addUrls([withProto]);
      setGalleryUrlInput('');
      return;
    }
    if (!urls.length) return;
    addUrls(urls);
    setGalleryUrlInput('');
  };

  return (
    <Form {...form}>
      <form id="product-form" onSubmit={handleSubmit(onSubmit, (errors) => { console.error('Client-side validation errors:', errors); })} className="flex-grow overflow-hidden flex flex-col">
        <Tabs defaultValue="basic" className="flex-grow flex flex-col overflow-hidden">
          <TabsList className="flex-shrink-0">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="pricing">Pricing & Inventory</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>
          <div className="flex-grow overflow-y-auto p-4 space-y-6">
            <TabsContent value="basic" className="space-y-4 m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Name (EN) <span className="text-red-500">*</span></FormLabel><FormControl><Input placeholder="e.g. Modern Sofa" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="name_ar" render={({ field }) => (<FormItem><FormLabel>Name (AR) <span className="text-red-500">*</span></FormLabel><FormControl><Input dir="rtl" placeholder="e.g. أريكة حديثة" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description (EN)</FormLabel><FormControl><Textarea placeholder="Product description..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="description_ar" render={({ field }) => (<FormItem><FormLabel>Description (AR)</FormLabel><FormControl><Textarea dir="rtl" placeholder="وصف المنتج..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
            </TabsContent>

            <TabsContent value="pricing" className="space-y-4 m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel>Price</FormLabel><FormControl><Input type="number" placeholder="99.99" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="sale_price" render={({ field }) => (<FormItem><FormLabel>Sale Price</FormLabel><FormControl><Input type="number" placeholder="129.99" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <FormField control={form.control} name="category_id" render={({ field }) => (<FormItem><FormLabel>Category <span className="text-red-500">*</span></FormLabel><Select onValueChange={field.onChange} defaultValue={field.value ?? ''}><FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl><SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="stock_quantity" render={({ field }) => (<FormItem><FormLabel>Stock Quantity</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="min_order_quantity" render={({ field }) => (<FormItem><FormLabel>Min Order Quantity</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl></FormItem>)} />
                <FormField control={form.control} name="max_order_quantity" render={({ field }) => (<FormItem><FormLabel>Max Order Quantity</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl></FormItem>)} />
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-6 m-0">
              <Tabs value={mediaSubTab} onValueChange={(v) => setMediaSubTab(v as 'storage' | 'links')} className="space-y-4">
                <TabsList>
                  <TabsTrigger value="storage">Storage</TabsTrigger>
                  <TabsTrigger value="links">Links</TabsTrigger>
                </TabsList>

                {/* Storage mode: existing uploaders */}
                <TabsContent value="storage" className="space-y-6 m-0">
                  <FormField
                    control={form.control}
                    name="main_image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main Image</FormLabel>
                        <FormControl>
                          <ImageUploader
                            value={field.value}
                            onChange={field.onChange}
                            onOversize={switchToLinks}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <FormLabel>Gallery Images</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
                      {galleryFields.map((field, index) => (
                        <FormField
                          key={field.id}
                          control={form.control}
                          name={`gallery_images.${index}`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <ImageUploader
                                  value={field.value.value}
                                  onChange={(url) => {
                                    if (url === null) {
                                      removeGallery(index);
                                    } else {
                                      updateGallery(index, { value: url });
                                    }
                                  }}
                                  onOversize={switchToLinks}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      ))}
                      <ImageUploader
                        value={null}
                        onChange={(url) => {
                          if (url) {
                            appendGallery({ value: url });
                          }
                        }}
                        multiple
                        onOversize={switchToLinks}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Links mode: enter external URLs */}
                <TabsContent value="links" className="space-y-6 m-0">
                  {/* Main image URL */}
                  <FormField
                    control={form.control}
                    name="main_image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main Image URL</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Input
                              placeholder="https://example.com/image.jpg"
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                            {field.value ? (
                              <div className="relative w-full h-48 border rounded-md overflow-hidden">
                                {/* Use native img to avoid next/image domain restrictions */}
                                <img
                                  src={field.value}
                                  alt="Main image preview"
                                  className="w-full h-full object-contain bg-muted"
                                />
                              </div>
                            ) : null}
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="destructive"
                                onClick={() => field.onChange('')}
                              >
                                Clear
                              </Button>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Gallery URLs manager */}
                  <div className="space-y-2">
                    <FormLabel>Gallery Image URLs</FormLabel>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Paste or type image URL(s), press Enter to add"
                        value={galleryUrlInput}
                        onChange={(e) => setGalleryUrlInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSingleOrMultiple(galleryUrlInput);
                          }
                        }}
                        onPaste={(e) => {
                          const text = e.clipboardData.getData('text');
                          const urls = extractUrls(text);
                          if (urls.length > 0) {
                            e.preventDefault();
                            addUrls(urls);
                            setGalleryUrlInput('');
                          }
                        }}
                      />
                      <Button type="button" variant="secondary" onClick={() => addSingleOrMultiple(galleryUrlInput)}>
                        Add
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const text = window.prompt('Paste multiple URLs (one per line)');
                          if (!text) return;
                          const urls = extractUrls(text);
                          if (urls.length === 0) return;
                          addUrls(urls);
                        }}
                      >
                        Bulk add
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => {
                          if (galleryFields.length === 0) return;
                          if (window.confirm('Remove all gallery links?')) {
                            replaceGallery([]);
                            toast.success('All gallery links cleared');
                          }
                        }}
                        disabled={galleryFields.length === 0}
                      >
                        Clear all
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
                      {galleryFields.length === 0 ? (
                        <div className="col-span-full text-sm text-muted-foreground">No gallery images yet.</div>
                      ) : (
                        galleryFields.map((gf, index) => (
                          <div key={gf.id} className="relative w-full h-40 border rounded-md overflow-hidden">
                            <img src={gf.value} alt={`Gallery ${index + 1}`} className="w-full h-full object-contain bg-muted" />
                            <div className="absolute top-2 left-2 z-10 flex gap-2">
                              <Button
                                type="button"
                                variant="secondary"
                                size="icon"
                                onClick={() => index > 0 && moveGallery(index, index - 1)}
                                disabled={index === 0}
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="secondary"
                                size="icon"
                                onClick={() => index < galleryFields.length - 1 && moveGallery(index, index + 1)}
                                disabled={index === galleryFields.length - 1}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="absolute top-2 right-2 z-10">
                              <Button type="button" variant="destructive" size="icon" onClick={() => removeGallery(index)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="details" className="space-y-4 m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="material_en" render={({ field }) => (<FormItem><FormLabel>Material (EN)</FormLabel><FormControl><Input placeholder="e.g. Oak Wood" {...field} value={field.value ?? ''} /></FormControl></FormItem>)} />
                <FormField control={form.control} name="material_ar" render={({ field }) => (<FormItem><FormLabel>Material (AR)</FormLabel><FormControl><Input dir="rtl" placeholder="e.g. خشب البلوط" {...field} value={field.value ?? ''} /></FormControl></FormItem>)} />
                <FormField control={form.control} name="color_en" render={({ field }) => (<FormItem><FormLabel>Color (EN)</FormLabel><FormControl><Input placeholder="e.g. Brown" {...field} value={field.value ?? ''} /></FormControl></FormItem>)} />
                <FormField control={form.control} name="color_ar" render={({ field }) => (<FormItem><FormLabel>Color (AR)</FormLabel><FormControl><Input dir="rtl" placeholder="e.g. بني" {...field} value={field.value ?? ''} /></FormControl></FormItem>)} />
                <FormField control={form.control} name="weight" render={({ field }) => (<FormItem><FormLabel>Weight (kg)</FormLabel><FormControl><Input type="number" placeholder="1.5" {...field} value={field.value ?? ''} /></FormControl></FormItem>)} />
                <FormField control={form.control} name="dimensions" render={({ field }) => (<FormItem><FormLabel>Dimensions</FormLabel><FormControl><Input placeholder="e.g. 120x80x60 cm" {...field} value={field.value ?? ''} /></FormControl></FormItem>)} />
              </div>
              <FormField control={form.control} name="specifications" render={({ field }) => (<FormItem><FormLabel>Specifications</FormLabel><FormControl><Textarea placeholder="Enter product specifications..." {...field} value={field.value ?? ''} /></FormControl></FormItem>)} />
              <FormField control={form.control} name="care_instructions_en" render={({ field }) => (<FormItem><FormLabel>Care Instructions (EN)</FormLabel><FormControl><Textarea placeholder="e.g. Wipe clean with a dry cloth" {...field} value={field.value ?? ''} /></FormControl></FormItem>)} />
              <FormField control={form.control} name="care_instructions_ar" render={({ field }) => (<FormItem><FormLabel>Care Instructions (AR)</FormLabel><FormControl><Textarea dir="rtl" placeholder="e.g. امسح بقطعة قماش جافة" {...field} value={field.value ?? ''} /></FormControl></FormItem>)} />
              <FormField control={form.control} name="warranty_period" render={({ field }) => (<FormItem><FormLabel>Warranty Period</FormLabel><FormControl><Input placeholder="e.g. 2 Years" {...field} value={field.value ?? ''} /></FormControl></FormItem>)} />
              <FormField control={form.control} name="video_url" render={({ field }) => (<FormItem><FormLabel>Video URL</FormLabel><FormControl><Input placeholder="https://youtube.com/watch?v=..." {...field} value={field.value ?? ''} /></FormControl></FormItem>)} />
              <div className="space-y-2 pt-4">
                <FormField control={form.control} name="in_stock" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>In Stock</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                <FormField control={form.control} name="featured" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Featured Product</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                <FormField control={form.control} name="is_new" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>New Arrival</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                <FormField control={form.control} name="is_sale" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>On Sale</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
              </div>
            </TabsContent>

            <TabsContent value="seo" className="space-y-4 m-0">
              <FormField control={form.control} name="meta_title_en" render={({ field }) => (<FormItem><FormLabel>Meta Title (EN)</FormLabel><FormControl><Input placeholder="Meta title for SEO..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="meta_title_ar" render={({ field }) => (<FormItem><FormLabel>Meta Title (AR)</FormLabel><FormControl><Input dir="rtl" placeholder="عنوان ميتا للسيو..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="meta_description_en" render={({ field }) => (<FormItem><FormLabel>Meta Description (EN)</FormLabel><FormControl><Textarea placeholder="Meta description for SEO..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="meta_description_ar" render={({ field }) => (<FormItem><FormLabel>Meta Description (AR)</FormLabel><FormControl><Textarea dir="rtl" placeholder="وصف ميتا للسيو..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
            </TabsContent>
          </div>
        </Tabs>

      </form>
    </Form>
  );
}
