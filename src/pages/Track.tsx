import React, { useState, useEffect } from 'react'
import { useFitnessPlanStore, useWorkoutRecordStore, useBodyMeasurementStore, useUserStore } from '../store'
import { cn } from '../utils/cn'
import { 
  Check, Calendar, BarChart3, Activity, ChevronRight, Plus, Edit,
  Zap, Timer, Dumbbell, Flame, Trophy, HeartPulse, Target
} from 'lucide-react'

const Track: React.FC = () => {
  const { currentPlan, getPlans, setCurrentPlan } = useFitnessPlanStore()
  const { addRecord, records, getRecords } = useWorkoutRecordStore()
  const { addMeasurement, measurements, getMeasurements } = useBodyMeasurementStore()
  const { user } = useUserStore()
  const [selectedDay, setSelectedDay] = useState(new Date())
  const [showBodyMeasurementForm, setShowBodyMeasurementForm] = useState(false)
  const [bodyMeasurement, setBodyMeasurement] = useState({
    weight: '',
    waist: '',
    hip: '',
    chest: '',
    arm: '',
    leg: ''
  })

  // 组件加载时获取数据
  useEffect(() => {
    const loadData = async () => {
      if (user) {
        // 获取用户的健身计划
        await getPlans()
        // 这里可以根据需要设置当前计划，例如获取最新的计划
        // 假设有计划列表，我们取最新的一个
        const plans = useFitnessPlanStore.getState().plans
        if (plans.length > 0) {
          // 按创建时间排序，取最新的
          const latestPlan = plans.sort((a, b) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          })[0]
          setCurrentPlan(latestPlan)
          // 获取该计划的锻炼记录
          await getRecords(latestPlan.id)
        }
        // 获取用户的身体数据
        await getMeasurements()
        
        // 尝试从数据库获取锻炼计划数据
        try {
          // 这里可以根据实际的数据库结构查询锻炼计划
          // 暂时使用默认数据
        } catch (error) {
          console.error('获取锻炼计划数据失败:', error)
          // 使用默认数据
        }
      }
    }

    loadData()
  }, [user, getPlans, setCurrentPlan, getRecords, getMeasurements])
  // 锻炼计划数据（从数据库获取或使用默认数据）
  const [workoutSchedule, setWorkoutSchedule] = useState([
    { 
      day: 1, 
      type: '胸+核心', 
      exercises: [
        { name: '标准俯卧撑', sets: 3, reps: '10-15', icon: <Dumbbell className="h-4 w-4" /> },
        { name: '卷腹', sets: 3, reps: '15-20', icon: <Zap className="h-4 w-4" /> },
        { name: '平板支撑', sets: 3, duration: '30-45秒', icon: <Timer className="h-4 w-4" /> },
        { name: '俄罗斯转体', sets: 3, reps: '20-30', icon: <Flame className="h-4 w-4" /> }
      ] 
    },
    { 
      day: 2, 
      type: '背+核心', 
      exercises: [
        { name: '俯身划船（水瓶）', sets: 3, reps: '12-15', icon: <Dumbbell className="h-4 w-4" /> },
        { name: '超人式', sets: 3, reps: '10-12', icon: <Zap className="h-4 w-4" /> },
        { name: '反向卷腹', sets: 3, reps: '12-15', icon: <Flame className="h-4 w-4" /> },
        { name: '侧平板支撑', sets: 3, duration: '25-30秒', icon: <Timer className="h-4 w-4" /> }
      ] 
    },
    { 
      day: 3, 
      type: '腿+核心', 
      exercises: [
        { name: '深蹲', sets: 4, reps: '12-15', icon: <Dumbbell className="h-4 w-4" /> },
        { name: '弓步蹲', sets: 3, reps: '10-12', icon: <Zap className="h-4 w-4" /> },
        { name: '臀桥', sets: 3, reps: '15-20', icon: <Flame className="h-4 w-4" /> },
        { name: '开合跳', sets: 3, reps: '30-40', icon: <HeartPulse className="h-4 w-4" /> }
      ] 
    },
    { day: 4, type: '休息', exercises: [] },
    { 
      day: 5, 
      type: '胸+核心', 
      exercises: [
        { name: '标准俯卧撑', sets: 3, reps: '10-15', icon: <Dumbbell className="h-4 w-4" /> },
        { name: '卷腹', sets: 3, reps: '15-20', icon: <Zap className="h-4 w-4" /> },
        { name: '平板支撑', sets: 3, duration: '30-45秒', icon: <Timer className="h-4 w-4" /> },
        { name: '俄罗斯转体', sets: 3, reps: '20-30', icon: <Flame className="h-4 w-4" /> }
      ] 
    },
    { 
      day: 6, 
      type: '背+核心', 
      exercises: [
        { name: '俯身划船（水瓶）', sets: 3, reps: '12-15', icon: <Dumbbell className="h-4 w-4" /> },
        { name: '超人式', sets: 3, reps: '10-12', icon: <Zap className="h-4 w-4" /> },
        { name: '反向卷腹', sets: 3, reps: '12-15', icon: <Flame className="h-4 w-4" /> },
        { name: '侧平板支撑', sets: 3, duration: '25-30秒', icon: <Timer className="h-4 w-4" /> }
      ] 
    },
    { 
      day: 7, 
      type: '腿+核心', 
      exercises: [
        { name: '深蹲', sets: 4, reps: '12-15', icon: <Dumbbell className="h-4 w-4" /> },
        { name: '弓步蹲', sets: 3, reps: '10-12', icon: <Zap className="h-4 w-4" /> },
        { name: '臀桥', sets: 3, reps: '15-20', icon: <Flame className="h-4 w-4" /> },
        { name: '开合跳', sets: 3, reps: '30-40', icon: <HeartPulse className="h-4 w-4" /> }
      ] 
    }
  ])

  const getDayOfWeek = (date: Date) => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return days[date.getDay()]
  }

  const getCurrentWorkout = () => {
    const dayOfWeek = selectedDay.getDay() || 7 // 调整为1-7
    return workoutSchedule.find(w => w.day === dayOfWeek)
  }

  // 状态管理：存储每个练习的组完成情况
  const [exerciseSets, setExerciseSets] = useState<Record<string, boolean[]>>({})
  // 状态管理：存储每个练习的最后完成组索引
  const [lastCompletedSetIndex, setLastCompletedSetIndex] = useState<Record<string, number>>({})

  // 初始化练习的组状态
  useEffect(() => {
    const workout = getCurrentWorkout()
    if (workout) {
      const initialSets: Record<string, boolean[]> = {}
      const initialLastSetIndex: Record<string, number> = {}
      workout.exercises.forEach((exercise) => {
        // 默认为3组，每组初始状态为未完成
        initialSets[exercise.name] = Array(exercise.sets || 3).fill(false)
        initialLastSetIndex[exercise.name] = -1
      })
      setExerciseSets(initialSets)
      setLastCompletedSetIndex(initialLastSetIndex)
    }
  }, [selectedDay])

  // 切换组的完成状态
  const toggleSetComplete = async (exerciseName: string, setIndex: number) => {
    console.log('👆 toggleSetComplete 被调用:', { exerciseName, setIndex })
    const lastSetIndex = lastCompletedSetIndex[exerciseName] ?? -1
    console.log('📊 最后完成组索引:', lastSetIndex)
    
    let willCompleteAllSets = false
    
    setExerciseSets(prev => {
      const updatedSets = { ...prev }
      if (updatedSets[exerciseName]) {
        updatedSets[exerciseName] = [...updatedSets[exerciseName]]
        
        // 如果点击的是第1组（索引0），并且最后完成组索引是-1或0，则可以切换
        if (setIndex === 0 && (lastSetIndex === -1 || lastSetIndex === 0)) {
          updatedSets[exerciseName][setIndex] = !updatedSets[exerciseName][setIndex]
          console.log('🔄 切换第1组状态:', updatedSets[exerciseName][setIndex])
          // 更新最后完成组索引
          setLastCompletedSetIndex(prevLast => ({
            ...prevLast,
            [exerciseName]: updatedSets[exerciseName][setIndex] ? 0 : -1
          }))
          // 检查是否所有组都完成了
          willCompleteAllSets = updatedSets[exerciseName].every(set => set)
        } 
        // 如果点击的是比最后完成组索引大1的组，则可以标记为完成
        else if (setIndex === lastSetIndex + 1) {
          updatedSets[exerciseName][setIndex] = true
          console.log('✅ 标记第', setIndex + 1, '组为完成')
          setLastCompletedSetIndex(prevLast => ({
            ...prevLast,
            [exerciseName]: setIndex
          }))
          // 检查是否所有组都完成了
          willCompleteAllSets = updatedSets[exerciseName].every(set => set)
        }
      }
      return updatedSets
    })
    
    // 如果所有组都完成了，调用 handleExerciseComplete
    if (willCompleteAllSets) {
      console.log('🎉 所有组都完成了！调用 handleExerciseComplete')
      setTimeout(() => {
        handleExerciseComplete(exerciseName)
      }, 100)
    }
  }

  // 检查练习是否全部完成
  const isExerciseComplete = (exerciseName: string) => {
    const sets = exerciseSets[exerciseName]
    return sets && sets.every(set => set)
  }

  // 当练习全部完成时添加记录
  const handleExerciseComplete = async (exerciseName: string) => {
    console.log('🎯 handleExerciseComplete 被调用，练习名称:', exerciseName)
    console.log('👤 用户信息:', user)
    console.log('📋 当前计划:', currentPlan)
    
    if (!currentPlan) {
      console.error('❌ 没有当前计划，无法添加记录')
      return
    }

    // 只有当所有组都完成时才添加记录
    if (isExerciseComplete(exerciseName)) {
      console.log('✅ 所有组都已完成，准备添加记录')
      
      const record = {
        user_id: user?.id || user?.user_metadata?.id || 'user123',
        plan_id: currentPlan.id,
        schedule_id: 'schedule123',
        exercise_id: `exercise_${exerciseName}`,
        date: selectedDay.toISOString().split('T')[0],
        sets_completed: 3,
        reps_completed: 15,
        created_at: new Date().toISOString()
      }
      
      console.log('📝 准备保存的记录:', record)
      
      // 尝试添加记录到数据库
      await addRecord(record)
      
      // 同时保存到本地存储作为 fallback
      try {
        const existingRecords = JSON.parse(localStorage.getItem('workout_records') || '[]')
        existingRecords.push({ ...record, id: `local_${Date.now()}` })
        localStorage.setItem('workout_records', JSON.stringify(existingRecords))
        console.log('✅ 已保存到本地存储')
      } catch (error) {
        console.error('❌ 保存锻炼记录到本地存储失败:', error)
      }
    } else {
      console.log('⚠️ 并非所有组都完成，不添加记录')
    }
  }

  // 检查组是否可以点击
  const isSetClickable = (exerciseName: string, setIndex: number) => {
    const lastSetIndex = lastCompletedSetIndex[exerciseName] ?? -1
    // 第1组（索引0）可以在最后完成组索引是-1或0时点击
    if (setIndex === 0) {
      return lastSetIndex === -1 || lastSetIndex === 0
    }
    // 其他组只能在最后完成组索引是当前组索引减1时点击
    return setIndex === lastSetIndex + 1
  }

  const handleBodyMeasurementSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addMeasurement({
      user_id: user?.id || 'user123',
      date: new Date().toISOString().split('T')[0],
      weight: parseFloat(bodyMeasurement.weight),
      waist: parseFloat(bodyMeasurement.waist),
      hip: parseFloat(bodyMeasurement.hip),
      chest: parseFloat(bodyMeasurement.chest),
      arm: parseFloat(bodyMeasurement.arm),
      leg: parseFloat(bodyMeasurement.leg),
      created_at: new Date().toISOString()
    })
    setShowBodyMeasurementForm(false)
    setBodyMeasurement({
      weight: '',
      waist: '',
      hip: '',
      chest: '',
      arm: '',
      leg: ''
    })
  }

  const currentWorkout = getCurrentWorkout()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          锻炼跟踪
        </h1>
        <p className="text-gray-400">记录你的锻炼情况，追踪身体变化</p>
      </div>

      {/* 计划信息 */}
      {currentPlan && (
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl p-6 border border-cyan-500/30 overflow-hidden">
          {/* 科技感背景装饰 */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-cyan-500 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-purple-500 rounded-full blur-3xl" />
          </div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {currentPlan.name}
                </h2>
                <div className="flex items-center space-x-6 mt-3">
                  <span className="flex items-center text-cyan-300">
                    <Target className="h-5 w-5 mr-2 text-cyan-400" />
                    目标：{currentPlan.goal}
                  </span>
                  <span className="flex items-center text-purple-300">
                    <Calendar className="h-5 w-5 mr-2 text-purple-400" />
                    时长：{currentPlan.duration} 周
                  </span>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="flex items-center space-x-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 px-5 py-3 rounded-xl border border-cyan-500/30">
                  <Calendar className="h-6 w-6 text-cyan-400" />
                  <span className="text-gray-200 font-bold">
                    {selectedDay.toISOString().split('T')[0]} {getDayOfWeek(selectedDay)}
                  </span>
                </div>
              </div>
            </div>

            {/* 当日训练 */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent flex items-center">
                  <Trophy className="h-6 w-6 mr-3 text-cyan-400" />
                  今日训练
                </h3>
                {currentWorkout ? (
                  <div>
                    <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 p-6 rounded-2xl mb-6 shadow-2xl border border-cyan-400/50">
                      <h4 className="font-bold text-white text-2xl flex items-center">
                        <Flame className="h-7 w-7 mr-3 animate-pulse text-yellow-300" />
                        {currentWorkout.type}
                      </h4>
                    </div>
                    {currentWorkout.exercises.length > 0 ? (
                      <div className="space-y-5">
                        {currentWorkout.exercises.map((exercise, index) => {
                          const isCompleted = records.some(r => 
                            r.exercise_id === `exercise_${exercise.name}` && 
                            r.date === selectedDay.toISOString().split('T')[0]
                          )
                          const sets = exerciseSets[exercise.name] || Array(exercise.sets || 3).fill(false)
                          const exerciseComplete = isExerciseComplete(exercise.name)
                          return (
                            <div key={index} className="p-6 bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-cyan-500/20 shadow-xl hover:shadow-cyan-500/20 hover:border-cyan-400/40 transition-all duration-500 hover:scale-[1.02]">
                              <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center space-x-4">
                                  <div className="p-3 bg-gradient-to-br from-cyan-500/30 to-purple-500/30 rounded-xl border border-cyan-400/30">
                                    {exercise.icon}
                                  </div>
                                  <div>
                                    <span className="font-bold text-white text-lg">{exercise.name}</span>
                                    <div className="text-sm text-gray-300 flex items-center space-x-4 mt-2">
                                      <span className="flex items-center">
                                        <Dumbbell className="h-4 w-4 mr-1.5 text-cyan-400" />
                                        {exercise.sets} 组
                                      </span>
                                      {exercise.reps && (
                                        <span className="flex items-center">
                                          <Zap className="h-4 w-4 mr-1.5 text-yellow-400" />
                                          {exercise.reps} 次
                                        </span>
                                      )}
                                      {exercise.duration && (
                                        <span className="flex items-center">
                                          <Timer className="h-4 w-4 mr-1.5 text-green-400" />
                                          {exercise.duration}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleExerciseComplete(exercise.name)}
                                  disabled={isCompleted || !exerciseComplete}
                                  className={cn(
                                    'flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 font-bold text-sm',
                                    isCompleted
                                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/40'
                                      : exerciseComplete
                                      ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-600 hover:to-purple-700 shadow-lg shadow-cyan-500/40 transform hover:scale-105'
                                      : 'bg-gradient-to-r from-slate-700 to-slate-600 text-gray-400 cursor-not-allowed border border-slate-500'
                                  )}
                                >
                                  {isCompleted ? (
                                    <>
                                      <Check size={20} />
                                      <span>已完成</span>
                                    </>
                                  ) : (
                                    <>
                                      <Check size={20} />
                                      <span>完成练习</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <div className="flex space-x-3">
                                {sets.map((setComplete, setIndex) => {
                                  const clickable = isSetClickable(exercise.name, setIndex)
                                  return (
                                  <button
                                    key={setIndex}
                                    onClick={() => toggleSetComplete(exercise.name, setIndex)}
                                    disabled={isCompleted || !clickable}
                                    className={cn(
                                      'flex-1 py-4 rounded-xl transition-all duration-300 text-center font-bold relative overflow-hidden',
                                      isCompleted || !clickable
                                        ? 'bg-gradient-to-r from-slate-700 to-slate-600 text-gray-500 border-2 border-slate-600 cursor-not-allowed'
                                        : setComplete
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-2 border-green-400 shadow-lg shadow-green-500/40'
                                        : 'bg-gradient-to-r from-slate-800 to-slate-700 text-gray-200 border-2 border-cyan-500/30 hover:border-cyan-400 hover:from-cyan-500/20 hover:to-purple-500/20 transform hover:scale-105'
                                    )}
                                  >
                                    {setComplete && (
                                      <div className="absolute inset-0 bg-green-400/30 animate-pulse" />
                                    )}
                                    <span className="relative z-10 flex items-center justify-center">
                                      第 {setIndex + 1} 组
                                      {setComplete && <Check size={18} className="ml-2" />}
                                    </span>
                                  </button>
                                )})}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="p-10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl text-center border-2 border-dashed border-cyan-500/30">
                        <Activity className="h-16 w-16 mx-auto text-cyan-400 mb-4" />
                        <p className="text-gray-300 text-xl font-bold">今日休息</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl text-center border-2 border-dashed border-cyan-500/30">
                    <BarChart3 className="h-16 w-16 mx-auto text-cyan-400 mb-4" />
                    <p className="text-gray-300 text-xl font-bold">暂无训练计划</p>
                  </div>
                )}
              </div>

              {/* 身体数据记录 */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent flex items-center">
                    <HeartPulse className="h-6 w-6 mr-3 text-green-400" />
                    身体数据
                  </h3>
                  <button
                    onClick={() => setShowBodyMeasurementForm(true)}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl hover:from-green-600 hover:to-teal-700 transition-all duration-300 shadow-lg shadow-green-500/40 transform hover:scale-105 font-bold"
                  >
                    <Plus size={20} />
                    <span>记录数据</span>
                  </button>
                </div>
                {measurements.length > 0 ? (
                  <div className="overflow-x-auto">
                    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-green-500/30 shadow-xl">
                      <table className="min-w-full">
                        <thead>
                          <tr className="bg-gradient-to-r from-green-500/20 to-teal-500/20">
                            <th className="py-4 px-6 text-left text-sm font-bold text-green-300 border-b-2 border-green-500/30">日期</th>
                            <th className="py-4 px-6 text-left text-sm font-bold text-green-300 border-b-2 border-green-500/30">体重 (kg)</th>
                            <th className="py-4 px-6 text-left text-sm font-bold text-green-300 border-b-2 border-green-500/30">腰围 (cm)</th>
                            <th className="py-4 px-6 text-left text-sm font-bold text-green-300 border-b-2 border-green-500/30">臀围 (cm)</th>
                            <th className="py-4 px-6 text-left text-sm font-bold text-green-300 border-b-2 border-green-500/30">胸围 (cm)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {measurements.slice(0, 5).map((measurement, index) => (
                            <tr key={index} className="hover:bg-gradient-to-r from-green-500/10 to-teal-500/10 transition-all duration-300">
                              <td className="py-4 px-6 text-sm text-gray-200 border-b border-green-500/20">{measurement.date}</td>
                              <td className="py-4 px-6 text-sm text-gray-200 border-b border-green-500/20 font-bold">{measurement.weight}</td>
                              <td className="py-4 px-6 text-sm text-gray-200 border-b border-green-500/20 font-bold">{measurement.waist}</td>
                              <td className="py-4 px-6 text-sm text-gray-200 border-b border-green-500/20 font-bold">{measurement.hip}</td>
                              <td className="py-4 px-6 text-sm text-gray-200 border-b border-green-500/20 font-bold">{measurement.chest}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="p-10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl text-center border-2 border-dashed border-green-500/30">
                    <BarChart3 className="h-16 w-16 mx-auto text-green-400 mb-4" />
                    <p className="text-gray-300 text-xl font-bold">暂无身体数据记录</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 身体数据记录表单 */}
      {showBodyMeasurementForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 max-w-lg w-full border border-cyan-500/30 shadow-2xl overflow-hidden">
            {/* 科技感背景装饰 */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-cyan-500 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-purple-500 rounded-full blur-3xl" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  记录身体数据
                </h3>
                <button
                  onClick={() => setShowBodyMeasurementForm(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Edit size={24} />
                </button>
              </div>
              <form onSubmit={handleBodyMeasurementSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="weight" className="block text-sm font-bold text-gray-300 mb-2">
                      体重 (kg)
                    </label>
                    <input
                      type="number"
                      id="weight"
                      value={bodyMeasurement.weight}
                      onChange={(e) => setBodyMeasurement(prev => ({ ...prev, weight: e.target.value }))}
                      className="w-full px-5 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
                      step="0.1"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="waist" className="block text-sm font-bold text-gray-300 mb-2">
                      腰围 (cm)
                    </label>
                    <input
                      type="number"
                      id="waist"
                      value={bodyMeasurement.waist}
                      onChange={(e) => setBodyMeasurement(prev => ({ ...prev, waist: e.target.value }))}
                      className="w-full px-5 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
                      step="0.1"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="hip" className="block text-sm font-bold text-gray-300 mb-2">
                      臀围 (cm)
                    </label>
                    <input
                      type="number"
                      id="hip"
                      value={bodyMeasurement.hip}
                      onChange={(e) => setBodyMeasurement(prev => ({ ...prev, hip: e.target.value }))}
                      className="w-full px-5 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
                      step="0.1"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="chest" className="block text-sm font-bold text-gray-300 mb-2">
                      胸围 (cm)
                    </label>
                    <input
                      type="number"
                      id="chest"
                      value={bodyMeasurement.chest}
                      onChange={(e) => setBodyMeasurement(prev => ({ ...prev, chest: e.target.value }))}
                      className="w-full px-5 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
                      step="0.1"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="arm" className="block text-sm font-bold text-gray-300 mb-2">
                      臂围 (cm)
                    </label>
                    <input
                      type="number"
                      id="arm"
                      value={bodyMeasurement.arm}
                      onChange={(e) => setBodyMeasurement(prev => ({ ...prev, arm: e.target.value }))}
                      className="w-full px-5 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
                      step="0.1"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="leg" className="block text-sm font-bold text-gray-300 mb-2">
                      腿围 (cm)
                    </label>
                    <input
                      type="number"
                      id="leg"
                      value={bodyMeasurement.leg}
                      onChange={(e) => setBodyMeasurement(prev => ({ ...prev, leg: e.target.value }))}
                      className="w-full px-5 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
                      step="0.1"
                      required
                    />
                  </div>
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBodyMeasurementForm(false)}
                    className="flex-1 py-3 px-6 bg-slate-700/50 border border-slate-500 text-gray-300 rounded-xl hover:bg-slate-600/50 transition-all duration-300 font-bold"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl hover:from-green-600 hover:to-teal-700 transition-all duration-300 font-bold shadow-lg shadow-green-500/40"
                  >
                    保存
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 提示信息 */}
      {!currentPlan && (
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 border border-cyan-500/30 shadow-xl overflow-hidden">
          {/* 科技感背景装饰 */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-cyan-500 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-purple-500 rounded-full blur-3xl" />
          </div>
          
          <div className="relative z-10">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3">
              开始你的健身计划
            </h3>
            <p className="text-gray-400 mb-6">
              你还没有创建健身计划，点击下方按钮开始生成或选择模板。
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/plan/generate"
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 flex items-center font-bold shadow-lg shadow-cyan-500/40 transform hover:scale-105"
              >
                生成计划
                <ChevronRight className="ml-2 h-5 w-5" />
              </a>
              <a
                href="/plan/templates"
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 flex items-center font-bold shadow-lg shadow-purple-500/40 transform hover:scale-105"
              >
                选择模板
                <ChevronRight className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Track
