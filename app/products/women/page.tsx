"use client"

import { useState, useEffect, useCallback } from "react"
import { ProductGrid } from "@/components/product-grid"
import { supabase } from "@/lib/supabase"
import type { Product } from "@/lib/types"
import { Loader2 } from "lucide-react"

export default function WomenProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWomenProducts = useCallback(async () => {
    const startTime = performance.now()
    console.log("🚀 Starting to fetch women's products...")

    try {
      setError(null)

      // Optimized query - only select needed fields and add limit
      const { data, error, count } = await supabase
        .from("products")
        .select(`
  id,
  name,
  price,
  images,
  category,
  is_new,
  stock_quantity,
  description,
  sizes,
  colors,
  created_at,
  updated_at
`, { count: "exact" })
        .eq("category", "women")
        .gt("stock_quantity", 0) // Only show products in stock
        .order("created_at", { ascending: false })
        .limit(50) // Limit results for better performance

      const endTime = performance.now()
      console.log(`⏱️ Query completed in ${(endTime - startTime).toFixed(2)}ms`)
      console.log(`📊 Found ${data?.length || 0} women's products (total: ${count})`)

      if (error) {
        console.error("❌ Supabase error:", error)
        throw error
      }

      setProducts(data || [])
    } catch (error: any) {
      console.error("💥 Error fetching women's products:", error)
      setError(error.message || "Failed to fetch products")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWomenProducts()
  }, [fetchWomenProducts])

  if (isLoading) {
    return (
      <div className="container px-4 py-12 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Loading women's collection...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container px-4 py-12 mx-auto text-center">
        <h1 className="text-2xl font-bold text-red-600">Error Loading Products</h1>
        <p className="mt-4 text-muted-foreground">{error}</p>
        <button
          onClick={fetchWomenProducts}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex flex-col items-center text-center space-y-2 mb-12">
        <h1 className="text-3xl font-bold tracking-tight">Women's Collection</h1>
        <p className="text-muted-foreground max-w-[600px]">
          Explore our elegant women's clothing collection with contemporary designs and premium quality
        </p>
        {products.length > 0 && <p className="text-sm text-muted-foreground">Showing {products.length} products</p>}
      </div>

      {products.length > 0 ? (
        <ProductGrid
  products={products.map((p) => ({
    ...p,
    image: p.images?.[0] || "/placeholder.svg",
    isNew: p.is_new,
  }))}
/>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No women's products available at the moment.</p>
        </div>
      )}
    </div>
  )
}