"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/supabase-client"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { useLanguage } from "@/lib/language-context"

export default function SignInPage() {
  const { t, isRTL } = useLanguage()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  // Admin-only mode: disable public signin page and redirect to admin login
  useEffect(() => {
    router.replace("/admin/login")
  }, [router, user, authLoading])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const result = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
  
      console.log("نتيجة تسجيل الدخول:", result);
  
      const { data, error } = result;
  
      if (error) {
        toast.error(error.message);
      } else {
        // اطبع التوكين في الكونسول
        console.log("Access Token:", data.session?.access_token);
        console.log("Refresh Token:", data.session?.refresh_token);
        console.log("Session Object:", data.session);
        console.log("Document Cookies:", document.cookie);
        toast.success("Welcome back!");
        router.push("/");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.log("خطأ غير متوقع:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        toast.error(error.message)
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    }
  }

  const handleForgotPassword = async () => {
    if (!formData.email) {
      toast.error("Please enter your email address first")
      return
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        toast.error(error.message)
      } else {
        toast.success("Password reset email sent!")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Link href="/">
            <Button variant="ghost" className={`group ${isRTL ? "flex-row-reverse" : ""}`}>
              <ArrowLeft
                className={`h-4 w-4 group-hover:${isRTL ? "translate-x-1" : "-translate-x-1"} transition-transform ${isRTL ? "ml-2" : "mr-2"}`}
              />
              {t("common.back")}
            </Button>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Card className="border-0 shadow-2xl backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
            <CardHeader className={`text-center pb-8 ${isRTL ? "rtl" : ""}`}>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
              >
                <span className="text-2xl font-bold text-white">L</span>
              </motion.div>
              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                {t("auth.signin.title")}
              </CardTitle>
              <CardDescription className="text-lg">{t("auth.signin.subtitle")}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t("auth.signin.email")}</Label>
                  <div className="relative">
                    <Mail className={`absolute ${isRTL ? "right-3" : "left-3"} top-3 h-4 w-4 text-gray-400`} />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={t("auth.signin.email.placeholder")}
                      value={formData.email}
                      onChange={handleInputChange}
                      className={isRTL ? "pr-10 text-right" : "pl-10"}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t("auth.signin.password")}</Label>
                  <div className="relative">
                    <Lock className={`absolute ${isRTL ? "right-3" : "left-3"} top-3 h-4 w-4 text-gray-400`} />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t("auth.signin.password.placeholder")}
                      value={formData.password}
                      onChange={handleInputChange}
                      className={isRTL ? "pr-10 pl-10 text-right" : "pl-10 pr-10"}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute ${isRTL ? "left-1" : "right-1"} top-1 h-8 w-8 p-0`}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className={`flex items-center space-x-2 ${isRTL ? "space-x-reverse" : ""}`}>
                    <input
                      id="remember"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <Label htmlFor="remember" className="text-sm">
                      {t("auth.signin.remember")}
                    </Label>
                  </div>
                  <Button type="button" variant="link" onClick={handleForgotPassword} className="text-sm p-0 h-auto">
                    {t("auth.signin.forgot")}
                  </Button>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t("auth.signin.signing") : t("auth.signin.button")}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button variant="outline" onClick={handleGoogleSignIn} className="w-full bg-transparent">
                <svg className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                {t("auth.signin.google")}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("auth.signin.noaccount")}{" "}
                  <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
                    {t("auth.signin.signup")}
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
