"use client"

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import type { Category, Manufacturer } from '@/lib/types'
import { saveCategory, deleteCategory } from '@/app/admin/categories/actions'
import { saveManufacturer, deleteManufacturer } from '../products/manufacturers-actions'
import { generateSlug } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Edit, Trash2, PlusCircle, Globe2, Building2 } from 'lucide-react'

interface HdfManagementClientPageProps {
  hdfCategory: Category | null
  hdfCountries: Category[]
  manufacturers: Manufacturer[]
}

type CountryFormState = {
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

type ManufacturerFormState = {
  name: string
  name_ar: string
  slug: string
  country_category_id: string
  description: string
  description_ar: string
  logo_url: string
  banner_image: string
  sort_order: string
  is_featured: boolean
}

const emptyCountryForm: CountryFormState = {
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

const emptyManufacturerForm: ManufacturerFormState = {
  name: '',
  name_ar: '',
  slug: '',
  country_category_id: '',
  description: '',
  description_ar: '',
  logo_url: '',
  banner_image: '',
  sort_order: '0',
  is_featured: false,
}

export function HdfManagementClientPage({ hdfCategory, hdfCountries, manufacturers }: HdfManagementClientPageProps) {
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<'countries' | 'manufacturers'>('countries')
  const [isCountryPending, startCountryTransition] = useTransition()
  const [isManufacturerPending, startManufacturerTransition] = useTransition()

  const [isCountryDialogOpen, setIsCountryDialogOpen] = useState(false)
  const [editingCountry, setEditingCountry] = useState<Category | null>(null)
  const [countryForm, setCountryForm] = useState<CountryFormState>(emptyCountryForm)

  const [isManufacturerDialogOpen, setIsManufacturerDialogOpen] = useState(false)
  const [editingManufacturer, setEditingManufacturer] = useState<Manufacturer | null>(null)
  const [manufacturerForm, setManufacturerForm] = useState<ManufacturerFormState>(emptyManufacturerForm)
  const [selectedManufacturerCountry, setSelectedManufacturerCountry] = useState<string>('all')

  const filteredManufacturers = useMemo(() => {
    if (selectedManufacturerCountry === 'all') {
      return manufacturers
    }
    return manufacturers.filter((manufacturer) => manufacturer.country_category_id === selectedManufacturerCountry)
  }, [manufacturers, selectedManufacturerCountry])

  const getCountryNameById = (countryId: string | null | undefined) => {
    if (!countryId) return ''
    const match = hdfCountries.find((country) => country.id === countryId)
    return match ? match.name_ar || match.name : ''
  }

  const closeCountryDialog = () => {
    setIsCountryDialogOpen(false)
    setEditingCountry(null)
    setCountryForm(emptyCountryForm)
  }

  const closeManufacturerDialog = () => {
    setIsManufacturerDialogOpen(false)
    setEditingManufacturer(null)
    setManufacturerForm(emptyManufacturerForm)
  }

  const openCountryDialog = (country?: Category) => {
    if (!hdfCategory) {
      toast.error('يجب إنشاء فئة HDF أولاً.')
      return
    }

    if (country) {
      setEditingCountry(country)
      setCountryForm({
        name: country.name || '',
        name_ar: country.name_ar || '',
        slug: country.slug || '',
        description: country.description || '',
        description_ar: country.description_ar || '',
        image_url: country.image_url || '',
        banner_image: country.banner_image || '',
        sort_order: String(country.sort_order ?? 0),
        is_featured: Boolean(country.is_featured),
      })
    } else {
      setEditingCountry(null)
      setCountryForm(emptyCountryForm)
    }

    setIsCountryDialogOpen(true)
  }

  const openManufacturerDialog = (manufacturer?: Manufacturer) => {
    if (!hdfCategory) {
      toast.error('يجب إنشاء فئة HDF أولاً.')
      return
    }

    if (!hdfCountries.length) {
      toast.error('الرجاء إضافة دولة أولاً.')
      return
    }

    if (manufacturer) {
      setEditingManufacturer(manufacturer)
      setManufacturerForm({
        name: manufacturer.name || '',
        name_ar: manufacturer.name_ar || '',
        slug: manufacturer.slug || '',
        country_category_id: manufacturer.country_category_id || '',
        description: manufacturer.description || '',
        description_ar: manufacturer.description_ar || '',
        logo_url: manufacturer.logo_url || '',
        banner_image: manufacturer.banner_image || '',
        sort_order: String(manufacturer.sort_order ?? 0),
        is_featured: Boolean(manufacturer.is_featured),
      })
    } else {
      const defaultCountryId = selectedManufacturerCountry !== 'all' ? selectedManufacturerCountry : hdfCountries[0]?.id ?? ''
      setEditingManufacturer(null)
      setManufacturerForm({
        ...emptyManufacturerForm,
        country_category_id: defaultCountryId,
      })
    }

    setIsManufacturerDialogOpen(true)
  }

  const handleCountryInputChange = (field: keyof CountryFormState, value: string | boolean) => {
    setCountryForm((prev) => {
      const next = {
        ...prev,
        [field]: value,
      } as CountryFormState

      if (!editingCountry && field === 'name' && typeof value === 'string') {
        next.slug = generateSlug(value)
      }

      return next
    })
  }

  const handleManufacturerInputChange = (field: keyof ManufacturerFormState, value: string | boolean) => {
    setManufacturerForm((prev) => {
      const next = {
        ...prev,
        [field]: value,
      } as ManufacturerFormState

      if (!editingManufacturer && field === 'name' && typeof value === 'string') {
        next.slug = generateSlug(value)
      }

      return next
    })
  }

  const handleSaveCountry = () => {
    if (!hdfCategory) {
      toast.error('لا يمكن حفظ الدولة بدون فئة HDF.')
      return
    }

    if (!countryForm.name.trim() || !countryForm.name_ar.trim() || !countryForm.slug.trim()) {
      toast.error('الرجاء إدخال الاسم والاسم العربي و الـ slug.')
      return
    }

    startCountryTransition(async () => {
      const result = await saveCategory({
        name: countryForm.name.trim(),
        name_ar: countryForm.name_ar.trim(),
        slug: countryForm.slug.trim(),
        description: countryForm.description || '',
        description_ar: countryForm.description_ar || '',
        image_url: countryForm.image_url || '',
        banner_image: countryForm.banner_image || '',
        sort_order: Number.parseInt(countryForm.sort_order, 10) || 0,
        is_featured: countryForm.is_featured,
        parent_id: hdfCategory.id,
      }, editingCountry?.id ?? null)

      if (result.success) {
        toast.success(result.message || 'تم حفظ الدولة بنجاح')
        closeCountryDialog()
        router.refresh()
      } else {
        toast.error(result.message || 'حدث خطأ أثناء حفظ الدولة')
      }
    })
  }

  const handleDeleteCountry = (country: Category) => {
    if (!country.id) return
    if (!confirm(`هل أنت متأكد من حذف ${country.name}?`)) return

    startCountryTransition(async () => {
      const result = await deleteCategory(country.id)
      if (result.success) {
        toast.success(result.message || 'تم حذف الدولة بنجاح')
        router.refresh()
      } else {
        toast.error(result.message || 'حدث خطأ أثناء الحذف')
      }
    })
  }

  const handleSaveManufacturer = () => {
    if (!manufacturerForm.name.trim() || !manufacturerForm.slug.trim()) {
      toast.error('الرجاء إدخال الاسم والـ slug للشركة.')
      return
    }

    if (!manufacturerForm.country_category_id) {
      toast.error('الرجاء اختيار الدولة المصنعة.')
      return
    }

    startManufacturerTransition(async () => {
      const result = await saveManufacturer({
        name: manufacturerForm.name.trim(),
        name_ar: manufacturerForm.name_ar?.trim() || '',
        slug: manufacturerForm.slug.trim(),
        country_category_id: manufacturerForm.country_category_id,
        description: manufacturerForm.description || '',
        description_ar: manufacturerForm.description_ar || '',
        logo_url: manufacturerForm.logo_url || '',
        banner_image: manufacturerForm.banner_image || '',
        sort_order: Number.parseInt(manufacturerForm.sort_order, 10) || 0,
        is_featured: manufacturerForm.is_featured,
      }, editingManufacturer?.id ?? null)

      if (result.success) {
        toast.success(result.message || 'تم حفظ الشركة بنجاح')
        closeManufacturerDialog()
        router.refresh()
      } else {
        toast.error(result.message || 'حدث خطأ أثناء حفظ الشركة')
      }
    })
  }

  const handleDeleteManufacturer = (manufacturer: Manufacturer) => {
    if (!manufacturer.id) return
    if (!confirm(`هل أنت متأكد من حذف ${manufacturer.name}?`)) return

    startManufacturerTransition(async () => {
      const result = await deleteManufacturer(manufacturer.id)
      if (result.success) {
        toast.success(result.message || 'تم حذف الشركة بنجاح')
        router.refresh()
      } else {
        toast.error(result.message || 'حدث خطأ أثناء الحذف')
      }
    })
  }

  return (
    <div className="space-y-8">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="space-y-6">
        <TabsList className="grid grid-cols-2 gap-2 bg-muted/50 p-1 rounded-xl w-full sm:w-[360px] mx-auto">
          <TabsTrigger value="countries" className="flex items-center justify-center gap-2 py-3">
            <Globe2 className="h-4 w-4" />
            <span>الدول المصنعة</span>
          </TabsTrigger>
          <TabsTrigger value="manufacturers" className="flex items-center justify-center gap-2 py-3">
            <Building2 className="h-4 w-4" />
            <span>الشركات المصنعة</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="countries" className="space-y-6">
          <header className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">الدول المصنعة لـ HDF</h1>
              <p className="text-muted-foreground">تحكم في قائمة الدول المرتبطة بفئة HDF.</p>
            </div>
            <Button onClick={() => openCountryDialog()} disabled={!hdfCategory}>
              <PlusCircle className="mr-2 h-4 w-4" />
              إضافة دولة
            </Button>
          </header>

          {!hdfCategory ? (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle>لم يتم العثور على فئة HDF</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                الرجاء إنشاء فئة رئيسية باسم HDF أولاً كي تتمكن من إدارة الدول المصنعة ضمنها.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {hdfCountries.length > 0 ? (
                hdfCountries.map((country) => (
                  <Card key={country.id} className="relative overflow-hidden">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between gap-4">
                        <span>{country.name_ar || country.name}</span>
                        <span className="text-sm font-normal text-muted-foreground">Slug: {country.slug}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {country.description || country.description_ar ? (
                        <p className="text-sm text-muted-foreground">
                          {country.description_ar || country.description}
                        </p>
                      ) : null}
                      <div className="space-y-1 text-xs text-muted-foreground">
                        {country.image_url ? <div>Cover: {country.image_url}</div> : null}
                        {country.banner_image ? <div>Banner: {country.banner_image}</div> : null}
                        <div>Sort order: {country.sort_order ?? 0}</div>
                        <div>Featured: {country.is_featured ? 'نعم' : 'لا'}</div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openCountryDialog(country)} disabled={isCountryPending}>
                        <Edit className="mr-2 h-4 w-4" />
                        تعديل
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteCountry(country)} disabled={isCountryPending}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        حذف
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card className="border-dashed col-span-full">
                  <CardContent className="py-12 text-center text-muted-foreground">
                    لم يتم إضافة أي دولة حتى الآن.
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="manufacturers" className="space-y-6">
          <header className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">الشركات المصنعة</h2>
              <p className="text-muted-foreground">أدر الشركات المرتبطة بكل دولة مصنّعة للـ HDF.</p>
            </div>
            <Button onClick={() => openManufacturerDialog()} disabled={!hdfCategory || hdfCountries.length === 0}>
              <PlusCircle className="mr-2 h-4 w-4" />
              إضافة شركة
            </Button>
          </header>

          {!hdfCategory || hdfCountries.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center text-muted-foreground">
                الرجاء إضافة دولة واحدة على الأقل لعرض الشركات التابعة لها.
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center gap-2 flex-wrap">
                <Label htmlFor="manufacturer-country-filter">فلترة حسب الدولة</Label>
                <Select value={selectedManufacturerCountry} onValueChange={setSelectedManufacturerCountry}>
                  <SelectTrigger id="manufacturer-country-filter" className="w-[220px]">
                    <SelectValue placeholder="اختر الدولة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الدول</SelectItem>
                    {hdfCountries.map((country) => (
                      <SelectItem key={country.id} value={country.id}>
                        {country.name_ar || country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredManufacturers.length > 0 ? (
                  filteredManufacturers.map((manufacturer) => (
                    <Card key={manufacturer.id} className="relative overflow-hidden">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between gap-4">
                          <span>{manufacturer.name_ar || manufacturer.name}</span>
                          <span className="text-sm font-normal text-muted-foreground">
                            {getCountryNameById(manufacturer.country_category_id)}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {manufacturer.description || manufacturer.description_ar ? (
                          <p className="text-sm text-muted-foreground">
                            {manufacturer.description_ar || manufacturer.description}
                          </p>
                        ) : null}
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div>Slug: {manufacturer.slug}</div>
                          <div>Sort order: {manufacturer.sort_order ?? 0}</div>
                          <div>Featured: {manufacturer.is_featured ? 'نعم' : 'لا'}</div>
                          {manufacturer.logo_url ? <div>Logo: {manufacturer.logo_url}</div> : null}
                          {manufacturer.banner_image ? <div>Banner: {manufacturer.banner_image}</div> : null}
                        </div>
                      </CardContent>
                      <CardFooter className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openManufacturerDialog(manufacturer)}
                          disabled={isManufacturerPending}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          تعديل
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteManufacturer(manufacturer)}
                          disabled={isManufacturerPending}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          حذف
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <Card className="border-dashed col-span-full">
                    <CardContent className="py-12 text-center text-muted-foreground">
                      لا توجد شركات تحت الدولة المحددة.
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isCountryDialogOpen} onOpenChange={(open) => {
        if (open) {
          setIsCountryDialogOpen(true)
        } else {
          closeCountryDialog()
        }
      }}>
        <DialogContent className="w-full max-w-3xl lg:max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCountry ? 'تعديل دولة' : 'إضافة دولة جديدة'}</DialogTitle>
            <DialogDescription>
              قم بتحديث معلومات الدولة المصنعة. سيتم ربطها تلقائياً بفئة HDF.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country-name">Name (EN)</Label>
                <Input
                  id="country-name"
                  value={countryForm.name}
                  onChange={(e) => handleCountryInputChange('name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="country-name-ar">Name (AR)</Label>
                <Input
                  id="country-name-ar"
                  dir="rtl"
                  value={countryForm.name_ar}
                  onChange={(e) => handleCountryInputChange('name_ar', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="country-slug">Slug</Label>
              <Input
                id="country-slug"
                value={countryForm.slug}
                onChange={(e) => handleCountryInputChange('slug', generateSlug(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="country-description">Description (EN)</Label>
              <Textarea
                id="country-description"
                value={countryForm.description}
                onChange={(e) => handleCountryInputChange('description', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="country-description-ar">Description (AR)</Label>
              <Textarea
                id="country-description-ar"
                dir="rtl"
                value={countryForm.description_ar}
                onChange={(e) => handleCountryInputChange('description_ar', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="country-image">Image URL</Label>
              <Input
                id="country-image"
                placeholder="https://..."
                value={countryForm.image_url}
                onChange={(e) => handleCountryInputChange('image_url', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="country-banner">Banner Image URL</Label>
              <Input
                id="country-banner"
                placeholder="https://..."
                value={countryForm.banner_image}
                onChange={(e) => handleCountryInputChange('banner_image', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country-sort-order">Sort Order</Label>
                <Input
                  id="country-sort-order"
                  type="number"
                  value={countryForm.sort_order}
                  onChange={(e) => handleCountryInputChange('sort_order', e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <Label htmlFor="country-featured">Featured</Label>
                  <p className="text-xs text-muted-foreground">إظهار الدولة في المواقع المميزة.</p>
                </div>
                <Switch
                  id="country-featured"
                  checked={countryForm.is_featured}
                  onCheckedChange={(checked) => handleCountryInputChange('is_featured', checked)}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isCountryPending}>إلغاء</Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveCountry} disabled={isCountryPending}>
              {isCountryPending ? 'جاري الحفظ...' : 'حفظ الدولة'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isManufacturerDialogOpen} onOpenChange={(open) => {
        if (open) {
          setIsManufacturerDialogOpen(true)
        } else {
          closeManufacturerDialog()
        }
      }}>
        <DialogContent className="w-full max-w-5xl lg:max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingManufacturer ? 'تعديل شركة' : 'إضافة شركة جديدة'}</DialogTitle>
            <DialogDescription>
              قم بتحديث معلومات الشركة المصنعة. سيتم ربطها بالدولة المختارة.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="manufacturer-name">Name (EN)</Label>
                <Input
                  id="manufacturer-name"
                  value={manufacturerForm.name}
                  onChange={(e) => handleManufacturerInputChange('name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="manufacturer-name-ar">Name (AR)</Label>
                <Input
                  id="manufacturer-name-ar"
                  dir="rtl"
                  value={manufacturerForm.name_ar}
                  onChange={(e) => handleManufacturerInputChange('name_ar', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="manufacturer-slug">Slug</Label>
              <Input
                id="manufacturer-slug"
                value={manufacturerForm.slug}
                onChange={(e) => handleManufacturerInputChange('slug', generateSlug(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="manufacturer-country">الدولة المصنعة</Label>
              <Select
                value={manufacturerForm.country_category_id}
                onValueChange={(value) => handleManufacturerInputChange('country_category_id', value)}
              >
                <SelectTrigger id="manufacturer-country">
                  <SelectValue placeholder="اختر الدولة" />
                </SelectTrigger>
                <SelectContent>
                  {hdfCountries.map((country) => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.name_ar || country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="manufacturer-description">Description (EN)</Label>
              <Textarea
                id="manufacturer-description"
                value={manufacturerForm.description}
                onChange={(e) => handleManufacturerInputChange('description', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="manufacturer-description-ar">Description (AR)</Label>
              <Textarea
                id="manufacturer-description-ar"
                dir="rtl"
                value={manufacturerForm.description_ar}
                onChange={(e) => handleManufacturerInputChange('description_ar', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="manufacturer-logo">Logo URL</Label>
              <Input
                id="manufacturer-logo"
                placeholder="https://..."
                value={manufacturerForm.logo_url}
                onChange={(e) => handleManufacturerInputChange('logo_url', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="manufacturer-banner">Banner Image URL</Label>
              <Input
                id="manufacturer-banner"
                placeholder="https://..."
                value={manufacturerForm.banner_image}
                onChange={(e) => handleManufacturerInputChange('banner_image', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="manufacturer-sort-order">Sort Order</Label>
                <Input
                  id="manufacturer-sort-order"
                  type="number"
                  value={manufacturerForm.sort_order}
                  onChange={(e) => handleManufacturerInputChange('sort_order', e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <Label htmlFor="manufacturer-featured">Featured</Label>
                  <p className="text-xs text-muted-foreground">تمييز الشركة في واجهات العرض.</p>
                </div>
                <Switch
                  id="manufacturer-featured"
                  checked={manufacturerForm.is_featured}
                  onCheckedChange={(checked) => handleManufacturerInputChange('is_featured', checked)}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isManufacturerPending}>إلغاء</Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveManufacturer} disabled={isManufacturerPending}>
              {isManufacturerPending ? 'جاري الحفظ...' : 'حفظ الشركة'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
