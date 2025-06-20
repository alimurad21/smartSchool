"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { getSupabaseClient, type UserProfile, type AuthUser } from "./supabase"

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>
  createProfile: (userId: string, email: string, fullName: string, role: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (session?.user) {
          await fetchUserProfile(session.user)
        }
      } catch (error) {
        console.error("Error getting initial session:", error)
      }
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session?.user) {
          await fetchUserProfile(session.user)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Error in auth state change:", error)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const createProfile = async (userId: string, email: string, fullName: string, role: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          email: email,
          full_name: fullName,
          role: role as "admin" | "teacher" | "student",
        })
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error("Error creating profile:", error)
      return { data: null, error }
    }
  }

  const fetchUserProfile = async (authUser: User) => {
    try {
      // First check if profiles table exists by trying to query it
      const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", authUser.id).single()

      if (error) {
        console.error("Error fetching profile:", error)

        // Handle different error cases
        if (error.code === "42P01") {
          // Table doesn't exist
          console.error("Profiles table doesn't exist. Please run the database setup scripts.")
          setUser(null)
          return
        }

        if (error.code === "PGRST116") {
          // Profile doesn't exist, try to create it
          console.log("Profile doesn't exist, creating one...")
          const { error: createError } = await createProfile(
            authUser.id,
            authUser.email!,
            authUser.user_metadata?.full_name || "",
            authUser.user_metadata?.role || "student",
          )

          if (createError) {
            console.error("Error creating profile:", createError)
            setUser(null)
            return
          }

          // Try to fetch the newly created profile
          const { data: newProfile, error: fetchError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", authUser.id)
            .single()

          if (fetchError) {
            console.error("Error fetching newly created profile:", fetchError)
            setUser(null)
            return
          }

          setUser({
            id: authUser.id,
            email: authUser.email!,
            profile: newProfile as UserProfile,
          })
          return
        }

        setUser(null)
        return
      }

      setUser({
        id: authUser.id,
        email: authUser.email!,
        profile: profile as UserProfile,
      })
    } catch (error) {
      console.error("Unexpected error fetching user profile:", error)
      setUser(null)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    } catch (error) {
      console.error("Sign in error:", error)
      return { error }
    }
  }

  const signUp = async (email: string, password: string, fullName: string, role: string) => {
    try {
      // First, sign up the user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      })

      if (signUpError) {
        console.error("Signup error:", signUpError)
        return { error: signUpError }
      }

      if (!data.user) {
        return { error: new Error("User creation failed") }
      }

      // If we have a session (auto-confirm is enabled), create profile
      if (data.session && data.user) {
        const { error: profileError } = await createProfile(data.user.id, data.user.email!, fullName, role)

        if (profileError) {
          console.error("Profile creation error:", profileError)
          // Don't return error here as the user was created successfully
          // The profile can be created later
        }
      }

      return { error: null }
    } catch (error) {
      console.error("Unexpected error during signup:", error)
      return { error: error as Error }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: new Error("No user logged in") }

    try {
      const { error } = await supabase.from("profiles").update(updates).eq("id", user.id)

      if (!error) {
        setUser({
          ...user,
          profile: { ...user.profile, ...updates },
        })
      }

      return { error }
    } catch (error) {
      console.error("Update profile error:", error)
      return { error }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        createProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
