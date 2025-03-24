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
      profiles: {
        Row: {
          id: string
          created_at: string | null
          updated_at: string | null
          email: string | null
          display_name: string | null
          avatar_url: string | null
          bio: string | null
        }
        Insert: {
          id: string
          created_at?: string | null
          updated_at?: string | null
          email?: string | null
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
        }
        Update: {
          id?: string
          created_at?: string | null
          updated_at?: string | null
          email?: string | null
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
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
