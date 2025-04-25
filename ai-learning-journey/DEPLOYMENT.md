# AI学习之旅 - 部署总结

本文档提供从开发环境到生产环境的完整部署流程。

## 1. 环境准备

### 1.1 安装依赖

确保你已安装以下工具：
- Node.js (v14.x 或更高版本)
- npm 或 yarn
- Git

### 1.2 Supabase项目设置

1. 前往 [Supabase](https://supabase.com/) 创建账户
2. 创建新项目
3. 记下项目URL和anon密钥（在项目设置 -> API中）

### 1.3 数据库设置

在Supabase的SQL编辑器中执行以下SQL脚本来创建所需的表：

```sql
-- 用户表
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

-- 任务表
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

-- 用户任务表
CREATE TABLE user_tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  task_id UUID REFERENCES tasks(id),
  progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 日志表
CREATE TABLE logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  task_id UUID REFERENCES tasks(id),
  action TEXT,
  exp_change INTEGER,
  points_change INTEGER,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户成就表
CREATE TABLE user_achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 设置RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- 用户只能查看和编辑自己的数据
CREATE POLICY "Users can view own data" 
  ON users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" 
  ON users FOR UPDATE USING (auth.uid() = id);

-- 任务表对所有人可读
CREATE POLICY "Tasks are viewable by everyone" 
  ON tasks FOR SELECT USING (true);

-- 用户任务表策略
CREATE POLICY "Users can view own tasks" 
  ON user_tasks FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks" 
  ON user_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" 
  ON user_tasks FOR UPDATE USING (auth.uid() = user_id);

-- 用户日志策略
CREATE POLICY "Users can view own logs" 
  ON logs FOR SELECT USING (auth.uid() = user_id);

-- 用户成就策略
CREATE POLICY "Users can view own achievements" 
  ON user_achievements FOR SELECT USING (auth.uid() = user_id);

-- 创建更新登录连续天数的函数
CREATE OR REPLACE FUNCTION update_login_streak(user_id UUID)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_data RECORD;
  today DATE := CURRENT_DATE;
  last_login_date DATE;
  day_diff INTEGER;
  new_streak INTEGER;
  updated BOOLEAN := FALSE;
BEGIN
  -- 获取用户数据
  SELECT streak, last_login INTO user_data
  FROM users
  WHERE id = user_id;
  
  -- 初始化条件
  new_streak := COALESCE(user_data.streak, 0);
  
  IF user_data.last_login IS NOT NULL THEN
    last_login_date := user_data.last_login::DATE;
    day_diff := today - last_login_date;
    
    IF day_diff = 1 THEN
      -- 连续登录
      new_streak := new_streak + 1;
      updated := TRUE;
    ELSIF day_diff > 1 THEN
      -- 中断了连续登录
      new_streak := 1;
      updated := TRUE;
    ELSIF day_diff = 0 THEN
      -- 今天已经登录过了
      updated := FALSE;
    END IF;
  ELSE
    -- 第一次登录
    new_streak := 1;
    updated := TRUE;
  END IF;
  
  -- 更新用户streak
  IF updated THEN
    UPDATE users
    SET streak = new_streak, last_login = NOW()
    WHERE id = user_id;
  END IF;
  
  RETURN json_build_object(
    'streak', new_streak,
    'updated', updated
  );
END;
$$;
```

## 2. 本地开发设置

### 2.1 克隆仓库

```bash
git clone https://github.com/yourusername/ai-learning-journey.git
cd ai-learning-journey
```

### 2.2 安装依赖

```bash
npm install
# 或
yarn install
```

### 2.3 配置环境变量

创建`.env.local`文件，内容如下：

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

将URL和密钥替换为你的Supabase项目信息。

### 2.4 运行开发服务器

```bash
npm run dev
# 或
yarn dev
```

现在可以访问 http://localhost:3000 查看你的应用。

## 3. 部署到Vercel

### 3.1 准备GitHub仓库

```bash
# 如果尚未初始化Git仓库
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "准备部署到Vercel"

# 添加GitHub远程仓库
git remote add origin https://github.com/yourusername/ai-learning-journey.git

# 推送代码到GitHub
git push -u origin main
```

### 3.2 Vercel部署步骤

1. 前往 [Vercel](https://vercel.com/) 注册或登录
2. 点击"New Project"
3. 导入你的GitHub仓库
4. 配置项目:
   - 框架预设: Next.js
   - 根目录: 保持默认
   - 环境变量: 添加与`.env.local`相同的环境变量
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
5. 点击"Deploy"按钮

### 3.3 自定义域名设置 (可选)

1. 在Vercel项目仪表板中，点击"Settings" -> "Domains"
2. 添加你的自定义域名
3. 按照Vercel提供的说明配置DNS记录
4. 等待DNS传播完成（通常需要几分钟到几小时）

## 4. 数据迁移

如果有需要从localStorage迁移的用户，访问 `https://your-domain.com/import-data` 页面，按照指引导入数据。

## 5. 持续集成/持续部署

GitHub仓库与Vercel的集成会自动触发部署：

- 当有新的提交推送到主分支时，Vercel会自动部署更新
- 可以为每个PR创建预览部署

## 6. 维护与更新

### 6.1 添加新任务

在Supabase控制台的`tasks`表中添加新记录即可。

### 6.2 数据库备份

定期通过Supabase界面备份数据库，或设置自动备份。

### 6.3 代码更新

按照正常的Git工作流程更新代码：

```bash
# 拉取最新代码
git pull

# 创建新分支进行修改
git checkout -b feature/new-feature

# 提交修改
git add .
git commit -m "添加新功能"

# 推送到GitHub
git push origin feature/new-feature

# 在GitHub创建Pull Request
# 合并后Vercel会自动部署
```

## 7. 故障排除

### 7.1 Supabase连接问题

- 检查环境变量是否正确
- 确认Supabase项目是否处于活动状态
- 验证RLS策略是否配置正确

### 7.2 Vercel部署失败

- 检查构建日志查找错误
- 确保package.json中的依赖正确
- 验证Next.js配置文件

### 7.3 常见错误

- 401 Unauthorized: 检查Supabase身份验证
- 404 Not Found: 检查路由和页面文件是否存在
- 500 Server Error: 检查服务器端API路由代码
