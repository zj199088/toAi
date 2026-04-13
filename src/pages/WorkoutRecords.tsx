import React, { useState, useEffect } from 'react'
import { useWorkoutRecordStore, useFitnessPlanStore } from '../store'
import { supabase } from '../lib/supabase'
import { formatChinaDate, formatChinaTime } from '../lib/utils'
import { Activity, Calendar, Dumbbell, Zap, Timer, ChevronLeft, ChevronRight, Search, Filter, X } from 'lucide-react'

const WorkoutRecords: React.FC = () => {
  const { records, isLoading, error, getRecords } = useWorkoutRecordStore()
  const { plans, getPlans } = useFitnessPlanStore()
  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage] = useState(10)
  const [exerciseMap, setExerciseMap] = useState<Record<string, string>>({})
  const [loadingExercises, setLoadingExercises] = useState(true)
  
  // 查询条件状态
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [planName, setPlanName] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    // 首先获取健身计划
    const loadData = async () => {
      await getPlans()
    }
    loadData()
  }, [getPlans])

  useEffect(() => {
    // 获取所有锻炼记录，支持查询条件
    console.log('✅ 获取锻炼记录，查询条件:', { startDate, endDate, planName })
    getRecords(undefined, undefined, startDate, endDate, planName)
  }, [getRecords, startDate, endDate, planName])

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

  // 计算分页
  const indexOfLastRecord = currentPage * recordsPerPage
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage
  const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord)
  const totalPages = Math.ceil(records.length / recordsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // 重置查询条件
  const resetFilters = () => {
    setStartDate('')
    setEndDate('')
    setPlanName('')
    setCurrentPage(1)
  }

  // 检查是否有查询条件
  const hasFilters = startDate || endDate || planName

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          锻炼记录
        </h1>
        <p className="text-gray-400">查看你的所有锻炼记录</p>
      </div>

      {/* 记录列表 */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-6 border border-cyan-500/30 overflow-hidden relative">
        {/* 背景装饰 */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-cyan-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-purple-500 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10">
          {/* 标题和筛选按钮 */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent flex items-center">
              <Activity className="h-6 w-6 mr-3 text-cyan-400 animate-pulse" />
              所有锻炼记录
            </h2>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-xl text-cyan-300 hover:from-cyan-500/30 hover:to-purple-500/30 transition-all duration-300"
            >
              <Filter className="h-5 w-5" />
              <span>筛选</span>
              {hasFilters && (
                <span className="flex items-center justify-center w-5 h-5 bg-cyan-500 text-white text-xs rounded-full">
                  1
                </span>
              )}
            </button>
          </div>
          
          {/* 筛选条件 */}
          {showFilters && (
            <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-cyan-500/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 开始日期 */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-1.5 text-cyan-400" />
                    开始日期
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
                  />
                </div>
                
                {/* 结束日期 */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-1.5 text-cyan-400" />
                    结束日期
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
                  />
                </div>
                
                {/* 计划名称 */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                    <Search className="h-4 w-4 mr-1.5 text-cyan-400" />
                    计划名称
                  </label>
                  <input
                    type="text"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    placeholder="输入计划名称..."
                    className="w-full px-4 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
              
              {/* 重置按钮 */}
              {hasFilters && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={resetFilters}
                    className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-xl text-gray-300 hover:bg-slate-700 transition-all duration-300"
                  >
                    <X className="h-4 w-4" />
                    <span>重置筛选</span>
                  </button>
                </div>
              )}
            </div>
          )}
          
          {isLoading ? (
            <div className="text-center py-8 text-gray-400">加载中...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-400">{error}</div>
          ) : records.length === 0 ? (
            <div className="text-center py-8 text-gray-400">暂无锻炼记录</div>
          ) : (
            <>
              <div className="space-y-4">
                {currentRecords.map((record) => (
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
                          <div className="text-gray-300 flex items-center">
                            <Dumbbell className="h-4 w-4 mr-1.5 text-cyan-400" />
                            组数: <span className="text-cyan-400 font-medium">{record.sets || record.sets_completed || 0}</span>
                          </div>
                          <div className="text-gray-300 flex items-center">
                            <Zap className="h-4 w-4 mr-1.5 text-yellow-400" />
                            次数: <span className="text-cyan-400 font-medium">{record.reps || record.reps_completed || 0}</span>
                          </div>
                          <div className="text-gray-300 flex items-center">
                            <Timer className="h-4 w-4 mr-1.5 text-green-400" />
                            时长: <span className="text-cyan-400 font-medium">{record.duration || 0} 分钟</span>
                          </div>
                          <div className="text-gray-300">
                            重量: <span className="text-cyan-400 font-medium">{record.weight || 0} kg</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400 flex flex-col items-end">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-cyan-400" />
                          <span>{record.date || formatChinaDate(record.created_at)}</span>
                        </div>
                        <div className="mt-1">
                          {formatChinaTime(record.created_at || record.date)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 分页 */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-xl border border-slate-700/50 text-gray-300 hover:border-cyan-500/30 hover:text-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => paginate(page)}
                        className={`px-4 py-2 rounded-xl transition-all duration-300 ${currentPage === page ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/40 text-cyan-300' : 'border border-slate-700/50 text-gray-300 hover:border-cyan-500/30 hover:text-cyan-300'}`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-xl border border-slate-700/50 text-gray-300 hover:border-cyan-500/30 hover:text-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default WorkoutRecords