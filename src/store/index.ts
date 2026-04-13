import { create } from 'zustand'
import { supabase } from '../lib/supabase'

interface UserState {
  user: any | null
  isLoading: boolean
  error: string | null
  signUp: (email: string, password: string, name: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: true,
  error: null,
  signUp: async (email, password, name) => {
    set({ isLoading: true, error: null })
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    })
    if (error) {
      set({ error: error.message, isLoading: false })
    } else {
      set({ user: data.user, isLoading: false })
    }
  },
  signIn: async (email, password) => {
    set({ isLoading: true, error: null })
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) {
      set({ error: error.message, isLoading: false })
    } else {
      set({ user: data.user, isLoading: false })
    }
  },
  signOut: async () => {
    set({ isLoading: true })
    const { error } = await supabase.auth.signOut()
    if (error) {
      set({ error: error.message, isLoading: false })
    } else {
      set({ user: null, isLoading: false })
    }
  },
  checkAuth: async () => {
    set({ isLoading: true })
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      set({ user: session.user, isLoading: false })
    } else {
      set({ user: null, isLoading: false })
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
    const { data, error } = await supabase
      .from('fitness_plans')
      .select('*')
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
    const { data, error } = await supabase
      .from('body_measurements')
      .select('*')
    if (error) {
      set({ error: error.message, isLoading: false })
    } else {
      set({ measurements: data, isLoading: false })
    }
  }
}))
