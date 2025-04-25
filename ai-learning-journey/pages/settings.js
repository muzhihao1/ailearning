import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import Settings from '../components/Settings';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = useSupabaseClient();
  const user = useUser();

  useEffect(() => {
    async function checkUser() {
      try {
        // 检查用户是否已登录
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (!data.session) {
          // 未登录，重定向到登录页
          router.push('/auth/login-simple');
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('检查用户状态出错:', error.message);
        setLoading(false);
      }
    }
    
    checkUser();
  }, [router, supabase]);

  // 加载状态
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">账户设置</h1>
          <p className="text-gray-600 mt-2">
            管理您的账户和学习进度
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-2">
            {user && (
              <div className="bg-blue-50 p-4 mb-6 rounded-lg">
                <p className="text-blue-800">
                  <span className="font-semibold">当前登录账户:</span> {user.email}
                </p>
              </div>
            )}
            
            <Settings />
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border-left-color: #3b82f6;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 