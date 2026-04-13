import React, { useEffect, useState } from 'react'
import { useUserStore, useFitnessPlanStore, useWorkoutRecordStore } from '../store'
import { supabase } from '../lib/supabase'
import { formatChinaDateTime } from '../lib/utils'
import { Link } from 'react-router-dom'
import { Activity, Calendar, BarChart3, Utensils, User, ChevronRight, Target, Timer } from 'lucide-react'

const Home: React.FC = () => {
  const { user, isAdmin } = useUserStore()
  const { currentPlan, getPlans } = useFitnessPlanStore()
  const { records, isLoading, error, getRecords } = useWorkoutRecordStore()
  const [exerciseMap, setExerciseMap] = useState<Record<string, string>>({})
  const [loadingExercises, setLoadingExercises] = useState(true)
  const [loadingPlans, setLoadingPlans] = useState(true)

  useEffect(() => {
    const loadPlans = async () => {
      setLoadingPlans(true)
      try {
        await getPlans()
      } catch (error) {
        console.error('获取健身计划失败:', error)
      } finally {
        setLoadingPlans(false)
      }
    }
    
    loadPlans()
  }, [getPlans])

  useEffect(() => {
    if (currentPlan) {
      getRecords(currentPlan.id)
    }
  }, [currentPlan, getRecords])

  useEffect(() => {
    // 获取所有锻炼动作，构建映射表
    const fetchExercises = async () => {
      setLoadingExercises(true)
      try {
        const { data: exercises, error } = await supabase
          .from('workout_exercises')
          .select('id, name')

        if (error) {
          console.error('获取锻炼动作失败:', error)
        } else if (exercises) {
          const map: Record<string, string> = {}
          exercises.forEach(exercise => {
            map[exercise.id] = exercise.name
          })
          setExerciseMap(map)
          console.log('✅ 成功构建锻炼动作映射表:', map)
        }
      } catch (error) {
        console.error('获取锻炼动作失败:', error)
      } finally {
        setLoadingExercises(false)
      }
    }

    fetchExercises()
  }, [])

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
          <p className="text-lg md:text-xl mb-4 opacity-90">
            {user ? `欢迎回来，${user.user_metadata?.displayName || user.user_metadata?.name || user.email.split('@')[0] || '用户'}` : '欢迎使用久坐赎罪健身'}，
            {currentPlan ? '你的健身计划正在进行中' : '开始你的健康之旅'}
          </p>
        </div>
      </section>

      {/* 计划状态 */}
      {currentPlan && (
        <>
          <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-8 border border-cyan-500/30 overflow-hidden relative animate-fade-in">
            {/* 背景装饰 */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-cyan-500 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
              <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
            </div>
            
            {/* 网格线背景 */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent flex items-center group">
                  <Activity className="h-6 w-6 mr-3 text-cyan-400 animate-pulse" />
                  当前计划
                  <span className="ml-3 px-3 py-1 bg-cyan-500/20 border border-cyan-500/40 rounded-full text-xs text-cyan-300 font-medium animate-pulse">进行中</span>
                </h2>
                <Link
                  to="/track"
                  className="mt-3 md:mt-0 px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-bold hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-cyan-500/40 transform hover:scale-105 flex items-center group"
                >
                  继续锻炼
                  <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-5 rounded-xl border border-cyan-500/20 shadow-xl hover:shadow-cyan-500/20 hover:border-cyan-400/40 transition-all duration-500 hover:scale-[1.02] transform hover:-translate-y-1">
                  <h3 className="text-sm font-bold text-cyan-300 mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-cyan-400" />
                    计划名称
                  </h3>
                  <p className="text-xl font-bold text-white animate-fade-in">{currentPlan.name}</p>
                </div>
                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-5 rounded-xl border border-green-500/20 shadow-xl hover:shadow-green-500/20 hover:border-green-400/40 transition-all duration-500 hover:scale-[1.02] transform hover:-translate-y-1">
                  <h3 className="text-sm font-bold text-green-300 mb-2 flex items-center">
                    <Target className="h-4 w-4 mr-2 text-green-400" />
                    目标
                  </h3>
                  <p className="text-xl font-bold text-white animate-fade-in" style={{ animationDelay: '0.2s' }}>{currentPlan.goal}</p>
                </div>
                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-5 rounded-xl border border-purple-500/20 shadow-xl hover:shadow-purple-500/20 hover:border-purple-400/40 transition-all duration-500 hover:scale-[1.02] transform hover:-translate-y-1">
                  <h3 className="text-sm font-bold text-purple-300 mb-2 flex items-center">
                    <Timer className="h-4 w-4 mr-2 text-purple-400" />
                    时长
                  </h3>
                  <p className="text-xl font-bold text-white animate-fade-in" style={{ animationDelay: '0.4s' }}>{currentPlan.duration} 周</p>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  to="/track"
                  className="text-cyan-400 font-medium hover:text-cyan-300 flex items-center transition-colors duration-300 group"
                >
                  查看计划详情
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </section>

          {/* 锻炼记录 */}
          <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-8 border border-cyan-500/30 overflow-hidden relative animate-fade-in">
            {/* 背景装饰 */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-cyan-500 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
              <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent flex items-center mb-6">
                <Activity className="h-6 w-6 mr-3 text-cyan-400 animate-pulse" />
                锻炼记录
              </h2>
              
              {/* 记录列表 */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">最近记录 (共{records.length}条)</h3>
                {isLoading ? (
                  <div className="text-center py-8 text-gray-400">加载中...</div>
                ) : error ? (
                  <div className="text-center py-8 text-red-400">{error}</div>
                ) : records.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">暂无锻炼记录</div>
                ) : (
                  <div className="space-y-4">
                    {records.map((record, index) => {
                      console.log(`📝 显示记录 ${index + 1}/${records.length}:`, record);
                      return (
                      <div key={record.id} className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-5 rounded-xl border border-cyan-500/20 shadow-xl hover:shadow-cyan-500/20 hover:border-cyan-400/40 transition-all duration-500">
                        <div className="flex justify-between items-start">
                          <div>
                              <h4 className="text-xl font-bold text-white mb-2">
                                {exerciseMap[record.exercise_id] || 
                                 record.exercise_name || 
                                 record.exercise || 
                                 record.exercise_id?.replace('exercise_', '') || 
                                 '未知锻炼'}
                              </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                              <div className="text-gray-300">组数: <span className="text-cyan-400 font-medium">{record.sets || record.sets_completed || 0}</span></div>
                              <div className="text-gray-300">次数: <span className="text-cyan-400 font-medium">{record.reps || record.reps_completed || 0}</span></div>
                              <div className="text-gray-300">重量: <span className="text-cyan-400 font-medium">{record.weight || 0} kg</span></div>
                              <div className="text-gray-300">时长: <span className="text-cyan-400 font-medium">{record.duration || 0} 分钟</span></div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-400">
                            {formatChinaDateTime(record.created_at || record.date)}
                          </div>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <Link
                  to="/records"
                  className="text-cyan-400 font-medium hover:text-cyan-300 flex items-center transition-colors duration-300 group"
                >
                  查看完整锻炼记录
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </section>
        </>
      )}

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
