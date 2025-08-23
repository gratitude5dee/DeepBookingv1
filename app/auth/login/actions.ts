"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  console.log("[v0] Server action login attempt for:", data.email)

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.log("[v0] Server action login error:", error.message)
    redirect("/auth/login?message=Could not authenticate user")
  }

  console.log("[v0] Server action login successful, revalidating and redirecting")
  revalidatePath("/", "layout")
  redirect("/dashboard")
}
