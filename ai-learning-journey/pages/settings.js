import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

export default function Settings() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const user = useUser();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  // 如果用户未登录，重定向到登录页面
  if (!user) {
    if (typeof window !== 'undefined') {
      router.push('/auth/login-simple');
    }
    return null;
  }
  
  // 重置所有进度
  const resetAllProgress = async () => {
    if (!window.confirm('确定要重置所有学习进度吗？此操作不可恢复！')) {
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/user/reset-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scope: 'all' }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsSuccess(true);
        setMessage('所有进度已重置，页面将在3秒后刷新...');
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        setIsSuccess(false);
        setMessage(`操作失败: ${data.error || '未知错误'}`);
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage(`发生错误: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // 重置特定阶段进度
  const resetPhaseProgress = async (phaseNumber) => {
    if (!window.confirm(`确定要重置第${phaseNumber}阶段的所有进度吗？此操作不可恢复！`)) {
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/user/reset-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scope: `phase-${phaseNumber}` }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsSuccess(true);
        setMessage(`第${phaseNumber}阶段进度已重置，页面将在3秒后刷新...`);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        setIsSuccess(false);
        setMessage(`操作失败: ${data.error || '未知错误'}`);
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage(`发生错误: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Layout title="设置 | AI学习之旅">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-8 text-center">设置与数据</h1>
          
          {message && (
            <div className={`p-4 mb-6 rounded-md ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}
          
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">学习进度管理</h2>
            <div className="bg-gray-50 p-6 rounded-md">
              <p className="text-gray-700 mb-4">通过以下选项管理您的学习进度数据：</p>
              
              <div className="mb-6">
                <button
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  onClick={resetAllProgress}
                  disabled={loading}
                >
                  {loading ? '处理中...' : '重置所有进度'}
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  清除所有学习记录、经验值和点数。此操作不可恢复！
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">重置特定阶段</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button 
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    onClick={() => resetPhaseProgress(1)}
                    disabled={loading}
                  >
                    重置第1阶段
                  </button>
                  <button 
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    onClick={() => resetPhaseProgress(2)}
                    disabled={loading}
                  >
                    重置第2阶段
                  </button>
                  <button 
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    onClick={() => resetPhaseProgress(3)}
                    disabled={loading}
                  >
                    重置第3阶段
                  </button>
                  <button 
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    onClick={() => resetPhaseProgress(4)}
                    disabled={loading}
                  >
                    重置第4阶段
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">账户信息</h2>
            <div className="bg-gray-50 p-6 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-500 mb-1">用户邮箱</p>
                  <p className="font-medium">{user?.email || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">用户ID</p>
                  <p className="font-medium text-sm">{user?.id || '-'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 