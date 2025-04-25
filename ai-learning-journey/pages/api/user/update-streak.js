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

  try {
    // 获取用户当前streak信息
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('streak, last_login')
      .eq('id', session.user.id)
      .single();
    
    if (userError) {
      throw new Error('获取用户信息失败');
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
      } else if (dayDiff === 0) {
        // 今天已经登录过了，不更新streak
        streakUpdated = false;
      }
    } else {
      // 第一次登录
      streak = 1;
      streakUpdated = true;
    }
    
    if (streakUpdated) {
      // 更新用户streak信息
      const { error: updateError } = await supabase
        .from('users')
        .update({
          streak: streak,
          last_login: new Date().toISOString()
        })
        .eq('id', session.user.id);
      
      if (updateError) {
        throw new Error('更新streak信息失败');
      }
      
      // 检查是否有连续登录成就
      let achievementUnlocked = null;
      
      if (streak === 7) {
        // 一周连续登录成就
        achievementUnlocked = {
          id: 'streak_7',
          name: '坚持不懈',
          description: '连续学习7天',
          icon: 'fa-fire'
        };
      } else if (streak === 30) {
        // 一个月连续登录成就
        achievementUnlocked = {
          id: 'streak_30',
          name: '学习达人',
          description: '连续学习30天',
          icon: 'fa-calendar-check'
        };
      }
      
      // 如果解锁了成就，记录到成就表中
      if (achievementUnlocked) {
        await supabase
          .from('user_achievements')
          .insert({
            user_id: session.user.id,
            achievement_id: achievementUnlocked.id,
            unlocked_at: new Date().toISOString()
          });
      }
      
      return res.status(200).json({
        success: true,
        streak,
        streakUpdated,
        achievementUnlocked
      });
    } else {
      return res.status(200).json({
        success: true,
        streak,
        streakUpdated: false
      });
    }
  } catch (error) {
    console.error('更新streak错误:', error);
    return res.status(500).json({ 
      error: '服务器错误',
      message: error.message 
    });
  }
} 