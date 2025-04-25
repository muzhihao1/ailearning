import { createClient } from '@supabase/supabase-js';

// 默认使用环境变量，但也提供回退值用于测试
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://project-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'public-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 