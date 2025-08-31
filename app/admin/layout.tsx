"use client"

import type React from "react"
import { useAuth } from "@/components/auth/auth-provider"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  Home,
  Info,
  Phone,
  Users,
  Settings,
  Palette,
  Menu,
  X,
  LogOut,
  Loader2,
  Mail,
} from "lucide-react"
import Link from "next/link"
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js"


const navigation = [
  { name: "لوحة التحكم", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "المنتجات", href: "/admin/products", icon: Package },
  { name: "الفئات", href: "/admin/categories", icon: FolderOpen },
  { name: "المشاريع", href: "/admin/projects", icon: FolderOpen },
  { name: "فئات المشاريع", href: "/admin/project-categories", icon: FolderOpen },
  { name: "رسائل التواصل", href: "/admin/dashboard/contact-messages", icon: Mail },
  { name: "القسم الرئيسي", href: "/admin/hero", icon: Home },
  { name: "صفحة من نحن", href: "/admin/about", icon: Info },
  { name: "معلومات التواصل", href: "/admin/contact", icon: Phone },
  { name: "المستخدمين", href: "/admin/users", icon: Users },
  { name: "إعدادات الموقع", href: "/admin/settings", icon: Settings },
  { name: "التصميم والألوان", href: "/admin/design", icon: Palette },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isAdmin, loading, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const router = useRouter()
  const pathname = usePathname()

  // If loading finished and user is not admin, navigate to login to avoid blank UI
  useEffect(() => {
    if (!loading && pathname !== "/admin/login" && !isAdmin) {
      router.replace("/admin/login")
    }
  }, [loading, isAdmin, pathname, router])

  useEffect(() => {
    if (!isAdmin) return;

    const fetchUnreadCount = async () => {
      const { count, error } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);

      if (error) {
        console.error('Error fetching unread count:', error);
      } else {
        setUnreadCount(count ?? 0);
      }
    };

    fetchUnreadCount();

    const channel = supabase
      .channel('realtime-contact-messages')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contact_messages' },
        (payload: RealtimePostgresChangesPayload<{ [key: string]: any }>) => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  const handleSignOut = async () => {
    await signOut()
    router.push("/admin/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  // عرض صفحة تسجيل الدخول بدون تخطيط
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  // إذا لم يكن مشرف، لا تعرض شيء (سيتم التوجيه لصفحة تسجيل الدخول)
  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex flex-row-reverse" dir="rtl">
      {/* Sidebar */}
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex w-64 flex-col border-r p-4 bg-white text-sidebar-foreground sticky top-0 h-screen">
        <div className="flex items-center justify-center h-16 mb-4 flex-shrink-0">
          <h1 className="text-2xl font-bold text-sidebar-foreground tracking-wider">لوحة التحكم</h1>
        </div>
        <nav className="flex-grow space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between gap-4 px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-inner"
                    : "hover:bg-sidebar-accent/50"
                }`}>
                <div className="flex items-center gap-4">
                  <item.icon className={`h-5 w-5 ${isActive ? "text-primary" : ""}`} />
                  <span className="truncate">{item.name}</span>
                </div>
                {item.name === "رسائل التواصل" && unreadCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
        <div className="pt-4 border-t border-sidebar-border mt-auto flex-shrink-0">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-semibold text-sidebar-foreground truncate">{user?.email}</p>
              <p className="text-xs text-sidebar-foreground/70">Admin</p>
            </div>
          </div>
          <Button
            onClick={handleSignOut}
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 mt-2">
            <LogOut className="ml-2 h-4 w-4" />
            تسجيل الخروج
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar for mobile */}
        <header className="bg-background/95 backdrop-blur-sm sticky top-0 z-10 border-b h-16 flex items-center justify-between px-6 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-foreground hover:text-primary">
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">لوحة التحكم</h1>
          <div className="w-6"></div>
        </header>
        <main className="admin-layout flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" dir="rtl">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)}></div>
          {/* Sidebar */}
          <aside className="absolute top-0 right-0 h-full w-64 bg-white text-sidebar-foreground p-4 border-l border-sidebar-border flex flex-col">
            <div className="flex items-center justify-between h-16 mb-4">
              <h1 className="text-2xl font-bold text-sidebar-foreground tracking-wider">لوحة التحكم</h1>
              <button onClick={() => setSidebarOpen(false)} className="text-sidebar-foreground/70 hover:text-sidebar-foreground">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-grow space-y-2 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 ${isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-inner"
                        : "hover:bg-sidebar-accent/50"
                      }`}>
                     <div className="flex items-center gap-3">
                        <item.icon className={`h-5 w-5 ${isActive ? "text-primary" : ""}`} />
                        <span className="truncate">{item.name}</span>
                      </div>
                      {item.name === "رسائل التواصل" && unreadCount > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                  </Link>
                )
              })}
            </nav>
            <div className="pt-4 border-t border-sidebar-border mt-auto flex-shrink-0">
              <div className="flex items-center gap-3 px-4 py-2">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 truncate">
                  <p className="text-sm font-semibold text-sidebar-foreground truncate">{user?.email}</p>
                  <p className="text-xs text-sidebar-foreground/70">Admin</p>
                </div>
              </div>
              <Button
                onClick={handleSignOut}
                variant="ghost"
                className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 mt-2">
                <LogOut className="ml-2 h-4 w-4" />
                تسجيل الخروج
              </Button>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
