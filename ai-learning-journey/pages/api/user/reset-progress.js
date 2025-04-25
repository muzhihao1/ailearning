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

  const userId = session.user.id;
  const { scope } = req.body || {}; // scope可能是特定阶段 (phase-1, phase-2...) 或 'all'
  
  try {
    // 重置用户数据
    if (scope === 'all') {
      // 重置所有进度，保留用户ID
      const { error: updateError } = await supabase
        .from('users')
        .update({
          level: 1,
          exp: 0,
          points: 50,
          streak: 0
        })
        .eq('id', userId);

      if (updateError) {
        throw new Error('重置用户数据失败：' + updateError.message);
      }
    
      // 删除用户的所有任务进度
      const { error: deleteTasksError } = await supabase
        .from('user_tasks')
        .delete()
        .eq('user_id', userId);
      
      if (deleteTasksError) {
        throw new Error('删除任务进度失败：' + deleteTasksError.message);
      }
      
      // 删除日志数据
      const { error: deleteLogsError } = await supabase
        .from('logs')
        .delete()
        .eq('user_id', userId);
      
      if (deleteLogsError) {
        throw new Error('删除日志数据失败：' + deleteLogsError.message);
      }
      
      return res.status(200).json({ 
        success: true, 
        message: '所有进度已重置'
      });
    } else if (scope && scope.startsWith('phase-')) {
      // 提取阶段号
      const phaseNumber = parseInt(scope.split('-')[1]);
      
      // 获取该阶段的所有任务ID
      const { data: phaseTasks, error: tasksError } = await supabase
        .from('tasks')
        .select('id')
        .eq('phase', phaseNumber);
      
      if (tasksError) {
        throw new Error('获取阶段任务失败：' + tasksError.message);
      }
      
      const taskIds = phaseTasks.map(task => task.id);
      
      if (taskIds.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: '未找到该阶段的任务'
        });
      }
      
      // 删除用户在这个阶段的任务进度
      const { error: deleteTasksError } = await supabase
        .from('user_tasks')
        .delete()
        .eq('user_id', userId)
        .in('task_id', taskIds);
      
      if (deleteTasksError) {
        throw new Error('删除阶段任务进度失败：' + deleteTasksError.message);
      }
      
      return res.status(200).json({ 
        success: true, 
        message: `第${phaseNumber}阶段进度已重置`
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        message: '缺少重置范围参数'
      });
    }
  } catch (error) {
    console.error('重置进度失败:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message
    });
  }
} 