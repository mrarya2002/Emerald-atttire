"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, User, MapPin } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Loader2 } from "lucide-react"

export default function AccountPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth?redirect=/account")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="container px-4 py-12 mx-auto flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Account</h1>
        <p className="text-muted-foreground">Welcome back, {user.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              My Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Track your orders and view order history</p>
            <Button asChild className="w-full">
              <Link href="/account/orders">View Orders</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Update your personal information</p>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/account/profile">Edit Profile</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Addresses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Manage your shipping addresses</p>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/account/addresses">Manage Addresses</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Name</h3>
                <p className="text-muted-foreground">{user.name}</p>
              </div>
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <div>
                <h3 className="font-medium">Account Type</h3>
                <p className="text-muted-foreground capitalize">{user.role}</p>
              </div>
              <div>
                <h3 className="font-medium">Member Since</h3>
                <p className="text-muted-foreground">{new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}