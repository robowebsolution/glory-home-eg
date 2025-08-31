"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save, Palette, Eye, RefreshCw } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DesignManagement() {
  const [colors, setColors] = useState({
    primary: "#000000",
    secondary: "#666666",
    accent: "#f59e0b",
    background: "#ffffff",
    foreground: "#000000",
    muted: "#f3f4f6",
    border: "#e5e7eb",
  })
  const [fonts, setFonts] = useState({
    heading: "Inter",
    body: "Inter",
    size: {
      xs: "12px",
      sm: "14px",
      base: "16px",
      lg: "18px",
      xl: "20px",
      "2xl": "24px",
      "3xl": "30px",
      "4xl": "36px",
    },
  })
  const [spacing, setSpacing] = useState({
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "48px",
  })
  const [success, setSuccess] = useState("")

  const handleSaveDesign = () => {
    // In a real implementation, this would save to database
    setSuccess("تم حفظ إعدادات التصميم بنجاح")
    setTimeout(() => setSuccess(""), 3000)
  }

  const resetToDefaults = () => {
    setColors({
      primary: "#000000",
      secondary: "#666666",
      accent: "#f59e0b",
      background: "#ffffff",
      foreground: "#000000",
      muted: "#f3f4f6",
      border: "#e5e7eb",
    })
  }

  const ColorPicker = ({
    label,
    value,
    onChange,
  }: { label: string; value: string; onChange: (value: string) => void }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-16 h-10 p-1 border rounded"
        />
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="#000000" className="flex-1" />
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">التصميم والألوان</h1>
        <p className="text-gray-600 mt-2">تخصيص مظهر الموقع والألوان والخطوط</p>
      </div>

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Design Controls */}
        <div className="space-y-6">
          <Tabs defaultValue="colors" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="colors">الألوان</TabsTrigger>
              <TabsTrigger value="fonts">الخطوط</TabsTrigger>
              <TabsTrigger value="spacing">المسافات</TabsTrigger>
            </TabsList>

            <TabsContent value="colors" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    ألوان الموقع
                  </CardTitle>
                  <CardDescription>تخصيص الألوان الأساسية للموقع</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ColorPicker
                    label="اللون الأساسي"
                    value={colors.primary}
                    onChange={(value) => setColors({ ...colors, primary: value })}
                  />
                  <ColorPicker
                    label="اللون الثانوي"
                    value={colors.secondary}
                    onChange={(value) => setColors({ ...colors, secondary: value })}
                  />
                  <ColorPicker
                    label="لون التمييز"
                    value={colors.accent}
                    onChange={(value) => setColors({ ...colors, accent: value })}
                  />
                  <ColorPicker
                    label="لون الخلفية"
                    value={colors.background}
                    onChange={(value) => setColors({ ...colors, background: value })}
                  />
                  <ColorPicker
                    label="لون النص"
                    value={colors.foreground}
                    onChange={(value) => setColors({ ...colors, foreground: value })}
                  />
                  <ColorPicker
                    label="لون الخلفية الثانوية"
                    value={colors.muted}
                    onChange={(value) => setColors({ ...colors, muted: value })}
                  />
                  <ColorPicker
                    label="لون الحدود"
                    value={colors.border}
                    onChange={(value) => setColors({ ...colors, border: value })}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fonts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات الخطوط</CardTitle>
                  <CardDescription>تخصيص خطوط الموقع وأحجامها</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>خط العناوين</Label>
                    <select
                      className="w-full p-2 border rounded"
                      value={fonts.heading}
                      onChange={(e) => setFonts({ ...fonts, heading: e.target.value })}
                    >
                      <option value="Inter">Inter</option>
                      <option value="Cairo">Cairo</option>
                      <option value="Tajawal">Tajawal</option>
                      <option value="Almarai">Almarai</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>خط النص العادي</Label>
                    <select
                      className="w-full p-2 border rounded"
                      value={fonts.body}
                      onChange={(e) => setFonts({ ...fonts, body: e.target.value })}
                    >
                      <option value="Inter">Inter</option>
                      <option value="Cairo">Cairo</option>
                      <option value="Tajawal">Tajawal</option>
                      <option value="Almarai">Almarai</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>حجم النص الأساسي</Label>
                      <Input
                        value={fonts.size.base}
                        onChange={(e) =>
                          setFonts({
                            ...fonts,
                            size: { ...fonts.size, base: e.target.value },
                          })
                        }
                        placeholder="16px"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>حجم العنوان الكبير</Label>
                      <Input
                        value={fonts.size["4xl"]}
                        onChange={(e) =>
                          setFonts({
                            ...fonts,
                            size: { ...fonts.size, "4xl": e.target.value },
                          })
                        }
                        placeholder="36px"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="spacing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات المسافات</CardTitle>
                  <CardDescription>تخصيص المسافات والهوامش</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>مسافة صغيرة</Label>
                      <Input
                        value={spacing.sm}
                        onChange={(e) => setSpacing({ ...spacing, sm: e.target.value })}
                        placeholder="8px"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>مسافة متوسطة</Label>
                      <Input
                        value={spacing.md}
                        onChange={(e) => setSpacing({ ...spacing, md: e.target.value })}
                        placeholder="16px"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>مسافة كبيرة</Label>
                      <Input
                        value={spacing.lg}
                        onChange={(e) => setSpacing({ ...spacing, lg: e.target.value })}
                        placeholder="24px"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>مسافة كبيرة جداً</Label>
                      <Input
                        value={spacing.xl}
                        onChange={(e) => setSpacing({ ...spacing, xl: e.target.value })}
                        placeholder="32px"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2">
            <Button onClick={handleSaveDesign} className="flex-1">
              <Save className="ml-2 h-4 w-4" />
              حفظ التصميم
            </Button>
            <Button onClick={resetToDefaults} variant="outline">
              <RefreshCw className="ml-2 h-4 w-4" />
              إعادة تعيين
            </Button>
          </div>
        </div>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              معاينة التصميم
            </CardTitle>
            <CardDescription>معاينة كيف ستظهر الألوان في الموقع</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="space-y-4 p-6 rounded-lg border"
              style={{
                backgroundColor: colors.background,
                color: colors.foreground,
                borderColor: colors.border,
              }}
            >
              <h1 className="text-3xl font-bold" style={{ color: colors.primary }}>
                عنوان رئيسي
              </h1>
              <p style={{ color: colors.secondary }}>
                هذا نص تجريبي لمعاينة كيف ستظهر الألوان في الموقع. يمكنك تغيير الألوان ومشاهدة التأثير مباشرة.
              </p>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded text-white" style={{ backgroundColor: colors.primary }}>
                  زر أساسي
                </button>
                <button
                  className="px-4 py-2 rounded"
                  style={{
                    backgroundColor: colors.accent,
                    color: colors.background,
                  }}
                >
                  زر مميز
                </button>
              </div>
              <div className="p-4 rounded" style={{ backgroundColor: colors.muted }}>
                <h3 className="font-semibold mb-2">بطاقة تجريبية</h3>
                <p className="text-sm" style={{ color: colors.secondary }}>
                  محتوى البطاقة مع خلفية ثانوية
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
