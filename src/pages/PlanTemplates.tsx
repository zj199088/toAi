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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">选择健身模板</h1>
        <p className="text-gray-600">选择预设模板，快速开始你的健身之旅</p>
      </div>

      {/* 模板选择 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              <p className="mt-2 text-gray-600">加载模板中...</p>
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
                'bg-white rounded-xl shadow-md overflow-hidden border transition-all cursor-pointer relative',
                selectedTemplate === template.id
                  ? 'border-blue-400 shadow-lg transform scale-105 shadow-blue-500/20'
                  : 'border-gray-100 hover:shadow-md hover:border-blue-200'
              )}
            >
              {selectedTemplate === template.id && (
                <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-blue-500 to-indigo-600 p-[1px] pointer-events-none">
                  <div className="w-full h-full rounded-lg bg-white" />
                </div>
              )}
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
                  <div className="absolute top-4 right-4 bg-blue-600 text-white rounded-full p-2 z-20">
                    <Check size={16} />
                  </div>
                )}
              </div>
              <div className="p-6">
                {selectedTemplate === template.id && (
                  <div className="mt-4 space-y-4">
                    <h4 className="text-sm font-medium text-blue-600 mb-2 flex items-center">
                      <Target className="h-4 w-4 mr-2" />
                      锻炼内容
                    </h4>
                    <div className="space-y-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                      {console.log(`渲染模板 ${template.id} 的锻炼内容:`, template.exercises)}
                      {Array.isArray(template.exercises) ? (
                        template.exercises.length > 0 ? (
                          template.exercises.map((exercise, index) => (
                            <div key={index} className="text-sm text-gray-700 flex flex-wrap items-center p-2 rounded-md hover:bg-white transition-colors">
                              <span className="w-1/3 font-medium truncate">{exercise.name || '未知动作'}</span>
                              <span className="w-1/3 text-center text-gray-600">{exercise.sets || 0} 组</span>
                              <span className="w-1/3 text-right text-gray-600 font-medium">
                                {exercise.reps ? `${exercise.reps} 次` : exercise.duration || '未知'}
                                {exercise.note && <span className="ml-1 text-blue-500 text-xs">({exercise.note})</span>}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-gray-500 py-4">
                            暂无锻炼内容
                          </div>
                        )
                      ) : (
                        <div className="text-center text-gray-500 py-4">
                          锻炼内容格式错误
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center py-12">
            <p className="text-gray-600">暂无模板数据</p>
          </div>
        )}
      </div>

      {/* 计划设置 */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="space-y-6">
          {/* 健身目标 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              健身目标
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {goals.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGoal(g)}
                  className={cn(
                    'px-4 py-2 rounded-md border transition-colors',
                    goal === g
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-300 hover:border-gray-400'
                  )}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* 计划时长 */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
              计划时长
            </label>
            <div className="flex items-center space-x-2">
              <select
                id="duration"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {durations.map((weeks) => (
                  <option key={weeks} value={weeks}>
                    {weeks} 周 ({Math.floor(weeks / 4)} 个月)
                  </option>
                ))}
              </select>
              <Calendar className="h-5 w-5 text-gray-500" />
            </div>
          </div>

          {/* 提交按钮 */}
          <div>
            <button
              type="submit"
              disabled={!selectedTemplate}
              className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-3 px-4 rounded-md hover:from-blue-700 hover:to-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              开始计划
              <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </form>

      {/* 提示信息 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-blue-800 mb-2">模板选择说明</h3>
        <ul className="space-y-2 text-sm text-blue-700">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            选择适合您当前健身水平的模板
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            根据您的健身目标调整计划设置
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            模板会根据您选择的时长自动调整训练强度
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            开始后，您可以在「锻炼跟踪」页面查看详细计划
          </li>
        </ul>
      </div>
    </div>
  )
}

export default PlanTemplates
