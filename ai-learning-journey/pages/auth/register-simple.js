import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function SimpleRegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState({ type: '', content: '' });
  const router = useRouter();

  // 初始化 Supabase 客户端
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-supabase-anon-key';
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage({ type: 'info', content: '正在注册...' });

    try {
      // 1. 创建用户
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // 2. 如果注册成功，添加用户信息到 profiles 表
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({ 
            id: data.user.id, 
            username: username,
            created_at: new Date() 
          });

        if (profileError) throw profileError;

        setMessage({ 
          type: 'success', 
          content: '注册成功！请检查您的邮箱进行确认。' 
        });
        
        // 3秒后重定向到登录页
        setTimeout(() => {
          router.push('/auth/login-simple');
        }, 3000);
      }
    } catch (error) {
      console.error('注册错误:', error);
      setMessage({ 
        type: 'error', 
        content: error.message || '注册失败，请稍后再试。' 
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            创建新账户
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            已有账户？{' '}
            <Link href="/auth/login-simple" className="font-medium text-blue-600 hover:text-blue-500">
              登录
            </Link>
          </p>
        </div>

        {message.content && (
          <div 
            className={`p-4 rounded-md ${
              message.type === 'error' 
                ? 'bg-red-50 text-red-700' 
                : message.type === 'success' 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-blue-50 text-blue-700'
            }`}
          >
            {message.content}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="username" className="sr-only">
                用户名
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                电子邮箱
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="电子邮箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                密码
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              注册
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-500 mt-4">
          <Link href="/" className="font-medium text-blue-600 hover:text-blue-500">
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
} 