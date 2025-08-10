'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { deleteExpense } from '@/lib/expenses'
import type { Expense } from '@/lib/supabase'
import { Trash2, Calendar,Tag } from 'lucide-react'

interface ExpenseListProps {
  expenses: Expense[]
  onExpenseDeleted: () => void
}

export default function ExpenseList({ expenses, onExpenseDeleted }: ExpenseListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)

    try {
      const { error } = await deleteExpense(id)
      if (error) {
        console.error('Error deleting expense:', error)
      } else {
        onExpenseDeleted()
      }
    } catch (err) {
      console.error('Unexpected error:', err)
    }

    setDeletingId(null)
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Food & Dining': 'bg-orange-100 text-orange-800',
      'Transportation': 'bg-blue-100 text-blue-800',
      'Shopping': 'bg-purple-100 text-purple-800',
      'Entertainment': 'bg-pink-100 text-pink-800',
      'Bills & Utilities': 'bg-red-100 text-red-800',
      'Healthcare': 'bg-green-100 text-green-800',
      'Travel': 'bg-indigo-100 text-indigo-800',
      'Education': 'bg-yellow-100 text-yellow-800',
      'Other': 'bg-gray-100 text-gray-800',
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const formatCurrency = (amount: number | null | undefined) => {
    if (typeof amount === 'number' && !isNaN(amount)) {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2,
      }).format(amount)
    }
    return '₹0.00'
  }

  if (expenses.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No expenses yet</h3>
          <p className="text-gray-500 text-center">
            Start tracking your expenses by adding your first expense above.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Recent Expenses</h2>
      <div className="grid gap-4">
        {expenses.map((expense) => (
          <Card key={expense.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{expense.title}</h3>
                    <Badge className={getCategoryColor(expense.category)}>
                      <Tag className="h-3 w-3 mr-1" />
                      {expense.category}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                    
                      <span className="font-semibold text-lg text-green-600">
                        {formatCurrency(expense.amount)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(expense.date), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>

                  {expense.description && (
                    <p className="text-gray-600 text-sm">{expense.description}</p>
                  )}
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={deletingId === expense.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Expense</AlertDialogTitle>
                      <AlertDialogDescription>
                        {`Are you sure you want to delete "{expense.title}"? This action cannot be
                        undone.`}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(expense.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
