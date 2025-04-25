import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import Link from 'next/link';

export default function Dashboard() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentTasks, setRecentTasks] = useState([]);
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    lastLogin: null
  });
  
  const supabase = useSupabaseClient();
  const user = useUser();

  useEffect(() => {
    if (user) {
      fetchUserData();
      updateLoginStreak();
    }
  }, [user]);

  async function fetchUserData() {
    try {
      setLoading(true);
      
      // 获取用户资料
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError) throw profileError;
      
      setUserProfile(profile);
      
      // 获取最近完成的任务
      const { data: tasks, error: tasksError } = await supabase
        .from('user_tasks')
        .select(`
          *,
          task:tasks(*)
        `)
        .eq('user_id', user.id)
        .eq('is_completed', true)
        .order('completed_at', { ascending: false })
        .limit(5);
      
      if (tasksError) throw tasksError;
      
      setRecentTasks(tasks);
      
      // 获取连续登录数据
      setStreakData({
        currentStreak: profile.streak || 0,
        lastLogin: profile.last_login
      });
      
    } catch (error) {
      console.error('获取用户数据错误:', error);
    } finally {
      setLoading(false);
    }
  }
  
  async function updateLoginStreak() {
    try {
      const { data, error } = await supabase.rpc('update_login_streak', {
        user_id: user.id
      });
      
      if (error) throw error;
      
      if (data) {
        setStreakData({
          currentStreak: data.streak,
          lastLogin: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('更新登录连续日错误:', error);
    }
  }

  if (loading) {
    return (
      <Layout title="加载中 | AI学习之旅">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载中，请稍候...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="学习仪表板 | AI学习之旅">
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* 头部区域 */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl p-6 md:p-8 text-white mb-8 shadow-lg">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3">
                <h1 className="text-3xl font-bold mb-2">
                  欢迎回来，{userProfile?.username || user.email}
                </h1>
                <p className="text-lg opacity-90 mb-4">
                  继续您的AI学习之旅，今天也要加油哦！
                </p>
                <div className="flex flex-wrap gap-6 mt-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
                      <i className="fas fa-trophy text-yellow-300 text-xl"></i>
                    </div>
                    <div>
                      <div className="text-sm opacity-80">当前等级</div>
                      <div className="text-xl font-bold">Lv. {userProfile?.level || 1}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
                      <i className="fas fa-star text-yellow-300 text-xl"></i>
                    </div>
                    <div>
                      <div className="text-sm opacity-80">经验值</div>
                      <div className="text-xl font-bold">{userProfile?.exp || 0}/100</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
                      <i className="fas fa-coins text-yellow-300 text-xl"></i>
                    </div>
                    <div>
                      <div className="text-sm opacity-80">代码点数</div>
                      <div className="text-xl font-bold">{userProfile?.points || 0}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/3 flex justify-center md:justify-end mt-6 md:mt-0">
                <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl p-4 text-center">
                  <div className="text-sm mb-1">连续学习</div>
                  <div className="flex items-center justify-center text-3xl font-bold">
                    <i className="fas fa-fire text-orange-400 mr-2"></i>
                    {streakData.currentStreak} 天
                  </div>
                  <div className="text-xs mt-2 opacity-80">
                    坚持每天学习，提高技能水平
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 主要内容区 - 两列布局 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左侧大列 */}
            <div className="lg:col-span-2 space-y-8">
              {/* 学习进度 */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">我的学习进度</h2>
                  <Link href="/roadmap">
                    <span className="text-indigo-600 hover:text-indigo-800 text-sm">
                      查看学习路线 <i className="fas fa-chevron-right text-xs ml-1"></i>
                    </span>
                  </Link>
                </div>
                
                {/* 学习阶段进度条 */}
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <div className="font-medium">阶段 1：编程基础</div>
                      <div className="text-sm text-gray-500">70%</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <div className="font-medium">阶段 2：机器学习基础</div>
                      <div className="text-sm text-gray-500">35%</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <div className="font-medium">阶段 3：深度学习与神经网络</div>
                      <div className="text-sm text-gray-500">10%</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-pink-600 h-2.5 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <div className="font-medium">阶段 4：AI高级应用与实战</div>
                      <div className="text-sm text-gray-500">0%</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Link href="/tasks">
                    <span className="block text-center py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition">
                      继续我的学习任务
                    </span>
                  </Link>
                </div>
              </div>
              
              {/* 最近完成的任务 */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">最近完成的任务</h2>
                  <Link href="/history">
                    <span className="text-indigo-600 hover:text-indigo-800 text-sm">
                      查看全部历史 <i className="fas fa-chevron-right text-xs ml-1"></i>
                    </span>
                  </Link>
                </div>
                
                {recentTasks.length > 0 ? (
                  <div className="space-y-4">
                    {recentTasks.map((userTask) => (
                      <div key={userTask.id} className="flex items-start border-b border-gray-100 pb-4">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-check text-green-600"></i>
                        </div>
                        <div className="ml-4 flex-grow">
                          <div className="font-medium">{userTask.task.title}</div>
                          <div className="text-sm text-gray-500">
                            完成于 {new Date(userTask.completed_at).toLocaleString('zh-CN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm font-medium text-green-600">+{userTask.task.exp_reward} 经验</div>
                          <div className="text-sm text-yellow-600">+{userTask.task.points_reward} 点数</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <i className="fas fa-clipboard-list text-4xl mb-3 opacity-30"></i>
                    <p>您还没有完成任何任务</p>
                    <Link href="/tasks">
                      <span className="inline-block mt-2 text-indigo-600 hover:underline">
                        开始学习任务
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
            
            {/* 右侧小列 */}
            <div className="space-y-8">
              {/* 今日学习建议 */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">今日学习建议</h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                    <div className="font-medium text-indigo-900 mb-1">
                      <i className="fas fa-lightbulb text-indigo-500 mr-2"></i>
                      完成阶段1的Python基础练习
                    </div>
                    <div className="text-sm text-indigo-700">
                      巩固Python数据结构和函数使用，为机器学习打下基础。
                    </div>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="font-medium text-purple-900 mb-1">
                      <i className="fas fa-book text-purple-500 mr-2"></i>
                      了解机器学习算法分类
                    </div>
                    <div className="text-sm text-purple-700">
                      学习监督学习、无监督学习和强化学习的基本概念。
                    </div>
                  </div>
                  
                  <div className="p-4 bg-pink-50 rounded-lg border border-pink-100">
                    <div className="font-medium text-pink-900 mb-1">
                      <i className="fas fa-code text-pink-500 mr-2"></i>
                      完成NumPy入门实验
                    </div>
                    <div className="text-sm text-pink-700">
                      掌握NumPy数组操作，为后续数据处理打好基础。
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 成就和徽章 */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">我的成就</h2>
                  <Link href="/achievements">
                    <span className="text-indigo-600 hover:text-indigo-800 text-sm">
                      全部成就 <i className="fas fa-chevron-right text-xs ml-1"></i>
                    </span>
                  </Link>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center mb-1">
                      <i className="fas fa-code text-yellow-600 text-lg"></i>
                    </div>
                    <span className="text-xs text-center">编程新手</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mb-1">
                      <i className="fas fa-fire text-indigo-600 text-lg"></i>
                    </div>
                    <span className="text-xs text-center">坚持不懈</span>
                  </div>
                  
                  <div className="flex flex-col items-center opacity-40">
                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-1">
                      <i className="fas fa-lock text-gray-400 text-lg"></i>
                    </div>
                    <span className="text-xs text-center">未解锁</span>
                  </div>
                </div>
              </div>
              
              {/* 学习资源推荐 */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">推荐学习资源</h2>
                
                <div className="space-y-3">
                  <a href="#" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg">
                    <div className="font-medium">Python数据科学手册</div>
                    <div className="text-sm text-gray-500">全面介绍Python科学计算生态系统</div>
                  </a>
                  
                  <a href="#" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg">
                    <div className="font-medium">机器学习实战</div>
                    <div className="text-sm text-gray-500">通过实例讲解主流机器学习算法</div>
                  </a>
                  
                  <a href="#" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg">
                    <div className="font-medium">深度学习基础视频课程</div>
                    <div className="text-sm text-gray-500">由吴恩达教授主讲的经典入门课程</div>
                  </a>
                </div>
                
                <div className="mt-4 text-center">
                  <Link href="/resources">
                    <span className="text-indigo-600 hover:text-indigo-800 text-sm">
                      浏览更多资源 <i className="fas fa-arrow-right text-xs ml-1"></i>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 