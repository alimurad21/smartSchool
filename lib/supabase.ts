import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function getSupabaseClient() {
  return supabase
}

export interface UserProfile {
  id: string
  email: string
  full_name: string
  role: "admin" | "teacher" | "student"
  avatar_url?: string
  department?: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email: string
  profile: UserProfile
}

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: UserProfile
        Insert: Omit<UserProfile, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<UserProfile, "id" | "created_at" | "updated_at">>
      }
    }
  }
}
