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
      // 实际从Supabase注册
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: name,
            displayName: name
          }
        }
      })
      
      if (error) {
        throw error
      }
      
      const user = {
        id: data.user?.id || 'user_' + Date.now(),
        email: data.user?.email || email,
        user_metadata: {
          name: data.user?.user_metadata?.name || name,
          displayName: data.user?.user_metadata?.displayName || name,
          ...data.user?.user_metadata
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
      // 实际从Supabase登录
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      })
      
      if (error) {
        throw error
      }
      
      const user = {
        id: data.user?.id || 'user_' + Date.now(),
        email: data.user?.email || email,
        user_metadata: {
          name: data.user?.user_metadata?.name || data.user?.email?.split('@')[0] || email.split('@')[0],
          displayName: data.user?.user_metadata?.displayName || data.user?.email?.split('@')[0] || email.split('@')[0],
          ...data.user?.user_metadata
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
      // 实际从Supabase登出
      await supabase.auth.signOut()
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
    // 立即设置加载状态
    set({ isLoading: true, error: null })
    
    try {
      // 首先尝试从Supabase获取当前用户会话
      // 设置超时，防止Supabase连接卡住
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('连接超时')), 5000)
      })
      
      const result = await Promise.race([
        supabase.auth.getUser(),
        timeoutPromise
      ]) as { data: { user: any } | null; error: any }
      const { data, error: authError } = result
      
      if (data?.user) {
        // 从Supabase获取到用户信息
        const userData = {
          id: data.user.id,
          email: data.user.email,
          user_metadata: {
            name: data.user.user_metadata?.name || data.user.email?.split('@')[0],
            displayName: data.user.user_metadata?.displayName || data.user.user_metadata?.name || data.user.email?.split('@')[0],
            ...data.user.user_metadata
          }
        }
        const isAdmin = data.user.email?.includes('admin') || false
        
        // 更新localStorage
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('isAdmin', isAdmin.toString())
        
        set({ 
          user: userData, 
          isAdmin, 
          isLoading: false, 
          error: null
        })
      } else {
        // 没有从Supabase获取到用户信息，检查localStorage
        const storedUser = localStorage.getItem('user')
        const storedIsAdmin = localStorage.getItem('isAdmin')
        
        if (storedUser) {
          set({ 
            user: JSON.parse(storedUser), 
            isAdmin: storedIsAdmin === 'true', 
            isLoading: false, 
            error: null
          })
        } else {
          // 没有本地存储的用户信息，直接设置为未登录状态
          set({ 
            user: null, 
            isAdmin: false, 
            isLoading: false, 
            error: null
          })
        }
      }
    } catch (error) {
      console.error('认证检查失败:', error)
      // 即使出错，也要确保设置isLoading为false
      set({ 
        user: null, 
        isAdmin: false, 
        isLoading: false, 
        error: '连接服务器失败，请稍后重试'
      })
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
          displayName: wechatInfo.nickname,
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
  plans: [],
  currentPlan: null,
  isLoading: false,
  error: null,
  createPlan: async (plan) => {
    set({ isLoading: true, error: null })
    try {
      // 保存到Supabase数据库
      const { data, error } = await supabase
        .from('fitness_plans')
        .insert({
          ...plan,
          created_at: new Date().toISOString()
        })
        .select()

      if (error) {
        throw error
      }

      set((state) => ({ 
        plans: [...state.plans, data[0]],
        currentPlan: data[0],
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
      // 从Supabase数据库获取健身计划
      const { data, error } = await supabase
        .from('fitness_plans')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      set({ plans: data || [], isLoading: false })
      // 设置最新的计划为当前计划
      if (data && data.length > 0) {
        set({ currentPlan: data[0] })
      }
    } catch (error) {
      console.error('获取健身计划失败:', error)
      set({ error: '获取健身计划失败，请稍后重试', isLoading: false })
    }
  },
  setCurrentPlan: async (plan) => {
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
  records: [],
  isLoading: false,
  error: null,
  addRecord: async (record) => {
    set({ isLoading: true, error: null })
    try {
      // 保存到Supabase数据库
      const { data, error } = await supabase
        .from('workout_records')
        .insert({
          ...record,
          created_at: new Date().toISOString()
        })
        .select()

      if (error) {
        throw error
      }

      set((state) => ({ 
        records: [...state.records, data[0]],
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
      // 从Supabase数据库获取锻炼记录
      const { data, error } = await supabase
        .from('workout_records')
        .select('*')
        .eq('plan_id', planId)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      set({ records: data || [], isLoading: false })
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
  measurements: [],
  isLoading: false,
  error: null,
  addMeasurement: async (measurement) => {
    set({ isLoading: true, error: null })
    try {
      // 保存到Supabase数据库
      const { data, error } = await supabase
        .from('body_measurements')
        .insert({
          ...measurement,
          created_at: new Date().toISOString()
        })
        .select()

      if (error) {
        throw error
      }

      set((state) => ({ 
        measurements: [...state.measurements, data[0]],
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
      // 从Supabase数据库获取身体数据
      const { data, error } = await supabase
        .from('body_measurements')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      set({ measurements: data || [], isLoading: false })
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
        .eq('is_enabled', true)

      if (error) {
        console.error('从数据库获取模板失败:', error)
        // 如果数据库查询失败，显示错误
        set({ templates: [], isLoading: false, error: '获取模板失败，请检查数据库' })
      } else {
        // 处理从数据库获取的数据，只包含启用的模板
        console.log('从数据库获取的启用模板数据:', data)
        const processedTemplates = data.map((template: any) => ({
          ...template,
          exercises: template.exercises || []
        }))
        console.log('处理后的启用模板数据:', processedTemplates)
        set({ templates: processedTemplates, isLoading: false })
      }
    } catch (error) {
      console.error('获取模板失败:', error)
      // 如果发生异常，显示错误
      set({ templates: [], isLoading: false, error: '获取模板失败，请稍后重试' })
    }
  }
}))

interface DietPlanState {
  plans: any[]
  currentPlan: any | null
  isLoading: boolean
  error: string | null
  createPlan: (plan: any) => Promise<void>
  getPlans: () => Promise<void>
}

export const useDietPlanStore = create<DietPlanState>((set) => ({
  plans: [],
  currentPlan: null,
  isLoading: false,
  error: null,
  createPlan: async (plan) => {
    set({ isLoading: true, error: null })
    try {
      // 保存到Supabase数据库
      const { data, error } = await supabase
        .from('diet_plans')
        .insert({
          ...plan,
          created_at: new Date().toISOString()
        })
        .select()

      if (error) {
        throw error
      }

      set((state) => ({ 
        plans: [...state.plans, data[0]],
        currentPlan: data[0],
        isLoading: false 
      }))
    } catch (error) {
      console.error('创建饮食计划失败:', error)
      set({ error: '创建饮食计划失败，请稍后重试', isLoading: false })
    }
  },
  getPlans: async () => {
    set({ isLoading: true, error: null })
    try {
      // 从Supabase数据库获取饮食计划
      const { data, error } = await supabase
        .from('diet_plans')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      set({ plans: data || [], isLoading: false })
      // 设置最新的计划为当前计划
      if (data && data.length > 0) {
        set({ currentPlan: data[0] })
      }
    } catch (error) {
      console.error('获取饮食计划失败:', error)
      set({ error: '获取饮食计划失败，请稍后重试', isLoading: false })
    }
  }
}))

interface DietRecordState {
  records: any[]
  isLoading: boolean
  error: string | null
  addRecord: (record: any) => Promise<void>
  getRecords: () => Promise<void>
}

export const useDietRecordStore = create<DietRecordState>((set) => ({
  records: [],
  isLoading: false,
  error: null,
  addRecord: async (record) => {
    set({ isLoading: true, error: null })
    try {
      // 保存到Supabase数据库
      const { data, error } = await supabase
        .from('diet_records')
        .insert({
          ...record,
          created_at: new Date().toISOString()
        })
        .select()

      if (error) {
        throw error
      }

      set((state) => ({ 
        records: [...state.records, data[0]],
        isLoading: false 
      }))
    } catch (error) {
      console.error('添加饮食记录失败:', error)
      set({ error: '添加饮食记录失败，请稍后重试', isLoading: false })
    }
  },
  getRecords: async () => {
    set({ isLoading: true, error: null })
    try {
      // 从Supabase数据库获取饮食记录
      const { data, error } = await supabase
        .from('diet_records')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      set({ records: data || [], isLoading: false })
    } catch (error) {
      console.error('获取饮食记录失败:', error)
      set({ error: '获取饮食记录失败，请稍后重试', isLoading: false })
    }
  }
}))
