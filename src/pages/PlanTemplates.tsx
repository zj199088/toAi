import React, { useState } from 'react'
import { useFitnessPlanStore } from '../store'
import { useNavigate } from 'react-router-dom'
import { cn } from '../utils/cn'
import { Calendar, Target, ChevronRight, Check } from 'lucide-react'

const PlanTemplates: React.FC = () => {
  const { createPlan } = useFitnessPlanStore()
  const navigate = useNavigate()
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [duration, setDuration] = useState(4) // 周数
  const [goal, setGoal] = useState('减脂')

  const templates = [
    {
      id: 'beginner',
      name: '基础健身模板',
      description: '适合健身新手，包含基础动作和循序渐进的训练计划',
      image: 'https://via.placeholder.com/400x200?text=基础健身'
    },
    {
      id: 'fat-loss',
      name: '减脂专项模板',
      description: '专注于减脂，结合有氧运动和力量训练',
      image: 'https://via.placeholder.com/400x200?text=减脂专项'
    },
    {
      id: 'muscle-gain',
      name: '增肌强化模板',
      description: '针对增肌目标，包含大重量训练和营养建议',
      image: 'https://via.placeholder.com/400x200?text=增肌强化'
    },
    {
      id: 'body-shaping',
      name: '全身塑形模板',
      description: '塑造全身线条，提升整体体态',
      image: 'https://via.placeholder.com/400x200?text=全身塑形'
    }
  ]

  const durations = [4, 6, 8, 12, 16, 24] // 周数
  const goals = ['减脂', '增肌', '塑形', '增强耐力', '提高灵活性']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTemplate) return

    const startDate = new Date()
    const endDate = new Date()
    endDate.setWeek(startDate.getWeek() + duration)

    const plan = {
      name: `${templates.find(t => t.id === selectedTemplate)?.name || '健身计划'}`,
      type: 'template',
      goal: goal,
      duration: duration,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      user_id: 'user123' // 实际项目中应该从用户状态中获取
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
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => setSelectedTemplate(template.id)}
            className={cn(
              'bg-white rounded-xl shadow-md overflow-hidden border transition-all cursor-pointer',
              selectedTemplate === template.id
                ? 'border-blue-600 shadow-lg transform scale-105'
                : 'border-gray-100 hover:shadow-md'
            )}
          >
            <div className="relative">
              <img src={template.image} alt={template.name} className="w-full h-48 object-cover" />
              {selectedTemplate === template.id && (
                <div className="absolute top-4 right-4 bg-blue-600 text-white rounded-full p-2">
                  <Check size={16} />
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{template.description}</p>
            </div>
          </div>
        ))}
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
