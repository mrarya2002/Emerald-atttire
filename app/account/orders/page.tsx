"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Package, Truck, CheckCircle, Clock, ArrowLeft } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

interface Order {
  id: string
  total_amount: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  payment_status: "pending" | "processing" | "paid" | "failed"
  payment_method: string
  created_at: string
  shipping_address: any
  order_items: {
    id: string
    quantity: number
    price: number
    selected_size: string
    selected_color: string
    products: {
      name: string
      images: string[]
    }
  }[]
}

const statusConfig = {
  pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
  processing: { color: "bg-blue-100 text-blue-800", icon: Package },
  shipped: { color: "bg-purple-100 text-purple-800", icon: Truck },
  delivered: { color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { color: "bg-red-100 text-red-800", icon: Clock },
}

export default function OrdersPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth?redirect=/account/orders")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            id,
            quantity,
            price,
            selected_size,
            selected_color,
            products (name, images)
          )
        `)
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading || isLoading) {
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
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/account">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Account
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="text-muted-foreground">Track your orders and view order history</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
            <Button asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const StatusIcon = statusConfig[order.status].icon
            return (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={statusConfig[order.status].color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <span className="text-lg font-bold">₹{order.total_amount.toFixed(2)}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div>
                      <h4 className="font-medium mb-3">Items ({order.order_items.length})</h4>
                      <div className="space-y-3">
                        {order.order_items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                            <img
                              src={item.products.images[0] || "/placeholder.svg"}
                              alt={item.products.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h5 className="font-medium">{item.products.name}</h5>
                              <p className="text-sm text-muted-foreground">
                                {item.selected_size && `Size: ${item.selected_size}`}
                                {item.selected_color && `, Color: ${item.selected_color}`}
                              </p>
                              <p className="text-sm">Quantity: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                              <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Order Status & Payment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Order Status</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm">Order placed</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                ["processing", "shipped", "delivered"].includes(order.status)
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            ></div>
                            <span className="text-sm">Processing</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                ["shipped", "delivered"].includes(order.status) ? "bg-green-500" : "bg-gray-300"
                              }`}
                            ></div>
                            <span className="text-sm">Shipped</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                order.status === "delivered" ? "bg-green-500" : "bg-gray-300"
                              }`}
                            ></div>
                            <span className="text-sm">Delivered</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Payment Information</h4>
                        <div className="space-y-1 text-sm">
                          <p>Method: {order.payment_method === "card" ? "Credit/Debit Card" : "PayPal"}</p>
                          <p>
                            Status: <span className="capitalize">{order.payment_status}</span>
                          </p>
                          <p>Total: ₹{order.total_amount.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Shipping Address */}
                    <div>
                      <h4 className="font-medium mb-2">Shipping Address</h4>
                      <div className="text-sm text-muted-foreground">
                        <p>
                          {order.shipping_address.firstName} {order.shipping_address.lastName}
                        </p>
                        <p>{order.shipping_address.address}</p>
                        {order.shipping_address.apartment && <p>{order.shipping_address.apartment}</p>}
                        <p>
                          {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}