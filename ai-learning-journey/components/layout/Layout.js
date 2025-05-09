import { useEffect } from 'react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export default function Layout({ children, title = 'AI学习之旅 | 从零开始的人工智能学习平台', description = '一站式AI学习平台，从零基础到项目实战，陪伴你的人工智能学习旅程。' }) {
  const router = useRouter();
  const supabase = useSupabaseClient();

  // 注意：主要的身份验证逻辑已经移至_app.js中的AuthWrapper组件
  // 这里只保留登录后对登录/注册页面的重定向逻辑
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // 如果是登录页但已经登录，则重定向到仪表板
      if ((router.pathname === '/login' || router.pathname === '/register' ||
           router.pathname === '/auth/login-simple' || router.pathname === '/auth/register-simple') && session) {
        router.push('/dashboard');
      }
    };
    
    checkUser();
  }, [router.pathname]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* Font Awesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </Head>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </>
  );
} 