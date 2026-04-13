import React, { useState, useEffect } from 'react'
import { useFitnessPlanStore, useUserStore, useTemplateStore } from '../store'
import { useNavigate } from 'react-router-dom'
import { cn } from '../utils/cn'
import { Calendar, Target, ChevronRight, Check, Loader2 } from 'lucide-react'

const PlanTemplates: React.FC = () => {
  const { createPlan } = useFitnessPlanStore()
  const { user } = useUserStore()
  const { templates, isLoading, getTemplates } = useTemplateStore()
  const navigate = useNavigate()
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  // 查看 selectedTemplate 状态
  useEffect(() => {
    console.log('selectedTemplate:', selectedTemplate)
  }, [selectedTemplate])
  const [duration, setDuration] = useState(4) // 周数
  const [goal, setGoal] = useState('减脂')
  
  // 自定义计划状态
  const [customPlan, setCustomPlan] = useState({
    name: '',
    goal: '减脂',
    duration: 4,
    exercises: [
      { name: '', sets: 3, reps: 10, type: 'reps' }
    ]
  })

  // 组件加载时获取模板数据
  useEffect(() => {
    getTemplates()
  }, [getTemplates])

  // 查看模板数据
  useEffect(() => {
    console.log('模板数据:', templates)
    // 查看每个模板的锻炼内容
    templates.forEach(template => {
      console.log(`模板 ${template.id} 的锻炼内容:`, template.exercises)
      console.log(`模板 ${template.id} 的锻炼内容类型:`, typeof template.exercises)
      console.log(`模板 ${template.id} 的锻炼内容是否为数组:`, Array.isArray(template.exercises))
    })
  }, [templates])

  const durations = [4, 6, 8, 12, 16, 24] // 周数
  const goals = ['减脂', '增肌', '塑形', '增强耐力', '提高灵活性']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTemplate) return

    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(startDate.getDate() + duration * 7)

    const plan = {
      name: `${templates.find(t => t.id === selectedTemplate)?.name || '健身计划'}`,
      type: 'template',
      goal: goal,
      duration: duration,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      user_id: user?.id || 'user123' // 使用真实用户ID，如果没有则使用默认值
    }

    await createPlan(plan)
    navigate('/track')
  }

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
          选择健身模板
        </h1>
        <p className="text-gray-400">选择预设模板，快速开始你的健身之旅</p>
      </div>

      {/* 模板选择 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
              <p className="mt-2 text-gray-400">加载模板中...</p>
            </div>
          </div>
        ) : templates.length > 0 ? (
          templates.map((template) => (
            <div
              key={template.id}
              onClick={() => {
                console.log('点击模板:', template.id)
                setSelectedTemplate(template.id)
              }}
              className={cn(
                'bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl overflow-hidden border transition-all cursor-pointer relative shadow-xl hover:shadow-cyan-500/20',
                selectedTemplate === template.id
                  ? 'border-cyan-400/40 shadow-lg transform scale-105 shadow-cyan-500/30'
                  : 'border-slate-700/50 hover:border-cyan-500/30'
              )}
            >
              <div className="relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10" />
                <img 
                  src={template.image} 
                  alt={template.name} 
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-4 left-4 z-20 text-white">
                  <h4 className="text-lg font-bold">{template.name}</h4>
                  <p className="text-sm opacity-90">{template.description.substring(0, 30)}...</p>
                </div>
                {selectedTemplate === template.id && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-full p-2 z-20">
                    <Check size={16} />
                  </div>
                )}
              </div>
              <div className="p-6">
                {selectedTemplate === template.id && (
                  <div className="mt-2 space-y-3">
                    <h4 className="text-base font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3 flex items-center">
                      <Target className="h-4 w-4 mr-2 text-cyan-400" />
                      锻炼内容
                    </h4>
                    <div className="space-y-2 bg-gradient-to-r from-slate-800/50 to-slate-900/50 p-4 rounded-xl border border-cyan-500/20">
                      {(() => {
                        console.log(`渲染模板 ${template.id} 的锻炼内容:`, template.exercises)
                        if (Array.isArray(template.exercises)) {
                          if (template.exercises.length > 0) {
                            return template.exercises.map((exercise, index) => (
                              <div key={index} className="text-sm text-gray-200 flex flex-wrap items-center p-3 rounded-md bg-slate-800/80 border border-cyan-500/20">
                                <span className="w-1/3 font-medium truncate">{exercise.name || '未知动作'}</span>
                                <span className="w-1/3 text-center text-gray-300">{exercise.sets || 0} 组</span>
                                <span className="w-1/3 text-right text-gray-300 font-medium">
                                  {exercise.reps ? `${exercise.reps} 次` : exercise.duration || '未知'}
                                  {exercise.note && <span className="ml-1 text-cyan-400 text-xs">({exercise.note})</span>}
                                </span>
                              </div>
                            ))
                          } else {
                            return (
                              <div className="text-center text-gray-400 py-6">
                                暂无锻炼内容
                              </div>
                            )
                          }
                        } else {
                          return (
                            <div className="text-center text-gray-400 py-6">
                              锻炼内容格式错误
                            </div>
                          )
                        }
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center py-12">
            <p className="text-gray-400">暂无模板数据</p>
          </div>
        )}
      </div>

      {/* 计划设置 */}
      <form onSubmit={handleSubmit} className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-6 border border-cyan-500/30">
        <div className="space-y-6">
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
                  onClick={() => setGoal(g)}
                  className={cn(
                    'px-4 py-3 rounded-xl border transition-all duration-300 relative overflow-hidden group',
                    goal === g
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400/40 text-cyan-300'
                      : 'bg-slate-800/50 border-slate-700/50 text-gray-300 hover:bg-slate-700/50 hover:border-cyan-500/30 hover:text-cyan-300'
                  )}
                >
                  {goal === g && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 animate-pulse" />
                  )}
                  <span className="relative z-10 font-medium">{g}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 计划时长 */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-3">
              计划时长
            </label>
            <div className="flex items-center space-x-3">
              <select
                id="duration"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
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

          {/* 提交按钮 */}
          <div>
            <button
              type="submit"
              disabled={!selectedTemplate}
              className={cn(
                'w-full py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center font-bold',
                !selectedTemplate
                  ? 'bg-slate-700/50 border border-slate-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-600 hover:to-purple-700 shadow-lg shadow-cyan-500/40 transform hover:scale-105'
              )}
            >
              开始计划
              <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </form>

      {/* 自定义计划 */}
      <div id="custom-plan" className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-6 border border-cyan-500/30">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6 flex items-center">
          <Target className="h-6 w-6 mr-3 text-cyan-400" />
          自定义计划
        </h3>
        
        <form onSubmit={handleCustomPlanSubmit} className="space-y-6">
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
                    exercises: [...prev.exercises, { name: '', sets: 3, reps: 10, type: 'reps' }]
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
        </form>
      </div>

      {/* 提示信息 */}
      <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-xl p-6">
        <h3 className="text-lg font-medium bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3">计划说明</h3>
        <ul className="space-y-3 text-sm text-gray-300">
          <li className="flex items-start">
            <span className="mr-2 text-cyan-400">•</span>
            选择适合您当前健身水平的模板或创建自定义计划
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-cyan-400">•</span>
            根据您的健身目标调整计划设置
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-cyan-400">•</span>
            模板会根据您选择的时长自动调整训练强度
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-cyan-400">•</span>
            自定义计划允许您完全控制运动项目和强度
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-cyan-400">•</span>
            开始后，您可以在「锻炼跟踪」页面查看详细计划
          </li>
        </ul>
      </div>
    </div>
  )
}

export default PlanTemplates
