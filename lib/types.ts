export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  // sizes: string[]
  // colors: string[]
  images: string[]
  is_new: boolean
  stock_quantity: number
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin"
  created_at: string
}

export interface CartItem extends Product {
  quantity: number
  selectedSize?: string
  selectedColor?: string
}
