'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/hooks/use-toast'
import { Loader2, Save, Eye, Upload, X } from 'lucide-react'
import { supabase } from '@/lib/supabase-client'
const MAX_FILE_SIZE = 512 * 1024; // 0.5 MB

declare global {
  interface Window {
    cloudinary: any;
  }
}

interface HeroContent {
  id?: number
  title_en: string
  title_ar: string
  subtitle_en: string
  subtitle_ar: string
  description_en: string
  description_ar: string
  button1_text_en: string
  button1_text_ar: string
  button1_link: string
  button2_text_en: string
  button2_text_ar: string
  button2_link: string
  background_image?: string
  video_url?: string
  is_active: boolean
}

export default function HeroManagement() {
  const { language, isRTL } = useLanguage()
  const [heroContent, setHeroContent] = useState<HeroContent>({
    title_en: '',
    title_ar: '',
    subtitle_en: '',
    subtitle_ar: '',
    description_en: '',
    description_ar: '',
    button1_text_en: 'Explore Collection',
    button1_text_ar: 'استكشف المجموعة',
    button1_link: '/categories',
    button2_text_en: 'View 3D Designs',
    button2_text_ar: 'عرض التصاميم ثلاثية الأبعاد',
    button2_link: '/3d-designs',
    background_image: '',
    video_url: '',
    is_active: true
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  useEffect(() => {
    fetchHeroContent()
  }, [])

  const fetchHeroContent = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_content')
        .select('*')
        .eq('is_active', true)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setHeroContent(data)
      }
    } catch (error) {
      console.error('Error fetching hero content:', error)
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'فشل في تحميل المحتوى' : 'Failed to load content',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { data, error } = await supabase
        .from('hero_content')
        .upsert({
          ...heroContent,
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      setHeroContent(data)
      toast({
        title: language === 'ar' ? 'تم الحفظ' : 'Saved',
        description: language === 'ar' ? 'تم حفظ المحتوى بنجاح' : 'Content saved successfully'
      })
    } catch (error) {
      console.error('Error saving hero content:', error)
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'فشل في حفظ المحتوى' : 'Failed to save content',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImageUploading(true)
    try {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: language === 'ar' ? 'حجم الملف كبير' : 'File too large',
          description: language === 'ar' ? 'الحد الأقصى لحجم الصورة هو 0.5 ميجابايت' : 'Maximum image size is 0.5 MB',
          variant: 'destructive'
        })
        return
      }
      const fileExt = file.name.split('.').pop()
      const fileName = `hero-${Date.now()}.${fileExt}`
      const filePath = `hero/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      setHeroContent(prev => ({
        ...prev,
        background_image: publicUrl
      }))

      toast({
        title: language === 'ar' ? 'تم الرفع' : 'Uploaded',
        description: language === 'ar' ? 'تم رفع الصورة بنجاح' : 'Image uploaded successfully'
      })
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'فشل في رفع الصورة' : 'Failed to upload image',
        variant: 'destructive'
      })
    } finally {
      setImageUploading(false)
    }
  }

  const ensureCloudinaryLoaded = () => new Promise<void>((resolve, reject) => {
    if (typeof window !== 'undefined' && window.cloudinary) return resolve();
    const script = document.createElement('script');
    script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Cloudinary widget'));
    document.body.appendChild(script);
  });

  const openCloudinaryWidget = async () => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      toast({
        title: language === 'ar' ? 'غير مُهيأ' : 'Not configured',
        description: language === 'ar' ? 'يرجى إعداد متغيرات Cloudinary في البيئة' : 'Please set Cloudinary env vars',
        variant: 'destructive'
      })
      return;
    }
    try {
      await ensureCloudinaryLoaded();
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName,
          uploadPreset,
          multiple: false,
          sources: ['local', 'url', 'camera'],
          maxFileSize: MAX_FILE_SIZE,
        },
        (error: any, result: any) => {
          if (error) {
            toast({ title: 'Cloudinary', description: String(error?.message || error), variant: 'destructive' });
            return;
          }
          if (result && result.event === 'success') {
            const url = result.info?.secure_url || result.info?.url;
            if (url) {
              setHeroContent(prev => ({ ...prev, background_image: url }));
              toast({ title: language === 'ar' ? 'تم الرفع' : 'Uploaded', description: language === 'ar' ? 'تم الرفع عبر Cloudinary' : 'Uploaded via Cloudinary' });
            }
          }
        }
      );
      widget.open();
    } catch (e: any) {
      toast({ title: 'Cloudinary', description: String(e?.message || e), variant: 'destructive' });
    }
  }

  const removeImage = () => {
    setHeroContent(prev => ({
      ...prev,
      background_image: ''
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {language === 'ar' ? 'إدارة القسم الرئيسي' : 'Hero Section Management'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'ar' 
              ? 'إدارة محتوى القسم الرئيسي للموقع' 
              : 'Manage the main hero section content of the website'
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'معاينة' : 'Preview'}
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {language === 'ar' ? 'حفظ' : 'Save'}
          </Button>
        </div>
      </div>

      {previewMode && (
        <Card>
          <CardHeader>
            <CardTitle>{language === 'ar' ? 'معاينة القسم الرئيسي' : 'Hero Section Preview'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="relative min-h-[400px] rounded-lg overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white"
              style={{
                backgroundImage: heroContent.background_image ? `url(${heroContent.background_image})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {language === 'ar' ? heroContent.title_ar : heroContent.title_en}
                </h1>
                <p className="text-xl md:text-2xl mb-6">
                  {language === 'ar' ? heroContent.subtitle_ar : heroContent.subtitle_en}
                </p>
                <p className="text-lg mb-8 opacity-90">
                  {language === 'ar' ? heroContent.description_ar : heroContent.description_en}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                    {language === 'ar' ? heroContent.button1_text_ar : heroContent.button1_text_en}
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                    {language === 'ar' ? heroContent.button2_text_ar : heroContent.button2_text_en}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="content" className="space-y-4">
        <TabsList>
          <TabsTrigger value="content">
            {language === 'ar' ? 'المحتوى' : 'Content'}
          </TabsTrigger>
          <TabsTrigger value="buttons">
            {language === 'ar' ? 'الأزرار' : 'Buttons'}
          </TabsTrigger>
          <TabsTrigger value="media">
            {language === 'ar' ? 'الوسائط' : 'Media'}
          </TabsTrigger>
          <TabsTrigger value="settings">
            {language === 'ar' ? 'الإعدادات' : 'Settings'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'المحتوى الإنجليزي' : 'English Content'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title_en">{language === 'ar' ? 'العنوان الرئيسي' : 'Main Title'}</Label>
                  <Input
                    id="title_en"
                    value={heroContent.title_en}
                    onChange={(e) => setHeroContent(prev => ({ ...prev, title_en: e.target.value }))}
                    placeholder="Transform Your Space with Modern Furniture"
                  />
                </div>
                <div>
                  <Label htmlFor="subtitle_en">{language === 'ar' ? 'العنوان الفرعي' : 'Subtitle'}</Label>
                  <Input
                    id="subtitle_en"
                    value={heroContent.subtitle_en}
                    onChange={(e) => setHeroContent(prev => ({ ...prev, subtitle_en: e.target.value }))}
                    placeholder="Discover cutting-edge furniture design"
                  />
                </div>
                <div>
                  <Label htmlFor="description_en">{language === 'ar' ? 'الوصف' : 'Description'}</Label>
                  <Textarea
                    id="description_en"
                    value={heroContent.description_en}
                    onChange={(e) => setHeroContent(prev => ({ ...prev, description_en: e.target.value }))}
                    placeholder="Explore our curated collection..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'المحتوى العربي' : 'Arabic Content'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title_ar">{language === 'ar' ? 'العنوان الرئيسي' : 'Main Title'}</Label>
                  <Input
                    id="title_ar"
                    value={heroContent.title_ar}
                    onChange={(e) => setHeroContent(prev => ({ ...prev, title_ar: e.target.value }))}
                    placeholder="حوّل مساحتك بالأثاث العصري"
                    dir="rtl"
                  />
                </div>
                <div>
                  <Label htmlFor="subtitle_ar">{language === 'ar' ? 'العنوان الفرعي' : 'Subtitle'}</Label>
                  <Input
                    id="subtitle_ar"
                    value={heroContent.subtitle_ar}
                    onChange={(e) => setHeroContent(prev => ({ ...prev, subtitle_ar: e.target.value }))}
                    placeholder="اكتشف تصميم الأثاث المتطور"
                    dir="rtl"
                  />
                </div>
                <div>
                  <Label htmlFor="description_ar">{language === 'ar' ? 'الوصف' : 'Description'}</Label>
                  <Textarea
                    id="description_ar"
                    value={heroContent.description_ar}
                    onChange={(e) => setHeroContent(prev => ({ ...prev, description_ar: e.target.value }))}
                    placeholder="استكشف مجموعتنا المختارة..."
                    rows={4}
                    dir="rtl"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="buttons" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'الزر الأول' : 'First Button'}</CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'الزر الرئيسي للدعوة للعمل' : 'Primary call-to-action button'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="button1_text_en">{language === 'ar' ? 'النص الإنجليزي' : 'English Text'}</Label>
                  <Input
                    id="button1_text_en"
                    value={heroContent.button1_text_en}
                    onChange={(e) => setHeroContent(prev => ({ ...prev, button1_text_en: e.target.value }))}
                    placeholder="Explore Collection"
                  />
                </div>
                <div>
                  <Label htmlFor="button1_text_ar">{language === 'ar' ? 'النص العربي' : 'Arabic Text'}</Label>
                  <Input
                    id="button1_text_ar"
                    value={heroContent.button1_text_ar}
                    onChange={(e) => setHeroContent(prev => ({ ...prev, button1_text_ar: e.target.value }))}
                    placeholder="استكشف المجموعة"
                    dir="rtl"
                  />
                </div>
                <div>
                  <Label htmlFor="button1_link">{language === 'ar' ? 'الرابط' : 'Link'}</Label>
                  <Input
                    id="button1_link"
                    value={heroContent.button1_link}
                    onChange={(e) => setHeroContent(prev => ({ ...prev, button1_link: e.target.value }))}
                    placeholder="/categories"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'الزر الثاني' : 'Second Button'}</CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'الزر الثانوي للدعوة للعمل' : 'Secondary call-to-action button'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="button2_text_en">{language === 'ar' ? 'النص الإنجليزي' : 'English Text'}</Label>
                  <Input
                    id="button2_text_en"
                    value={heroContent.button2_text_en}
                    onChange={(e) => setHeroContent(prev => ({ ...prev, button2_text_en: e.target.value }))}
                    placeholder="View 3D Designs"
                  />
                </div>
                <div>
                  <Label htmlFor="button2_text_ar">{language === 'ar' ? 'النص العربي' : 'Arabic Text'}</Label>
                  <Input
                    id="button2_text_ar"
                    value={heroContent.button2_text_ar}
                    onChange={(e) => setHeroContent(prev => ({ ...prev, button2_text_ar: e.target.value }))}
                    placeholder="عرض التصاميم ثلاثية الأبعاد"
                    dir="rtl"
                  />
                </div>
                <div>
                  <Label htmlFor="button2_link">{language === 'ar' ? 'الرابط' : 'Link'}</Label>
                  <Input
                    id="button2_link"
                    value={heroContent.button2_link}
                    onChange={(e) => setHeroContent(prev => ({ ...prev, button2_link: e.target.value }))}
                    placeholder="/3d-designs"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'صورة الخلفية' : 'Background Image'}</CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'رفع صورة خلفية للقسم الرئيسي' : 'Upload a background image for the hero section'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {heroContent.background_image ? (
                  <div className="relative">
                    <img
                      src={heroContent.background_image || "/placeholder.svg"}
                      alt="Background"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-4">
                      {language === 'ar' ? 'لا توجد صورة مرفوعة' : 'No image uploaded'}
                    </p>
                  </div>
                )}
                <div>
                  <Label htmlFor="background_image">
                    {language === 'ar' ? 'رفع صورة جديدة' : 'Upload New Image'}
                  </Label>
                  <Input
                    id="background_image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={imageUploading}
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <Button variant="secondary" type="button" onClick={openCloudinaryWidget} disabled={imageUploading}>
                      {language === 'ar' ? 'الرفع عبر Cloudinary' : 'Upload via Cloudinary'}
                    </Button>
                    <span className="text-xs text-muted-foreground">{language === 'ar' ? 'الحد الأقصى 0.5 ميجابايت' : 'Max 0.5 MB'}</span>
                  </div>
                  {imageUploading && (
                    <div className="flex items-center mt-2">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span className="text-sm text-gray-500">
                        {language === 'ar' ? 'جاري الرفع...' : 'Uploading...'}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'فيديو الخلفية' : 'Background Video'}</CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'رابط فيديو للخلفية (اختياري)' : 'Background video URL (optional)'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="video_url">{language === 'ar' ? 'رابط الفيديو' : 'Video URL'}</Label>
                  <Input
                    id="video_url"
                    value={heroContent.video_url || ''}
                    onChange={(e) => setHeroContent(prev => ({ ...prev, video_url: e.target.value }))}
                    placeholder="https://example.com/video.mp4"
                  />
                </div>
                {heroContent.video_url && (
                  <div>
                    <video
                      src={heroContent.video_url}
                      className="w-full h-48 object-cover rounded-lg"
                      controls
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'إعدادات القسم' : 'Section Settings'}</CardTitle>
              <CardDescription>
                {language === 'ar' ? 'إعدادات عامة للقسم الرئيسي' : 'General settings for the hero section'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={heroContent.is_active}
                  onCheckedChange={(checked) => setHeroContent(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">
                  {language === 'ar' ? 'تفعيل القسم' : 'Enable Section'}
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                {language === 'ar' 
                  ? 'عند إلغاء التفعيل، لن يظهر القسم الرئيسي في الموقع'
                  : 'When disabled, the hero section will not appear on the website'
                }
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
