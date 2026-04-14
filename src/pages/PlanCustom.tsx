import React, { useState } from 'react'
import { useFitnessPlanStore, useUserStore } from '../store'
import { useNavigate } from 'react-router-dom'
import { cn } from '../utils/cn'
import { Target, Calendar, ChevronRight } from 'lucide-react'

const PlanCustom: React.FC = () => {
  const { createPlan } = useFitnessPlanStore()
  const { user } = useUserStore()
  const navigate = useNavigate()
  
  // 自定义计划状态
  const [customPlan, setCustomPlan] = useState({
    name: '',
    goal: '减脂',
    duration: 4,
    exercises: [
      { name: '', sets: 3, reps: 10, type: 'reps', duration: undefined }
    ]
  })

  const durations = [4, 6, 8, 12, 16, 24] // 周数
  const goals = ['减脂', '增肌', '塑形', '增强耐力', '提高灵活性']

  const handleCustomPlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customPlan.name || customPlan.exercises.length === 0) return

    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(startDate.getDate() + customPlan.duration * 7)

    const plan = {
      name: customPlan.name,
      type: 'custom',
      goal: customPlan.goal,
      duration: customPlan.duration,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      user_id: user?.id || 'user123', // 使用真实用户ID
      exercises: customPlan.exercises // 传递自定义运动项目
    }

    await createPlan(plan)
    navigate('/track')
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          自定义计划
        </h1>
        <p className="text-gray-400">创建完全符合您需求的个性化健身计划</p>
      </div>

      <form onSubmit={handleCustomPlanSubmit} className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-6 border border-cyan-500/30">
        <div className="space-y-6">
          {/* 计划名称 */}
          <div>
            <label htmlFor="custom-plan-name" className="block text-sm font-medium text-gray-300 mb-3">
              计划标题
            </label>
            <input
              type="text"
              id="custom-plan-name"
              value={customPlan.name}
              onChange={(e) => setCustomPlan(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
              placeholder="输入计划标题"
              required
            />
          </div>

          {/* 健身目标 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              健身目标
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {goals.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setCustomPlan(prev => ({ ...prev, goal: g }))}
                  className={cn(
                    'px-4 py-3 rounded-xl border transition-all duration-300 relative overflow-hidden group',
                    customPlan.goal === g
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400/40 text-cyan-300'
                      : 'bg-slate-800/50 border-slate-700/50 text-gray-300 hover:bg-slate-700/50 hover:border-cyan-500/30 hover:text-cyan-300'
                  )}
                >
                  {customPlan.goal === g && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 animate-pulse" />
                  )}
                  <span className="relative z-10 font-medium">{g}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 计划时长 */}
          <div>
            <label htmlFor="custom-plan-duration" className="block text-sm font-medium text-gray-300 mb-3">
              计划时长
            </label>
            <div className="flex items-center space-x-3">
              <select
                id="custom-plan-duration"
                value={customPlan.duration}
                onChange={(e) => setCustomPlan(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
              >
                {durations.map((weeks) => (
                  <option key={weeks} value={weeks} className="bg-slate-900 text-gray-200">
                    {weeks} 周 ({Math.floor(weeks / 4)} 个月)
                  </option>
                ))}
              </select>
              <div className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-cyan-400">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* 运动项目 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              运动项目
            </label>
            <div className="space-y-4">
              {customPlan.exercises.map((exercise, index) => (
                <div key={index} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">动作名称</label>
                      <input
                        type="text"
                        value={exercise.name}
                        onChange={(e) => {
                          const newExercises = [...customPlan.exercises]
                          newExercises[index].name = e.target.value
                          setCustomPlan(prev => ({ ...prev, exercises: newExercises }))
                        }}
                        className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                        placeholder="输入动作名称"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">组数</label>
                      <input
                        type="number"
                        min="1"
                        value={exercise.sets}
                        onChange={(e) => {
                          const newExercises = [...customPlan.exercises]
                          newExercises[index].sets = parseInt(e.target.value) || 1
                          setCustomPlan(prev => ({ ...prev, exercises: newExercises }))
                        }}
                        className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">次数/时长</label>
                      <input
                        type="number"
                        min="1"
                        value={exercise.reps || exercise.duration}
                        onChange={(e) => {
                          const newExercises = [...customPlan.exercises]
                          if (exercise.type === 'reps') {
                            newExercises[index].reps = parseInt(e.target.value) || 1
                          } else {
                            newExercises[index].duration = parseInt(e.target.value) || 1
                          }
                          setCustomPlan(prev => ({ ...prev, exercises: newExercises }))
                        }}
                        className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <select
                      value={exercise.type}
                      onChange={(e) => {
                        const newExercises = [...customPlan.exercises]
                        newExercises[index].type = e.target.value
                        if (e.target.value === 'reps') {
                          newExercises[index].reps = 10
                          newExercises[index].duration = undefined
                        } else {
                          newExercises[index].duration = 60
                          newExercises[index].reps = undefined
                        }
                        setCustomPlan(prev => ({ ...prev, exercises: newExercises }))
                      }}
                      className="px-3 py-1 bg-slate-700/50 border border-slate-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-sm"
                    >
                      <option value="reps">次数</option>
                      <option value="duration">时长(秒)</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        const newExercises = customPlan.exercises.filter((_, i) => i !== index)
                        setCustomPlan(prev => ({ ...prev, exercises: newExercises }))
                      }}
                      className="text-sm text-red-400 hover:text-red-300 transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => {
                  setCustomPlan(prev => ({
                    ...prev,
                    exercises: [...prev.exercises, { name: '', sets: 3, reps: 10, type: 'reps', duration: undefined }]
                  }))
                }}
                className="w-full py-2 px-4 rounded-xl bg-slate-800/50 border border-dashed border-cyan-500/30 text-cyan-400 hover:bg-slate-700/50 hover:border-cyan-400/40 transition-all duration-300 flex items-center justify-center"
              >
                <span className="mr-2">+</span>
                添加运动项目
              </button>
            </div>
          </div>

          {/* 提交按钮 */}
          <div>
            <button
              type="submit"
              disabled={!customPlan.name || customPlan.exercises.length === 0}
              className={cn(
                'w-full py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center font-bold',
                !customPlan.name || customPlan.exercises.length === 0
                  ? 'bg-slate-700/50 border border-slate-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-600 hover:to-purple-700 shadow-lg shadow-cyan-500/40 transform hover:scale-105'
              )}
            >
              生成自定义计划
              <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </form>

      {/* 提示信息 */}
      <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-xl p-6">
        <h3 className="text-lg font-medium bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3">自定义计划说明</h3>
        <ul className="space-y-3 text-sm text-gray-300">
          <li className="flex items-start">
            <span className="mr-2 text-cyan-400">•</span>
            输入计划标题，选择健身目标和计划时长
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-cyan-400">•</span>
            添加您想要的运动项目，设置每组的组数和次数/时长
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-cyan-400">•</span>
            系统会根据您的设置生成完整的训练计划
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-cyan-400">•</span>
            生成后，您可以在「锻炼跟踪」页面查看和执行计划
          </li>
        </ul>
      </div>
    </div>
  )
}

export default PlanCustom