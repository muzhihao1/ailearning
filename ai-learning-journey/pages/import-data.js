import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';

export default function ImportData() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [localData, setLocalData] = useState({
    completedTasks: [],
    learningHistory: [],
    userLevel: null,
    userExp: null,
    codePoints: null,
    streakDays: null,
    hasData: false
  });
  
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      checkLocalStorage();
    }
  }, []);

  function checkLocalStorage() {
    try {
      const completedTasks = JSON.parse(localStorage.getItem('completedTasks') || '[]');
      const learningHistory = JSON.parse(localStorage.getItem('learningHistory') || '[]');
      const userLevel = localStorage.getItem('userLevel');
      const userExp = localStorage.getItem('userExp');
      const codePoints = localStorage.getItem('codePoints');
      const streakDays = localStorage.getItem('streakDays');
      
      const hasData = completedTasks.length > 0 || userLevel || userExp || codePoints || streakDays;
      
      setLocalData({
        completedTasks,
        learningHistory,
        userLevel,
        userExp,
        codePoints,
        streakDays,
        hasData
      });
      
    } catch (error) {
      console.error('检查localStorage错误:', error);
      setMessage('无法读取本地数据，可能是浏览器不支持localStorage或数据已损坏。');
    }
  }

  async function handleImport() {
    if (!user) {
      setMessage('您需要先登录才能导入数据。');
      return;
    }
    
    setLoading(true);
    setMessage('正在导入数据，请稍候...');
    
    try {
      // 1. 更新用户基本信息
      if (localData.userLevel || localData.userExp || localData.codePoints || localData.streakDays) {
        const { error: userUpdateError } = await supabase
          .from('users')
          .upsert({
            id: user.id,
            level: parseInt(localData.userLevel || '1'),
            exp: parseInt(localData.userExp || '0'),
            points: parseInt(localData.codePoints || '50'),
            streak: parseInt(localData.streakDays || '0')
          });

        if (userUpdateError) {
          throw new Error('更新用户信息失败: ' + userUpdateError.message);
        }
      }
      
      // 2. 导入已完成的任务
      let tasksImported = 0;
      
      if (localData.completedTasks.length > 0) {
        for (const task of localData.completedTasks) {
          // 先检查任务是否存在
          let taskId;
          
          const { data: existingTask } = await supabase
            .from('tasks')
            .select('id')
            .eq('title', task.title)
            .single();
          
          if (existingTask) {
            taskId = existingTask.id;
          } else {
            // 创建新任务
            const { data: newTask, error: taskError } = await supabase
              .from('tasks')
              .insert({
                title: task.title,
                description: task.description || '',
                phase: task.phase || 1,
                stage: task.stage || 'begin',
                exp_reward: task.expValue || 30,
                points_reward: task.pointsValue || 20,
                total_steps: 1
              })
              .select('id')
              .single();
            
            if (taskError) {
              console.error('创建任务错误:', taskError);
              continue;
            }
            
            taskId = newTask.id;
          }
          
          // 添加用户任务记录
          const { error: userTaskError } = await supabase
            .from('user_tasks')
            .insert({
              user_id: user.id,
              task_id: taskId,
              progress: 100,
              is_completed: true,
              completed_at: new Date(task.completedAt || Date.now()).toISOString()
            });
          
          if (userTaskError) {
            console.error('添加用户任务记录错误:', userTaskError);
            continue;
          }
          
          // 记录到日志
          await supabase
            .from('logs')
            .insert({
              user_id: user.id,
              task_id: taskId,
              action: 'import_task',
              exp_change: task.expValue || 0,
              points_change: task.pointsValue || 0,
              timestamp: new Date().toISOString()
            });
          
          tasksImported++;
        }
      }
      
      setMessage(`数据导入成功！共导入 ${tasksImported} 个任务记录。`);
      
      // 如果想要导入后清除localStorage数据，取消下面的注释
      /*
      if (window.confirm('是否清除浏览器中的本地数据？这将删除localStorage中的所有学习数据。')) {
        localStorage.removeItem('completedTasks');
        localStorage.removeItem('learningHistory');
        localStorage.removeItem('userLevel');
        localStorage.removeItem('userExp');
        localStorage.removeItem('codePoints');
        localStorage.removeItem('streakDays');
        setMessage(`数据导入成功并已清除本地数据！共导入 ${tasksImported} 个任务记录。`);
      }
      */
      
    } catch (error) {
      console.error('导入数据错误:', error);
      setMessage(`导入失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="数据导入 | AI学习之旅" description="将您的本地学习数据导入到云端账户">
      <div className="min-h-screen py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-bold text-center mb-8">数据导入工具</h1>
          
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">什么是数据导入？</h2>
            <p className="text-gray-600 mb-4">
              此工具可以帮助您将浏览器本地存储中的学习数据（localStorage）导入到您的云端账户中。
              这样您可以在任何设备上访问您的学习进度，并确保数据不会因清除浏览器缓存而丢失。
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <i className="fas fa-info-circle text-blue-400"></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    导入后，您的本地数据将被保留。如果您希望清除本地数据，可以在导入后手动清除。
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">本地存储中的数据</h2>
            
            {localData.hasData ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">等级</div>
                    <div className="font-medium">{localData.userLevel || '未设置'}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">经验值</div>
                    <div className="font-medium">{localData.userExp || '未设置'}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">代码点数</div>
                    <div className="font-medium">{localData.codePoints || '未设置'}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">连续学习天数</div>
                    <div className="font-medium">{localData.streakDays || '未设置'}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">已完成任务 ({localData.completedTasks.length})</h3>
                  {localData.completedTasks.length > 0 ? (
                    <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                      <ul className="divide-y divide-gray-200">
                        {localData.completedTasks.map((task, index) => (
                          <li key={index} className="px-4 py-3">
                            <div className="font-medium">{task.title}</div>
                            <div className="text-sm text-gray-500">
                              完成于: {new Date(task.completedAt).toLocaleString()}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="text-gray-500 italic">无已完成任务</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <i className="fas fa-database text-4xl mb-3 opacity-30"></i>
                <p>未检测到本地存储数据</p>
                <p className="text-sm mt-2">
                  您的浏览器中没有保存学习数据，或者localStorage功能被禁用。
                </p>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">导入操作</h2>
            
            {message && (
              <div className={`p-4 mb-4 rounded-lg ${message.includes('失败') || message.includes('错误') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                {message}
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleImport}
                disabled={loading || !localData.hasData || !user}
                className={`py-2 px-4 rounded-md flex items-center justify-center ${loading || !localData.hasData || !user ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    导入中...
                  </>
                ) : (
                  <>
                    <i className="fas fa-file-import mr-2"></i>
                    导入数据到云端
                  </>
                )}
              </button>
              
              <button
                onClick={() => router.push('/dashboard')}
                className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                返回仪表板
              </button>
            </div>
            
            {!user && (
              <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <i className="fas fa-exclamation-triangle text-yellow-400"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      您需要先登录才能导入数据。
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
} 