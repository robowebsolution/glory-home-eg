"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save, Settings, Globe } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { ImageIcon } from "lucide-react"

interface SiteSettings {
  id: number
  site_name_en: string
  site_name_ar: string
  site_description_en: string
  site_description_ar: string
  logo_url: string
  favicon_url: string
  primary_color: string
  secondary_color: string
  is_maintenance_mode: boolean
}

export default function SiteSettingsManagement() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    site_name_en: "",
    site_name_ar: "",
    site_description_en: "",
    site_description_ar: "",
    logo_url: "",
    favicon_url: "",
    primary_color: "#000000",
    secondary_color: "#666666",
    is_maintenance_mode: false,
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from("site_settings").select("*").single()

      if (error && error.code !== "PGRST116") throw error

      if (data) {
        setSettings(data)
        setFormData({
          site_name_en: data.site_name_en,
          site_name_ar: data.site_name_ar,
          site_description_en: data.site_description_en,
          site_description_ar: data.site_description_ar,
          logo_url: data.logo_url || "",
          favicon_url: data.favicon_url || "",
          primary_color: data.primary_color || "#000000",
          secondary_color: data.secondary_color || "#666666",
          is_maintenance_mode: data.is_maintenance_mode || false,
        })
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
      setError("خطأ في تحميل إعدادات الموقع")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const settingsData = {
        ...formData,
        updated_at: new Date().toISOString(),
      }

      if (settings) {
        const { error } = await supabase.from("site_settings").update(settingsData).eq("id", settings.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("site_settings").insert([settingsData])

        if (error) throw error
      }

      setSuccess("تم حفظ إعدادات الموقع بنجاح")
      fetchSettings()
    } catch (error) {
      console.error("Error saving settings:", error)
      setError("خطأ في حفظ إعدادات الموقع")
    } finally {
      setSaving(false)
    }
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">إعدادات الموقع</h1>
        <p className="text-gray-600 mt-2">إدارة الإعدادات العامة للموقع والعلامة التجارية</p>
      </div>

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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Site Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              معلومات الموقع
            </CardTitle>
            <CardDescription>الاسم والوصف العام للموقع</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="site_name_en">اسم الموقع (إنجليزي)</Label>
                <Input
                  id="site_name_en"
                  value={formData.site_name_en}
                  onChange={(e) => setFormData({ ...formData, site_name_en: e.target.value })}
                  placeholder="LUXE Furniture"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site_name_ar">اسم الموقع (عربي)</Label>
                <Input
                  id="site_name_ar"
                  value={formData.site_name_ar}
                  onChange={(e) => setFormData({ ...formData, site_name_ar: e.target.value })}
                  placeholder="أثاث لوكس"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="site_description_en">وصف الموقع (إنجليزي)</Label>
                <Textarea
                  id="site_description_en"
                  value={formData.site_description_en}
                  onChange={(e) => setFormData({ ...formData, site_description_en: e.target.value })}
                  placeholder="Modern furniture for contemporary living"
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site_description_ar">وصف الموقع (عربي)</Label>
                <Textarea
                  id="site_description_ar"
                  value={formData.site_description_ar}
                  onChange={(e) => setFormData({ ...formData, site_description_ar: e.target.value })}
                  placeholder="أثاث عصري للحياة المعاصرة"
                  rows={3}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brand Assets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              الصور والشعارات
            </CardTitle>
            <CardDescription>شعار الموقع وأيقونة المتصفح</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo_url">رابط الشعار</Label>
              <Input
                id="logo_url"
                type="url"
                value={formData.logo_url}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                placeholder="https://example.com/logo.png"
              />
              {formData.logo_url && (
                <div className="mt-2">
                  <img
                    src={formData.logo_url || "/placeholder.svg"}
                    alt="Logo Preview"
                    className="h-12 w-auto object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="favicon_url">رابط أيقونة المتصفح (Favicon)</Label>
              <Input
                id="favicon_url"
                type="url"
                value={formData.favicon_url}
                onChange={(e) => setFormData({ ...formData, favicon_url: e.target.value })}
                placeholder="https://example.com/favicon.ico"
              />
            </div>
          </CardContent>
        </Card>

        {/* Colors */}
        <Card>
          <CardHeader>
            <CardTitle>الألوان</CardTitle>
            <CardDescription>ألوان العلامة التجارية الأساسية</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary_color">اللون الأساسي</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary_color"
                    type="color"
                    value={formData.primary_color}
                    onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                    className="w-16 h-10 p-1 border rounded"
                  />
                  <Input
                    value={formData.primary_color}
                    onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary_color">اللون الثانوي</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondary_color"
                    type="color"
                    value={formData.secondary_color}
                    onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                    className="w-16 h-10 p-1 border rounded"
                  />
                  <Input
                    value={formData.secondary_color}
                    onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                    placeholder="#666666"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Mode */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              إعدادات النظام
            </CardTitle>
            <CardDescription>إعدادات تشغيل الموقع</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="maintenance_mode">وضع الصيانة</Label>
                <p className="text-sm text-gray-600">عند التفعيل، سيظهر للزوار صفحة صيانة بدلاً من الموقع</p>
              </div>
              <Switch
                id="maintenance_mode"
                checked={formData.is_maintenance_mode}
                onCheckedChange={(checked) => setFormData({ ...formData, is_maintenance_mode: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={saving}>
          <Save className="ml-2 h-4 w-4" />
          {saving ? "جاري الحفظ..." : "حفظ جميع الإعدادات"}
        </Button>
      </form>
    </div>
  )
}
