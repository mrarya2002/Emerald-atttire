"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Loader2, LogOut, Package, ShoppingCart, Users, BarChart3 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AdminProvider, useAdmin } from "@/components/admin-provider"

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { adminUser, isAdminAuthenticated, isLoading, logout } = useAdmin()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !isAdminAuthenticated && pathname !== "/admin/login") {
      router.push("/admin/login")
    }
  }, [isAdminAuthenticated, isLoading, router, pathname])

  const handleLogout = async () => {
    await logout()
    router.push("/admin/login")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isAdminAuthenticated && pathname !== "/admin/login") {
    return null
  }

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="border-b bg-white shadow-sm">
        <div className="container px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {adminUser?.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/">View Store</Link>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-2">
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === "/admin" ? "bg-primary text-primary-foreground" : "hover:bg-gray-100"
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname.startsWith("/admin/products") ? "bg-primary text-primary-foreground" : "hover:bg-gray-100"
              }`}
            >
              <Package className="h-5 w-5" />
              Products
            </Link>
            <Link
              href="/admin/orders"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname.startsWith("/admin/orders") ? "bg-primary text-primary-foreground" : "hover:bg-gray-100"
              }`}
            >
              <ShoppingCart className="h-5 w-5" />
              Orders
            </Link>
            <Link
              href="/admin/users"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname.startsWith("/admin/users") ? "bg-primary text-primary-foreground" : "hover:bg-gray-100"
              }`}
            >
              <Users className="h-5 w-5" />
              Users
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">{children}</div>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminProvider>
  )
}
