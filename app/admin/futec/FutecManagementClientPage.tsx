"use client"

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import type { Category } from '@/lib/types'
import { saveCategory, deleteCategory } from '@/app/admin/categories/actions'
import { generateSlug } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import { Edit, Trash2, PlusCircle } from 'lucide-react'

interface FutecManagementClientPageProps {
  futecCategory: Category | null
  futecCollections: Category[]
}

type CollectionFormState = {
  name: string
  name_ar: string
  slug: string
  description: string
  description_ar: string
  image_url: string
  banner_image: string
  sort_order: string
  is_featured: boolean
}

const emptyCollectionForm: CollectionFormState = {
  name: '',
  name_ar: '',
  slug: '',
  description: '',
  description_ar: '',
  image_url: '',
  banner_image: '',
  sort_order: '0',
  is_featured: false,
}

export function FutecManagementClientPage({ futecCategory, futecCollections }: FutecManagementClientPageProps) {
  const router = useRouter()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [editingCollection, setEditingCollection] = useState<Category | null>(null)
  const [collectionForm, setCollectionForm] = useState<CollectionFormState>(emptyCollectionForm)

  const openCollectionDialog = (collection?: Category) => {
    if (!futecCategory) {
      toast.error('يجب إنشاء فئة Futec أولاً.')
      return
    }

    if (collection) {
      setEditingCollection(collection)
      setCollectionForm({
        name: collection.name || '',
        name_ar: collection.name_ar || '',
        slug: collection.slug || '',
        description: collection.description || '',
        description_ar: collection.description_ar || '',
        image_url: collection.image_url || '',
        banner_image: collection.banner_image || '',
        sort_order: String(collection.sort_order ?? 0),
        is_featured: Boolean(collection.is_featured),
      })
    } else {
      setEditingCollection(null)
      setCollectionForm(emptyCollectionForm)
    }

    setIsDialogOpen(true)
  }

  const closeCollectionDialog = () => {
    setIsDialogOpen(false)
    setEditingCollection(null)
    setCollectionForm(emptyCollectionForm)
  }

  const handleInputChange = (field: keyof CollectionFormState, value: string | boolean) => {
    setCollectionForm((prev) => {
      const next = {
        ...prev,
        [field]: value,
      } as CollectionFormState

      if (!editingCollection && field === 'name' && typeof value === 'string') {
        next.slug = generateSlug(value)
      }

      return next
    })
  }

  const handleSaveCollection = () => {
    if (!futecCategory) {
      toast.error('لا يمكن حفظ المجموعة بدون فئة Futec.')
      return
    }

    if (!collectionForm.name.trim() || !collectionForm.name_ar.trim() || !collectionForm.slug.trim()) {
      toast.error('الرجاء إدخال الاسم باللغة العربية والإنجليزية بالإضافة إلى الـ slug.')
      return
    }

    startTransition(async () => {
      const result = await saveCategory({
        name: collectionForm.name.trim(),
        name_ar: collectionForm.name_ar.trim(),
        slug: collectionForm.slug.trim(),
        description: collectionForm.description || '',
        description_ar: collectionForm.description_ar || '',
        image_url: collectionForm.image_url || '',
        banner_image: collectionForm.banner_image || '',
        sort_order: Number.parseInt(collectionForm.sort_order, 10) || 0,
        is_featured: collectionForm.is_featured,
        parent_id: futecCategory.id,
      }, editingCollection?.id ?? null)

      if (result.success) {
        toast.success(result.message || 'تم حفظ المجموعة بنجاح')
        closeCollectionDialog()
        router.refresh()
      } else {
        toast.error(result.message || 'حدث خطأ أثناء حفظ المجموعة')
      }
    })
  }

  const handleDeleteCollection = (collection: Category) => {
    if (!collection.id) return
    if (!confirm(`هل أنت متأكد من حذف ${collection.name}?`)) return

    startTransition(async () => {
      const result = await deleteCategory(collection.id as string)
      if (result.success) {
        toast.success(result.message || 'تم حذف المجموعة بنجاح')
        router.refresh()
      } else {
        toast.error(result.message || 'حدث خطأ أثناء الحذف')
      }
    })
  }

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">مجموعات Futec</h1>
          <p className="text-muted-foreground">إدارة المجموعات الفرعية التابعة لفئة Futec.</p>
        </div>
        <Button onClick={() => openCollectionDialog()} disabled={!futecCategory}>
          <PlusCircle className="mr-2 h-4 w-4" />
          إضافة مجموعة
        </Button>
      </header>

      {!futecCategory ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>لم يتم العثور على فئة Futec</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            الرجاء إنشاء فئة رئيسية باسم Futec أولاً كي تتمكن من إدارة المجموعات التابعة لها.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {futecCollections.length > 0 ? (
            futecCollections.map((collection) => (
              <Card key={collection.id} className="relative overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-4">
                    <span>{collection.name_ar || collection.name}</span>
                    <span className="text-sm font-normal text-muted-foreground">Slug: {collection.slug}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {collection.description || collection.description_ar ? (
                    <p className="text-sm text-muted-foreground">
                      {collection.description_ar || collection.description}
                    </p>
                  ) : null}
                  <div className="space-y-1 text-xs text-muted-foreground">
                    {collection.image_url ? <div>Cover: {collection.image_url}</div> : null}
                    {collection.banner_image ? <div>Banner: {collection.banner_image}</div> : null}
                    <div>Sort order: {collection.sort_order ?? 0}</div>
                    <div>Featured: {collection.is_featured ? 'نعم' : 'لا'}</div>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => openCollectionDialog(collection)} disabled={isPending}>
                    <Edit className="mr-2 h-4 w-4" />
                    تعديل
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteCollection(collection)} disabled={isPending}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    حذف
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Card className="border-dashed col-span-full">
              <CardContent className="py-12 text-center text-muted-foreground">
                لم يتم إضافة أي مجموعة حتى الآن.
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-full max-w-3xl lg:max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCollection ? 'تعديل المجموعة' : 'إضافة مجموعة جديدة'}</DialogTitle>
            <DialogDescription>
              قم بتحديث تفاصيل المجموعة، سيتم استخدام هذه البيانات لعرض منتجات Futec على الموقع.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="collection-name">الاسم (EN)</Label>
                <Input
                  id="collection-name"
                  value={collectionForm.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="collection-name-ar">الاسم (AR)</Label>
                <Input
                  id="collection-name-ar"
                  dir="rtl"
                  value={collectionForm.name_ar}
                  onChange={(e) => handleInputChange('name_ar', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="collection-slug">Slug</Label>
              <Input
                id="collection-slug"
                value={collectionForm.slug}
                onChange={(e) => handleInputChange('slug', generateSlug(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="collection-description">الوصف (EN)</Label>
              <Textarea
                id="collection-description"
                value={collectionForm.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="collection-description-ar">الوصف (AR)</Label>
              <Textarea
                id="collection-description-ar"
                dir="rtl"
                value={collectionForm.description_ar}
                onChange={(e) => handleInputChange('description_ar', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="collection-image">صورة الغلاف</Label>
              <Input
                id="collection-image"
                placeholder="https://..."
                value={collectionForm.image_url}
                onChange={(e) => handleInputChange('image_url', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="collection-banner">صورة البانر</Label>
              <Input
                id="collection-banner"
                placeholder="https://..."
                value={collectionForm.banner_image}
                onChange={(e) => handleInputChange('banner_image', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="collection-sort-order">ترتيب العرض</Label>
                <Input
                  id="collection-sort-order"
                  type="number"
                  value={collectionForm.sort_order}
                  onChange={(e) => handleInputChange('sort_order', e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <Label htmlFor="collection-featured" className="cursor-pointer">
                    مميزة في الواجهة؟
                  </Label>
                  <p className="text-sm text-muted-foreground">فعّل هذا الخيار لتمييز المجموعة في واجهة الموقع.</p>
                </div>
                <Switch
                  id="collection-featured"
                  checked={collectionForm.is_featured}
                  onCheckedChange={(checked) => handleInputChange('is_featured', checked)}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-wrap gap-2 justify-between sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                إلغاء
              </Button>
            </DialogClose>
            <Button onClick={handleSaveCollection} disabled={isPending}>
              {isPending ? 'جارٍ الحفظ...' : editingCollection ? 'تحديث المجموعة' : 'حفظ المجموعة'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
