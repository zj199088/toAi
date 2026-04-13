import React, { useState, useEffect } from 'react'
import { useFitnessPlanStore, useDietPlanStore, useDietRecordStore } from '../store'
import { cn } from '../utils/cn'
import { Utensils, Check, ChevronRight } from 'lucide-react'

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
        <h1 className="text-3xl font-bold mb-2">饮食计划</h1>
        <p className="text-gray-600">根据健身目标提供科学的饮食建议</p>
      </div>

      {/* 计划信息 */}
      {currentPlan && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-xl font-bold">{currentPlan.name}</h2>
              <p className="text-gray-600">目标：{currentPlan.goal} | 时长：{currentPlan.duration} 周</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-2">
                <span className="text-gray-700">
                  {selectedDay.toISOString().split('T')[0]} {getDayOfWeek(selectedDay)}
                </span>
              </div>
            </div>
          </div>

          {/* 饮食计划 */}
          <div className="space-y-6">
            {/* 早餐 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold flex items-center">
                  <Utensils className="h-5 w-5 mr-2 text-blue-600" />
                  早餐
                </h3>
                <button
                  onClick={() => handleDietComplete('breakfast')}
                  className={cn(
                    'flex items-center space-x-1 px-3 py-1 rounded-md transition-colors',
                    localDietRecords[`${selectedDay.toISOString().split('T')[0]}_breakfast`]
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  )}
                >
                  <Check size={16} />
                  <span>
                    {localDietRecords[`${selectedDay.toISOString().split('T')[0]}_breakfast`] ? '已完成' : '标记完成'}
                  </span>
                </button>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <ul className="space-y-2">
                  {dietPlans.breakfast.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 午餐 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold flex items-center">
                  <Utensils className="h-5 w-5 mr-2 text-green-600" />
                  午餐
                </h3>
                <button
                  onClick={() => handleDietComplete('lunch')}
                  className={cn(
                    'flex items-center space-x-1 px-3 py-1 rounded-md transition-colors',
                    localDietRecords[`${selectedDay.toISOString().split('T')[0]}_lunch`]
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  )}
                >
                  <Check size={16} />
                  <span>
                    {localDietRecords[`${selectedDay.toISOString().split('T')[0]}_lunch`] ? '已完成' : '标记完成'}
                  </span>
                </button>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <ul className="space-y-2">
                  {dietPlans.lunch.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 晚餐 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold flex items-center">
                  <Utensils className="h-5 w-5 mr-2 text-purple-600" />
                  晚餐
                </h3>
                <button
                  onClick={() => handleDietComplete('dinner')}
                  className={cn(
                    'flex items-center space-x-1 px-3 py-1 rounded-md transition-colors',
                    localDietRecords[`${selectedDay.toISOString().split('T')[0]}_dinner`]
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  )}
                >
                  <Check size={16} />
                  <span>
                    {localDietRecords[`${selectedDay.toISOString().split('T')[0]}_dinner`] ? '已完成' : '标记完成'}
                  </span>
                </button>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <ul className="space-y-2">
                  {dietPlans.dinner.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-purple-600 rounded-full mr-3"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 饮食建议 */}
            <div>
              <h3 className="text-lg font-semibold mb-3">饮食建议</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    保持充足的水分摄入，每天至少2000ml
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    饮食均衡，确保蛋白质、碳水化合物和脂肪的合理比例
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    避免高糖、高脂肪和加工食品
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    按时进餐，避免过度饥饿或暴饮暴食
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    根据训练强度适当调整饮食量
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 提示信息 */}
      {!currentPlan && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-800 mb-2">开始你的健身计划</h3>
          <p className="text-sm text-blue-700 mb-4">
            你还没有创建健身计划，点击下方按钮开始生成或选择模板。
          </p>
          <div className="flex space-x-4">
            <a
              href="/plan/generate"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              生成计划
              <ChevronRight className="ml-1 h-4 w-4" />
            </a>
            <a
              href="/plan/templates"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
            >
              选择模板
              <ChevronRight className="ml-1 h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default Diet
