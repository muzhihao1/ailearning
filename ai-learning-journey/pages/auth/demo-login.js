import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function DemoLoginPage() {
  const [message, setMessage] = useState('');
  const router = useRouter();
  
  // 模拟登录函数
  const handleDemoLogin = (e) => {
    e.preventDefault();
    setMessage('正在以演示账户登录...');
    
    // 模拟登录延迟
    setTimeout(() => {
      // 在本地存储中保存演示用户信息
      if (typeof window !== 'undefined') {
        localStorage.setItem('demo_user', JSON.stringify({
          id: 'demo-user-123',
          email: 'demo@example.com',
          user_metadata: {
            username: '演示用户'
          },
          is_demo: true
        }));
      }
      
      setMessage('登录成功！正在跳转...');
      
      // 跳转到首页
      setTimeout(() => {
        router.push('/demo-home');
      }, 1000);
    }, 1500);
  };
  
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '500px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>演示登录</h1>
      
      {message && (
        <div style={{ padding: '10px', marginBottom: '20px', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
          {message}
        </div>
      )}
      
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <p style={{ marginBottom: '15px' }}>这是一个演示页面，无需真实的Supabase配置即可体验登录功能。</p>
        <p style={{ marginBottom: '15px' }}>点击下方按钮以演示账户登录：</p>
      </div>
      
      <button
        onClick={handleDemoLogin}
        style={{ 
          width: '100%',
          padding: '10px', 
          backgroundColor: '#4f46e5', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          marginBottom: '20px'
        }}
      >
        以演示账户登录
      </button>
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Link 
          href="/demo-home"
          style={{ color: '#4f46e5', textDecoration: 'none' }}
        >
          返回首页
        </Link>
        {' | '}
        <Link 
          href="/auth/login-simple"
          style={{ color: '#4f46e5', textDecoration: 'none' }}
        >
          真实登录页面
        </Link>
      </div>
      
      <div style={{ marginTop: '30px', fontSize: '14px', color: '#666', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <p style={{ marginBottom: '5px' }}><strong>演示账户信息:</strong></p>
        <p style={{ margin: '0' }}>用户名: 演示用户</p>
        <p style={{ margin: '0' }}>邮箱: demo@example.com</p>
      </div>
    </div>
  );
} 