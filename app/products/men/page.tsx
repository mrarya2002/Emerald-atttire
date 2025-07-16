"use client"

import { useState, useEffect } from "react"
import { ProductGrid } from "@/components/product-grid"
import { getCachedProducts } from "@/lib/supabase-optimized"
import { PerformanceMonitor } from "@/components/performance-monitor"
import type { Product } from "@/lib/types"
import { Loader2 } from "lucide-react"

export default function MenProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setError(null)
        const result = await getCachedProducts("men", 50)

        if (result.error) {
          throw result.error
        }

        setProducts(result.data)
      } catch (error: any) {
        console.error("Error fetching men's products:", error)
        setError(error.message || "Failed to fetch products")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (isLoading) {
    return (
      <div className="container px-4 py-12 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Loading men's collection...</p>
        </div>
        <PerformanceMonitor label="Men's Products" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container px-4 py-12 mx-auto text-center">
        <h1 className="text-2xl font-bold text-red-600">Error Loading Products</h1>
        <p className="mt-4 text-muted-foreground">{error}</p>
      </div>
    )
  }

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex flex-col items-center text-center space-y-2 mb-12">
        <h1 className="text-3xl font-bold tracking-tight">Men's Collection</h1>
        <p className="text-muted-foreground max-w-[600px]">
          Discover our premium men's clothing collection featuring the latest styles and timeless classics
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
          <p className="text-muted-foreground">No men's products available at the moment.</p>
        </div>
      )}

      <PerformanceMonitor label="Men's Products" />
    </div>
  )
}