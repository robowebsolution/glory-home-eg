"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, FolderOpen, Users, Eye, Plus, Edit, TrendingUp, Activity } from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  products: number
  categories: number
  users: number
  views: number
  recentProducts: any[]
  recentUsers: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    categories: 0,
    users: 0,
    views: 0,
    recentProducts: [],
    recentUsers: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // جلب إحصائيات المنتجات
      const { count: productsCount } = await supabase.from("products").select("*", { count: "exact", head: true })

      // جلب إحصائيات الفئات
      const { count: categoriesCount } = await supabase.from("categories").select("*", { count: "exact", head: true })

      // جلب إحصائيات المستخدمين
      const { count: usersCount } = await supabase.from("profiles").select("*", { count: "exact", head: true })

      // جلب أحدث المنتجات
      const { data: recentProducts } = await supabase
        .from("products")
        .select("id, name, name_ar, price, created_at")
        .order("created_at", { ascending: false })
        .limit(5)

      // جلب أحدث المستخدمين
      const { data: recentUsers } = await supabase
        .from("profiles")
        .select("id, full_name, email, created_at")
        .order("created_at", { ascending: false })
        .limit(5)

      setStats({
        products: productsCount || 0,
        categories: categoriesCount || 0,
        users: usersCount || 0,
        views: 1250, // بيانات وهمية للمشاهدات
        recentProducts: recentProducts || [],
        recentUsers: recentUsers || [],
      })
    } catch (error) {
      console.error("خطأ في جلب بيانات لوحة الإدارة:", error)
    } finally {
      setLoading(false)
    }
  }

  const statsCards = [
    {
      title: "إجمالي المنتجات",
      value: stats.products,
      icon: Package,
      href: "/admin/products",
    },
    {
      title: "الفئات",
      value: stats.categories,
      icon: FolderOpen,
      href: "/admin/categories",
    },
    {
      title: "المستخدمين",
      value: stats.users,
      icon: Users,
      href: "/admin/users",
    },
    {
      title: "المشاهدات",
      value: stats.views,
      icon: Eye,
      href: "#",
    },
  ]

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">لوحة التحكم</h1>
          <p className="text-muted-foreground">نظرة عامة على متجرك.</p>
        </div>
        <Button asChild>
          <Link href="/admin/products">
            <Plus className="ml-2 h-4 w-4" />
            إضافة منتج
          </Link>
        </Button>
      </header>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <card.icon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{card.value}</div>
              <Link href={card.href} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                عرض التفاصيل
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="ml-2 h-5 w-5" />
              أحدث المنتجات
            </CardTitle>
            <CardDescription>آخر 5 منتجات تمت إضافتها.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className="h-10 w-10 bg-muted rounded-md"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                ))
              ) : stats.recentProducts.length > 0 ? (
                stats.recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted flex items-center justify-center rounded-md">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{product.name_ar || product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.price ? `${product.price.toFixed(2)} ج.م` : "-"}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/products?productId=${product.id}`}>تعديل</Link>
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">لم تتم إضافة أي منتجات مؤخراً.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="ml-2 h-5 w-5" />
              أحدث المستخدمين
            </CardTitle>
            <CardDescription>آخر 5 مستخدمين.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="h-9 w-9 bg-muted rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                    </div>
                  </div>
                ))
              ) : stats.recentUsers.length > 0 ? (
                stats.recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary/10 text-primary flex items-center justify-center rounded-full font-bold">
                      {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-medium text-foreground truncate">{user.full_name || "مستخدم جديد"}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">لا يوجد مستخدمون جدد.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
