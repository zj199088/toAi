import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const checkAuthAndRedirect = (shouldRedirect = true) => {
  const storedUser = localStorage.getItem('user')
  if (!storedUser && shouldRedirect) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    return false
  }
  return !!storedUser
}

interface UserState {
  user: any | null
  isAdmin: boolean
  isLoading: boolean
  error: string | null
  signUp: (email: string, password: string, name: string) => Promise<boolean>
  signIn: (email: string, password: string) => Promise<boolean>
  signOut: () => Promise<void>
  checkAuth: () => Promise<void>
  signInWithWechat: (wechatInfo: any) => Promise<boolean>
  updateUser: (metadata: any) => Promise<void>
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
      set({ user, isAdmin, isLoading: false, error: null })
      return true
    } catch (error) {
      console.error('注册失败:', error)
      set({ error: '注册失败，请稍后重试', isLoading: false })
      return false
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
      set({ user, isAdmin, isLoading: false, error: null })
      return true
    } catch (error) {
      console.error('登录失败:', error)
      set({ error: '登录失败，请稍后重试', isLoading: false })
      return false
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
      // 重置所有store
      useFitnessPlanStore.getState().plans = []
      useFitnessPlanStore.getState().currentPlan = null
      useWorkoutRecordStore.getState().records = []
      useWorkoutRecordStore.getState().totalCountLastYear = 0
      useBodyMeasurementStore.getState().measurements = []
      useDietPlanStore.getState().plans = []
      useDietPlanStore.getState().currentPlan = null
      useDietRecordStore.getState().records = []
      set({ user: null, isAdmin: false, isLoading: false })
    } catch (error) {
      console.error('登出失败:', error)
      set({ user: null, isAdmin: false, isLoading: false })
    }
  },
  checkAuth: async () => {
    // 立即设置加载状态
    set({ isLoading: true, error: null })
    
    // 简化版本：只从localStorage获取用户信息，不尝试连接Supabase
    // 这样可以避免因Supabase连接问题导致的加载卡住
    try {
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
        isLoading: false,
        error: null
      })
      return true
    } catch (error) {
      console.error('微信登录失败:', error)
      set({ error: '微信登录失败，请稍后重试', isLoading: false })
      return false
    }
  },
  updateUser: async (metadata) => {
    set({ isLoading: true, error: null })
    try {
      // 从 Supabase 更新用户信息
      const { data, error } = await supabase.auth.updateUser({
        data: metadata
      })
      
      if (error) {
        throw error
      }
      
      // 更新本地用户信息
      const currentUser = useUserStore.getState().user
      const updatedUser = {
        ...currentUser,
        user_metadata: {
          ...currentUser.user_metadata,
          ...metadata
        }
      }
      
      localStorage.setItem('user', JSON.stringify(updatedUser))
      set({ user: updatedUser, isLoading: false })
    } catch (error) {
      console.error('更新用户信息失败:', error)
      set({ error: '更新用户信息失败，请稍后重试', isLoading: false })
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
    if (!checkAuthAndRedirect()) return
    set({ isLoading: true, error: null })
    try {
      // 获取当前用户
      const user = useUserStore.getState().user
      if (!user) {
        throw new Error('用户未登录')
      }

      // 生成 UUID
      const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };

      // 保存到Supabase数据库
      const { data: planData, error: planError } = await supabase
        .from('fitness_plans')
        .insert({
          ...plan,
          user_id: user.id,
          created_at: new Date().toISOString()
        })
        .select()

      if (planError) {
        throw planError
      }

      const fitnessPlan = planData[0]
      console.log('✅ 成功创建健身计划:', fitnessPlan)

      // 为每个计划创建7天的训练日程
      const workoutSchedules = []
      
      // 根据健身目标生成不同的训练计划
      const getExercisesByGoal = (goal: string, day: number) => {
        const baseExercises = {
          '减脂': [
            { name: '标准俯卧撑', sets: 3, reps: 15 },
            { name: '深蹲', sets: 3, reps: 20 },
            { name: '平板支撑', sets: 3, duration: 45 },
            { name: '开合跳', sets: 3, reps: 30 }
          ],
          '增肌': [
            { name: '标准俯卧撑', sets: 4, reps: 12 },
            { name: '深蹲', sets: 4, reps: 15 },
            { name: '引体向上', sets: 3, reps: 8 },
            { name: '卧推', sets: 3, reps: 10 }
          ],
          '塑形': [
            { name: '标准俯卧撑', sets: 3, reps: 12 },
            { name: '深蹲', sets: 3, reps: 15 },
            { name: '平板支撑', sets: 3, duration: 60 },
            { name: '侧平板支撑', sets: 3, duration: 30 }
          ],
          '增强耐力': [
            { name: '标准俯卧撑', sets: 4, reps: 20 },
            { name: '深蹲', sets: 4, reps: 25 },
            { name: '平板支撑', sets: 4, duration: 60 },
            { name: '开合跳', sets: 4, reps: 40 }
          ],
          '提高灵活性': [
            { name: '瑜伽伸展', sets: 2, duration: 120 },
            { name: '普拉提', sets: 3, duration: 90 },
            { name: '动态拉伸', sets: 3, duration: 60 },
            { name: '平衡训练', sets: 3, duration: 45 }
          ]
        }
        
        return baseExercises[goal] || baseExercises['减脂']
      }

      // 计算计划总天数
      const totalDays = plan.duration * 7
      console.log(`📅 计划总天数: ${totalDays}天`)

      // 为整个计划期间创建训练日程
      for (let day = 1; day <= totalDays; day++) {
        // 计算是星期几（1-7）
        const dayOfWeek = ((day - 1) % 7) + 1
        let workoutType = ''
        switch (dayOfWeek) {
          case 1: workoutType = '胸+核心'; break
          case 2: workoutType = '背+核心'; break
          case 3: workoutType = '腿+核心'; break
          case 4: workoutType = '休息'; break
          case 5: workoutType = '胸+核心'; break
          case 6: workoutType = '背+核心'; break
          case 7: workoutType = '腿+核心'; break
        }

        // 只有非休息日才创建训练动作
        if (workoutType !== '休息') {
          const { data: scheduleData, error: scheduleError } = await supabase
            .from('workout_schedules')
            .insert({
              id: generateUUID(),
              plan_id: fitnessPlan.id,
              user_id: user.id,
              day: day,
              workout_type: workoutType,
              description: `${workoutType}训练 (第${Math.ceil(day/7)}周)`,
              created_at: new Date().toISOString()
            })
            .select()

          if (scheduleError) {
            throw scheduleError
          }

          const schedule = scheduleData[0]
          workoutSchedules.push(schedule)
          console.log(`✅ 成功创建训练日程 (第${day}天, 第${Math.ceil(day/7)}周):`, schedule)

          // 创建训练动作
          let exercises = []
          if (plan.exercises && plan.exercises.length > 0) {
            // 使用自定义运动项目
            exercises = plan.exercises
            console.log(`📋 使用自定义运动项目，共${exercises.length}个`)
          } else {
            // 使用根据目标生成的运动项目
            exercises = getExercisesByGoal(plan.goal, dayOfWeek)
            console.log(`🎯 使用根据目标生成的运动项目，共${exercises.length}个`)
          }
          
          for (const exercise of exercises) {
            const { error: exerciseError } = await supabase
              .from('workout_exercises')
              .insert({
                id: generateUUID(),
                schedule_id: schedule.id,
                user_id: user.id,
                name: exercise.name,
                sets: exercise.sets,
                reps: exercise.reps,
                duration: exercise.duration,
                created_at: new Date().toISOString()
              })

            if (exerciseError) {
              throw exerciseError
            }
          }
          console.log(`✅ 成功创建${exercises.length}个训练动作`)
        }
      }

      set((state) => ({ 
        plans: [...state.plans, fitnessPlan],
        currentPlan: fitnessPlan,
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
      // 获取当前用户
      const user = useUserStore.getState().user
      if (!user) {
        set({ plans: [], currentPlan: null, isLoading: false })
        return
      }

      // 从Supabase数据库获取健身计划
      const { data, error } = await supabase
        .from('fitness_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      set({ plans: data || [], isLoading: false })
      // 设置最新的计划为当前计划
      if (data && data.length > 0) {
        set({ currentPlan: data[0] })
      } else {
        set({ currentPlan: null })
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
  totalCountLastYear: number
  addRecord: (record: any) => Promise<void>
  getRecords: (planId?: string, limit?: number, startDate?: string, endDate?: string, planName?: string) => Promise<void>
  getTotalCountLastYear: () => Promise<void>
}

export const useWorkoutRecordStore = create<WorkoutRecordState>((set, get) => ({
  records: [],
  isLoading: false,
  error: null,
  totalCountLastYear: 0,
  addRecord: async (record) => {
    if (!checkAuthAndRedirect(false)) return
    console.log('🔄 开始添加锻炼记录，数据:', record)
    set({ isLoading: true, error: null })
    try {
      // 获取当前用户
      const user = useUserStore.getState().user
      if (!user) {
        throw new Error('用户未登录')
      }

      // 保存到Supabase数据库
      console.log('📡 尝试保存到Supabase数据库...')
      const { data, error } = await supabase
        .from('workout_records')
        .insert({
          ...record,
          user_id: user.id,
          created_at: new Date().toISOString()
        })
        .select()

      if (error) {
        console.error('❌ Supabase错误:', error)
        throw error
      }

      console.log('✅ 成功保存到数据库:', data)
      set((state) => ({ 
        records: [...state.records, data[0]],
        isLoading: false 
      }))
    } catch (error) {
      console.error('❌ 添加锻炼记录到数据库失败:', error)
      // 只依赖数据库，不使用本地存储
      set({ 
        isLoading: false,
        error: '添加锻炼记录到数据库失败，请检查网络连接' 
      })
    }
  },
  getRecords: async (planId, limit, startDate, endDate, planName) => {
    if (!checkAuthAndRedirect(false)) {
      set({ records: [], isLoading: false })
      return
    }
    console.log('🔄 开始获取锻炼记录，planId:', planId, 'limit:', limit, 'startDate:', startDate, 'endDate:', endDate, 'planName:', planName)
    set({ isLoading: true, error: null })
    try {
      // 获取当前用户
      const user = useUserStore.getState().user
      if (!user) {
        set({ records: [], isLoading: false })
        return
      }

      // 从Supabase数据库获取锻炼记录，包含计划名称
      console.log('📡 尝试从Supabase获取记录...')
      let query = supabase
        .from('workout_records')
        .select(`
          *,
          fitness_plans(name)
        `)
        .eq('user_id', user.id)
      
      // 如果有planId，添加计划过滤
      if (planId) {
        query = query.eq('plan_id', planId)
      }
      
      // 如果有startDate，添加开始日期过滤
      if (startDate) {
        query = query.gte('date', startDate)
      }
      
      // 如果有endDate，添加结束日期过滤
      if (endDate) {
        query = query.lte('date', endDate)
      }
      
      // 如果有planName，添加计划名称过滤
      if (planName) {
        // 先获取符合计划名称的计划ID
        const { data: plans, error: planError } = await supabase
          .from('fitness_plans')
          .select('id')
          .eq('user_id', user.id)
          .ilike('name', `%${planName}%`)
        
        if (!planError && plans && plans.length > 0) {
          const planIds = plans.map(p => p.id)
          query = query.in('plan_id', planIds)
        } else {
          // 没有找到匹配的计划，返回空结果
          set({ records: [], isLoading: false })
          return
        }
      }
      
      query = query.order('created_at', { ascending: false })
      
      // 如果有limit参数，添加限制
      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query

      if (error) {
        console.error('❌ Supabase错误:', error)
        throw error
      }

      console.log('✅ 成功从数据库获取记录，共', data?.length || 0, '条:', data)
      set({ records: data || [], isLoading: false })
    } catch (error) {
      console.error('❌ 从数据库获取锻炼记录失败:', error)
      // 只依赖数据库，不使用本地存储
      set({ 
        records: [], 
        isLoading: false, 
        error: '从数据库获取锻炼记录失败，请检查网络连接' 
      })
    }
  },
  getTotalCountLastYear: async () => {
    if (!checkAuthAndRedirect(false)) {
      set({ totalCountLastYear: 0, isLoading: false })
      return
    }
    console.log('🔄 开始获取最近1年锻炼记录总数')
    set({ isLoading: true, error: null })
    try {
      const user = useUserStore.getState().user
      if (!user) {
        set({ totalCountLastYear: 0, isLoading: false })
        return
      }

      const oneYearAgo = new Date()
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

      const { count, error } = await supabase
        .from('workout_records')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', oneYearAgo.toISOString())

      if (error) {
        console.error('❌ Supabase错误:', error)
        throw error
      }

      console.log('✅ 成功获取最近1年锻炼记录总数:', count)
      set({ totalCountLastYear: count || 0, isLoading: false })
    } catch (error) {
      console.error('❌ 获取最近1年锻炼记录总数失败:', error)
      set({ totalCountLastYear: 0, isLoading: false })
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
    if (!checkAuthAndRedirect()) return
    set({ isLoading: true, error: null })
    try {
      // 获取当前用户
      const user = useUserStore.getState().user
      if (!user) {
        throw new Error('用户未登录')
      }

      // 保存到Supabase数据库
      const { data, error } = await supabase
        .from('body_measurements')
        .insert({
          ...measurement,
          user_id: user.id,
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
    if (!checkAuthAndRedirect()) return
    set({ isLoading: true, error: null })
    try {
      // 获取当前用户
      const user = useUserStore.getState().user
      if (!user) {
        set({ measurements: [], isLoading: false })
        return
      }

      // 从Supabase数据库获取身体数据
      const { data, error } = await supabase
        .from('body_measurements')
        .select('*')
        .eq('user_id', user.id)
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
    if (!checkAuthAndRedirect()) return
    set({ isLoading: true, error: null })
    try {
      // 获取当前用户
      const user = useUserStore.getState().user
      if (!user) {
        throw new Error('用户未登录')
      }

      // 保存到Supabase数据库
      const { data, error } = await supabase
        .from('diet_plans')
        .insert({
          ...plan,
          user_id: user.id,
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
    if (!checkAuthAndRedirect(false)) {
      set({ plans: [], currentPlan: null, isLoading: false })
      return
    }
    set({ isLoading: true, error: null })
    try {
      // 获取当前用户
      const user = useUserStore.getState().user
      if (!user) {
        set({ plans: [], currentPlan: null, isLoading: false })
        return
      }

      // 从Supabase数据库获取饮食计划
      const { data, error } = await supabase
        .from('diet_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      set({ plans: data || [], isLoading: false })
      // 设置最新的计划为当前计划
      if (data && data.length > 0) {
        set({ currentPlan: data[0] })
      } else {
        set({ currentPlan: null })
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
    if (!checkAuthAndRedirect()) return
    set({ isLoading: true, error: null })
    try {
      // 获取当前用户
      const user = useUserStore.getState().user
      if (!user) {
        throw new Error('用户未登录')
      }

      // 保存到Supabase数据库
      const { data, error } = await supabase
        .from('diet_records')
        .insert({
          ...record,
          user_id: user.id,
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
    if (!checkAuthAndRedirect()) return
    set({ isLoading: true, error: null })
    try {
      // 获取当前用户
      const user = useUserStore.getState().user
      if (!user) {
        set({ records: [], isLoading: false })
        return
      }

      // 从Supabase数据库获取饮食记录
      const { data, error } = await supabase
        .from('diet_records')
        .select('*')
        .eq('user_id', user.id)
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
