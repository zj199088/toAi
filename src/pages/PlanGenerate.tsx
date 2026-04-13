import React, { useState } from 'react'
import { useFitnessPlanStore } from '../store'
import { useNavigate } from 'react-router-dom'
import { cn } from '../utils/cn'
import { Upload, Activity, Target, Calendar, ChevronRight } from 'lucide-react'

const PlanGenerate: React.FC = () => {
  const { createPlan } = useFitnessPlanStore()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    goal: '减脂',
    duration: 4,
    healthReport: null as File | null
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, healthReport: e.target.files[0] }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAnalyzing(true)

    // 模拟体检报告分析过程
    setTimeout(async () => {
      const startDate = new Date()
      const endDate = new Date()
      endDate.setWeek(startDate.getWeek() + formData.duration)

      const plan = {
        name: formData.name || `${formData.goal}计划`,
        type: 'custom',
        goal: formData.goal,
        duration: formData.duration,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        user_id: 'user123' // 实际项目中应该从用户状态中获取
      }

      await createPlan(plan)
      setIsAnalyzing(false)
      navigate('/track')
    }, 2000)
  }

  const goals = ['减脂', '增肌', '塑形', '增强耐力', '提高灵活性']
  const durations = [4, 6, 8, 12, 16, 24] // 周数

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">生成个性化健身计划</h1>
        <p className="text-gray-600">上传体检报告，设置目标，获取专属健身计划</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="space-y-6">
          {/* 计划名称 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              计划名称
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入计划名称"
            />
          </div>

          {/* 健身目标 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              健身目标
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {goals.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, goal }))}
                  className={cn(
                    'px-4 py-2 rounded-md border transition-colors',
                    formData.goal === goal
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-300 hover:border-gray-400'
                  )}
                >
                  {goal}
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
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
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

          {/* 体检报告上传 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              上传体检报告
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {formData.healthReport ? (
                <div className="flex items-center justify-center space-x-2">
                  <Upload className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-700">{formData.healthReport.name}</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-600">
                    点击或拖拽文件到此处上传
                  </p>
                  <p className="text-xs text-gray-500">
                    支持 PDF、JPG、PNG 格式
                  </p>
                </div>
              )}
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
                id="health-report"
              />
              <label
                htmlFor="health-report"
                className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
              >
                选择文件
              </label>
            </div>
          </div>

          {/* 提交按钮 */}
          <div>
            <button
              type="submit"
              disabled={isAnalyzing || !formData.healthReport}
              className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-3 px-4 rounded-md hover:from-blue-700 hover:to-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isAnalyzing ? (
                <>
                  <Activity className="animate-spin h-5 w-5 mr-2" />
                  分析体检报告...
                </>
              ) : (
                <>
                  生成计划
                  <ChevronRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* 提示信息 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-blue-800 mb-2">生成计划说明</h3>
        <ul className="space-y-2 text-sm text-blue-700">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            上传体检报告后，系统会分析您的身体状况
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            根据您的健身目标，生成个性化的训练计划
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            计划包含详细的训练内容、饮食建议和进度跟踪
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            生成后，您可以在「锻炼跟踪」页面查看和执行计划
          </li>
        </ul>
      </div>
    </div>
  )
}

export default PlanGenerate
