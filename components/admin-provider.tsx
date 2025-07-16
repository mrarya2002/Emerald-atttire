"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { User } from "@/lib/types"

type AdminContextType = {
  adminUser: User | null
  isAdminAuthenticated: boolean
  isLoading: boolean
  logout: () => Promise<void>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAdminSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setAdminUser(null)
        localStorage.removeItem("admin_session")
      } else if (session?.user) {
        await fetchAdminProfile(session.user.id)
      }
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkAdminSession = async () => {
    const adminSession = localStorage.getItem("admin_session")
    if (!adminSession) {
      setIsLoading(false)
      return
    }

    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (session?.user) {
      await fetchAdminProfile(session.user.id)
    } else {
      localStorage.removeItem("admin_session")
      setIsLoading(false)
    }
  }

  const fetchAdminProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", userId).eq("role", "admin").single()

      if (error || !data) {
        localStorage.removeItem("admin_session")
        setAdminUser(null)
      } else {
        setAdminUser(data)
      }
    } catch (error) {
      console.error("Error fetching admin profile:", error)
      localStorage.removeItem("admin_session")
      setAdminUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setAdminUser(null)
    localStorage.removeItem("admin_session")
  }

  const isAdminAuthenticated = !!adminUser && !!localStorage.getItem("admin_session")

  return (
    <AdminContext.Provider value={{ adminUser, isAdminAuthenticated, isLoading, logout }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
