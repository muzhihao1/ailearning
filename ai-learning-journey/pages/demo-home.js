import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DemoHome() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 从本地存储中获取用户信息
    if (typeof window !== 'undefined') {
      const demoUser = localStorage.getItem('demo_user');
      if (demoUser) {
        setUser(JSON.parse(demoUser));
      }
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    // 清除本地存储中的用户信息
    if (typeof window !== 'undefined') {
      localStorage.removeItem('demo_user');
      setUser(null);
    }
  };

  if (loading) {
    return (
      <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '20px', textAlign: 'center' }}>AI学习之旅 - 演示首页</h1>
      
      <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', marginBottom: '20px' }}>
        {user ? (
          <div>
            <h2 style={{ marginBottom: '10px' }}>欢迎回来，{user.user_metadata?.username || user.email}！</h2>
            <p style={{ marginBottom: '15px' }}>您已成功登录。</p>
            {user.is_demo && (
              <p style={{ marginBottom: '15px', color: '#666' }}>
                这是一个演示账户，所有数据仅保存在本地浏览器中。
              </p>
            )}
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              退出登录
            </button>
          </div>
        ) : (
          <div>
            <p style={{ marginBottom: '15px' }}>您尚未登录。请登录以访问完整功能。</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link
                href="/auth/demo-login"
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
              >
                演示登录
              </Link>
              <Link
                href="/auth/login-simple"
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
              >
                真实登录
              </Link>
            </div>
          </div>
        )}
      </div>
      
      <div style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ marginBottom: '15px' }}>Supabase 集成</h2>
        <p style={{ marginBottom: '10px' }}>
          由于您已在Vercel上配置了Supabase，您可以使用真实的登录/注册功能。
        </p>
        <Link
          href="/auth/config-checker"
          style={{
            padding: '8px 16px',
            backgroundColor: '#2196F3',
            color: 'white',
            borderRadius: '4px',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          检查Supabase配置
        </Link>
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <h3 style={{ marginBottom: '10px' }}>演示功能：</h3>
        <ul style={{ paddingLeft: '20px' }}>
          <li style={{ marginBottom: '8px' }}>使用演示账户登录/退出</li>
          <li style={{ marginBottom: '8px' }}>通过本地存储保存登录状态</li>
          <li style={{ marginBottom: '8px' }}>基本页面导航</li>
          <li style={{ marginBottom: '8px' }}>Supabase集成 - 真实用户认证</li>
        </ul>
      </div>
      
      <footer style={{ marginTop: '40px', padding: '20px', borderTop: '1px solid #eee', textAlign: 'center' }}>
        <p>AI学习之旅 - 游戏化学习平台演示</p>
      </footer>
    </div>
  );
} 