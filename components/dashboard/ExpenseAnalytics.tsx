'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'
import type { Expense } from '@/lib/supabase'
import { TrendingUp, Calendar, PieChart as PieChartIcon } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const TypedResponsiveContainer = ResponsiveContainer as unknown as React.ComponentType<{
  width: string | number;
  height: number;
  children: React.ReactNode;
}>;


interface ExpenseAnalyticsProps {
  expenses: Expense[]
}

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
  '#82CA9D', '#FFC658', '#FF7C7C', '#8DD1E1', '#D084D0'
]

export default function ExpenseAnalytics({ expenses }: ExpenseAnalyticsProps) {
  const analytics = useMemo(() => {
    if (expenses.length === 0) {
      return {
        totalExpenses: 0,
        monthlyTotal: 0,
        categoryData: [],
        monthlyData: [],
        averageExpense: 0
      }
    }

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const monthlyExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
    })
    const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0)

    const categoryTotals: Record<string, number> = {}
    expenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount
    })

    const categoryData = Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category,
      value: amount,
      percentage: ((amount / totalExpenses) * 100).toFixed(1)
    }))

    const monthlyData: Record<string, number> = {}
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      return date
    }).reverse()

    last6Months.forEach(date => {
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      monthlyData[monthKey] = 0
    })

    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date)
      const monthKey = expenseDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      if (monthlyData.hasOwnProperty(monthKey)) {
        monthlyData[monthKey] += expense.amount
      }
    })

    const monthlyDataArray = Object.entries(monthlyData).map(([month, amount]) => ({
      month,
      amount
    }))

    const averageExpense = totalExpenses / expenses.length

    return {
      totalExpenses,
      monthlyTotal,
      categoryData,
      monthlyData: monthlyDataArray,
      averageExpense
    }
  }, [expenses])

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(analytics.totalExpenses)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(analytics.monthlyTotal)}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Expense</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(analytics.averageExpense)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.categoryData.length}
                </p>
              </div>
              <PieChartIcon className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {expenses.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <TypedResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: string | number | undefined) => [
                      typeof value === 'number' ? formatCurrency(value) : value,
                      'Amount'
                    ]}
                  />
                </PieChart>
              </TypedResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: string | number | undefined) => [
                      typeof value === 'number' ? formatCurrency(value) : value,
                      'Amount'
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
