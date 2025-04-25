import { useState, useEffect } from 'react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'

// 如果样式文件存在，可以取消下面这行的注释
// import '../styles/globals.css'

function AuthWrapper({ children }) {
  const router = useRouter();
  const user = useUser();
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(true);
  
  // 不需要认证就能访问的路径列表
  const publicPaths = [
    '/auth/login-simple',
    '/auth/register-simple',
    '/auth/config-checker',
    '/auth/callback'
  ];
  
  useEffect(() => {
    async function checkAuth() {
      // 等待会话检查完成
      const { data: { session } } = await supabase.auth.getSession();
      
      // 当前路径不在公开路径列表中 且 用户未登录，重定向到登录页面
      if (!publicPaths.includes(router.pathname) && !session) {
        router.push('/auth/login-simple');
      } else {
        // 完成加载
        setLoading(false);
      }
    }
    
    checkAuth();
  }, [router.pathname]);
  
  // 显示加载状态
  if (loading && !publicPaths.includes(router.pathname)) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.5rem',
        color: '#4f46e5'
      }}>
        正在加载...
      </div>
    );
  }
  
  return children;
}

function MyApp({ Component, pageProps }) {
  const [supabaseClient] = useState(() => createPagesBrowserClient())

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <AuthWrapper>
        <Component {...pageProps} />
      </AuthWrapper>
    </SessionContextProvider>
  )
}

export default MyApp 