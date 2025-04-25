-- 初始化基本任务数据
-- 第1阶段任务
INSERT INTO tasks (title, description, phase, stage, exp_reward, points_reward, total_steps)
VALUES
  ('Python环境搭建与基础语法', '安装Python环境，学习变量、数据类型和基本运算', 1, 'basic', 30, 20, 5),
  ('Python控制流与函数', '学习条件语句、循环和函数定义与调用', 1, 'basic', 35, 25, 4),
  ('Python数据结构与算法', '掌握列表、元组、字典等数据结构及常用算法', 1, 'basic', 40, 30, 6),
  ('Python文件操作与异常处理', '学习文件读写、异常捕获与处理', 1, 'basic', 40, 30, 3),
  ('面向对象编程', '类与对象、继承、多态和封装', 1, 'basic', 45, 35, 5),
  ('Python模块与包', '模块导入、创建和使用第三方库', 1, 'basic', 50, 40, 4);

-- 第2阶段任务
INSERT INTO tasks (title, description, phase, stage, exp_reward, points_reward, total_steps)
VALUES
  ('NumPy基础', '数值计算与数组操作', 2, 'intermediate', 50, 40, 5),
  ('Pandas数据分析', '数据读取、清洗与预处理', 2, 'intermediate', 55, 45, 6),
  ('数据可视化', 'Matplotlib与Seaborn可视化库', 2, 'intermediate', 55, 45, 5),
  ('统计学基础', '统计分析与假设检验', 2, 'intermediate', 60, 50, 4),
  ('机器学习算法入门', '监督与无监督学习的基本算法', 2, 'intermediate', 65, 55, 7),
  ('Scikit-learn框架实践', '使用Scikit-learn构建机器学习模型', 2, 'intermediate', 70, 60, 6);

-- 第3阶段任务
INSERT INTO tasks (title, description, phase, stage, exp_reward, points_reward, total_steps)
VALUES
  ('神经网络基础', '神经元、激活函数与反向传播', 3, 'advanced', 70, 60, 5),
  ('TensorFlow基础', 'TensorFlow框架入门与基本操作', 3, 'advanced', 75, 65, 6),
  ('PyTorch基础', 'PyTorch框架入门与基本操作', 3, 'advanced', 75, 65, 6),
  ('卷积神经网络(CNN)', 'CNN架构、图像分类与目标检测', 3, 'advanced', 80, 70, 7),
  ('循环神经网络(RNN)', 'RNN架构与自然语言处理应用', 3, 'advanced', 80, 70, 7),
  ('生成对抗网络(GAN)', 'GAN架构与图像生成应用', 3, 'advanced', 85, 75, 8);

-- 第4阶段任务
INSERT INTO tasks (title, description, phase, stage, exp_reward, points_reward, total_steps)
VALUES
  ('项目规划与设计', '问题定义、目标设定与方案设计', 4, 'project', 80, 70, 3),
  ('数据收集与处理', '数据获取、清洗与特征工程', 4, 'project', 85, 75, 5),
  ('模型开发与训练', '选择合适的模型架构并进行训练', 4, 'project', 90, 80, 6),
  ('模型优化与评估', '性能评估与模型调优', 4, 'project', 90, 80, 4),
  ('应用部署', '模型集成与Web应用开发', 4, 'project', 95, 85, 5),
  ('项目展示与评估', '项目演示、文档编写与成果评估', 4, 'project', 100, 100, 3);

-- 学习资源表
CREATE TABLE resources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL,
  url TEXT,
  phase INTEGER,
  exp_reward INTEGER DEFAULT 20,
  points_reward INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用资源表Row Level Security
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- 资源表对所有人可读
CREATE POLICY "Resources are viewable by everyone" 
  ON resources FOR SELECT USING (true);

-- 添加一些示例资源
INSERT INTO resources (title, description, resource_type, url, phase, exp_reward, points_reward)
VALUES
  ('Python 数据科学基础', '系统学习Python数据分析的基础知识，包括NumPy、Pandas和Matplotlib等工具库的使用。', 'course', 'https://example.com/course1', 2, 20, 50),
  ('《机器学习实战》', '通过实际案例讲解机器学习算法，从理论到实践的完美结合。', 'book', 'https://example.com/book1', 2, 30, 75),
  ('Kaggle 数据竞赛', '参与实际的数据科学竞赛，提高模型构建和算法应用能力。', 'project', 'https://kaggle.com', 2, 50, 100),
  ('AI研究社区', '与全球AI爱好者交流，分享学习心得，解决技术难题。', 'community', 'https://example.com/community', null, 15, 25),
  ('TensorFlow官方教程', '学习TensorFlow的各种模型和应用场景', 'course', 'https://tensorflow.org/tutorials', 3, 35, 60),
  ('深度学习入门', '通过简单的例子讲解深度学习的基本概念和应用', 'book', 'https://example.com/book2', 3, 30, 50);

-- 成就表
CREATE TABLE achievements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  condition TEXT,
  points_reward INTEGER DEFAULT 0,
  img_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用成就表Row Level Security
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- 成就表对所有人可读
CREATE POLICY "Achievements are viewable by everyone" 
  ON achievements FOR SELECT USING (true);

-- 添加一些示例成就
INSERT INTO achievements (id, title, description, condition, points_reward, img_url)
VALUES
  ('python_beginner', 'Python入门', '完成第1阶段的所有任务', 'phase_1_complete', 200, '/images/badges/python_beginner.png'),
  ('data_scientist', '数据科学师', '完成第2阶段的所有任务', 'phase_2_complete', 300, '/images/badges/data_scientist.png'),
  ('deep_learning_expert', '深度学习专家', '完成第3阶段的所有任务', 'phase_3_complete', 500, '/images/badges/deep_learning_expert.png'),
  ('ai_builder', 'AI构建师', '完成第4阶段的所有任务', 'phase_4_complete', 1000, '/images/badges/ai_builder.png'),
  ('streak_7', '坚持一周', '连续学习7天', 'streak_7', 100, '/images/badges/streak_7.png'),
  ('streak_30', '月度学霸', '连续学习30天', 'streak_30', 300, '/images/badges/streak_30.png'),
  ('streak_100', '百日成习', '连续学习100天', 'streak_100', 1000, '/images/badges/streak_100.png'),
  ('first_task', '起步', '完成第一个任务', 'first_task', 50, '/images/badges/first_task.png');

-- 创建函数：检查并授予成就
CREATE OR REPLACE FUNCTION check_and_grant_achievement(user_id UUID, achievement_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  already_granted BOOLEAN;
  points INTEGER;
BEGIN
  -- 检查是否已获得该成就
  SELECT EXISTS (
    SELECT 1 FROM user_achievements 
    WHERE user_id = check_and_grant_achievement.user_id 
    AND achievement_id = check_and_grant_achievement.achievement_id
  ) INTO already_granted;
  
  -- 如果已获得，返回false
  IF already_granted THEN
    RETURN FALSE;
  END IF;
  
  -- 获取成就的点数奖励
  SELECT points_reward INTO points 
  FROM achievements 
  WHERE id = achievement_id;
  
  -- 授予成就
  INSERT INTO user_achievements (user_id, achievement_id)
  VALUES (user_id, achievement_id);
  
  -- 增加用户点数
  UPDATE users
  SET points = points + COALESCE(points, 0)
  WHERE id = user_id;
  
  RETURN TRUE;
END;
$$; 