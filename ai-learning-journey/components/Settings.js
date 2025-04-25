import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export default function Settings() {
  const [isResetting, setIsResetting] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const supabase = useSupabaseClient();

  // 重置所有进度
  const resetAllProgress = async () => {
    if (window.confirm('确定要重置所有学习进度吗？此操作不可恢复！')) {
      try {
        setIsResetting(true);
        setMessage('正在重置进度...');
        
        // 调用重置API
        const response = await fetch('/api/user/reset-progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ scope: 'all' }),
        });
        
        const result = await response.json();
        
        if (result.success) {
          setMessage('重置成功！页面将在2秒后刷新...');
          setTimeout(() => {
            router.reload();
          }, 2000);
        } else {
          setMessage(`重置失败: ${result.error || '未知错误'}`);
        }
      } catch (error) {
        console.error('重置进度出错:', error);
        setMessage(`重置出错: ${error.message}`);
      } finally {
        setIsResetting(false);
      }
    }
  };

  // 重置特定阶段进度
  const resetPhaseProgress = async (phaseNumber) => {
    if (window.confirm(`确定要重置第${phaseNumber}阶段的所有进度吗？`)) {
      try {
        setIsResetting(true);
        setMessage(`正在重置第${phaseNumber}阶段进度...`);
        
        // 调用重置API，指定阶段
        const response = await fetch('/api/user/reset-progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ scope: `phase-${phaseNumber}` }),
        });
        
        const result = await response.json();
        
        if (result.success) {
          setMessage(`第${phaseNumber}阶段重置成功！页面将在2秒后刷新...`);
          setTimeout(() => {
            router.reload();
          }, 2000);
        } else {
          setMessage(`重置失败: ${result.error || '未知错误'}`);
        }
      } catch (error) {
        console.error('重置阶段进度出错:', error);
        setMessage(`重置出错: ${error.message}`);
      } finally {
        setIsResetting(false);
      }
    }
  };

  // 如果在本地存储模式使用，也支持直接清除localStorage
  const resetLocalStorage = () => {
    if (window.confirm('确定要重置本地存储数据吗？此操作不可恢复！')) {
      try {
        // 备份用户ID
        const userId = localStorage.getItem('userId');
        
        // 清除所有数据
        localStorage.clear();
        console.log('已清除所有本地存储数据');
        
        // 重置基本数据
        if (userId) localStorage.setItem('userId', userId);
        localStorage.setItem('learningStartDate', new Date().toISOString());
        localStorage.setItem('userLevel', '1');
        localStorage.setItem('userExp', '0');
        localStorage.setItem('codePoints', '50');
        localStorage.setItem('streakDays', '0');
        localStorage.setItem('completedTasks', '[]');
        localStorage.setItem('learningHistory', '[]');
        localStorage.setItem('currentLearning', '{}');
        
        setMessage('本地存储已重置！页面将在2秒后刷新...');
        setTimeout(() => {
          router.reload();
        }, 2000);
      } catch (error) {
        console.error('重置本地存储出错:', error);
        setMessage(`重置出错: ${error.message}`);
      }
    }
  };

  // 登出功能
  const handleLogout = async () => {
    try {
      setMessage('正在登出...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // 清除任何本地存储的状态
      localStorage.removeItem('currentUser');
      
      router.push('/auth/login-simple');
    } catch (error) {
      console.error('登出错误:', error);
      setMessage(`登出出错: ${error.message}`);
    }
  };

  return (
    <div className="settings-container p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">设置</h2>
      
      {message && (
        <div className="mb-4 p-3 rounded bg-blue-50 text-blue-700">
          {message}
        </div>
      )}
      
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">账户</h3>
          <button 
            onClick={handleLogout}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
          >
            登出
          </button>
        </div>
        
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">进度管理</h3>
          <div className="space-y-3">
            <button 
              onClick={resetAllProgress}
              disabled={isResetting}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded w-full"
            >
              {isResetting ? '重置中...' : '重置所有进度'}
            </button>
            
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map(phase => (
                <button 
                  key={phase}
                  onClick={() => resetPhaseProgress(phase)}
                  disabled={isResetting}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-2 rounded text-sm"
                >
                  重置第{phase}阶段
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">本地存储</h3>
          <button 
            onClick={resetLocalStorage}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded"
          >
            重置本地存储
          </button>
        </div>
      </div>
    </div>
  );
} 