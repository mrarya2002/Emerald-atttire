"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AuthModal({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={() => router.back()} />
      <div className="relative bg-background rounded-lg shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <Button variant="ghost" size="icon" className="absolute right-2 top-2 z-10" onClick={() => router.back()}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
        {children}
      </div>
    </div>
  )
}
