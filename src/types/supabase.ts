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
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: string
          subscription_tier: string
          subscription_status: string
          created_at: string
          last_login: string | null
          settings: Json
          metadata: Json
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          role?: string
          subscription_tier?: string
          subscription_status?: string
          created_at?: string
          last_login?: string | null
          settings?: Json
          metadata?: Json
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: string
          subscription_tier?: string
          subscription_status?: string
          created_at?: string
          last_login?: string | null
          settings?: Json
          metadata?: Json
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: string
          amount: number
          currency: string
          status: string
          description: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          amount: number
          currency?: string
          status?: string
          description?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          amount?: number
          currency?: string
          status?: string
          description?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      predictions: {
        Row: {
          id: string
          user_id: string
          type: string
          prediction: Json
          confidence: number | null
          status: string
          created_at: string
          valid_until: string | null
          metadata: Json
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          prediction: Json
          confidence?: number | null
          status?: string
          created_at?: string
          valid_until?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          prediction?: Json
          confidence?: number | null
          status?: string
          created_at?: string
          valid_until?: string | null
          metadata?: Json
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