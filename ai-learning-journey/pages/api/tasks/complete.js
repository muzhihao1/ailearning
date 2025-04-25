import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '方法不允许' });
  }
  
  // 初始化Supabase客户端（服务器端）
  const supabase = createServerSupabaseClient({ req, res });
  
  // 验证用户是否已登录
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({ error: '未授权' });
  }

  const { taskId } = req.body;
  
  if (!taskId) {
    return res.status(400).json({ error: '缺少taskId参数' });
  }

  try {
    // 1. 获取任务信息
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();
    
    if (taskError) {
      throw new Error('获取任务信息失败');
    }
    
    if (!task) {
      return res.status(404).json({ error: '任务不存在' });
    }
    
    // 2. 检查任务是否已完成
    const { data: existingTask, error: checkError } = await supabase
      .from('user_tasks')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('task_id', taskId)
      .eq('is_completed', true)
      .single();

    // 如果任务已完成，返回成功但不增加经验值
    if (existingTask) {
      return res.status(200).json({
        success: true,
        message: '任务已经完成过了',
        alreadyCompleted: true
      });
    }
    
    // 3. 更新用户任务进度
    const { error: updateError } = await supabase
      .from('user_tasks')
      .upsert({
        user_id: session.user.id,
        task_id: taskId,
        progress: 100,
        is_completed: true,
        completed_at: new Date().toISOString()
      });
    
    if (updateError) {
      throw new Error('更新任务进度失败');
    }
    
    // 4. 获取用户信息
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('level, exp, points, streak')
      .eq('id', session.user.id)
      .single();
    
    if (userError) {
      throw new Error('获取用户信息失败');
    }
    
    // 5. 计算新的经验值和等级
    let newExp = userData.exp + task.exp_reward;
    let newLevel = userData.level;
    let leveledUp = false;
    
    // 处理升级逻辑
    if (newExp >= 100) {
      newLevel += 1;
      newExp -= 100;
      leveledUp = true;
    }
    
    // 6. 更新用户经验和点数
    const { error: updateUserError } = await supabase
      .from('users')
      .update({
        level: newLevel,
        exp: newExp,
        points: userData.points + task.points_reward
      })
      .eq('id', session.user.id);
    
    if (updateUserError) {
      throw new Error('更新用户信息失败');
    }
    
    // 7. 记录行为日志
    const { error: logError } = await supabase
      .from('logs')
      .insert({
        user_id: session.user.id,
        task_id: taskId,
        action: 'complete_task',
        exp_change: task.exp_reward,
        points_change: task.points_reward,
        timestamp: new Date().toISOString()
      });
    
    if (logError) {
      console.error('添加日志记录错误:', logError);
      // 日志错误不影响操作结果，所以不抛出异常
    }
    
    // 8. 返回成功结果
    return res.status(200).json({
      success: true,
      leveledUp,
      newLevel,
      newExp,
      pointsGained: task.points_reward,
      streak: userData.streak
    });
  } catch (error) {
    console.error('任务完成处理错误:', error);
    return res.status(500).json({ 
      error: '服务器错误',
      message: error.message 
    });
  }
} 