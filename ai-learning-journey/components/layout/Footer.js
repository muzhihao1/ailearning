import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="footer-about">
            <div className="footer-logo flex items-center mb-4">
              <i className="fas fa-brain text-indigo-400 text-2xl mr-2"></i>
              <span className="text-xl font-bold">AI学习之旅</span>
            </div>
            <p className="text-gray-400 mb-4">
              我们致力于为零基础学习者提供系统化的AI编程学习路径，帮助你从入门到精通。
            </p>
            <div className="social-links flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-indigo-600 transition">
                <i className="fab fa-weixin"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-indigo-600 transition">
                <i className="fab fa-weibo"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-indigo-600 transition">
                <i className="fab fa-github"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-indigo-600 transition">
                <i className="fab fa-bilibili"></i>
              </a>
            </div>
          </div>
          
          <div className="footer-links">
            <h4 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-700">快速链接</h4>
            <ul className="space-y-2">
              <li><Link href="/"><span className="text-gray-400 hover:text-white transition">首页</span></Link></li>
              <li><Link href="/dashboard"><span className="text-gray-400 hover:text-white transition">学习仪表板</span></Link></li>
              <li><Link href="/tasks"><span className="text-gray-400 hover:text-white transition">学习任务</span></Link></li>
              <li><Link href="/courses"><span className="text-gray-400 hover:text-white transition">课程资源</span></Link></li>
            </ul>
          </div>
          
          <div className="footer-links">
            <h4 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-700">学习资源</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition">Python基础</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">机器学习</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">深度学习</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">项目实战</a></li>
            </ul>
          </div>
          
          <div className="footer-links">
            <h4 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-700">帮助支持</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition">学习指南</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">常见问题</a></li>
              <li><Link href="/profile"><span className="text-gray-400 hover:text-white transition">个人设置</span></Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">关于我们</a></li>
            </ul>
          </div>
        </div>
        
        <div className="copyright text-center text-gray-500 mt-10 pt-5 border-t border-gray-700">
          &copy; {new Date().getFullYear()} AI学习之旅 | 使用 Next.js, Supabase, Vercel 构建
        </div>
      </div>
    </footer>
  );
} 