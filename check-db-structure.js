import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dnaxucsackajzgzyuwuk.supabase.co'
const supabaseAnonKey = 'sb_publishable_PcGgu4NmxJzu6RUwQqnmbg_8HsKNpdW'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkDatabaseStructure() {
  try {
    // 尝试查询一些常见的表名
    const tablesToCheck = ['templates', 'exercises', 'workouts', 'workout_records']
    
    for (const tableName of tablesToCheck) {
      console.log(`\nChecking table: ${tableName}`)
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(5)

        if (error) {
          console.log(`Error fetching data: ${error.message}`)
        } else {
          console.log(`Data found: ${data.length} records`)
          console.log(JSON.stringify(data, null, 2))
        }
      } catch (e) {
        console.log(`Error querying ${tableName}: ${e.message}`)
      }
    }

    // 尝试创建模板表（如果不存在）
    console.log('\nAttempting to create templates table if not exists...')
    try {
      const { error: createError } = await supabase
        .from('templates')
        .insert([
          {
            id: 'beginner',
            name: '基础健身模板',
            description: '适合健身新手，包含基础动作和循序渐进的训练计划',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20fitness%20technology%20beginner%20workout%20blue%20cyberpunk%20style&image_size=landscape_16_9',
            exercises: JSON.stringify([
              { name: '标准俯卧撑', sets: 3, reps: '10-15' },
              { name: '卷腹', sets: 3, reps: '15-20' },
              { name: '平板支撑', sets: 3, duration: '30-45秒' },
              { name: '深蹲', sets: 3, reps: '12-15' },
              { name: '弓步蹲', sets: 3, reps: '10-12', note: '每侧' },
              { name: '臀桥', sets: 3, reps: '15-20' }
            ])
          },
          {
            id: 'fat-loss',
            name: '减脂专项模板',
            description: '专注于减脂，结合有氧运动和力量训练',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20fitness%20technology%20fat%20loss%20workout%20green%20cyberpunk%20style&image_size=landscape_16_9',
            exercises: JSON.stringify([
              { name: '高抬腿', sets: 4, duration: '30秒' },
              { name: '开合跳', sets: 4, duration: '30秒' },
              { name: '俯卧撑', sets: 3, reps: '12-15' },
              { name: '登山跑', sets: 4, duration: '30秒' },
              { name: '深蹲跳', sets: 3, reps: '10-12' },
              { name: '平板支撑', sets: 3, duration: '45-60秒' }
            ])
          }
        ])

      if (createError) {
        console.log(`Error creating templates: ${createError.message}`)
      } else {
        console.log('Templates created successfully!')
      }
    } catch (e) {
      console.log(`Error creating templates table: ${e.message}`)
    }

  } catch (error) {
    console.error('Error checking database structure:', error)
  }
}

checkDatabaseStructure()
