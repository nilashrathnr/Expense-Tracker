// app/auth/callback/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // Refresh the session from the URL fragment
    const handleAuth = async () => {
      const { error } = await supabase.auth.getSession()
      if (error) {
        console.error('Session error:', error.message)
      }

      // Optionally redirect to dashboard
      router.push('/dashboard')
    }

    handleAuth()
  }, [router])

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg">Verifying your email... Please wait.</p>
    </div>
  )
}
