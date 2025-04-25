# AI学习网站部署指南

本文档提供了以下部署方案：
1. 当前实现：使用本地存储的静态网站部署方案
2. 推荐升级：基于Next.js + Supabase + Vercel的现代Web应用部署方案
3. 其他选项：带数据库支持的服务器端部署方案

## 1. 静态网站部署方案 (当前实现)

当前网站使用浏览器的localStorage进行数据存储，不需要服务器支持，可以作为静态网站部署。

### 1.1 GitHub Pages 部署

1. **创建GitHub仓库**
   ```bash
   # 初始化Git仓库
   git init
   git add .
   git commit -m "Initial commit"
   
   # 创建GitHub仓库并推送代码
   git remote add origin https://github.com/yourusername/ai-learning-website.git
   git push -u origin main
   ```

2. **启用GitHub Pages**
   - 进入GitHub仓库 -> Settings -> Pages
   - Source选择main分支
   - 保存设置，等待部署完成

3. **访问网站**
   - 部署完成后，您的网站将可通过以下地址访问：
   - `https://yourusername.github.io/ai-learning-website/`

### 1.2 Netlify 部署

1. **注册Netlify账号**
   - 访问 [Netlify官网](https://www.netlify.com/) 注册账号

2. **部署网站**
   - 选择 "从Git导入" 或 "拖放站点文件夹"
   - 如果从Git导入，连接您的GitHub账号并选择仓库
   - 如果拖放部署，将整个网站文件夹拖到上传区域

3. **自定义域名 (可选)**
   - 在网站设置中添加自定义域名
   - 按照指引配置DNS记录

## 2. Next.js + Supabase + Vercel 部署方案 (推荐升级)

这是一个现代、功能强大的部署方案，支持用户认证、数据存储、API路由和全球CDN。

### 2.1 环境准备

1. **安装Node.js和npm**
   - 下载并安装 [Node.js](https://nodejs.org/) (推荐使用LTS版本)
   - 确认安装成功:
   ```bash
   node -v
   npm -v
   ```

### 2.2 创建Next.js项目

1. **初始化Next.js项目**
   ```bash
   # 创建新的Next.js项目
   npx create-next-app@latest ai-learning-website
   cd ai-learning-website
   
   # 安装必要的依赖
   npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
   ```

2. **项目结构调整**
   - 将现有的HTML、CSS、JS代码按照Next.js项目结构重新组织
   - 创建合适的组件结构：

   ```
   /components
     /layout
       Header.js
       Footer.js
     /learning
       TaskList.js
       PhaseCard.js
       ProgressBar.js
     /gamification
       LevelIndicator.js
       StreakCounter.js
       AchievementSystem.js
     /ui
       Button.js
       Modal.js
   /pages
     index.js (主页)
     dashboard.js (学习仪表板)
     tasks.js (任务页面)
     courses.js (课程页面)
     profile.js (用户资料)
     _app.js (应用包装器)
   /styles
     globals.css (全局样式)
     components.css (组件样式)
   /lib
     supabase.js (Supabase客户端)
     utils.js (工具函数)
   ```

### 2.3 设置Supabase

1. **创建Supabase项目**
   - 前往 [Supabase](https://supabase.com/) 注册并创建项目
   - 记下项目URL和anon密钥

2. **配置环境变量**
   - 创建`.env.local`文件:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **设置数据库表**
   - 使用Supabase界面或SQL创建以下表:

   **users表**:
   ```sql
   CREATE TABLE users (
     id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
     username TEXT UNIQUE,
     email TEXT UNIQUE,
     level INTEGER DEFAULT 1,
     exp INTEGER DEFAULT 0,
     points INTEGER DEFAULT 50,
     streak INTEGER DEFAULT 0,
     last_login TIMESTAMP WITH TIME ZONE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

   **tasks表**:
   ```sql
   CREATE TABLE tasks (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     title TEXT NOT NULL,
     description TEXT,
     phase INTEGER,
     stage TEXT,
     exp_reward INTEGER DEFAULT 30,
     points_reward INTEGER DEFAULT 20,
     total_steps INTEGER DEFAULT 1,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```
   
   **user_tasks表**:
   ```sql
   CREATE TABLE user_tasks (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     user_id UUID REFERENCES users(id),
     task_id UUID REFERENCES tasks(id),
     progress INTEGER DEFAULT 0,
     is_completed BOOLEAN DEFAULT FALSE,
     completed_at TIMESTAMP WITH TIME ZONE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```
   
   **logs表**:
   ```sql
   CREATE TABLE logs (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     user_id UUID REFERENCES users(id),
     task_id UUID REFERENCES tasks(id),
     action TEXT,
     exp_change INTEGER,
     points_change INTEGER,
     timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

4. **设置Row Level Security (RLS)**
   - 为每个表添加适当的安全策略，确保用户只能访问自己的数据:
   
   ```sql
   -- 用户只能查看和编辑自己的数据
   CREATE POLICY "Users can view own data" 
     ON users FOR SELECT USING (auth.uid() = id);
   
   CREATE POLICY "Users can update own data" 
     ON users FOR UPDATE USING (auth.uid() = id);
   
   -- 任务表对所有人可读，只有管理员可写
   CREATE POLICY "Tasks are viewable by everyone" 
     ON tasks FOR SELECT USING (true);
   
   -- 用户任务表策略
   CREATE POLICY "Users can view own tasks" 
     ON user_tasks FOR SELECT USING (auth.uid() = user_id);
   
   CREATE POLICY "Users can insert own tasks" 
     ON user_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
   
   CREATE POLICY "Users can update own tasks" 
     ON user_tasks FOR UPDATE USING (auth.uid() = user_id);
   ```

### 2.4 实现认证系统

1. **创建认证组件**
   - 在`/components/auth`目录下创建登录和注册表单

2. **设置认证页面**
   - 在`/pages/auth`创建登录和注册页面
   - 使用Supabase Auth实现认证功能:

   ```jsx
   // pages/auth/login.js
   import { useState } from 'react'
   import { supabase } from '../../lib/supabase'
   
   export default function Login() {
     const [email, setEmail] = useState('')
     const [password, setPassword] = useState('')
     const [loading, setLoading] = useState(false)
     const [error, setError] = useState(null)
     
     async function handleLogin(e) {
       e.preventDefault()
       setLoading(true)
       setError(null)
       
       const { error } = await supabase.auth.signInWithPassword({
         email,
         password,
       })
       
       if (error) {
         setError(error.message)
       } else {
         window.location.href = '/dashboard'
       }
       
       setLoading(false)
     }
     
     return (
       // 登录表单界面
     )
   }
   ```

### 2.5 数据迁移

1. **编写迁移脚本**
   - 创建一个页面，允许用户从localStorage导入数据到Supabase

   ```jsx
   // pages/import.js
   import { useState } from 'react'
   import { supabase } from '../lib/supabase'
   
   export default function ImportData() {
     const [importing, setImporting] = useState(false)
     const [message, setMessage] = useState('')
     
     async function importFromLocalStorage() {
       setImporting(true)
       
       try {
         // 从localStorage获取数据
         const userData = {
           completedTasks: JSON.parse(localStorage.getItem('completedTasks') || '[]'),
           learningHistory: JSON.parse(localStorage.getItem('learningHistory') || '[]'),
           userLevel: localStorage.getItem('userLevel') || '1',
           userExp: localStorage.getItem('userExp') || '0',
           codePoints: localStorage.getItem('codePoints') || '50',
           streakDays: localStorage.getItem('streakDays') || '0',
         }
         
         const user = supabase.auth.user()
         
         // 更新用户记录
         await supabase.from('users').upsert({
           id: user.id,
           level: parseInt(userData.userLevel),
           exp: parseInt(userData.userExp),
           points: parseInt(userData.codePoints),
           streak: parseInt(userData.streakDays)
         })
         
         // 导入任务完成记录
         for (const task of userData.completedTasks) {
           // 查找或创建任务
           const { data: taskData } = await supabase
             .from('tasks')
             .select('id')
             .eq('title', task.title)
             .single()
           
           let taskId
           if (taskData) {
             taskId = taskData.id
           } else {
             const { data: newTask } = await supabase
               .from('tasks')
               .insert({
                 title: task.title,
                 exp_reward: task.expValue,
                 points_reward: task.pointsValue
               })
               .single()
             
             taskId = newTask.id
           }
           
           // 添加用户任务记录
           await supabase.from('user_tasks').insert({
             user_id: user.id,
             task_id: taskId,
             progress: 100,
             is_completed: true,
             completed_at: new Date(task.completedAt).toISOString()
           })
           
           // 记录到日志
           await supabase.from('logs').insert({
             user_id: user.id,
             task_id: taskId,
             action: 'complete_task',
             exp_change: task.expValue,
             points_change: task.pointsValue
           })
         }
         
         setMessage('数据导入成功！')
       } catch (error) {
         console.error('导入错误:', error)
         setMessage(`导入失败: ${error.message}`)
       }
       
       setImporting(false)
     }
     
     return (
       // 导入界面
     )
   }
   ```

### 2.6 部署到Vercel

1. **准备项目**
   - 确保项目在GitHub上

2. **Vercel部署**
   - 前往 [Vercel](https://vercel.com/) 注册账户
   - 导入GitHub仓库
   - 配置环境变量 (Supabase URL和密钥)
   - 点击部署

3. **配置域名 (可选)**
   - 在Vercel仪表板中添加自定义域名
   - 根据指示配置DNS

### 2.7 数据与逻辑迁移

1. **用户数据存储**
   - 使用Supabase Auth代替localStorage存储用户认证状态
   - 使用Supabase数据库替代localStorage存储学习进度

2. **API开发**
   - 使用Next.js API Routes实现后端逻辑:

   ```jsx
   // pages/api/tasks/complete.js
   import { supabase } from '../../../lib/supabase'
   
   export default async function handler(req, res) {
     if (req.method !== 'POST') {
       return res.status(405).json({ error: '方法不允许' })
     }
     
     // 验证用户
     const { user } = await supabase.auth.api.getUserByCookie(req)
     if (!user) {
       return res.status(401).json({ error: '未授权' })
     }
     
     const { taskId } = req.body
     
     // 事务处理
     try {
       // 1. 获取任务信息
       const { data: task } = await supabase
         .from('tasks')
         .select('*')
         .eq('id', taskId)
         .single()
       
       if (!task) {
         return res.status(404).json({ error: '任务不存在' })
       }
       
       // 2. 更新用户任务进度
       await supabase
         .from('user_tasks')
         .upsert({
           user_id: user.id,
           task_id: taskId,
           progress: 100,
           is_completed: true,
           completed_at: new Date().toISOString()
         })
       
       // 3. 更新用户经验和点数
       const { data: userData } = await supabase
         .from('users')
         .select('level, exp, points')
         .eq('id', user.id)
         .single()
       
       let newExp = userData.exp + task.exp_reward
       let newLevel = userData.level
       let leveledUp = false
       
       // 处理升级逻辑
       if (newExp >= 100) {
         newLevel += 1
         newExp -= 100
         leveledUp = true
       }
       
       await supabase
         .from('users')
         .update({
           level: newLevel,
           exp: newExp,
           points: userData.points + task.points_reward
         })
         .eq('id', user.id)
       
       // 4. 记录行为日志
       await supabase
         .from('logs')
         .insert({
           user_id: user.id,
           task_id: taskId,
           action: 'complete_task',
           exp_change: task.exp_reward,
           points_change: task.points_reward
         })
       
       return res.status(200).json({
         success: true,
         leveledUp,
         newLevel,
         newExp,
         pointsGained: task.points_reward
       })
     } catch (error) {
       console.error('任务完成错误:', error)
       return res.status(500).json({ error: '服务器错误' })
     }
   }
   ```

## 3. 其他服务器端部署方案 (可选方案)

如果因为特殊需求不希望使用Vercel+Supabase组合，也可以考虑以下方案。

### 3.1 Firebase 集成 (轻量级方案)

1. **创建Firebase项目**
   - 访问 [Firebase控制台](https://console.firebase.google.com/) 创建项目
   - 启用Authentication和Firestore服务

2. **安装Firebase SDK**
   ```bash
   # 安装Firebase工具
   npm install -g firebase-tools
   
   # 登录Firebase
   firebase login
   
   # 初始化Firebase项目
   firebase init
   ```

3. **修改代码集成Firebase**
   - 在`index.html`头部添加Firebase SDK：
   ```html
   <!-- Firebase SDK -->
   <script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js"></script>
   <script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js"></script>
   <script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"></script>
   
   <!-- 初始化Firebase -->
   <script>
     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "your-app.firebaseapp.com",
       projectId: "your-app",
       storageBucket: "your-app.appspot.com",
       messagingSenderId: "YOUR_SENDER_ID",
       appId: "YOUR_APP_ID"
     };
     firebase.initializeApp(firebaseConfig);
   </script>
   ```

4. **修改数据存储逻辑**
   - 创建`firebase-auth.js`文件实现认证功能
   - 创建`firebase-db.js`文件实现数据存储功能
   - 修改现有的localStorage操作，添加Firebase备份功能

5. **部署到Firebase Hosting**
   ```bash
   firebase deploy
   ```

### 3.2 Node.js + MongoDB 部署 (完整解决方案)

1. **创建后端API**
   - 使用Express.js创建REST API
   - 使用MongoDB存储用户数据
   - 实现用户认证、数据同步等功能

2. **前端代码修改**
   - 创建API客户端封装数据操作
   - 修改现有代码，使用API进行数据存取

3. **后端部署**
   - 在Heroku、Render或其他云服务上部署Node.js应用
   - 使用MongoDB Atlas作为数据库服务

4. **前端部署**
   - 按照静态网站部署方式部署前端代码
   - 配置API端点指向后端服务器

## 4. 安全建议

1. **数据备份**
   - 定期提醒用户导出数据
   - 使用Supabase或其他服务端存储时，设置自动备份机制

2. **隐私保护**
   - 添加隐私政策说明用户数据的使用方式
   - 只收集必要的用户信息

3. **安全措施**
   - 使用HTTPS确保传输安全
   - 正确设置RLS (Row Level Security) 策略
   - 实施JWT令牌刷新机制

## 5. 域名与SSL

1. **购买域名**
   - 通过Namecheap、GoDaddy等注册商购买域名

2. **配置DNS**
   - 将域名指向Vercel或其他托管服务

3. **设置SSL**
   - Vercel、Netlify等服务会自动提供SSL证书
   - 如使用自己的服务器，可以使用Let's Encrypt获取免费SSL证书

## 6. 性能优化

1. **代码优化**
   - 利用Next.js的静态生成和服务器端渲染功能
   - 实现代码分割和懒加载
   - 优化图片大小和格式，使用Next.js的Image组件

2. **CDN加速**
   - Vercel内置全球CDN分发
   - 对于静态资源，考虑使用额外的CDN服务

---

## 选择指南

根据您的需求选择合适的部署方案：

1. **静态网站部署** - 仅适合个人使用，数据只存储在本地浏览器中
2. **Next.js + Supabase + Vercel** - 推荐方案，功能完整，易于扩展，开发体验好
3. **Firebase方案** - 适合小型应用，开发简单，有Google的支持
4. **Node.js + MongoDB** - 完全自定义解决方案，适合有特殊需求的项目

对于大多数情况，我们强烈推荐使用Next.js + Supabase + Vercel组合，它提供了最佳的开发体验和性能。 