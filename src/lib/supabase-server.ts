import { createClient } from '@supabase/supabase-js'
import { env, isSupabaseConfigured } from './env'

/**
 * Server-side Supabase client for API routes
 * Uses server-side environment variables for database access
 */

// Only create the client if we have the required environment variables
export const supabaseServer = isSupabaseConfigured() ? createClient(env.supabaseUrl, env.supabaseServiceKey || env.supabaseAnonKey, {
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-application-name': 'aspire-properties-server'
    }
  },
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
}) : null

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          first_name?: string
          last_name?: string
          phone?: string
          role: 'ADMIN' | 'AGENT' | 'BUYER' | 'BUILDER'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          first_name?: string
          last_name?: string
          phone?: string
          role?: 'ADMIN' | 'AGENT' | 'BUYER' | 'BUILDER'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          first_name?: string
          last_name?: string
          phone?: string
          role?: 'ADMIN' | 'AGENT' | 'BUYER' | 'BUILDER'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          title: string
          description: string
          price: number
          location: string
          property_type: 'residential' | 'commercial' | 'land'
          status: 'available' | 'sold' | 'pending' | 'under_construction'
          agent_id?: string
          builder_id?: string
          images: string[]
          features: any
          specifications: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          price: number
          location: string
          property_type: 'residential' | 'commercial' | 'land'
          status?: 'available' | 'sold' | 'pending' | 'under_construction'
          agent_id?: string
          builder_id?: string
          images?: string[]
          features?: any
          specifications?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number
          location?: string
          property_type?: 'residential' | 'commercial' | 'land'
          status?: 'available' | 'sold' | 'pending' | 'under_construction'
          agent_id?: string
          builder_id?: string
          images?: string[]
          features?: any
          specifications?: any
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      get_user_role: {
        Args: { user_uuid: string }
        Returns: string
      }
      has_role: {
        Args: { user_uuid: string; role_name: string }
        Returns: boolean
      }
    }
  }
}
