"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import OrdersClientPage from "./OrdersClientPage"
import { useAuth } from "@/components/auth/auth-provider"

export default function OrdersPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/signin?next=/orders")
    }
  }, [loading, router, user])

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900" />
      </div>
    )
  }

  return <OrdersClientPage userId={user.id} />
}
