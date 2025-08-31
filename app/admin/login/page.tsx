"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Lock, Mail, Eye, EyeOff } from "lucide-react"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)

    // التحقق من وجود جلسة مسبقة
    const checkExistingSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          // التحقق من كون المستخدم مشرف
          const { data: adminData } = await supabase
            .from("admin_users")
            .select("user_id")
            .eq("user_id", session.user.id)
            .single()

          if (adminData) {
            router.push("/admin/dashboard")
          }
        }
      } catch (error) {
        console.error("خطأ في التحقق من الجلسة:", error)
      }
    }

    checkExistingSession()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // تسجيل الدخول
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      })

      if (authError) {
        if (authError.message.includes("Invalid login credentials")) {
          setError("البريد الإلكتروني أو كلمة المرور غير صحيحة")
        } else {
          setError("حدث خطأ في تسجيل الدخول: " + authError.message)
        }
        return
      }

      if (authData.user) {
        // التحقق من كون المستخدم مشرف
        const { data: adminData, error: adminError } = await supabase
          .from("admin_users")
          .select("user_id, email")
          .eq("user_id", authData.user.id)
          .single()

        if (adminError || !adminData) {
          setError("ليس لديك صلاحيات الوصول إلى لوحة الإدارة")
          await supabase.auth.signOut()
          return
        }

        // الانتقال إلى لوحة الإدارة
        router.push("/admin/dashboard")
      }
    } catch (error) {
      console.error("خطأ في تسجيل الدخول:", error)
      setError("حدث خطأ غير متوقع")
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">لوحة الإدارة</CardTitle>
          <CardDescription className="text-gray-600">قم بتسجيل الدخول للوصول إلى لوحة إدارة الموقع</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription className="text-right">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-right block">
                البريد الإلكتروني
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="pr-10 text-right"
                  required
                  disabled={loading}
                  dir="ltr"
                />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-right block">
                كلمة المرور
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pr-10 pl-10"
                  required
                  disabled={loading}
                />
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                "تسجيل الدخول"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">للحصول على حساب إداري، يرجى التواصل مع مطور النظام</p>
          </div>

          {/* معلومات للاختبار */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">للاختبار:</h3>
            <p className="text-xs text-blue-700">
              1. سجل حساب جديد في الموقع أولاً
              <br />
              2. قم بتشغيل سكريبت إنشاء المشرف
              <br />
              3. استخدم نفس البيانات هنا
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
