"use client"
import { use } from 'react';
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Minus, Plus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/components/cart-provider"
import { supabase } from "@/lib/supabase"
import type { Product } from "@/lib/types"

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedImage, setSelectedImage] = useState(0)

  // Unwrap the params promise
  const { id } = use(params)
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProduct()
  }, [id]) // Now using the unwrapped id

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id) // Using the unwrapped id
        .single()

      if (error) throw error
      setProduct(data)
    } catch (error) {
      console.error("Error fetching product:", error)
    } finally {
      setIsLoading(false)
    }
  }
  if (isLoading) {
    return (
      <div className="container px-4 py-12 mx-auto text-center">
        <p>Loading product...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container px-4 py-12 mx-auto text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="mt-4">The product you are looking for does not exist.</p>
        <Button asChild className="mt-6">
          <Link href="/products">Back to Products</Link>
        </Button>
      </div>
    )
  }

  const handleAddToCart = () => {
    // if (!selectedSize || !selectedColor) return

    addToCart({
      ...product,
      quantity,
      selectedSize,
      selectedColor,
    })
  }

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/products" className="hover:text-foreground">
          Products
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border">
            <Image
              src={product.images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
            />
            {product.is_new && <Badge className="absolute top-4 right-4">New</Badge>}
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`relative aspect-square w-20 overflow-hidden rounded-md border ${
                    selectedImage === index ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-2xl font-bold mt-2">₹{product.price.toFixed(2)}</p>
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          <div className="space-y-4">
            {/* {product.sizes.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      className="min-w-[60px]"
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
                {!selectedSize && <p className="text-sm text-muted-foreground mt-2">Please select a size</p>}
              </div>
            )}

            {product.colors.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? "default" : "outline"}
                      className="min-w-[80px]"
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
                {!selectedColor && <p className="text-sm text-muted-foreground mt-2">Please select a color</p>}
              </div>
            )} */}

            <div>
              <h3 className="font-medium mb-2">Quantity</h3>
              <div className="flex items-center">
                <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full"
            // disabled={(!selectedSize && product.sizes.length > 0) || (!selectedColor && product.colors.length > 0)}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart
          </Button>

          <Tabs defaultValue="details">
            <TabsList className="w-full">
              <TabsTrigger value="details" className="flex-1">
                Details
              </TabsTrigger>
              <TabsTrigger value="shipping" className="flex-1">
                Shipping & Returns
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Category</h4>
                  <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
                </div>
                <div>
                  <h4 className="font-medium">Stock</h4>
                  <p className="text-sm text-muted-foreground">{product.stock_quantity} available</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="shipping" className="space-y-4 pt-4">
              <div>
                <h4 className="font-medium">Shipping</h4>
                <p className="text-sm text-muted-foreground">
                  Free standard shipping on all orders over $100. Delivery within 3-5 business days.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Returns</h4>
                <p className="text-sm text-muted-foreground">
                  We accept returns within 30 days of delivery. Items must be unworn, unwashed, and with the original
                  tags attached.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
