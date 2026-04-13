import React, { useState, useEffect } from 'react'
import { useFitnessPlanStore, useWorkoutRecordStore, useBodyMeasurementStore, useUserStore } from '../store'
import { cn } from '../utils/cn'
import { Check, Calendar, BarChart3, Activity, ChevronRight, Plus, Edit } from 'lucide-react'

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
      }
    }

    loadData()
  }, [user, getPlans, setCurrentPlan, getRecords, getMeasurements])

  // 模拟训练计划数据
  const workoutSchedule = [
    { day: 1, type: '胸+核心', exercises: ['标准俯卧撑', '卷腹', '平板支撑', '俄罗斯转体'] },
    { day: 2, type: '背+核心', exercises: ['俯身划船（水瓶）', '超人式', '反向卷腹', '侧平板支撑'] },
    { day: 3, type: '腿+核心', exercises: ['深蹲', '弓步蹲', '臀桥', '开合跳'] },
    { day: 4, type: '休息', exercises: [] },
    { day: 5, type: '胸+核心', exercises: ['标准俯卧撑', '卷腹', '平板支撑', '俄罗斯转体'] },
    { day: 6, type: '背+核心', exercises: ['俯身划船（水瓶）', '超人式', '反向卷腹', '侧平板支撑'] },
    { day: 7, type: '腿+核心', exercises: ['深蹲', '弓步蹲', '臀桥', '开合跳'] }
  ]

  const getDayOfWeek = (date: Date) => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return days[date.getDay()]
  }

  const getCurrentWorkout = () => {
    const dayOfWeek = selectedDay.getDay() || 7 // 调整为1-7
    return workoutSchedule.find(w => w.day === dayOfWeek)
  }

  const handleWorkoutComplete = (exercise: string) => {
    const workout = getCurrentWorkout()
    if (!workout || !currentPlan) return

    addRecord({
      user_id: user?.id || 'user123',
      plan_id: currentPlan.id,
      schedule_id: 'schedule123',
      exercise_id: `exercise_${exercise}`,
      date: selectedDay.toISOString().split('T')[0],
      sets_completed: 3,
      reps_completed: 15,
      created_at: new Date().toISOString()
    })
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
        <h1 className="text-3xl font-bold mb-2">锻炼跟踪</h1>
        <p className="text-gray-600">记录你的锻炼情况，追踪身体变化</p>
      </div>

      {/* 计划信息 */}
      {currentPlan && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-xl font-bold">{currentPlan.name}</h2>
              <p className="text-gray-600">目标：{currentPlan.goal} | 时长：{currentPlan.duration} 周</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">
                  {selectedDay.toISOString().split('T')[0]} {getDayOfWeek(selectedDay)}
                </span>
              </div>
            </div>
          </div>

          {/* 当日训练 */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">今日训练</h3>
              {currentWorkout ? (
                <div>
                  <div className="bg-blue-50 p-3 rounded-lg mb-4">
                    <h4 className="font-medium text-blue-800">{currentWorkout.type}</h4>
                  </div>
                  {currentWorkout.exercises.length > 0 ? (
                    <div className="space-y-3">
                      {currentWorkout.exercises.map((exercise, index) => {
                        const isCompleted = records.some(r => 
                          r.exercise_id === `exercise_${exercise}` && 
                          r.date === selectedDay.toISOString().split('T')[0]
                        )
                        return (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">{exercise}</span>
                            <button
                              onClick={() => handleWorkoutComplete(exercise)}
                              disabled={isCompleted}
                              className={cn(
                                'flex items-center space-x-1 px-3 py-1 rounded-md transition-colors',
                                isCompleted
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              )}
                            >
                              {isCompleted ? (
                                <>
                                  <Check size={16} />
                                  <span>已完成</span>
                                </>
                              ) : (
                                <>
                                  <Check size={16} />
                                  <span>标记完成</span>
                                </>
                              )}
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <p className="text-gray-600">今日休息</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-gray-600">暂无训练计划</p>
                </div>
              )}
            </div>

            {/* 身体数据记录 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">身体数据</h3>
                <button
                  onClick={() => setShowBodyMeasurementForm(true)}
                  className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Plus size={16} />
                  <span>记录数据</span>
                </button>
              </div>
              {measurements.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">日期</th>
                        <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">体重 (kg)</th>
                        <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">腰围 (cm)</th>
                        <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">臀围 (cm)</th>
                        <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">胸围 (cm)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {measurements.slice(0, 5).map((measurement, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="py-2 px-4 border-b text-sm text-gray-600">{measurement.date}</td>
                          <td className="py-2 px-4 border-b text-sm text-gray-600">{measurement.weight}</td>
                          <td className="py-2 px-4 border-b text-sm text-gray-600">{measurement.waist}</td>
                          <td className="py-2 px-4 border-b text-sm text-gray-600">{measurement.hip}</td>
                          <td className="py-2 px-4 border-b text-sm text-gray-600">{measurement.chest}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-gray-600">暂无身体数据记录</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 身体数据记录表单 */}
      {showBodyMeasurementForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">记录身体数据</h3>
              <button
                onClick={() => setShowBodyMeasurementForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Edit size={20} />
              </button>
            </div>
            <form onSubmit={handleBodyMeasurementSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                    体重 (kg)
                  </label>
                  <input
                    type="number"
                    id="weight"
                    value={bodyMeasurement.weight}
                    onChange={(e) => setBodyMeasurement(prev => ({ ...prev, weight: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    step="0.1"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="waist" className="block text-sm font-medium text-gray-700 mb-1">
                    腰围 (cm)
                  </label>
                  <input
                    type="number"
                    id="waist"
                    value={bodyMeasurement.waist}
                    onChange={(e) => setBodyMeasurement(prev => ({ ...prev, waist: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    step="0.1"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="hip" className="block text-sm font-medium text-gray-700 mb-1">
                    臀围 (cm)
                  </label>
                  <input
                    type="number"
                    id="hip"
                    value={bodyMeasurement.hip}
                    onChange={(e) => setBodyMeasurement(prev => ({ ...prev, hip: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    step="0.1"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="chest" className="block text-sm font-medium text-gray-700 mb-1">
                    胸围 (cm)
                  </label>
                  <input
                    type="number"
                    id="chest"
                    value={bodyMeasurement.chest}
                    onChange={(e) => setBodyMeasurement(prev => ({ ...prev, chest: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    step="0.1"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="arm" className="block text-sm font-medium text-gray-700 mb-1">
                    臂围 (cm)
                  </label>
                  <input
                    type="number"
                    id="arm"
                    value={bodyMeasurement.arm}
                    onChange={(e) => setBodyMeasurement(prev => ({ ...prev, arm: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    step="0.1"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="leg" className="block text-sm font-medium text-gray-700 mb-1">
                    腿围 (cm)
                  </label>
                  <input
                    type="number"
                    id="leg"
                    value={bodyMeasurement.leg}
                    onChange={(e) => setBodyMeasurement(prev => ({ ...prev, leg: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    step="0.1"
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowBodyMeasurementForm(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 提示信息 */}
      {!currentPlan && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-800 mb-2">开始你的健身计划</h3>
          <p className="text-sm text-blue-700 mb-4">
            你还没有创建健身计划，点击下方按钮开始生成或选择模板。
          </p>
          <div className="flex space-x-4">
            <a
              href="/plan/generate"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              生成计划
              <ChevronRight className="ml-1 h-4 w-4" />
            </a>
            <a
              href="/plan/templates"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
            >
              选择模板
              <ChevronRight className="ml-1 h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default Track
