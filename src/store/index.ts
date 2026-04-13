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
  plans: [],
  currentPlan: null,
  isLoading: false,
  error: null,
  createPlan: async (plan) => {
    set({ isLoading: true, error: null })
    const { data, error } = await supabase
      .from('fitness_plans')
      .insert(plan)
      .select()
    if (error) {
      set({ error: error.message, isLoading: false })
    } else {
      set((state) => ({ 
        plans: [...state.plans, data[0]],
        currentPlan: data[0],
        isLoading: false 
      }))
    }
  },
  getPlans: async () => {
    set({ isLoading: true, error: null })
    // 获取当前用户ID
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      set({ plans: [], isLoading: false })
      return
    }
    const { data, error } = await supabase
      .from('fitness_plans')
      .select('*')
      .eq('user_id', session.user.id)
    if (error) {
      set({ error: error.message, isLoading: false })
    } else {
      set({ plans: data, isLoading: false })
    }
  },
  setCurrentPlan: (plan) => {
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
    const { data, error } = await supabase
      .from('workout_records')
      .insert(record)
      .select()
    if (error) {
      set({ error: error.message, isLoading: false })
    } else {
      set((state) => ({ 
        records: [...state.records, data[0]],
        isLoading: false 
      }))
    }
  },
  getRecords: async (planId) => {
    set({ isLoading: true, error: null })
    const { data, error } = await supabase
      .from('workout_records')
      .select('*')
      .eq('plan_id', planId)
    if (error) {
      set({ error: error.message, isLoading: false })
    } else {
      set({ records: data, isLoading: false })
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
    const { data, error } = await supabase
      .from('body_measurements')
      .insert(measurement)
      .select()
    if (error) {
      set({ error: error.message, isLoading: false })
    } else {
      set((state) => ({ 
        measurements: [...state.measurements, data[0]],
        isLoading: false 
      }))
    }
  },
  getMeasurements: async () => {
    set({ isLoading: true, error: null })
    // 获取当前用户ID
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      set({ measurements: [], isLoading: false })
      return
    }
    const { data, error } = await supabase
      .from('body_measurements')
      .select('*')
      .eq('user_id', session.user.id)
    if (error) {
      set({ error: error.message, isLoading: false })
    } else {
      set({ measurements: data, isLoading: false })
    }
  }
}))
