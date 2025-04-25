import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // 验证密码
    if (password !== confirmPassword) {
      setMessage('两次输入的密码不一致');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setMessage('密码长度必须至少为6个字符');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data?.user?.identities?.length === 0) {
        setMessage('该邮箱已注册，请直接登录');
      } else {
        setMessage('注册成功！请查看您的邮箱进行验证，或直接登录');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage(`注册出错: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>注册新账户</h1>
      
      {message && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '20px', 
          background: message.includes('出错') || message.includes('不一致') || message.includes('至少') ? '#ffdddd' : '#ddffdd',
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>电子邮箱</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>密码 (至少6个字符)</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px' }}>确认密码</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? '注册中...' : '注册'}
        </button>
        
        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <Link href="/login">
            <span style={{ color: '#4f46e5', textDecoration: 'none', cursor: 'pointer' }}>
              已有账户？登录
            </span>
          </Link>
        </div>
      </form>
    </div>
  );
} 