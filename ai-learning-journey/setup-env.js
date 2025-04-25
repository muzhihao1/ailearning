/**
 * 环境变量设置辅助脚本
 * 
 * 使用方法:
 * 1. 直接运行并按提示输入:
 *    node setup-env.js
 * 
 * 2. 通过命令行参数设置:
 *    node setup-env.js --url=YOUR_SUPABASE_URL --key=YOUR_SUPABASE_ANON_KEY
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 解析命令行参数
function parseArgs() {
  const args = {};
  process.argv.slice(2).forEach(arg => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.substring(2).split('=');
      if (value) {
        args[key] = value;
      }
    }
  });
  return args;
}

// 从控制台获取输入
async function promptInput(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

// 主函数
async function main() {
  console.log('\n🔧 Supabase环境变量设置工具\n');
  
  // 解析命令行参数
  const args = parseArgs();
  let supabaseUrl = args.url;
  let supabaseAnonKey = args.key;
  
  // 如果命令行没有提供参数，则提示用户输入
  if (!supabaseUrl) {
    supabaseUrl = await promptInput('请输入Supabase项目URL: ');
  }
  
  if (!supabaseAnonKey) {
    supabaseAnonKey = await promptInput('请输入Supabase匿名密钥: ');
  }
  
  // 验证输入
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ URL和密钥都必须提供。设置已取消。');
    process.exit(1);
  }
  
  // 生成环境变量文件内容
  const envContent = `# Supabase配置 - 由setup-env.js自动生成
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}
`;

  // 写入.env.local文件
  const envPath = path.join(__dirname, '.env.local');
  fs.writeFileSync(envPath, envContent);

  console.log(`\n✅ 环境变量已成功写入 ${envPath}`);
  console.log('\n提示: 请确保不要将.env.local文件提交到版本控制系统中');
  console.log('\n下一步:');
  console.log('1. 启动开发服务器: npm run dev');
  console.log('2. 访问 http://localhost:3000/auth/config-checker 验证配置');
  console.log('3. 测试登录/注册功能');
}

// 执行主函数
main().catch(err => {
  console.error('设置过程中出错:', err);
  process.exit(1);
}); 