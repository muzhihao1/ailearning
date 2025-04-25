import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// 在服务端组件中使用的 Supabase 客户端
export function createServerSupabaseClient() {
  const cookieStore = cookies()
  return createSupabaseClient(cookieStore)
}

// 在服务端动作(Server Actions)和路由处理程序(Route Handlers)中使用的 Supabase 客户端
export function createActionSupabaseClient() {
  "use server"
  const cookieStore = cookies()
  return createSupabaseClient(cookieStore)
}

// 创建共享的 Supabase 客户端
function createSupabaseClient(cookieStore: ReturnType<typeof cookies>) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // 在只读上下文中尝试设置 Cookie 时会失败，这在中间件中很常见
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // 在只读上下文中尝试删除 Cookie 时会失败，这在中间件中很常见
          }
        },
      },
    }
  )
} 