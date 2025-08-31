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
import { Save, Eye, Upload } from "lucide-react"

interface AboutContent {
  id: number
  page_title_en: string
  page_title_ar: string
  hero_title_en: string
  hero_title_ar: string
  hero_subtitle_en: string
  hero_subtitle_ar: string
  story_title_en: string
  story_title_ar: string
  story_content_en: string
  story_content_ar: string
  mission_title_en: string
  mission_title_ar: string
  mission_content_en: string
  mission_content_ar: string
  vision_title_en: string
  vision_title_ar: string
  vision_content_en: string
  vision_content_ar: string
  values_title_en: string
  values_title_ar: string
  values_content_en: string
  values_content_ar: string
  team_title_en: string
  team_title_ar: string
  team_description_en?: string
  team_description_ar?: string
  hero_image?: string
  story_image?: string
  mission_image?: string
  is_active: boolean
}

export default function AboutManagement() {
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null)
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
    story_title_en: "",
    story_title_ar: "",
    story_content_en: "",
    story_content_ar: "",
    mission_title_en: "",
    mission_title_ar: "",
    mission_content_en: "",
    mission_content_ar: "",
    vision_title_en: "",
    vision_title_ar: "",
    vision_content_en: "",
    vision_content_ar: "",
    values_title_en: "",
    values_title_ar: "",
    values_content_en: "",
    values_content_ar: "",
    team_title_en: "",
    team_title_ar: "",
    team_description_en: "",
    team_description_ar: "",
    hero_image: "",
    story_image: "",
    mission_image: "",
  })

  useEffect(() => {
    fetchAboutContent()
  }, [])

  const fetchAboutContent = async () => {
    try {
      const { data, error } = await supabase.from("about_content").select("*").eq("is_active", true).single()

      if (error && error.code !== "PGRST116") {
        throw error
      }

      if (data) {
        setAboutContent(data)
        setFormData({
          page_title_en: data.page_title_en || "",
          page_title_ar: data.page_title_ar || "",
          hero_title_en: data.hero_title_en || "",
          hero_title_ar: data.hero_title_ar || "",
          hero_subtitle_en: data.hero_subtitle_en || "",
          hero_subtitle_ar: data.hero_subtitle_ar || "",
          story_title_en: data.story_title_en || "",
          story_title_ar: data.story_title_ar || "",
          story_content_en: data.story_content_en || "",
          story_content_ar: data.story_content_ar || "",
          mission_title_en: data.mission_title_en || "",
          mission_title_ar: data.mission_title_ar || "",
          mission_content_en: data.mission_content_en || "",
          mission_content_ar: data.mission_content_ar || "",
          vision_title_en: data.vision_title_en || "",
          vision_title_ar: data.vision_title_ar || "",
          vision_content_en: data.vision_content_en || "",
          vision_content_ar: data.vision_content_ar || "",
          values_title_en: data.values_title_en || "",
          values_title_ar: data.values_title_ar || "",
          values_content_en: data.values_content_en || "",
          values_content_ar: data.values_content_ar || "",
          team_title_en: data.team_title_en || "",
          team_title_ar: data.team_title_ar || "",
          team_description_en: data.team_description_en || "",
          team_description_ar: data.team_description_ar || "",
          hero_image: data.hero_image || "",
          story_image: data.story_image || "",
          mission_image: data.mission_image || "",
        })
      }
    } catch (error) {
      console.error("خطأ في جلب محتوى صفحة من نحن:", error)
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

      if (aboutContent) {
        const { error } = await supabase.from("about_content").update(dataToSave).eq("id", aboutContent.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("about_content").insert([dataToSave])

        if (error) throw error
      }

      setSuccess("تم حفظ التغييرات بنجاح")
      fetchAboutContent()
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
          <h1 className="text-3xl font-bold text-gray-900">إدارة صفحة من نحن</h1>
          <p className="text-gray-600 mt-2">تعديل محتوى صفحة من نحن والقصة والمهمة والرؤية</p>
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
          <Tabs defaultValue="hero" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="hero">البطل</TabsTrigger>
              <TabsTrigger value="story">القصة</TabsTrigger>
              <TabsTrigger value="mission">المهمة</TabsTrigger>
              <TabsTrigger value="vision">الرؤية</TabsTrigger>
              <TabsTrigger value="values">القيم</TabsTrigger>
            </TabsList>

            <TabsContent value="hero" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>القسم الرئيسي</CardTitle>
                  <CardDescription>العنوان الرئيسي والفرعي للصفحة</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="page_title_en">عنوان الصفحة (إنجليزي)</Label>
                      <Input
                        id="page_title_en"
                        value={formData.page_title_en}
                        onChange={(e) => handleInputChange("page_title_en", e.target.value)}
                        placeholder="About Us"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="page_title_ar">عنوان الصفحة (عربي)</Label>
                      <Input
                        id="page_title_ar"
                        value={formData.page_title_ar}
                        onChange={(e) => handleInputChange("page_title_ar", e.target.value)}
                        placeholder="من نحن"
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
                        placeholder="About LUXE Furniture"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hero_title_ar">العنوان الرئيسي (عربي)</Label>
                      <Input
                        id="hero_title_ar"
                        value={formData.hero_title_ar}
                        onChange={(e) => handleInputChange("hero_title_ar", e.target.value)}
                        placeholder="عن أثاث لوكس"
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
                        placeholder="Crafting exceptional furniture experiences"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hero_subtitle_ar">العنوان الفرعي (عربي)</Label>
                      <Textarea
                        id="hero_subtitle_ar"
                        value={formData.hero_subtitle_ar}
                        onChange={(e) => handleInputChange("hero_subtitle_ar", e.target.value)}
                        placeholder="صناعة تجارب أثاث استثنائية"
                        rows={2}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hero_image">صورة القسم الرئيسي</Label>
                    <div className="relative">
                      <Input
                        id="hero_image"
                        value={formData.hero_image}
                        onChange={(e) => handleInputChange("hero_image", e.target.value)}
                        placeholder="https://example.com/hero-image.jpg"
                        className="pr-10"
                      />
                      <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                    {formData.hero_image && (
                      <div className="mt-2">
                        <img
                          src={formData.hero_image || "/placeholder.svg"}
                          alt="معاينة صورة القسم الرئيسي"
                          className="w-full h-32 object-cover rounded border"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg"
                          }}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="story" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>قسم القصة</CardTitle>
                  <CardDescription>قصة الشركة وتاريخها</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="story_title_en">عنوان القصة (إنجليزي)</Label>
                      <Input
                        id="story_title_en"
                        value={formData.story_title_en}
                        onChange={(e) => handleInputChange("story_title_en", e.target.value)}
                        placeholder="Our Story"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="story_title_ar">عنوان القصة (عربي)</Label>
                      <Input
                        id="story_title_ar"
                        value={formData.story_title_ar}
                        onChange={(e) => handleInputChange("story_title_ar", e.target.value)}
                        placeholder="قصتنا"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="story_content_en">محتوى القصة (إنجليزي)</Label>
                      <Textarea
                        id="story_content_en"
                        value={formData.story_content_en}
                        onChange={(e) => handleInputChange("story_content_en", e.target.value)}
                        placeholder="Founded with a passion for exceptional design..."
                        rows={6}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="story_content_ar">محتوى القصة (عربي)</Label>
                      <Textarea
                        id="story_content_ar"
                        value={formData.story_content_ar}
                        onChange={(e) => handleInputChange("story_content_ar", e.target.value)}
                        placeholder="تأسست بشغف للتصميم الاستثنائي..."
                        rows={6}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="story_image">صورة القصة</Label>
                    <Input
                      id="story_image"
                      value={formData.story_image}
                      onChange={(e) => handleInputChange("story_image", e.target.value)}
                      placeholder="https://example.com/story-image.jpg"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mission" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>قسم المهمة</CardTitle>
                  <CardDescription>مهمة الشركة وأهدافها</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mission_title_en">عنوان المهمة (إنجليزي)</Label>
                      <Input
                        id="mission_title_en"
                        value={formData.mission_title_en}
                        onChange={(e) => handleInputChange("mission_title_en", e.target.value)}
                        placeholder="Our Mission"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mission_title_ar">عنوان المهمة (عربي)</Label>
                      <Input
                        id="mission_title_ar"
                        value={formData.mission_title_ar}
                        onChange={(e) => handleInputChange("mission_title_ar", e.target.value)}
                        placeholder="مهمتنا"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mission_content_en">محتوى المهمة (إنجليزي)</Label>
                      <Textarea
                        id="mission_content_en"
                        value={formData.mission_content_en}
                        onChange={(e) => handleInputChange("mission_content_en", e.target.value)}
                        placeholder="To create furniture that transforms spaces..."
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mission_content_ar">محتوى المهمة (عربي)</Label>
                      <Textarea
                        id="mission_content_ar"
                        value={formData.mission_content_ar}
                        onChange={(e) => handleInputChange("mission_content_ar", e.target.value)}
                        placeholder="إنشاء أثاث يحول المساحات..."
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mission_image">صورة المهمة</Label>
                    <Input
                      id="mission_image"
                      value={formData.mission_image}
                      onChange={(e) => handleInputChange("mission_image", e.target.value)}
                      placeholder="https://example.com/mission-image.jpg"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="vision" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>قسم الرؤية</CardTitle>
                  <CardDescription>رؤية الشركة المستقبلية</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vision_title_en">عنوان الرؤية (إنجليزي)</Label>
                      <Input
                        id="vision_title_en"
                        value={formData.vision_title_en}
                        onChange={(e) => handleInputChange("vision_title_en", e.target.value)}
                        placeholder="Our Vision"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vision_title_ar">عنوان الرؤية (عربي)</Label>
                      <Input
                        id="vision_title_ar"
                        value={formData.vision_title_ar}
                        onChange={(e) => handleInputChange("vision_title_ar", e.target.value)}
                        placeholder="رؤيتنا"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vision_content_en">محتوى الرؤية (إنجليزي)</Label>
                      <Textarea
                        id="vision_content_en"
                        value={formData.vision_content_en}
                        onChange={(e) => handleInputChange("vision_content_en", e.target.value)}
                        placeholder="To be the leading furniture brand..."
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vision_content_ar">محتوى الرؤية (عربي)</Label>
                      <Textarea
                        id="vision_content_ar"
                        value={formData.vision_content_ar}
                        onChange={(e) => handleInputChange("vision_content_ar", e.target.value)}
                        placeholder="أن نكون العلامة التجارية الرائدة..."
                        rows={4}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="values" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>قسم القيم</CardTitle>
                  <CardDescription>قيم ومبادئ الشركة</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="values_title_en">عنوان القيم (إنجليزي)</Label>
                      <Input
                        id="values_title_en"
                        value={formData.values_title_en}
                        onChange={(e) => handleInputChange("values_title_en", e.target.value)}
                        placeholder="Our Values"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="values_title_ar">عنوان القيم (عربي)</Label>
                      <Input
                        id="values_title_ar"
                        value={formData.values_title_ar}
                        onChange={(e) => handleInputChange("values_title_ar", e.target.value)}
                        placeholder="قيمنا"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="values_content_en">محتوى القيم (إنجليزي)</Label>
                      <Textarea
                        id="values_content_en"
                        value={formData.values_content_en}
                        onChange={(e) => handleInputChange("values_content_en", e.target.value)}
                        placeholder="Quality, Innovation, Sustainability..."
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="values_content_ar">محتوى القيم (عربي)</Label>
                      <Textarea
                        id="values_content_ar"
                        value={formData.values_content_ar}
                        onChange={(e) => handleInputChange("values_content_ar", e.target.value)}
                        placeholder="الجودة والابتكار والاستدامة..."
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="team_title_en">عنوان الفريق (إنجليزي)</Label>
                      <Input
                        id="team_title_en"
                        value={formData.team_title_en}
                        onChange={(e) => handleInputChange("team_title_en", e.target.value)}
                        placeholder="Our Team"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="team_title_ar">عنوان الفريق (عربي)</Label>
                      <Input
                        id="team_title_ar"
                        value={formData.team_title_ar}
                        onChange={(e) => handleInputChange("team_title_ar", e.target.value)}
                        placeholder="فريقنا"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="team_description_en">وصف الفريق (إنجليزي)</Label>
                      <Textarea
                        id="team_description_en"
                        value={formData.team_description_en}
                        onChange={(e) => handleInputChange("team_description_en", e.target.value)}
                        placeholder="Meet our talented team..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="team_description_ar">وصف الفريق (عربي)</Label>
                      <Textarea
                        id="team_description_ar"
                        value={formData.team_description_ar}
                        onChange={(e) => handleInputChange("team_description_ar", e.target.value)}
                        placeholder="تعرف على فريقنا الموهوب..."
                        rows={3}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* المعاينة */}
        {previewMode && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>معاينة صفحة من نحن</CardTitle>
                <CardDescription>كيف ستظهر الصفحة في الموقع</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* القسم الرئيسي */}
                  <div className="text-center space-y-4 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                    <h1 className="text-4xl font-bold text-gray-900">{formData.hero_title_ar || "عنوان الصفحة"}</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                      {formData.hero_subtitle_ar || "العنوان الفرعي"}
                    </p>
                    {formData.hero_image && (
                      <img
                        src={formData.hero_image || "/placeholder.svg"}
                        alt="صورة القسم الرئيسي"
                        className="w-full h-48 object-cover rounded-lg mt-4"
                      />
                    )}
                  </div>

                  {/* قسم القصة */}
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">{formData.story_title_ar || "قصتنا"}</h2>
                    <p className="text-gray-700 leading-relaxed">{formData.story_content_ar || "محتوى القصة..."}</p>
                    {formData.story_image && (
                      <img
                        src={formData.story_image || "/placeholder.svg"}
                        alt="صورة القصة"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    )}
                  </div>

                  {/* قسم المهمة */}
                  <div className="space-y-4 bg-blue-50 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold text-blue-900">{formData.mission_title_ar || "مهمتنا"}</h2>
                    <p className="text-blue-800 leading-relaxed">{formData.mission_content_ar || "محتوى المهمة..."}</p>
                  </div>

                  {/* قسم الرؤية */}
                  <div className="space-y-4 bg-green-50 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold text-green-900">{formData.vision_title_ar || "رؤيتنا"}</h2>
                    <p className="text-green-800 leading-relaxed">{formData.vision_content_ar || "محتوى الرؤية..."}</p>
                  </div>

                  {/* قسم القيم */}
                  <div className="space-y-4 bg-purple-50 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold text-purple-900">{formData.values_title_ar || "قيمنا"}</h2>
                    <p className="text-purple-800 leading-relaxed">{formData.values_content_ar || "محتوى القيم..."}</p>
                  </div>

                  {/* قسم الفريق */}
                  {(formData.team_title_ar || formData.team_description_ar) && (
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold text-gray-900">{formData.team_title_ar || "فريقنا"}</h2>
                      <p className="text-gray-700 leading-relaxed">{formData.team_description_ar || "وصف الفريق..."}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
