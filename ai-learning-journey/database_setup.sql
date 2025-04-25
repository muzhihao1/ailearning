-- 在Supabase中设置必要的数据库表
-- 注意：auth.users表由Supabase自动创建和管理，不需要我们创建

-- 创建用户资料表，与auth.users表关联
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  level INTEGER DEFAULT 1,
  exp INTEGER DEFAULT 0,
  points INTEGER DEFAULT 50,
  streak INTEGER DEFAULT 0,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 为profiles表设置RLS (Row Level Security)策略
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 创建公开访问策略 - 允许所有人读取profiles
CREATE POLICY "允许公开访问profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (true);

-- 创建个人访问策略 - 用户只能修改自己的profile
CREATE POLICY "用户可以修改自己的profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- 创建插入策略 - 用户可以为自己创建profile
CREATE POLICY "用户可以创建自己的profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- 创建任务表
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  phase TEXT,
  difficulty TEXT,
  exp_reward INTEGER DEFAULT 10,
  points_reward INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 创建用户任务进度表
CREATE TABLE IF NOT EXISTS public.user_tasks (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  task_id UUID REFERENCES public.tasks(id) NOT NULL,
  progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, task_id)
);

-- 为用户任务表设置RLS策略
ALTER TABLE public.user_tasks ENABLE ROW LEVEL SECURITY;

-- 用户只能读取自己的任务进度
CREATE POLICY "用户可以读取自己的任务进度" 
  ON public.user_tasks 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- 用户只能更新自己的任务进度
CREATE POLICY "用户可以更新自己的任务进度" 
  ON public.user_tasks 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- 用户只能插入自己的任务进度
CREATE POLICY "用户可以插入自己的任务进度" 
  ON public.user_tasks 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- 创建活动日志表
CREATE TABLE IF NOT EXISTS public.logs (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  task_id UUID REFERENCES public.tasks(id),
  action TEXT NOT NULL,
  exp_change INTEGER,
  points_change INTEGER,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 为日志表设置RLS策略
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

-- 用户只能读取自己的日志
CREATE POLICY "用户可以读取自己的日志" 
  ON public.logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- 用户只能插入自己的日志
CREATE POLICY "用户可以插入自己的日志" 
  ON public.logs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- 在Supabase dashboard > SQL Editor中运行此脚本
-- 运行后，在Authentication > Settings中确认已启用邮箱登录 