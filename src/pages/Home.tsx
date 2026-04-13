import React from 'react'
import { useUserStore, useFitnessPlanStore } from '../store'
import { Link } from 'react-router-dom'
import { cn } from '../utils/cn'
import { Activity, Calendar, BarChart3, Utensils, User, ChevronRight } from 'lucide-react'

const Home: React.FC = () => {
  const { user, isAdmin } = useUserStore()
  const { currentPlan } = useFitnessPlanStore()

  const features = [
    {
      icon: <Activity className="h-8 w-8 text-blue-600" />,
      title: '个性化健身计划',
      description: '根据体检报告和个人目标生成专属健身计划',
      link: '/plan/generate'
    },
    {
      icon: <Calendar className="h-8 w-8 text-green-600" />,
      title: '模板选择',
      description: '选择预设模板，快速开始你的健身之旅',
      link: '/plan/templates'
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      title: '锻炼跟踪',
      description: '记录每次锻炼，追踪身体数据变化',
      link: '/track'
    },
    {
      icon: <Utensils className="h-8 w-8 text-orange-600" />,
      title: '饮食计划',
      description: '根据健身目标提供科学的饮食建议',
      link: '/diet'
    }
  ]

  return (
    <div className="space-y-12">
      {/* 英雄区 */}
      <section className="bg-gradient-to-r from-blue-600 to-green-500 rounded-2xl p-8 md:p-12 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            科学健身，成就更好的自己
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            {user ? `欢迎回来，${user.user_metadata?.displayName || user.user_metadata?.name || user.email.split('@')[0] || '用户'}` : '欢迎使用久坐赎罪健身'}，
            {currentPlan ? '你的健身计划正在进行中' : '开始你的健康之旅'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to={currentPlan ? '/track' : '/plan/generate'}
              className="px-6 py-3 bg-white text-blue-600 rounded-md font-medium hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              {currentPlan ? '继续锻炼' : '开始计划'}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
            {!currentPlan && (
              <Link
                to="/plan/templates"
                className="px-6 py-3 bg-transparent border border-white text-white rounded-md font-medium hover:bg-white/10 transition-colors flex items-center justify-center"
              >
                浏览模板
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* 功能卡片 */}
      <section>
        <h2 className="text-2xl font-bold mb-8 text-center">核心功能</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 计划状态 */}
      {currentPlan && (
        <section className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-2xl font-bold mb-4">当前计划</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-1">计划名称</h3>
              <p className="text-lg font-semibold text-gray-800">{currentPlan.name}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-800 mb-1">目标</h3>
              <p className="text-lg font-semibold text-gray-800">{currentPlan.goal}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-purple-800 mb-1">时长</h3>
              <p className="text-lg font-semibold text-gray-800">{currentPlan.duration} 周</p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/track"
              className="text-blue-600 font-medium hover:text-blue-800 flex items-center"
            >
              查看计划详情
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </section>
      )}

      {/* 管理员提示 */}
      {isAdmin && (
        <section className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center mb-4">
            <User className="h-6 w-6 mr-2" />
            <h2 className="text-xl font-bold">管理员功能</h2>
          </div>
          <p className="mb-4 opacity-90">
            作为管理员，你可以管理用户、健身模板和查看系统数据统计。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/users"
              className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-md hover:bg-white/30 transition-colors"
            >
              用户管理
            </Link>
            <Link
              to="/admin/templates"
              className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-md hover:bg-white/30 transition-colors"
            >
              模板管理
            </Link>
            <Link
              to="/admin/stats"
              className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-md hover:bg-white/30 transition-colors"
            >
              数据统计
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}

export default Home
