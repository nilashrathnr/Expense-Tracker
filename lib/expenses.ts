// lib/expenses.ts

import { supabase } from './supabase'

// Define the Expense type
export type Expense = {
  id: string
  user_id: string
  title: string
  amount: number
  category?: string // Optional
  date: string // ISO string or YYYY-MM-DD
  created_at: string
  updated_at?: string
}

// ✅ 1. Create Expense
export const createExpense = async (
  expense: Omit<Expense, 'id' | 'user_id' | 'created_at' | 'updated_at'>
) => {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (!user || userError) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('expenses')
    .insert([
      {
        ...expense,
        user_id: user.id
      }
    ])
    .select()
    .single()

  return { data, error }
}

// ✅ 2. Get All Expenses (latest first)
export const getExpenses = async () => {
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (!user || userError) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  return { data, error }
}

// ✅ 3. Update Expense by ID
export const updateExpense = async (
  id: string,
  updates: Partial<Omit<Expense, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
) => {
  const { data, error } = await supabase
    .from('expenses')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

// ✅ 4. Delete Expense by ID
export const deleteExpense = async (id: string) => {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)

  return { error }
}

// ✅ 5. Get Expenses Grouped by Category
export const getExpensesByCategory = async () => {
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (!user || userError) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('expenses')
    .select('category, amount')
    .eq('user_id', user.id)

  if (error || !data) return { data: null, error }

  // Group by category and sum amounts
  const categoryTotals = data.reduce((acc: Record<string, number>, expense) => {
    const category = expense.category || 'Uncategorized'
    acc[category] = (acc[category] || 0) + expense.amount
    return acc
  }, {})

  return {
    data: Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount
    })),
    error: null
  }
}
