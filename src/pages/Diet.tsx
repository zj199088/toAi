import React, { useState, useEffect } from 'react'
import { useFitnessPlanStore, useDietPlanStore, useDietRecordStore } from '../store'
import { cn } from '../utils/cn'
import { Utensils, Check, ChevronRight, ArrowRight } from 'lucide-react'

const Diet: React.FC = () => {
  const { currentPlan } = useFitnessPlanStore()
  const { currentPlan: currentDietPlan, createPlan: createDietPlan, getPlans: getDietPlans } = useDietPlanStore()
  const { records: dietRecords, addRecord: addDietRecord, getRecords: getDietRecords } = useDietRecordStore()
  const [selectedDay, setSelectedDay] = useState(new Date())
  const [localDietRecords, setLocalDietRecords] = useState<{[key: string]: boolean}>({})

  // 模拟饮食计划数据
  const dietPlans = {
    breakfast: [
      '鸡蛋2个',
      '燕麦粥1碗',
      '蔬菜沙拉1份',
      '水果1份'
    ],
    lunch: [
      '瘦肉100g',
      '糙米1碗',
      '蔬菜200g',
      '汤1碗'
    ],
    dinner: [
      '鱼/虾100g',
      '红薯1个',
      '蔬菜200g',
      '酸奶1杯'
    ]
  }

  const getDayOfWeek = (date: Date) => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return days[date.getDay()]
  }

  useEffect(() => {
    const loadData = async () => {
      // 获取饮食计划
      await getDietPlans()
      // 获取饮食记录
      await getDietRecords()
      
      // 初始化本地记录状态
      const recordsMap: {[key: string]: boolean} = {}
      dietRecords.forEach(record => {
        const key = `${record.date}_${record.meal_type}`
        recordsMap[key] = true
      })
      setLocalDietRecords(recordsMap)
    }
    
    loadData()
  }, [getDietPlans, getDietRecords, dietRecords])

  const handleDietComplete = async (mealType: string) => {
    const date = selectedDay.toISOString().split('T')[0]
    const key = `${date}_${mealType}`
    const newStatus = !localDietRecords[key]
    
    // 更新本地状态
    setLocalDietRecords(prev => ({
      ...prev,
      [key]: newStatus
    }))
    
    // 如果标记为完成，保存到数据库
    if (newStatus) {
      await addDietRecord({
        date,
        meal_type: mealType,
        status: true
      })
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-teal-400 to-emerald-500">
          饮食计划
        </h1>
        <p className="text-gray-300">根据健身目标提供科学的饮食建议</p>
      </div>

      {/* 计划信息 */}
      {currentPlan && (
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 shadow-lg shadow-blue-900/10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
                {currentPlan.name}
              </h2>
              <p className="text-gray-400 mt-1">
                目标：{currentPlan.goal} | 时长：{currentPlan.duration} 周
              </p>
            </div>
            <div className="mt-4 md:mt-0 bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700">
              <div className="flex items-center space-x-2">
                <span className="text-blue-300 font-medium">
                  {selectedDay.toISOString().split('T')[0]} {getDayOfWeek(selectedDay)}
                </span>
              </div>
            </div>
          </div>

          {/* 饮食计划 */}
          <div className="space-y-6">
            {/* 早餐 */}
            <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 hover:border-blue-500/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center text-blue-300">
                  <Utensils className="h-5 w-5 mr-2 text-blue-400" />
                  早餐
                </h3>
                <button
                  onClick={() => handleDietComplete('breakfast')}
                  className={cn(
                    'flex items-center space-x-1 px-4 py-2 rounded-md transition-all duration-300 font-medium',
                    localDietRecords[`${selectedDay.toISOString().split('T')[0]}_breakfast`]
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-gradient-to-r from-blue-600 to-teal-500 text-white hover:from-blue-500 hover:to-teal-400'
                  )}
                >
                  <Check size={16} />
                  <span>
                    {localDietRecords[`${selectedDay.toISOString().split('T')[0]}_breakfast`] ? '已完成' : '标记完成'}
                  </span>
                </button>
              </div>
              <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
                <ul className="space-y-3">
                  {dietPlans.breakfast.map((item, index) => (
                    <li key={index} className="flex items-center text-gray-300">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 午餐 */}
            <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 hover:border-green-500/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center text-green-300">
                  <Utensils className="h-5 w-5 mr-2 text-green-400" />
                  午餐
                </h3>
                <button
                  onClick={() => handleDietComplete('lunch')}
                  className={cn(
                    'flex items-center space-x-1 px-4 py-2 rounded-md transition-all duration-300 font-medium',
                    localDietRecords[`${selectedDay.toISOString().split('T')[0]}_lunch`]
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-gradient-to-r from-blue-600 to-teal-500 text-white hover:from-blue-500 hover:to-teal-400'
                  )}
                >
                  <Check size={16} />
                  <span>
                    {localDietRecords[`${selectedDay.toISOString().split('T')[0]}_lunch`] ? '已完成' : '标记完成'}
                  </span>
                </button>
              </div>
              <div className="bg-green-900/20 border border-green-800/30 rounded-lg p-4">
                <ul className="space-y-3">
                  {dietPlans.lunch.map((item, index) => (
                    <li key={index} className="flex items-center text-gray-300">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 晚餐 */}
            <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 hover:border-purple-500/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center text-purple-300">
                  <Utensils className="h-5 w-5 mr-2 text-purple-400" />
                  晚餐
                </h3>
                <button
                  onClick={() => handleDietComplete('dinner')}
                  className={cn(
                    'flex items-center space-x-1 px-4 py-2 rounded-md transition-all duration-300 font-medium',
                    localDietRecords[`${selectedDay.toISOString().split('T')[0]}_dinner`]
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-gradient-to-r from-blue-600 to-teal-500 text-white hover:from-blue-500 hover:to-teal-400'
                  )}
                >
                  <Check size={16} />
                  <span>
                    {localDietRecords[`${selectedDay.toISOString().split('T')[0]}_dinner`] ? '已完成' : '标记完成'}
                  </span>
                </button>
              </div>
              <div className="bg-purple-900/20 border border-purple-800/30 rounded-lg p-4">
                <ul className="space-y-3">
                  {dietPlans.dinner.map((item, index) => (
                    <li key={index} className="flex items-center text-gray-300">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 饮食建议 */}
            <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 hover:border-teal-500/50 transition-all duration-300">
              <h3 className="text-lg font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-400">
                饮食建议
              </h3>
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-lg p-4">
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-start">
                    <span className="text-teal-400 mr-3 mt-0.5">•</span>
                    <span>保持充足的水分摄入，每天至少2000ml</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-400 mr-3 mt-0.5">•</span>
                    <span>饮食均衡，确保蛋白质、碳水化合物和脂肪的合理比例</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-400 mr-3 mt-0.5">•</span>
                    <span>避免高糖、高脂肪和加工食品</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-400 mr-3 mt-0.5">•</span>
                    <span>按时进餐，避免过度饥饿或暴饮暴食</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-400 mr-3 mt-0.5">•</span>
                    <span>根据训练强度适当调整饮食量</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 提示信息 */}
      {!currentPlan && (
        <div className="bg-gradient-to-br from-blue-900/30 to-teal-900/30 border border-blue-800/50 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300 mb-4">
            开始你的健身计划
          </h3>
          <p className="text-gray-400 mb-6">
            你还没有创建健身计划，点击下方按钮开始生成或选择模板。
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="/plan/generate"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg hover:from-blue-500 hover:to-teal-400 transition-all duration-300 flex items-center justify-center font-medium"
            >
              生成计划
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <a
              href="/plan/templates"
              className="px-6 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg hover:border-teal-500/50 hover:bg-gray-700 transition-all duration-300 flex items-center justify-center font-medium"
            >
              选择模板
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default Diet
