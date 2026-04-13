import React, { useState } from 'react'
import { useFitnessPlanStore, useUserStore } from '../store'
import { useNavigate } from 'react-router-dom'
import { cn } from '../utils/cn'
import { Upload, Activity, Target, Calendar, ChevronRight, Brain, FileText } from 'lucide-react'

const PlanGenerate: React.FC = () => {
  const { createPlan } = useFitnessPlanStore()
  const { user } = useUserStore()
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

    // 模拟AI分析体检报告过程
    setTimeout(async () => {
      const startDate = new Date()
      const endDate = new Date()
      endDate.setDate(startDate.getDate() + formData.duration * 7)

      const plan = {
        name: formData.name || `${formData.goal}AI计划`,
        type: 'ai',
        goal: formData.goal,
        duration: formData.duration,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        user_id: user?.id || 'user123' // 使用真实用户ID
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
        <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent flex items-center">
          <Brain className="h-10 w-10 mr-3 text-cyan-400 animate-pulse" />
          AI智能健身计划
        </h1>
        <p className="text-gray-400">上传体检报告，AI大模型分析健康状况，为您定制专属运动方案</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-6 border border-cyan-500/30">
        <div className="space-y-6">
          {/* 计划名称 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-3">
              计划名称
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
              placeholder="输入计划名称"
            />
          </div>

          {/* 健身目标 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              健身目标
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {goals.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, goal }))}
                  className={cn(
                    'px-4 py-3 rounded-xl border transition-all duration-300 relative overflow-hidden group',
                    formData.goal === goal
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400/40 text-cyan-300'
                      : 'bg-slate-800/50 border-slate-700/50 text-gray-300 hover:bg-slate-700/50 hover:border-cyan-500/30 hover:text-cyan-300'
                  )}
                >
                  {formData.goal === goal && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 animate-pulse" />
                  )}
                  <span className="relative z-10 font-medium">{goal}</span>
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
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
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

          {/* 体检报告上传 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center">
              <FileText className="h-4 w-4 mr-2 text-cyan-400" />
              上传体检报告
            </label>
            <div className="border-2 border-dashed border-cyan-500/30 rounded-xl p-6 text-center bg-slate-800/50">
              {formData.healthReport ? (
                <div className="flex items-center justify-center space-x-2">
                  <Upload className="h-5 w-5 text-green-400" />
                  <span className="text-sm text-gray-300">{formData.healthReport.name}</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-12 w-12 text-cyan-400 mx-auto" />
                  <p className="text-sm text-gray-300">
                    点击或拖拽文件到此处上传
                  </p>
                  <p className="text-xs text-gray-400">
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
                className="mt-4 inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 cursor-pointer font-medium"
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
              className={cn(
                'w-full py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center font-bold',
                isAnalyzing || !formData.healthReport
                  ? 'bg-slate-700/50 border border-slate-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-600 hover:to-purple-700 shadow-lg shadow-cyan-500/40 transform hover:scale-105'
              )}
            >
              {isAnalyzing ? (
                <>
                  <Brain className="animate-spin h-5 w-5 mr-2 text-cyan-300" />
                  AI分析体检报告中...
                </>
              ) : (
                <>
                  AI生成计划
                  <ChevronRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* 提示信息 */}
      <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-xl p-6">
        <h3 className="text-lg font-medium bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3 flex items-center">
          <Brain className="h-5 w-5 mr-2 text-cyan-400" />
          AI计划生成说明
        </h3>
        <ul className="space-y-3 text-sm text-gray-300">
          <li className="flex items-start">
            <span className="mr-2 text-cyan-400">•</span>
            上传体检报告后，AI大模型会分析您的健康状况
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-cyan-400">•</span>
            根据分析结果和健身目标，智能安排适合的运动项目
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-cyan-400">•</span>
            生成的计划包含详细的训练内容、强度建议和进度跟踪
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-cyan-400">•</span>
            生成后，与选择模板一样保存到数据库，您可以在「锻炼跟踪」页面查看和执行计划
          </li>
        </ul>
      </div>
    </div>
  )
}

export default PlanGenerate
