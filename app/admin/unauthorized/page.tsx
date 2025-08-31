import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldX } from "lucide-react"
import Link from "next/link"

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <ShieldX className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">غير مصرح</CardTitle>
          <CardDescription>ليس لديك صلاحية للوصول إلى لوحة الإدارة</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            يجب أن تكون مديراً للوصول إلى هذه الصفحة. إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع مطور النظام.
          </p>
          <div className="space-y-2">
            <Link href="/">
              <Button className="w-full">العودة للصفحة الرئيسية</Button>
            </Link>
            <Link href="/admin/login">
              <Button variant="outline" className="w-full bg-transparent">
                تسجيل الدخول مرة أخرى
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
