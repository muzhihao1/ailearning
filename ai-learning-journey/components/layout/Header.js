import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profile, setProfile] = useState(null);
  const router = useRouter();
  const supabase = useSupabaseClient();
  const user = useUser();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <span className="text-2xl font-bold text-primary cursor-pointer flex items-center">
              <span className="mr-2">
                <i className="fas fa-brain text-primary"></i>
              </span>
              AI学习之旅
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/courses">
              <span className={`nav-link ${router.pathname === '/courses' ? 'text-primary font-semibold' : 'text-gray-700'}`}>
                课程
              </span>
            </Link>
            <Link href="/roadmap">
              <span className={`nav-link ${router.pathname === '/roadmap' ? 'text-primary font-semibold' : 'text-gray-700'}`}>
                学习路线
              </span>
            </Link>
            <Link href="/projects">
              <span className={`nav-link ${router.pathname === '/projects' ? 'text-primary font-semibold' : 'text-gray-700'}`}>
                项目实战
              </span>
            </Link>
            <Link href="/resources">
              <span className={`nav-link ${router.pathname === '/resources' ? 'text-primary font-semibold' : 'text-gray-700'}`}>
                资源库
              </span>
            </Link>
            <Link href="/community">
              <span className={`nav-link ${router.pathname === '/community' ? 'text-primary font-semibold' : 'text-gray-700'}`}>
                社区
              </span>
            </Link>
            
            {!user ? (
              <div className="space-x-2">
                <Link href="/auth/login-simple">
                  <span className="px-4 py-2 rounded-md border border-primary text-primary hover:bg-primary hover:text-white transition-colors">
                    登录
                  </span>
                </Link>
                <Link href="/auth/register-simple">
                  <span className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-dark transition-colors">
                    注册
                  </span>
                </Link>
              </div>
            ) : (
              <div className="relative group">
                <div className="flex items-center space-x-2 cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <i className="fas fa-user text-gray-600"></i>
                    )}
                  </div>
                  <span className="text-gray-700">{profile?.username || user.email}</span>
                  <i className="fas fa-chevron-down text-xs text-gray-500"></i>
                </div>
                
                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link href="/dashboard">
                    <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <i className="fas fa-chart-line mr-2"></i>我的学习
                    </span>
                  </Link>
                  <Link href="/profile">
                    <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <i className="fas fa-user mr-2"></i>个人资料
                    </span>
                  </Link>
                  <Link href="/settings">
                    <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <i className="fas fa-cog mr-2"></i>设置
                    </span>
                  </Link>
                  <div className="border-t border-gray-200"></div>
                  <button 
                    onClick={handleSignOut}
                    className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i>退出登录
                  </button>
                </div>
              </div>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={toggleMenu}
          >
            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="flex flex-col space-y-4 py-4">
            <Link href="/courses">
              <span 
                className={`block px-2 py-1 ${router.pathname === '/courses' ? 'text-primary font-semibold' : 'text-gray-700'}`}
                onClick={() => setIsOpen(false)}
              >
                课程
              </span>
            </Link>
            <Link href="/roadmap">
              <span 
                className={`block px-2 py-1 ${router.pathname === '/roadmap' ? 'text-primary font-semibold' : 'text-gray-700'}`}
                onClick={() => setIsOpen(false)}
              >
                学习路线
              </span>
            </Link>
            <Link href="/projects">
              <span 
                className={`block px-2 py-1 ${router.pathname === '/projects' ? 'text-primary font-semibold' : 'text-gray-700'}`}
                onClick={() => setIsOpen(false)}
              >
                项目实战
              </span>
            </Link>
            <Link href="/resources">
              <span 
                className={`block px-2 py-1 ${router.pathname === '/resources' ? 'text-primary font-semibold' : 'text-gray-700'}`}
                onClick={() => setIsOpen(false)}
              >
                资源库
              </span>
            </Link>
            <Link href="/community">
              <span 
                className={`block px-2 py-1 ${router.pathname === '/community' ? 'text-primary font-semibold' : 'text-gray-700'}`}
                onClick={() => setIsOpen(false)}
              >
                社区
              </span>
            </Link>
            
            {!user ? (
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                <Link href="/auth/login-simple">
                  <span 
                    className="w-full text-center px-4 py-2 rounded-md border border-primary text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    登录
                  </span>
                </Link>
                <Link href="/auth/register-simple">
                  <span 
                    className="w-full text-center px-4 py-2 rounded-md bg-primary text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    注册
                  </span>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                <div className="flex items-center space-x-2 px-2 py-1">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <i className="fas fa-user text-gray-600"></i>
                    )}
                  </div>
                  <span className="text-gray-700">{profile?.username || user.email}</span>
                </div>
                <Link href="/dashboard">
                  <span 
                    className="block px-2 py-1 text-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    <i className="fas fa-chart-line mr-2"></i>我的学习
                  </span>
                </Link>
                <Link href="/profile">
                  <span 
                    className="block px-2 py-1 text-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    <i className="fas fa-user mr-2"></i>个人资料
                  </span>
                </Link>
                <Link href="/settings">
                  <span 
                    className="block px-2 py-1 text-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    <i className="fas fa-cog mr-2"></i>设置
                  </span>
                </Link>
                <button 
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                  className="text-left px-2 py-1 text-red-600"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>退出登录
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 