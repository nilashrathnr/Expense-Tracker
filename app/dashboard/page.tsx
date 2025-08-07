'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import ExpenseForm from '@/components/dashboard/ExpenseForm'
import ExpenseList from '@/components/dashboard/ExpenseList'
import ExpenseAnalytics from '@/components/dashboard/ExpenseAnalytics'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getCurrentUser } from '@/lib/auth'
import { getExpenses } from '@/lib/expenses'
import type { Expense } from '@/lib/supabase'
import { Loader2, BarChart3, List, Plus } from 'lucide-react'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { user } = await getCurrentUser()
      if (!user) {
        router.push('/')
        return
      }
      setUser(user)
      await fetchExpenses()
      setLoading(false)
    }
    checkAuth()
  }, [router])

  const fetchExpenses = async () => {
    try {
      const { data, error } = await getExpenses()
      if (error) {
        console.error('Error fetching expenses:', error)
      } else {
        setExpenses(data || [])
      }
    } catch (err) {
      console.error('Unexpected error:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.email?.split('@')[0]}!
          </h1>
          <p className="text-gray-600">
            Track and manage your expenses with detailed analytics.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Expense
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              All Expenses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <ExpenseAnalytics expenses={expenses} />
          </TabsContent>

          <TabsContent value="add" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              <ExpenseForm onExpenseAdded={fetchExpenses} />
            </div>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-6">
            <ExpenseList expenses={expenses} onExpenseDeleted={fetchExpenses} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}