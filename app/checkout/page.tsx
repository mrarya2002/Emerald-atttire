"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, CreditCard, ShieldCheck, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"

export default function CheckoutPage() {
  const { cartItems, subtotal, clearCart } = useCart()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [orderId, setOrderId] = useState<string>("")
  const [error, setError] = useState("")

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth?redirect=/checkout")
    }
  }, [user, authLoading, router])

  // Redirect if cart is empty
  if (cartItems.length === 0 && !isComplete) {
    return (
      <div className="container px-4 py-12 mx-auto text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-4">You need to add items to your cart before checking out.</p>
        <Button asChild className="mt-6">
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    )
  }

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="container px-4 py-12 mx-auto flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Redirect if not authenticated
  if (!user) {
    return null
  }

  if (isComplete) {
    return (
      <div className="container px-4 py-12 mx-auto max-w-md">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <ShieldCheck className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Thank you for your purchase. Your order has been confirmed and will be processed soon.</p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-medium">Order #{orderId.slice(0, 8)}</p>
              <p className="text-sm text-muted-foreground">
                You can track your order status in your account dashboard.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/account/orders">Track Your Order</Link>
            </Button>
            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href="/">Continue Shopping</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const shippingData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      apartment: formData.get("apartment") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      zip: formData.get("zip") as string,
    }

    const paymentMethod = formData.get("paymentMethod") as string

    try {
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: user.id,
            total_amount: subtotal,
            status: "pending",
            shipping_address: shippingData,
            payment_method: paymentMethod,
            payment_status: "processing",
          },
        ])
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity || 1,
        price: item.price,
        selected_size: item.selectedSize,
        selected_color: item.selectedColor,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) throw itemsError

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update order status to paid
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          status: "processing",
          payment_status: "paid",
          payment_date: new Date().toISOString(),
        })
        .eq("id", order.id)

      if (updateError) throw updateError

      setOrderId(order.id)
      setIsComplete(true)
      clearCart()
    } catch (err: any) {
      console.error("Order creation error:", err)
      setError(err.message || "Failed to process order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/cart">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Cart
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Secure Checkout</h1>
            <p className="text-muted-foreground">Complete your purchase with secure online payment</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-medium mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" name="firstName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" name="lastName" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" defaultValue={user.email} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" type="tel" required />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h2 className="text-lg font-medium mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                    <Input id="apartment" name="apartment" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" name="city" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Select name="state" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ca">California</SelectItem>
                          <SelectItem value="ny">New York</SelectItem>
                          <SelectItem value="tx">Texas</SelectItem>
                          <SelectItem value="fl">Florida</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input id="zip" name="zip" required />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h2 className="text-lg font-medium mb-4">Payment Method</h2>
                <Tabs defaultValue="card">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="card">Credit/Debit Card</TabsTrigger>
                    <TabsTrigger value="paypal">PayPal</TabsTrigger>
                  </TabsList>
                  <TabsContent value="card" className="space-y-4 pt-4">
                    <input type="hidden" name="paymentMethod" value="card" />
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input id="cardName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <div className="relative">
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                        <CreditCard className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" required />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="paypal" className="pt-4">
                    <input type="hidden" name="paymentMethod" value="paypal" />
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <p className="mb-4">You will be redirected to PayPal to complete your purchase securely.</p>
                      <div className="bg-blue-50 p-4 rounded-lg w-full">
                        <p className="text-sm text-blue-800">
                          <ShieldCheck className="inline h-4 w-4 mr-1" />
                          Secure payment processing with PayPal
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <Separator />

              <div>
                <h2 className="text-lg font-medium mb-4">Shipping Method</h2>
                <RadioGroup defaultValue="standard" className="space-y-3">
                  <div className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard" className="flex-1">
                      <div className="flex justify-between">
                        <span>Standard Shipping</span>
                        <span>Free</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Delivery in 5-7 business days</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="express" id="express" />
                    <Label htmlFor="express" className="flex-1">
                      <div className="flex justify-between">
                        <span>Express Shipping</span>
                        <span>$9.99</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Delivery in 2-3 business days</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="lg:hidden">
                <OrderSummary cartItems={cartItems} subtotal={subtotal} />
              </div>

              <div className="flex justify-end">
                <Button type="submit" size="lg" disabled={isSubmitting} className="min-w-[200px]">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Complete Secure Payment
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>

        <div className="hidden lg:block">
          <OrderSummary cartItems={cartItems} subtotal={subtotal} />
        </div>
      </div>
    </div>
  )
}

function OrderSummary({ cartItems, subtotal }: { cartItems: any[]; subtotal: number }) {
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{item.quantity || 1} ×</span>
                <span className="text-sm">{item.name}</span>
              </div>
              <span className="text-sm font-medium">${(item.price * (item.quantity || 1)).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <Separator />
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>Calculated at checkout</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  )
}