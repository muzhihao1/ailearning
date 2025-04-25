import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('缺少Supabase环境变量。请确保您在.env.local文件中设置了NEXT_PUBLIC_SUPABASE_URL和NEXT_PUBLIC_SUPABASE_ANON_KEY。');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 用户相关函数
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('获取用户资料错误:', error);
    return null;
  }

  return data;
}

// 任务相关函数
export async function getUserTasks(userId) {
  const { data, error } = await supabase
    .from('user_tasks')
    .select(`
      *,
      task:tasks(*)
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('获取用户任务错误:', error);
    return [];
  }

  return data;
}

export async function completeTask(userId, taskId) {
  // 获取任务信息
  const { data: task, error: taskError } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .single();

  if (taskError) {
    console.error('获取任务信息错误:', taskError);
    return { success: false, error: '获取任务信息失败' };
  }

  // 更新用户任务进度
  const { error: updateError } = await supabase
    .from('user_tasks')
    .upsert({
      user_id: userId,
      task_id: taskId,
      progress: 100,
      is_completed: true,
      completed_at: new Date().toISOString()
    });

  if (updateError) {
    console.error('更新任务进度错误:', updateError);
    return { success: false, error: '更新任务进度失败' };
  }

  // 获取用户信息
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('level, exp, points')
    .eq('id', userId)
    .single();

  if (userError) {
    console.error('获取用户信息错误:', userError);
    return { success: false, error: '获取用户信息失败' };
  }

  // 计算新的经验值和等级
  let newExp = userData.exp + task.exp_reward;
  let newLevel = userData.level;
  let leveledUp = false;

  // 处理升级逻辑
  if (newExp >= 100) {
    newLevel += 1;
    newExp -= 100;
    leveledUp = true;
  }

  // 更新用户经验和点数
  const { error: updateUserError } = await supabase
    .from('users')
    .update({
      level: newLevel,
      exp: newExp,
      points: userData.points + task.points_reward
    })
    .eq('id', userId);

  if (updateUserError) {
    console.error('更新用户信息错误:', updateUserError);
    return { success: false, error: '更新用户信息失败' };
  }

  // 记录行为日志
  const { error: logError } = await supabase
    .from('logs')
    .insert({
      user_id: userId,
      task_id: taskId,
      action: 'complete_task',
      exp_change: task.exp_reward,
      points_change: task.points_reward
    });

  if (logError) {
    console.error('添加日志记录错误:', logError);
    // 日志错误不影响操作结果
  }

  return {
    success: true,
    leveledUp,
    newLevel,
    newExp,
    pointsGained: task.points_reward
  };
}

// 连续学习（streak）相关函数
export async function updateStreak(userId) {
  // 获取用户当前streak信息
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('streak, last_login')
    .eq('id', userId)
    .single();

  if (userError) {
    console.error('获取用户信息错误:', userError);
    return { success: false, error: '获取用户信息失败' };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let streak = userData.streak || 0;
  let streakUpdated = false;
  let lastLogin = userData.last_login ? new Date(userData.last_login) : null;
  
  if (lastLogin) {
    lastLogin.setHours(0, 0, 0, 0);
    const timeDiff = today.getTime() - lastLogin.getTime();
    const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    
    if (dayDiff === 1) {
      // 连续登录
      streak += 1;
      streakUpdated = true;
    } else if (dayDiff > 1) {
      // 中断了连续登录
      streak = 1;
      streakUpdated = true;
    }
  } else {
    // 第一次登录
    streak = 1;
    streakUpdated = true;
  }

  // 更新用户streak信息
  const { error: updateError } = await supabase
    .from('users')
    .update({
      streak: streak,
      last_login: new Date().toISOString()
    })
    .eq('id', userId);

  if (updateError) {
    console.error('更新streak信息错误:', updateError);
    return { success: false, error: '更新streak信息失败' };
  }

  return {
    success: true,
    streak,
    streakUpdated
  };
}

// 数据迁移相关函数
export async function importLocalStorageData(userId) {
  if (typeof window === 'undefined') {
    return { success: false, error: '只能在浏览器环境中执行' };
  }

  try {
    // 获取localStorage数据
    const userData = {
      completedTasks: JSON.parse(localStorage.getItem('completedTasks') || '[]'),
      learningHistory: JSON.parse(localStorage.getItem('learningHistory') || '[]'),
      userLevel: localStorage.getItem('userLevel') || '1',
      userExp: localStorage.getItem('userExp') || '0',
      codePoints: localStorage.getItem('codePoints') || '50',
      streakDays: localStorage.getItem('streakDays') || '0',
    };

    // 更新用户记录
    const { error: userUpdateError } = await supabase
      .from('users')
      .upsert({
        id: userId,
        level: parseInt(userData.userLevel),
        exp: parseInt(userData.userExp),
        points: parseInt(userData.codePoints),
        streak: parseInt(userData.streakDays)
      });

    if (userUpdateError) {
      console.error('更新用户信息错误:', userUpdateError);
      return { success: false, error: '更新用户信息失败' };
    }

    // 导入任务完成记录
    let tasksImported = 0;
    for (const task of userData.completedTasks) {
      // 查找或创建任务
      let taskId;
      const { data: existingTask } = await supabase
        .from('tasks')
        .select('id')
        .eq('title', task.title)
        .single();

      if (existingTask) {
        taskId = existingTask.id;
      } else {
        const { data: newTask, error: taskError } = await supabase
          .from('tasks')
          .insert({
            title: task.title,
            exp_reward: task.expValue || 30,
            points_reward: task.pointsValue || 20
          })
          .select('id')
          .single();

        if (taskError) {
          console.error('创建任务错误:', taskError);
          continue;
        }

        taskId = newTask.id;
      }

      // 添加用户任务记录
      const { error: userTaskError } = await supabase
        .from('user_tasks')
        .insert({
          user_id: userId,
          task_id: taskId,
          progress: 100,
          is_completed: true,
          completed_at: new Date(task.completedAt || Date.now()).toISOString()
        });

      if (userTaskError) {
        console.error('添加用户任务记录错误:', userTaskError);
        continue;
      }

      // 记录到日志
      await supabase
        .from('logs')
        .insert({
          user_id: userId,
          task_id: taskId,
          action: 'import_task',
          exp_change: task.expValue || 0,
          points_change: task.pointsValue || 0
        });

      tasksImported++;
    }

    return {
      success: true,
      tasksImported,
      message: `成功导入 ${tasksImported} 个任务记录`
    };
  } catch (error) {
    console.error('导入数据错误:', error);
    return { success: false, error: error.message };
  }
} 