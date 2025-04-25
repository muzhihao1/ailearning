import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function middleware(req: NextRequest) {
  // 创建一个响应对象，我们将在处理完身份验证后返回它
  const res = NextResponse.next()
  
  // 从请求中提取 cookie
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  // 从请求的 cookie 中获取刷新令牌
  const refreshToken = req.cookies.get('sb-refresh-token')?.value
  const accessToken = req.cookies.get('sb-access-token')?.value

  if (refreshToken && accessToken) {
    // 使用提供的访问令牌和刷新令牌创建一个 Supabase 客户端
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // 尝试通过访问令牌获取会话
    const { data: { user } } = await supabase.auth.getUser(accessToken)

    // 如果没有用户，刷新会话
    if (!user) {
      const { data: { session } } = await supabase.auth.refreshSession({
        refresh_token: refreshToken
      })

      if (session) {
        // 将刷新的令牌作为 cookie 设置到响应中
        res.cookies.set('sb-access-token', session.access_token, {
          path: '/',
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production'
        })
        res.cookies.set('sb-refresh-token', session.refresh_token, {
          path: '/',
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production'
        })
        
        // 如果不是公共路由，检查用户是否登录
        const publicRoutes = ['/auth/login-simple', '/auth/register-simple', '/auth/callback', '/auth/config-checker']
        const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname)
        
        if (!isPublicRoute && !session.user) {
          // 重定向到登录页面
          const redirectUrl = req.nextUrl.clone()
          redirectUrl.pathname = '/auth/login-simple'
          redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
          return NextResponse.redirect(redirectUrl)
        }
      } else {
        // 如果无法刷新会话，则清除 cookie
        res.cookies.delete('sb-access-token')
        res.cookies.delete('sb-refresh-token')
        
        // 如果不是公共路由，重定向到登录页面
        const publicRoutes = ['/auth/login-simple', '/auth/register-simple', '/auth/callback', '/auth/config-checker']
        const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname)
        
        if (!isPublicRoute) {
          const redirectUrl = req.nextUrl.clone()
          redirectUrl.pathname = '/auth/login-simple'
          redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
          return NextResponse.redirect(redirectUrl)
        }
      }
    }
  } else {
    // 如果没有 cookie，并且不是公共路由，则重定向到登录页面
    const publicRoutes = ['/auth/login-simple', '/auth/register-simple', '/auth/callback', '/auth/config-checker']
    const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname)
    
    if (!isPublicRoute) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/auth/login-simple'
      redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }
  
  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|images|favicon.ico|.*\\.svg$).*)'
  ]
} 