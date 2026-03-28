"use client"

import Image from "next/image"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { useLanguage } from "@/lib/language-context"

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { t, isRTL } = useLanguage()

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/signin?next=/profile")
    }
  }, [loading, router, user])

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900" />
      </div>
    )
  }

  const fullName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email ||
    "User"
  const avatarUrl = user.user_metadata?.avatar_url as string | undefined

  return (
    <>
      <Navigation />
      <section className="min-h-[60vh] bg-white py-12 dark:bg-gray-900 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`mb-12 text-center ${isRTL ? "rtl" : ""}`}
          >
            <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              {t("profile.title") || "My Profile"}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t("profile.subtitle") ||
                "Manage your account information and preferences."}
            </p>
          </motion.div>

          <Card className="rounded-xl border-0 bg-white shadow-lg dark:bg-gray-800">
            <CardContent className="flex flex-col items-center gap-4 p-8">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={fullName}
                    width={112}
                    height={112}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-5xl text-gray-400 dark:text-gray-500">
                    U
                  </span>
                )}
              </div>

              <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {fullName}
              </h3>
              <p className="text-gray-500 dark:text-gray-300">{user.email}</p>

              <div className="mt-4 grid w-full grid-cols-1 gap-2 text-sm text-gray-700 dark:text-gray-300">
                <div>
                  <b>{t("profile.id") || "User ID"}:</b> {user.id}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </>
  )
}
