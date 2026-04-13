import { create } from 'zustand'
import { supabase } from '../lib/supabase'

interface UserState {
  user: any | null
  isAdmin: boolean
  isLoading: boolean
  error: string | null
  signUp: (email: string, password: string, name: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  checkAuth: () => Promise<void>
  signInWithWechat: (wechatInfo: any) => Promise<void>
}

export const useUserStore = create<UserState>((set) => ({
  user: typeof window !== 'undefined' && localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  isAdmin: typeof window !== 'undefined' && localStorage.getItem('isAdmin') ? localStorage.getItem('isAdmin') === 'true' : false,
  isLoading: false,
  error: null,
  signUp: async (email, password, name) => {
    set({ isLoading: true, error: null })
    try {
      // 模拟注册成功，保存用户信息到localStorage
      const user = {
        id: 'user_' + Date.now(),
        email: email,
        user_metadata: {
          name: name
        }
      }
      const isAdmin = email.includes('admin') || false
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('isAdmin', isAdmin.toString())
      set({ user, isAdmin, isLoading: false })
    } catch (error) {
      console.error('注册失败:', error)
      set({ error: '注册失败，请稍后重试', isLoading: false })
    }
  },
  signIn: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      // 模拟登录成功，保存用户信息到localStorage
      const user = {
        id: 'user_' + Date.now(),
        email: email,
        user_metadata: {
          name: email.split('@')[0]
        }
      }
      const isAdmin = email.includes('admin') || false
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('isAdmin', isAdmin.toString())
      set({ user, isAdmin, isLoading: false })
    } catch (error) {
      console.error('登录失败:', error)
      set({ error: '登录失败，请稍后重试', isLoading: false })
    }
  },
  signOut: async () => {
    set({ isLoading: true })
    try {
      // 从localStorage移除用户信息
      localStorage.removeItem('user')
      localStorage.removeItem('isAdmin')
      set({ user: null, isAdmin: false, isLoading: false })
    } catch (error) {
      console.error('登出失败:', error)
      set({ user: null, isAdmin: false, isLoading: false })
    }
  },
  checkAuth: async () => {
    set({ isLoading: true })
    try {
      // 从localStorage恢复用户信息
      const storedUser = localStorage.getItem('user')
      const storedIsAdmin = localStorage.getItem('isAdmin')
      if (storedUser) {
        set({ 
          user: JSON.parse(storedUser), 
          isAdmin: storedIsAdmin === 'true', 
          isLoading: false 
        })
      } else {
        set({ user: null, isAdmin: false, isLoading: false })
      }
    } catch (error) {
      console.error('认证检查失败:', error)
      set({ user: null, isAdmin: false, isLoading: false })
    }
  },
  signInWithWechat: async (wechatInfo) => {
    set({ isLoading: true, error: null })
    try {
      // 这里需要实现微信登录逻辑
      // 实际项目中会使用微信开放平台的API
      // 这里模拟登录成功
      const user = {
        id: 'wechat_' + wechatInfo.openid,
        email: wechatInfo.openid + '@wechat.com',
        user_metadata: {
          name: wechatInfo.nickname,
          avatar: wechatInfo.avatarUrl
        }
      }
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('isAdmin', 'false')
      set({ 
        user,
        isAdmin: false,
        isLoading: false 
      })
    } catch (error) {
      console.error('微信登录失败:', error)
      set({ error: '微信登录失败，请稍后重试', isLoading: false })
    }
  }
}))

interface FitnessPlanState {
  plans: any[]
  currentPlan: any | null
  isLoading: boolean
  error: string | null
  createPlan: (plan: any) => Promise<void>
  getPlans: () => Promise<void>
  setCurrentPlan: (plan: any) => void
}

export const useFitnessPlanStore = create<FitnessPlanState>((set) => ({
  plans: typeof window !== 'undefined' && localStorage.getItem('fitnessPlans') ? JSON.parse(localStorage.getItem('fitnessPlans')!) : [],
  currentPlan: typeof window !== 'undefined' && localStorage.getItem('currentPlan') ? JSON.parse(localStorage.getItem('currentPlan')!) : null,
  isLoading: false,
  error: null,
  createPlan: async (plan) => {
    set({ isLoading: true, error: null })
    try {
      // 使用localStorage保存健身计划
      const newPlan = { ...plan, id: Date.now().toString(), created_at: new Date().toISOString() }
      const storedPlans = typeof window !== 'undefined' && localStorage.getItem('fitnessPlans') ? JSON.parse(localStorage.getItem('fitnessPlans')!) : []
      const updatedPlans = [...storedPlans, newPlan]
      localStorage.setItem('fitnessPlans', JSON.stringify(updatedPlans))
      localStorage.setItem('currentPlan', JSON.stringify(newPlan))
      set((state) => ({ 
        plans: updatedPlans,
        currentPlan: newPlan,
        isLoading: false 
      }))
    } catch (error) {
      console.error('创建健身计划失败:', error)
      set({ error: '创建健身计划失败，请稍后重试', isLoading: false })
    }
  },
  getPlans: async () => {
    set({ isLoading: true, error: null })
    try {
      // 从localStorage获取健身计划
      const storedPlans = typeof window !== 'undefined' && localStorage.getItem('fitnessPlans') ? JSON.parse(localStorage.getItem('fitnessPlans')!) : []
      set({ plans: storedPlans, isLoading: false })
    } catch (error) {
      console.error('获取健身计划失败:', error)
      set({ error: '获取健身计划失败，请稍后重试', isLoading: false })
    }
  },
  setCurrentPlan: (plan) => {
    if (plan) {
      localStorage.setItem('currentPlan', JSON.stringify(plan))
    } else {
      localStorage.removeItem('currentPlan')
    }
    set({ currentPlan: plan })
  }
}))

