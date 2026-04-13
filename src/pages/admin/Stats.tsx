import React from 'react'
import { cn } from '../../utils/cn'
import { BarChart3, Users, Calendar, Activity, TrendingUp } from 'lucide-react'

const Stats: React.FC = () => {
  // 模拟统计数据
  const stats = {
    totalUsers: 128,
    activeUsers: 89,
    totalPlans: 256,
    completedWorkouts: 1245,
    monthlyActivity: [
      { month: '1月', workouts: 120 },
      { month: '2月', workouts: 156 },
      { month: '3月', workouts: 189 },
      { month: '4月', workouts: 210 },
      { month: '5月', workouts: 234 },
      { month: '6月', workouts: 256 }
    ],
    goalDistribution: [
      { goal: '减脂', count: 45 },
      { goal: '增肌', count: 35 },
      { goal: '塑形', count: 28 },
      { goal: '综合提升', count: 20 }
    ]
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">数据统计</h1>
        <p className="text-gray-600">查看系统数据统计信息</p>
      </div>

      {/* 概览统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">总用户数</h3>
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <TrendingUp size={14} className="mr-1" />
            <span>12.5% 增长</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">活跃用户</h3>
            <Activity className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <TrendingUp size={14} className="mr-1" />
            <span>8.3% 增长</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">总计划数</h3>
            <Calendar className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalPlans}</p>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <TrendingUp size={14} className="mr-1" />
            <span>15.2% 增长</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">完成锻炼数</h3>
            <BarChart3 className="h-5 w-5 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.completedWorkouts}</p>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <TrendingUp size={14} className="mr-1" />
            <span>23.7% 增长</span>
          </div>
        </div>
      </div>

      {/* 月度活动统计 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">月度活动统计</h3>
          <div className="h-64">
            <div className="w-full h-full flex items-end justify-between">
              {stats.monthlyActivity.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-10 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md"
                    style={{ height: `${(item.workouts / 300) * 100}%` }}
                  ></div>
                  <span className="text-xs text-gray-600 mt-2">{item.month}</span>
                  <span className="text-xs font-medium mt-1">{item.workouts}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 目标分布 */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">目标分布</h3>
          <div className="space-y-4">
            {stats.goalDistribution.map((item, index) => {
              const percentage = (item.count / stats.totalUsers) * 100
              return (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{item.goal}</span>
                    <span className="text-sm text-gray-600">{item.count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={cn(
                        'h-2 rounded-full transition-all duration-500',
                        index === 0 ? 'bg-orange-500' :
                        index === 1 ? 'bg-blue-500' :
                        index === 2 ? 'bg-purple-500' :
                        'bg-green-500'
                      )}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 系统概览 */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">系统概览</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">用户留存率</h4>
            <p className="text-2xl font-bold text-blue-600">68.5%</p>
            <p className="text-xs text-blue-600 mt-1">较上月提升 3.2%</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-green-800 mb-2">平均计划完成率</h4>
            <p className="text-2xl font-bold text-green-600">72.3%</p>
            <p className="text-xs text-green-600 mt-1">较上月提升 5.1%</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-purple-800 mb-2">用户满意度</h4>
            <p className="text-2xl font-bold text-purple-600">4.8/5</p>
            <p className="text-xs text-purple-600 mt-1">基于 120 份反馈</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stats
