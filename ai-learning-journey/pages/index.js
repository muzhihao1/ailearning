import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Link from 'next/link';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

export default function Home() {
  const [heroStats, setHeroStats] = useState({
    users: 0,
    tasks: 0,
    projects: 0
  });
  const user = useUser();
  const supabase = useSupabaseClient();

  useEffect(() => {
    async function fetchStats() {
      try {
        // 获取用户数量
        const { count: userCount } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });
        
        // 获取已完成任务数
        const { count: taskCount } = await supabase
          .from('user_tasks')
          .select('*', { count: 'exact', head: true })
          .eq('is_completed', true);
        
        setHeroStats({
          users: userCount || 0,
          tasks: taskCount || 0,
          projects: 12 // 项目数暂时硬编码
        });
      } catch (error) {
        console.error('获取统计数据失败:', error);
      }
    }
    
    fetchStats();
  }, []);

  return (
    <Layout>
      {/* 英雄区域 */}
      <section className="hero-section bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 text-white mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                从零开始的人工智能学习之旅
              </h1>
              <p className="text-xl mb-8">
                无论你是完全零基础还是有编程经验，这里都能找到适合你的AI学习路线。
                通过体系化的课程和实战项目，让AI不再是遥不可及的技术。
              </p>
              <div className="flex flex-wrap gap-4">
                {!user ? (
                  <>
                    <Link href="/register">
                      <span className="btn-primary px-8 py-3 rounded-full text-lg font-semibold">
                        开始学习之旅
                      </span>
                    </Link>
                    <Link href="/roadmap">
                      <span className="btn-secondary px-8 py-3 rounded-full text-lg font-semibold">
                        查看学习路线
                      </span>
                    </Link>
                    <Link href="/auth/login-simple">
                      <span className="btn-outline px-8 py-3 rounded-full text-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-indigo-600 transition-colors">
                        登录
                      </span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/dashboard">
                      <span className="btn-primary px-8 py-3 rounded-full text-lg font-semibold">
                        继续我的学习
                      </span>
                    </Link>
                    <Link href="/tasks">
                      <span className="btn-secondary px-8 py-3 rounded-full text-lg font-semibold">
                        今日学习任务
                      </span>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="/images/hero-illustration.svg" 
                alt="AI学习插图" 
                className="w-full max-w-md mx-auto"
              />
            </div>
          </div>
          
          {/* 数据统计 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-white mb-2">{heroStats.users}+</div>
              <div className="text-white text-lg">学习者</div>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-white mb-2">{heroStats.tasks}+</div>
              <div className="text-white text-lg">已完成任务</div>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-white mb-2">{heroStats.projects}</div>
              <div className="text-white text-lg">实战项目</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* 特色区域 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">为什么选择我们的AI学习平台？</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-indigo-600 text-2xl">
                <i className="fas fa-road"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">体系化学习路径</h3>
              <p className="text-gray-600">
                从Python基础到机器学习，从深度学习到实战项目，清晰的学习路径让你进阶无忧。
              </p>
            </div>
            
            <div className="feature-card bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 text-purple-600 text-2xl">
                <i className="fas fa-gamepad"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">游戏化学习体验</h3>
              <p className="text-gray-600">
                通过任务完成、经验值累积、等级提升等机制，让枯燥的学习变得有趣而富有成就感。
              </p>
            </div>
            
            <div className="feature-card bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4 text-pink-600 text-2xl">
                <i className="fas fa-project-diagram"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">实战项目驱动</h3>
              <p className="text-gray-600">
                精心设计的实战项目，从入门级到高级应用，帮助你构建实用的AI应用并积累项目经验。
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* 学习路径预览 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">AI学习路径</h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
            我们精心设计了从零基础到AI专家的学习路径，无论你的起点在哪里，都能找到适合你的阶段和内容。
          </p>
          
          <div className="learning-path-timeline space-y-8">
            {/* 阶段1 */}
            <div className="relative pl-8 md:pl-0">
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -translate-y-4">
                <div className="w-8 h-8 bg-indigo-500 rounded-full text-white flex items-center justify-center">1</div>
              </div>
              <div className="md:w-5/12 md:mr-auto md:pr-8 bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold text-indigo-600">阶段一：编程基础</h3>
                <p className="mt-2 text-gray-600">Python基础、数据结构、算法入门、NumPy和Pandas库的使用。</p>
                <Link href="/roadmap#phase1">
                  <span className="inline-block mt-3 text-indigo-600 hover:underline">查看详情 →</span>
                </Link>
              </div>
            </div>
            
            {/* 阶段2 */}
            <div className="relative pl-8 md:pl-0">
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -translate-y-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full text-white flex items-center justify-center">2</div>
              </div>
              <div className="md:w-5/12 md:ml-auto md:pl-8 bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold text-purple-600">阶段二：机器学习基础</h3>
                <p className="mt-2 text-gray-600">数据预处理、特征工程、常见机器学习算法、模型评估与优化。</p>
                <Link href="/roadmap#phase2">
                  <span className="inline-block mt-3 text-purple-600 hover:underline">查看详情 →</span>
                </Link>
              </div>
            </div>
            
            {/* 阶段3 */}
            <div className="relative pl-8 md:pl-0">
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -translate-y-4">
                <div className="w-8 h-8 bg-pink-500 rounded-full text-white flex items-center justify-center">3</div>
              </div>
              <div className="md:w-5/12 md:mr-auto md:pr-8 bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold text-pink-600">阶段三：深度学习与神经网络</h3>
                <p className="mt-2 text-gray-600">神经网络基础、PyTorch/TensorFlow框架、CNN、RNN、注意力机制。</p>
                <Link href="/roadmap#phase3">
                  <span className="inline-block mt-3 text-pink-600 hover:underline">查看详情 →</span>
                </Link>
              </div>
            </div>
            
            {/* 阶段4 */}
            <div className="relative pl-8 md:pl-0">
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -translate-y-4">
                <div className="w-8 h-8 bg-indigo-500 rounded-full text-white flex items-center justify-center">4</div>
              </div>
              <div className="md:w-5/12 md:ml-auto md:pl-8 bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold text-indigo-600">阶段四：AI高级应用与实战</h3>
                <p className="mt-2 text-gray-600">NLP、计算机视觉、强化学习、大型语言模型应用，完整AI项目实战。</p>
                <Link href="/roadmap#phase4">
                  <span className="inline-block mt-3 text-indigo-600 hover:underline">查看详情 →</span>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/roadmap">
              <span className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg transition-shadow">
                查看完整学习路线
              </span>
            </Link>
          </div>
        </div>
      </section>
      
      {/* 行动召唤 */}
      <section className="py-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">准备好开始你的AI学习之旅了吗？</h2>
          <p className="text-xl max-w-3xl mx-auto mb-10">
            从今天开始，踏上系统化学习AI的道路，让人工智能成为你的核心竞争力。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {!user ? (
              <Link href="/register">
                <span className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-full hover:shadow-lg transition-shadow">
                  立即注册，开始学习
                </span>
              </Link>
            ) : (
              <Link href="/dashboard">
                <span className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-full hover:shadow-lg transition-shadow">
                  进入我的学习仪表板
                </span>
              </Link>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
} 