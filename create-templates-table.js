import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dnaxucsackajzgzyuwuk.supabase.co'
const supabaseAnonKey = 'sb_publishable_PcGgu4NmxJzu6RUwQqnmbg_8HsKNpdW'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createTemplatesTable() {
  try {
    // 创建 templates 表
    const { error: createTableError } = await supabase
      .rpc('execute_sql', {
        sql: `
        CREATE TABLE IF NOT EXISTS templates (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          image TEXT NOT NULL,
          exercises JSONB NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        );
        `
      })

    if (createTableError) {
      console.error('创建表失败:', createTableError)
      return
    }

    console.log('Templates 表创建成功!')

    // 插入默认模板数据
    const defaultTemplates = [
      {
        id: 'beginner',
        name: '基础健身模板',
        description: '适合健身新手，包含基础动作和循序渐进的训练计划',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20fitness%20technology%20beginner%20workout%20blue%20cyberpunk%20style&image_size=landscape_16_9',
        exercises: [
          { name: '标准俯卧撑', sets: 3, reps: '10-15' },
          { name: '卷腹', sets: 3, reps: '15-20' },
          { name: '平板支撑', sets: 3, duration: '30-45秒' },
          { name: '深蹲', sets: 3, reps: '12-15' },
          { name: '弓步蹲', sets: 3, reps: '10-12', note: '每侧' },
          { name: '臀桥', sets: 3, reps: '15-20' }
        ]
      },
      {
        id: 'fat-loss',
        name: '减脂专项模板',
        description: '专注于减脂，结合有氧运动和力量训练',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20fitness%20technology%20fat%20loss%20workout%20green%20cyberpunk%20style&image_size=landscape_16_9',
        exercises: [
          { name: '高抬腿', sets: 4, duration: '30秒' },
          { name: '开合跳', sets: 4, duration: '30秒' },
          { name: '俯卧撑', sets: 3, reps: '12-15' },
          { name: '登山跑', sets: 4, duration: '30秒' },
          { name: '深蹲跳', sets: 3, reps: '10-12' },
          { name: '平板支撑', sets: 3, duration: '45-60秒' }
        ]
      },
      {
        id: 'muscle-gain',
        name: '增肌强化模板',
        description: '针对增肌目标，包含大重量训练和营养建议',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20fitness%20technology%20muscle%20gain%20workout%20purple%20cyberpunk%20style&image_size=landscape_16_9',
        exercises: [
          { name: '卧推', sets: 4, reps: '8-10', note: '逐渐增加重量' },
          { name: '硬拉', sets: 4, reps: '6-8', note: '保持正确姿势' },
          { name: '深蹲', sets: 4, reps: '8-10', note: '大重量' },
          { name: '引体向上', sets: 4, reps: '6-8', note: '可使用助力带' },
          { name: '哑铃弯举', sets: 3, reps: '10-12' },
          { name: '三头下压', sets: 3, reps: '10-12' }
        ]
      },
      {
        id: 'body-shaping',
        name: '全身塑形模板',
        description: '塑造全身线条，提升整体体态',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20fitness%20technology%20body%20shaping%20workout%20orange%20cyberpunk%20style&image_size=landscape_16_9',
        exercises: [
          { name: '侧平板支撑', sets: 3, duration: '30-45秒', note: '每侧' },
          { name: '哑铃肩推', sets: 3, reps: '12-15' },
          { name: '罗马尼亚硬拉', sets: 3, reps: '12-15' },
          { name: '仰卧起坐', sets: 3, reps: '20-25' },
          { name: '侧平举', sets: 3, reps: '12-15' },
          { name: '单腿臀桥', sets: 3, reps: '10-12', note: '每侧' }
        ]
      }
    ]

    for (const template of defaultTemplates) {
      const { error: insertError } = await supabase
        .from('templates')
        .insert({
          id: template.id,
          name: template.name,
          description: template.description,
          image: template.image,
          exercises: template.exercises
        })

      if (insertError) {
        console.error(`插入模板 ${template.name} 失败:`, insertError)
      } else {
        console.log(`模板 ${template.name} 插入成功!`)
      }
    }

  } catch (error) {
    console.error('创建表和插入数据失败:', error)
  }
}

createTemplatesTable()
