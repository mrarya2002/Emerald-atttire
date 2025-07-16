import { supabase } from "@/lib/supabase"

export async function checkAdminAccess(userId: string) {
  const { data, error } = await supabase.from("users").select("role").eq("id", userId).single()

  if (error || data?.role !== "admin") {
    throw new Error("Unauthorized: Admin access required")
  }

  return true
}
