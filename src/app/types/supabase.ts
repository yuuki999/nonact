export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      customer_profiles: {
        Row: {
          id: string
          created_at: string | null
          updated_at: string | null
          email: string | null
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          phone_number: string | null
        }
        Insert: {
          id: string
          created_at?: string | null
          updated_at?: string | null
          email?: string | null
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          phone_number?: string | null
        }
        Update: {
          id?: string
          created_at?: string | null
          updated_at?: string | null
          email?: string | null
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          phone_number?: string | null
        }
      },
      nonact_staff: {
        Row: {
          id: string
          created_at: string
          name: string
          display_name: string
          profile_image_url?: string
          rank?: number
          category?: string
          main_title?: string
          tags?: string[]
          bio?: string
          is_available: boolean
          email?: string
          nickname?: string
          age?: number
          gender?: string
          prefecture?: string
          hobby?: string[]
          specialty?: string
          image_url?: string
          hourly_rate?: number
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          display_name?: string
          profile_image_url?: string
          rank?: number
          category?: string
          main_title?: string
          tags?: string[]
          bio?: string
          is_available?: boolean
          email?: string
          nickname?: string
          age?: number
          gender?: string
          prefecture?: string
          hobby?: string[]
          specialty?: string
          image_url?: string
          hourly_rate?: number
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          display_name?: string
          profile_image_url?: string
          rank?: number
          category?: string
          main_title?: string
          tags?: string[]
          bio?: string
          is_available?: boolean
          email?: string
          nickname?: string
          age?: number
          gender?: string
          prefecture?: string
          hobby?: string[]
          specialty?: string
          image_url?: string
          hourly_rate?: number
        }
      },
      nonact_staff_pending: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          age?: number
          height?: number
          hobbies?: string[]
          bio?: string
          image_url?: string
          confirmation_token: string
          expires_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          age?: number
          height?: number
          hobbies?: string[]
          bio?: string
          image_url?: string
          confirmation_token: string
          expires_at: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          age?: number
          height?: number
          hobbies?: string[]
          bio?: string
          image_url?: string
          confirmation_token?: string
          expires_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
