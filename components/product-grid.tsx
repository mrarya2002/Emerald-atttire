"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/components/cart-provider"

type Product = {
  id: string
  name: string
  price: number
  image: string
  category: string
  isNew: boolean
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
  <ProductCard key={product.id} product={product} />
))}
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()

  return (
    <Card className="overflow-hidden group">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {product.isNew && <Badge className="absolute top-2 right-2">New</Badge>}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/products/${product.id}`} className="hover:underline">
          <h3 className="font-medium">{product.name}</h3>
        </Link>
        <p className="font-bold mt-1">₹{product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          size="sm"
          onClick={() =>
            addToCart({
              ...product,
              id: String(product.id), // Convert id to string
              quantity: 1,
              description: "", 
              // or product.description if available
              sizes: [],
              // colors: [],
              images: [],
              is_new: false,
              stock_quantity: 0,
              created_at: "",
              updated_at: "",
            })
          }
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
