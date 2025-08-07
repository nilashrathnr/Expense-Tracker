import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Expense {
  id: string
  user_id: string
  title: string
  amount: number
  category: string
  description?: string
  date: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  created_at: string
}