// 测试Supabase连接
import { createClient } from '@supabase/supabase-js';

// 使用与应用相同的Supabase配置
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabaseConnection() {
  console.log('测试Supabase连接...');
  
  try {
    // 测试基本连接
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Supabase连接失败:', error);
    } else {
      console.log('Supabase连接成功!');
      console.log('获取到的数据:', data);
    }
  } catch (error) {
    console.error('测试Supabase连接时出错:', error);
  }
}

async function testLogin(email, password) {
  console.log(`测试登录: ${email}`);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });
    
    if (error) {
      console.error('登录失败:', error);
    } else {
      console.log('登录成功!');
      console.log('用户信息:', data.user);
    }
  } catch (error) {
    console.error('测试登录时出错:', error);
  }
}

// 运行测试
testSupabaseConnection();

// 测试登录（需要提供实际的邮箱和密码）
// testLogin('test@example.com', 'password123');
