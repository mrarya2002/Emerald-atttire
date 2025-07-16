import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create optimized client with connection pooling
export const supabaseOptimized = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: "public",
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      "x-client-info": "stylehub-web",
    },
  },
  // Add connection pooling settings
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Helper function for optimized product queries
export const getProductsByCategory = async (category: string, limit = 50) => {
  const startTime = performance.now()

  try {
    const { data, error, count } = await supabaseOptimized
      .from("products")
      .select(
        `
        id,
        name,
        price,
        images,
        category,
        is_new,
        stock_quantity
      `,
        { count: "exact" },
      )
      .eq("category", category)
      .gt("stock_quantity", 0)
      .order("created_at", { ascending: false })
      .limit(limit)

    const endTime = performance.now()
    console.log(`⚡ Optimized query for ${category} completed in ${(endTime - startTime).toFixed(2)}ms`)

    if (error) throw error
    return { data: data || [], count, error: null }
  } catch (error) {
    console.error(`❌ Error fetching ${category} products:`, error)
    return { data: [], count: 0, error }
  }
}

// Cache for frequently accessed data
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export const getCachedProducts = async (category: string, limit = 50) => {
  const cacheKey = `products-${category}-${limit}`
  const cached = cache.get(cacheKey)

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`📦 Using cached data for ${category}`)
    return cached.data
  }

  const result = await getProductsByCategory(category, limit)

  if (!result.error) {
    cache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
    })
  }

  return result
}