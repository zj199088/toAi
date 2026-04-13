import React, { useState, useEffect } from 'react'
import { useWorkoutRecordStore } from '../store'
import { supabase } from '../lib/supabase'
import { Activity, Calendar, Dumbbell, Zap, Timer, ChevronLeft, ChevronRight } from 'lucide-react'

const WorkoutRecords: React.FC = () => {
  const { records, isLoading, error, getRecords } = useWorkoutRecordStore()
  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage] = useState(10)
  const [exerciseMap, setExerciseMap] = useState<Record<string, string>>({})
  const [loadingExercises, setLoadingExercises] = useState(true)

  useEffect(() => {
    // 这里应该从当前计划获取 planId
    // 暂时使用一个默认值，实际项目中应该从状态中获取
    const planId = 'plan123'
    getRecords(planId)
  }, [getRecords])

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
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent flex items-center mb-6">
            <Activity className="h-6 w-6 mr-3 text-cyan-400 animate-pulse" />
            所有锻炼记录
          </h2>
          
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
                          <span>{record.date || new Date(record.created_at).toISOString().split('T')[0]}</span>
                        </div>
                        <div className="mt-1">
                          {new Date(record.created_at || record.date).toLocaleTimeString('zh-CN')}
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