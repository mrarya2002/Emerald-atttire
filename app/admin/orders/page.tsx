"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, Eye, Package, Truck, CheckCircle, XCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Order {
  id: string
  user_id: string
  total_amount: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shipping_address: any
  created_at: string
  users: {
    name: string
    email: string
  }
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

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

const statusIcons = {
  pending: Package,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, statusFilter])

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          users (name, email),
          order_items (
            id,
            quantity,
            price,
            selected_size,
            selected_color,
            products (name, images)
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = orders

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.users.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.users.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }

  // const updateOrderStatus = async (orderId: string, newStatus: string) => {
  //   try {
  //     const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId)

  //     if (error) throw error

  //     setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus as any } : order)))
  //   } catch (error) {
  //     console.error("Error updating order status:", error)
  //   }
  // }

  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

const updateOrderStatus = async (orderId: string, newStatus: string) => {
  setUpdatingOrderId(orderId); // Start loading
  try {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      alert("Failed to update order status: " + error.message);
      throw error;
    }

    // Optimistically update local state
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus as any } : order
      )
    );

    // Optionally, refetch from DB for accuracy
    await fetchOrders();
  } catch (error) {
    console.error("Error updating order status:", error);
  } finally {
    setUpdatingOrderId(null); // Stop loading
  }
};

  if (isLoading) {
    return <div>Loading orders...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Orders Management</h2>
        <p className="text-muted-foreground">View and manage customer orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders, customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const StatusIcon = statusIcons[order.status]
          return (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>{order?.users?.name}</span>
                      <span>{order?.users?.email}</span>
                      <span>{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={statusColors[order.status]}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                    <span className="text-lg font-bold">${order.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div>
                    <h4 className="font-medium mb-2">Items ({order.order_items.length})</h4>
                    <div className="space-y-2">
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                          <img
                            src={item.products.images[0] || "/placeholder.svg"}
                            alt={item.products.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{item.products.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.selected_size && `Size: ${item.selected_size}`}
                              {item.selected_color && `, Color: ${item.selected_color}`}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">Qty: {item.quantity}</p>
                            <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h4 className="font-medium mb-2">Shipping Address</h4>
                    <div className="p-3 bg-gray-50 rounded text-sm">
                      <p>
                        {order.shipping_address.firstName} {order.shipping_address.lastName}
                      </p>
                      <p>{order.shipping_address.address}</p>
                      {order.shipping_address.apartment && <p>{order.shipping_address.apartment}</p>}
                      <p>
                        {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
                      </p>
                      <p>{order.shipping_address.phone}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Update Status:</span>
                      <Select
  value={order.status}
  onValueChange={(value) => updateOrderStatus(order.id, value)}
  disabled={updatingOrderId === order.id}
>
  <SelectTrigger className="w-[140px]">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="pending">Pending</SelectItem>
    <SelectItem value="processing">Processing</SelectItem>
    <SelectItem value="shipped">Shipped</SelectItem>
    <SelectItem value="delivered">Delivered</SelectItem>
    <SelectItem value="cancelled">Cancelled</SelectItem>
  </SelectContent>
</Select>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No orders found</p>
        </div>
      )}
    </div>
  )
}
