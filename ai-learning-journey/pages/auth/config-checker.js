import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

export default function ConfigChecker() {
  const [status, setStatus] = useState({
    checking: true,
    supabaseUrl: null,
    supabaseAnonKey: null,
    connectionWorking: false,
    error: null
  });

  useEffect(() => {
    checkConfig();
  }, []);

  const checkConfig = async () => {
    try {
      // 获取环境变量
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      setStatus(prev => ({
        ...prev,
        supabaseUrl: supabaseUrl ? '已设置' : '未设置',
        supabaseAnonKey: supabaseAnonKey ? '已设置' : '未设置',
      }));

      // 检查环境变量是否设置
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase环境变量未设置');
      }

      // 尝试连接Supabase
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      
      // 执行简单查询测试连接
      const { data, error } = await supabase.from('users').select('count').limit(1);
      
      if (error) {
        throw new Error(`Supabase连接错误: ${error.message}`);
      }

      setStatus(prev => ({
        ...prev,
        checking: false,
        connectionWorking: true,
      }));
    } catch (error) {
      console.error('配置检查错误:', error);
      setStatus(prev => ({
        ...prev,
        checking: false,
        error: error.message,
      }));
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Supabase配置检查</h1>
      
      {status.checking ? (
        <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <p>正在检查Supabase配置...</p>
        </div>
      ) : (
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h2 style={{ marginBottom: '15px' }}>配置状态</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <p style={{ margin: '5px 0' }}>
              <span style={{ fontWeight: 'bold' }}>Supabase URL: </span>
              <span style={{ 
                color: status.supabaseUrl === '已设置' ? 'green' : 'red',
                fontWeight: 'bold'
              }}>
                {status.supabaseUrl}
              </span>
            </p>
            
            <p style={{ margin: '5px 0' }}>
              <span style={{ fontWeight: 'bold' }}>Supabase Anon Key: </span>
              <span style={{ 
                color: status.supabaseAnonKey === '已设置' ? 'green' : 'red',
                fontWeight: 'bold'
              }}>
                {status.supabaseAnonKey}
              </span>
            </p>
            
            <p style={{ margin: '5px 0' }}>
              <span style={{ fontWeight: 'bold' }}>连接状态: </span>
              <span style={{ 
                color: status.connectionWorking ? 'green' : 'red',
                fontWeight: 'bold'
              }}>
                {status.connectionWorking ? '正常' : '异常'}
              </span>
            </p>
            
            {status.error && (
              <p style={{ margin: '10px 0', color: 'red' }}>
                <span style={{ fontWeight: 'bold' }}>错误信息: </span>
                {status.error}
              </p>
            )}
          </div>
          
          <div style={{ marginTop: '30px' }}>
            <h3 style={{ marginBottom: '10px' }}>下一步操作</h3>
            
            {status.connectionWorking ? (
              <div>
                <p style={{ marginBottom: '15px', color: 'green' }}>
                  ✅ Supabase连接正常！您可以使用登录/注册功能了。
                </p>
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <Link
                    href="/auth/login-simple"
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      borderRadius: '4px',
                      textDecoration: 'none',
                    }}
                  >
                    前往登录页面
                  </Link>
                  
                  <Link
                    href="/auth/register-simple"
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#2196F3',
                      color: 'white',
                      borderRadius: '4px',
                      textDecoration: 'none',
                    }}
                  >
                    前往注册页面
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <p style={{ marginBottom: '15px', color: 'red' }}>
                  ❌ Supabase连接存在问题。请检查您的配置。
                </p>
                
                <h4 style={{ marginBottom: '10px' }}>解决方法:</h4>
                <ol style={{ paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '8px' }}>
                    确保您已在Vercel项目设置中添加了Supabase集成，并且已正确配置环境变量。
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    检查您的Supabase项目是否已创建并激活。
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    确保您的Supabase项目中已创建必要的数据表（users, profiles等）。
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    如果在本地开发，请确保.env.local文件中包含正确的环境变量。
                  </li>
                </ol>
                
                <div style={{ marginTop: '20px' }}>
                  <button 
                    onClick={checkConfig}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#FF9800',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    重新检查配置
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '10px' }}>Vercel与Supabase集成说明</h3>
        
        <p style={{ marginBottom: '10px' }}>要在Vercel上正确配置Supabase：</p>
        
        <ol style={{ paddingLeft: '20px' }}>
          <li style={{ marginBottom: '8px' }}>
            在Vercel项目设置中，找到<strong>Integrations</strong>选项。
          </li>
          <li style={{ marginBottom: '8px' }}>
            搜索并添加<strong>Supabase</strong>集成。
          </li>
          <li style={{ marginBottom: '8px' }}>
            链接您的Supabase账户并选择相应的项目。
          </li>
          <li style={{ marginBottom: '8px' }}>
            集成会自动为您设置<code>NEXT_PUBLIC_SUPABASE_URL</code>和<code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>环境变量。
          </li>
          <li style={{ marginBottom: '8px' }}>
            重新部署您的Vercel项目以应用这些更改。
          </li>
        </ol>
        
        <p style={{ marginTop: '15px' }}>
          <a 
            href="https://vercel.com/docs/integrations/supabase" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#4f46e5', textDecoration: 'none' }}
          >
            查看Vercel官方文档 →
          </a>
        </p>
      </div>
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Link
          href="/demo-home"
          style={{ color: '#4f46e5', textDecoration: 'none' }}
        >
          返回演示首页
        </Link>
      </div>
    </div>
  );
} 