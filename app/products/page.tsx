"use client"

import { useState, useEffect } from "react"
import { ProductGrid } from "@/components/product-grid"
import { supabase } from "@/lib/supabase"
import type { Product } from "@/lib/types"
import { Loader2 } from "lucide-react"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container px-4 py-12 mx-auto flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex flex-col items-center text-center space-y-2 mb-12">
        <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
        <p className="text-muted-foreground max-w-[600px]">Browse our complete collection of premium clothing</p>
      </div>
      {/* <ProductGrid products={products} />
       */}
       <ProductGrid
  products={products.map((p) => ({
    ...p,
    image: p.images?.[0] || "/placeholder.svg",
    isNew: p.is_new,
  }))}
/>
    </div>
  )
}
