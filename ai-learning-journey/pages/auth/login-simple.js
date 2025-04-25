import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function SimpleLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  
  // 直接在页面内初始化supabase客户端
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  async function handleLogin(e) {
    e.preventDefault();
    
    try {
      setMessage('正在登录...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        setMessage(`登录错误: ${error.message}`);
      } else {
        setMessage('登录成功!');
        console.log('登录用户数据:', data);
        
        // 登录成功后重定向到主页
        setTimeout(() => {
          router.push('/');
        }, 1000);
      }
    } catch (err) {
      setMessage(`发生错误: ${err.message}`);
    }
  }
  
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '500px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>简单登录</h1>
      
      {message && (
        <div style={{ padding: '10px', marginBottom: '20px', backgroundColor: message.includes('错误') ? '#ffebee' : '#e8f5e9', borderRadius: '4px' }}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>电子邮箱:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>密码:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        
        <button
          type="submit"
          style={{ 
            padding: '10px', 
            backgroundColor: '#4f46e5', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          登录
        </button>
      </form>
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Link href="/" style={{ color: '#4f46e5', textDecoration: 'none' }}>返回首页</Link>
        {' | '}
        <Link href="/auth/register-simple" style={{ color: '#4f46e5', textDecoration: 'none' }}>注册账号</Link>
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p>调试信息:</p>
        <p>Supabase URL: {supabaseUrl}</p>
        <p>Anon Key设置: {supabaseAnonKey ? '已设置' : '未设置'}</p>
      </div>
    </div>
  );
} 