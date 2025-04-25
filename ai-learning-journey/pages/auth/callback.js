import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        router.push('/')
      }
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div className="w-full max-w-md space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            正在处理您的登录...
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            请稍候，我们正在处理您的登录请求
          </p>
        </div>
      </div>
    </div>
  )
} 