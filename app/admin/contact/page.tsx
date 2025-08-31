"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Eye, Phone, Mail, MapPin, Clock, Globe } from "lucide-react"

interface ContactInfo {
  id: number
  page_title_en: string
  page_title_ar: string
  hero_title_en: string
  hero_title_ar: string
  hero_subtitle_en?: string
  hero_subtitle_ar?: string
  address_en: string
  address_ar: string
  phone_primary: string
  phone_secondary?: string
  email_general: string
  email_support?: string
  email_sales?: string
  whatsapp_number?: string
  business_hours_en: string
  business_hours_ar: string
  map_embed_url?: string
  social_facebook?: string
  social_instagram?: string
  social_twitter?: string
  social_linkedin?: string
  social_youtube?: string
  contact_form_title_en?: string
  contact_form_title_ar?: string
  is_active: boolean
}

export default function ContactManagement() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [previewMode, setPreviewMode] = useState(false)

  const [formData, setFormData] = useState({
    page_title_en: "",
    page_title_ar: "",
    hero_title_en: "",
    hero_title_ar: "",
    hero_subtitle_en: "",
    hero_subtitle_ar: "",
    address_en: "",
    address_ar: "",
    phone_primary: "",
    phone_secondary: "",
    email_general: "",
    email_support: "",
    email_sales: "",
    whatsapp_number: "",
    business_hours_en: "",
    business_hours_ar: "",
    map_embed_url: "",
    social_facebook: "",
    social_instagram: "",
    social_twitter: "",
    social_linkedin: "",
    social_youtube: "",
    contact_form_title_en: "",
    contact_form_title_ar: "",
  })

  useEffect(() => {
    fetchContactInfo()
  }, [])

  const fetchContactInfo = async () => {
    try {
      const { data, error } = await supabase.from("contact_info").select("*").eq("is_active", true).single()

      if (error && error.code !== "PGRST116") {
        throw error
      }

      if (data) {
        setContactInfo(data)
        setFormData({
          page_title_en: data.page_title_en || "",
          page_title_ar: data.page_title_ar || "",
          hero_title_en: data.hero_title_en || "",
          hero_title_ar: data.hero_title_ar || "",
          hero_subtitle_en: data.hero_subtitle_en || "",
          hero_subtitle_ar: data.hero_subtitle_ar || "",
          address_en: data.address_en || "",
          address_ar: data.address_ar || "",
          phone_primary: data.phone_primary || "",
          phone_secondary: data.phone_secondary || "",
          email_general: data.email_general || "",
          email_support: data.email_support || "",
          email_sales: data.email_sales || "",
          whatsapp_number: data.whatsapp_number || "",
          business_hours_en: data.business_hours_en || "",
          business_hours_ar: data.business_hours_ar || "",
          map_embed_url: data.map_embed_url || "",
          social_facebook: data.social_facebook || "",
          social_instagram: data.social_instagram || "",
          social_twitter: data.social_twitter || "",
          social_linkedin: data.social_linkedin || "",
          social_youtube: data.social_youtube || "",
          contact_form_title_en: data.contact_form_title_en || "",
          contact_form_title_ar: data.contact_form_title_ar || "",
        })
      }
    } catch (error) {
      console.error("خطأ في جلب معلومات التواصل:", error)
      setError("خطأ في تحميل البيانات")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const dataToSave = {
        ...formData,
        is_active: true,
        updated_at: new Date().toISOString(),
      }

      if (contactInfo) {
        const { error } = await supabase.from("contact_info").update(dataToSave).eq("id", contactInfo.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("contact_info").insert([dataToSave])

        if (error) throw error
      }

      setSuccess("تم حفظ معلومات التواصل بنجاح")
      fetchContactInfo()
    } catch (error) {
      console.error("خطأ في حفظ البيانات:", error)
      setError("حدث خطأ أثناء حفظ البيانات")
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* العنوان والإجراءات */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة معلومات التواصل</h1>
          <p className="text-gray-600 mt-2">تعديل معلومات التواصل والعناوين وأرقام الهواتف</p>
        </div>
        <div className="flex space-x-2 space-x-reverse">
          <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
            <Eye className="ml-2 h-4 w-4" />
            {previewMode ? "إخفاء المعاينة" : "معاينة"}
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="ml-2 h-4 w-4" />
            {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
          </Button>
        </div>
      </div>

      {/* التنبيهات */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* نموذج التحرير */}
        <div className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">أساسي</TabsTrigger>
              <TabsTrigger value="contact">التواصل</TabsTrigger>
              <TabsTrigger value="social">اجتماعي</TabsTrigger>
              <TabsTrigger value="map">الخريطة</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>المعلومات الأساسية</CardTitle>
                  <CardDescription>عناوين الصفحة والأقسام الرئيسية</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="page_title_en">عنوان الصفحة (إنجليزي)</Label>
                      <Input
                        id="page_title_en"
                        value={formData.page_title_en}
                        onChange={(e) => handleInputChange("page_title_en", e.target.value)}
                        placeholder="Contact Us"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="page_title_ar">عنوان الصفحة (عربي)</Label>
                      <Input
                        id="page_title_ar"
                        value={formData.page_title_ar}
                        onChange={(e) => handleInputChange("page_title_ar", e.target.value)}
                        placeholder="تواصل معنا"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hero_title_en">العنوان الرئيسي (إنجليزي)</Label>
                      <Input
                        id="hero_title_en"
                        value={formData.hero_title_en}
                        onChange={(e) => handleInputChange("hero_title_en", e.target.value)}
                        placeholder="Get in Touch"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hero_title_ar">العنوان الرئيسي (عربي)</Label>
                      <Input
                        id="hero_title_ar"
                        value={formData.hero_title_ar}
                        onChange={(e) => handleInputChange("hero_title_ar", e.target.value)}
                        placeholder="تواصل معنا"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hero_subtitle_en">العنوان الفرعي (إنجليزي)</Label>
                      <Textarea
                        id="hero_subtitle_en"
                        value={formData.hero_subtitle_en}
                        onChange={(e) => handleInputChange("hero_subtitle_en", e.target.value)}
                        placeholder="We'd love to hear from you"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hero_subtitle_ar">العنوان الفرعي (عربي)</Label>
                      <Textarea
                        id="hero_subtitle_ar"
                        value={formData.hero_subtitle_ar}
                        onChange={(e) => handleInputChange("hero_subtitle_ar", e.target.value)}
                        placeholder="نحن نحب أن نسمع منك"
                        rows={2}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact_form_title_en">عنوان نموذج التواصل (إنجليزي)</Label>
                      <Input
                        id="contact_form_title_en"
                        value={formData.contact_form_title_en}
                        onChange={(e) => handleInputChange("contact_form_title_en", e.target.value)}
                        placeholder="Send us a Message"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact_form_title_ar">عنوان نموذج التواصل (عربي)</Label>
                      <Input
                        id="contact_form_title_ar"
                        value={formData.contact_form_title_ar}
                        onChange={(e) => handleInputChange("contact_form_title_ar", e.target.value)}
                        placeholder="أرسل لنا رسالة"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    العنوان
                  </CardTitle>
                  <CardDescription>عنوان المعرض الرئيسي</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address_en">العنوان (إنجليزي)</Label>
                    <Textarea
                      id="address_en"
                      value={formData.address_en}
                      onChange={(e) => handleInputChange("address_en", e.target.value)}
                      placeholder="123 Design Street, Riyadh, Saudi Arabia"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address_ar">العنوان (عربي)</Label>
                    <Textarea
                      id="address_ar"
                      value={formData.address_ar}
                      onChange={(e) => handleInputChange("address_ar", e.target.value)}
                      placeholder="123 شارع التصميم، الرياض، المملكة العربية السعودية"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    أرقام الهواتف
                  </CardTitle>
                  <CardDescription>أرقام الهواتف للتواصل</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone_primary">الهاتف الرئيسي</Label>
                    <Input
                      id="phone_primary"
                      value={formData.phone_primary}
                      onChange={(e) => handleInputChange("phone_primary", e.target.value)}
                      placeholder="+966 50 123 4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone_secondary">الهاتف الثانوي (اختياري)</Label>
                    <Input
                      id="phone_secondary"
                      value={formData.phone_secondary}
                      onChange={(e) => handleInputChange("phone_secondary", e.target.value)}
                      placeholder="+966 50 123 4568"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp_number">رقم الواتساب</Label>
                    <Input
                      id="whatsapp_number"
                      value={formData.whatsapp_number}
                      onChange={(e) => handleInputChange("whatsapp_number", e.target.value)}
                      placeholder="+966501234567"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    عناوين البريد الإلكتروني
                  </CardTitle>
                  <CardDescription>عناوين البريد الإلكتروني للأقسام المختلفة</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email_general">البريد العام</Label>
                    <Input
                      id="email_general"
                      type="email"
                      value={formData.email_general}
                      onChange={(e) => handleInputChange("email_general", e.target.value)}
                      placeholder="info@luxefurniture.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email_support">بريد الدعم الفني</Label>
                    <Input
                      id="email_support"
                      type="email"
                      value={formData.email_support}
                      onChange={(e) => handleInputChange("email_support", e.target.value)}
                      placeholder="support@luxefurniture.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email_sales">بريد المبيعات</Label>
                    <Input
                      id="email_sales"
                      type="email"
                      value={formData.email_sales}
                      onChange={(e) => handleInputChange("email_sales", e.target.value)}
                      placeholder="sales@luxefurniture.com"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    ساعات العمل
                  </CardTitle>
                  <CardDescription>أوقات العمل الرسمية</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="business_hours_en">ساعات العمل (إنجليزي)</Label>
                    <Input
                      id="business_hours_en"
                      value={formData.business_hours_en}
                      onChange={(e) => handleInputChange("business_hours_en", e.target.value)}
                      placeholder="Sunday - Thursday: 9:00 AM - 9:00 PM"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business_hours_ar">ساعات العمل (عربي)</Label>
                    <Input
                      id="business_hours_ar"
                      value={formData.business_hours_ar}
                      onChange={(e) => handleInputChange("business_hours_ar", e.target.value)}
                      placeholder="الأحد - الخميس: 9:00 ص - 9:00 م"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    وسائل التواصل الاجتماعي
                  </CardTitle>
                  <CardDescription>روابط حسابات وسائل التواصل الاجتماعي</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="social_facebook">فيسبوك</Label>
                    <Input
                      id="social_facebook"
                      value={formData.social_facebook}
                      onChange={(e) => handleInputChange("social_facebook", e.target.value)}
                      placeholder="https://facebook.com/luxefurniture"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social_instagram">إنستغرام</Label>
                    <Input
                      id="social_instagram"
                      value={formData.social_instagram}
                      onChange={(e) => handleInputChange("social_instagram", e.target.value)}
                      placeholder="https://instagram.com/luxefurniture"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social_twitter">تويتر</Label>
                    <Input
                      id="social_twitter"
                      value={formData.social_twitter}
                      onChange={(e) => handleInputChange("social_twitter", e.target.value)}
                      placeholder="https://twitter.com/luxefurniture"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social_linkedin">لينكد إن</Label>
                    <Input
                      id="social_linkedin"
                      value={formData.social_linkedin}
                      onChange={(e) => handleInputChange("social_linkedin", e.target.value)}
                      placeholder="https://linkedin.com/company/luxefurniture"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social_youtube">يوتيوب</Label>
                    <Input
                      id="social_youtube"
                      value={formData.social_youtube}
                      onChange={(e) => handleInputChange("social_youtube", e.target.value)}
                      placeholder="https://youtube.com/luxefurniture"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="map" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>خريطة الموقع</CardTitle>
                  <CardDescription>رابط تضمين خريطة جوجل</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="map_embed_url">رابط تضمين الخريطة</Label>
                    <Textarea
                      id="map_embed_url"
                      value={formData.map_embed_url}
                      onChange={(e) => handleInputChange("map_embed_url", e.target.value)}
                      placeholder="https://www.google.com/maps/embed?pb=..."
                      rows={4}
                    />
                    <p className="text-xs text-gray-500">
                      احصل على رابط التضمين من خرائط جوجل: اذهب إلى الموقع → مشاركة → تضمين خريطة
                    </p>
                  </div>

                  {formData.map_embed_url && (
                    <div className="space-y-2">
                      <Label>معاينة الخريطة</Label>
                      <div className="border rounded-lg overflow-hidden">
                        <iframe
                          src={formData.map_embed_url}
                          width="100%"
                          height="200"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* المعاينة */}
        {previewMode && (
          <Card>
            <CardHeader>
              <CardTitle>معاينة معلومات التواصل</CardTitle>
              <CardDescription>كيف ستظهر معلومات التواصل في الموقع</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* القسم الرئيسي */}
                <div className="text-center space-y-2 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <h1 className="text-3xl font-bold text-blue-900">{formData.hero_title_ar || "تواصل معنا"}</h1>
                  <p className="text-blue-700">{formData.hero_subtitle_ar || "نحن نحب أن نسمع منك"}</p>
                </div>

                {/* معلومات التواصل */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-600 mt-1" />
                      <div>
                        <h4 className="font-semibold">العنوان</h4>
                        <p className="text-gray-600 text-sm">{formData.address_ar || "العنوان بالعربية"}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-gray-600 mt-1" />
                      <div>
                        <h4 className="font-semibold">الهاتف</h4>
                        <p className="text-gray-600 text-sm">{formData.phone_primary || "الهاتف الرئيسي"}</p>
                        {formData.phone_secondary && (
                          <p className="text-gray-600 text-sm">{formData.phone_secondary}</p>
                        )}
                        {formData.whatsapp_number && (
                          <p className="text-gray-600 text-sm">واتساب: {formData.whatsapp_number}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-gray-600 mt-1" />
                      <div>
                        <h4 className="font-semibold">البريد الإلكتروني</h4>
                        <p className="text-gray-600 text-sm">عام: {formData.email_general || "البريد العام"}</p>
                        {formData.email_support && (
                          <p className="text-gray-600 text-sm">دعم: {formData.email_support}</p>
                        )}
                        {formData.email_sales && (
                          <p className="text-gray-600 text-sm">مبيعات: {formData.email_sales}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-gray-600 mt-1" />
                      <div>
                        <h4 className="font-semibold">ساعات العمل</h4>
                        <p className="text-gray-600 text-sm">{formData.business_hours_ar || "ساعات العمل"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">{formData.contact_form_title_ar || "أرسل لنا رسالة"}</h4>
                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                      <Input placeholder="الاسم" />
                      <Input placeholder="البريد الإلكتروني" />
                      <Input placeholder="الموضوع" />
                      <Textarea placeholder="الرسالة" rows={3} />
                      <Button className="w-full">إرسال الرسالة</Button>
                    </div>
                  </div>
                </div>

                {/* وسائل التواصل الاجتماعي */}
                {(formData.social_facebook ||
                  formData.social_instagram ||
                  formData.social_twitter ||
                  formData.social_linkedin ||
                  formData.social_youtube) && (
                  <div className="space-y-4">
                    <h4 className="font-semibold">تابعنا على</h4>
                    <div className="flex gap-4">
                      {formData.social_facebook && (
                        <Button variant="outline" size="sm">
                          فيسبوك
                        </Button>
                      )}
                      {formData.social_instagram && (
                        <Button variant="outline" size="sm">
                          إنستغرام
                        </Button>
                      )}
                      {formData.social_twitter && (
                        <Button variant="outline" size="sm">
                          تويتر
                        </Button>
                      )}
                      {formData.social_linkedin && (
                        <Button variant="outline" size="sm">
                          لينكد إن
                        </Button>
                      )}
                      {formData.social_youtube && (
                        <Button variant="outline" size="sm">
                          يوتيوب
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* الخريطة */}
                {formData.map_embed_url && (
                  <div className="space-y-4">
                    <h4 className="font-semibold">موقعنا على الخريطة</h4>
                    <div className="border rounded-lg overflow-hidden">
                      <iframe
                        src={formData.map_embed_url}
                        width="100%"
                        height="200"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
