import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartProvider } from "@/components/cart-provider"
import { AuthProvider } from "@/components/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "StyleHub | Premium Clothing Brand",
  description: "Discover the latest fashion trends with our premium clothing collection",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
  auth,
}: Readonly<{
  children: React.ReactNode
  auth: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            {auth}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