interface WorkoutRecordState {
  records: any[]
  isLoading: boolean
  error: string | null
  addRecord: (record: any) => Promise<void>
  getRecords: (planId: string) => Promise<void>
}

export const useWorkoutRecordStore = create<WorkoutRecordState>((set) => ({
  records: typeof window !== 'undefined' && localStorage.getItem('workoutRecords') ? JSON.parse(localStorage.getItem('workoutRecords')!) : [],
  isLoading: false,
  error: null,
  addRecord: async (record) => {
    set({ isLoading: true, error: null })
    try {
      // 使用localStorage保存锻炼记录
      const newRecord = { ...record, id: Date.now().toString() }
      const storedRecords = typeof window !== 'undefined' && localStorage.getItem('workoutRecords') ? JSON.parse(localStorage.getItem('workoutRecords')!) : []
      const updatedRecords = [...storedRecords, newRecord]
      localStorage.setItem('workoutRecords', JSON.stringify(updatedRecords))
      set((state) => ({ 
        records: updatedRecords,
        isLoading: false 
      }))
    } catch (error) {
      console.error('添加锻炼记录失败:', error)
      set({ error: '添加锻炼记录失败，请稍后重试', isLoading: false })
    }
  },
  getRecords: async (planId) => {
    set({ isLoading: true, error: null })
    try {
      // 从localStorage获取锻炼记录
      const storedRecords = typeof window !== 'undefined' && localStorage.getItem('workoutRecords') ? JSON.parse(localStorage.getItem('workoutRecords')!) : []
      const filteredRecords = storedRecords.filter((r: any) => r.plan_id === planId)
      set({ records: filteredRecords, isLoading: false })
    } catch (error) {
      console.error('获取锻炼记录失败:', error)
      set({ error: '获取锻炼记录失败，请稍后重试', isLoading: false })
    }
  }
}))

interface BodyMeasurementState {
  measurements: any[]
  isLoading: boolean
  error: string | null
  addMeasurement: (measurement: any) => Promise<void>
  getMeasurements: () => Promise<void>
}

export const useBodyMeasurementStore = create<BodyMeasurementState>((set) => ({
  measurements: typeof window !== 'undefined' && localStorage.getItem('bodyMeasurements') ? JSON.parse(localStorage.getItem('bodyMeasurements')!) : [],
  isLoading: false,
  error: null,
  addMeasurement: async (measurement) => {
    set({ isLoading: true, error: null })
    try {
      // 使用localStorage保存身体数据
      const newMeasurement = { ...measurement, id: Date.now().toString() }
      const storedMeasurements = typeof window !== 'undefined' && localStorage.getItem('bodyMeasurements') ? JSON.parse(localStorage.getItem('bodyMeasurements')!) : []
      const updatedMeasurements = [...storedMeasurements, newMeasurement]
      localStorage.setItem('bodyMeasurements', JSON.stringify(updatedMeasurements))
      set((state) => ({ 
        measurements: updatedMeasurements,
        isLoading: false 
      }))
    } catch (error) {
      console.error('添加身体数据失败:', error)
      set({ error: '添加身体数据失败，请稍后重试', isLoading: false })
    }
  },
  getMeasurements: async () => {
    set({ isLoading: true, error: null })
    try {
      // 从localStorage获取身体数据
      const storedMeasurements = typeof window !== 'undefined' && localStorage.getItem('bodyMeasurements') ? JSON.parse(localStorage.getItem('bodyMeasurements')!) : []
      set({ measurements: storedMeasurements, isLoading: false })
    } catch (error) {
      console.error('获取身体数据失败:', error)
      set({ error: '获取身体数据失败，请稍后重试', isLoading: false })
    }
  }
}))

interface TemplateState {
  templates: any[]
  isLoading: boolean
  error: string | null
  getTemplates: () => Promise<void>
}

export const useTemplateStore = create<TemplateState>((set) => ({
  templates: [],
  isLoading: false,
  error: null,
  getTemplates: async () => {
    set({ isLoading: true, error: null })
    try {
      // 尝试从Supabase获取模板数据
      const { data, error } = await supabase
        .from('templates')
        .select('*')

      if (error) {
        console.error('从数据库获取模板失败:', error)
        // 如果数据库中没有数据，使用默认模板
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
        set({ templates: defaultTemplates, isLoading: false })
      } else {
        // 处理从数据库获取的数据
        console.log('从数据库获取的模板数据:', data)
        const processedTemplates = data.map((template: any) => ({
          ...template,
          exercises: template.exercises || []
        }))
        console.log('处理后的模板数据:', processedTemplates)
        set({ templates: processedTemplates, isLoading: false })
      }
    } catch (error) {
      console.error('获取模板失败:', error)
      // 使用默认模板
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
      set({ templates: defaultTemplates, isLoading: false })
    }
  }
}))
