import React, { useState } from 'react'
import { cn } from '../../utils/cn'
import { Calendar, Search, Plus, Edit, Trash2 } from 'lucide-react'

const Templates: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')

  // 模拟模板数据
  const templates = [
    {
      id: '1',
      name: '基础健身模板',
      description: '适合健身新手，包含基础动作和循序渐进的训练计划',
      goal: '综合提升',
      duration: '4周',
      createdAt: '2026-04-01',
      image: 'https://via.placeholder.com/200x100?text=基础健身'
    },
    {
      id: '2',
      name: '减脂专项模板',
      description: '专注于减脂，结合有氧运动和力量训练',
      goal: '减脂',
      duration: '8周',
      createdAt: '2026-04-02',
      image: 'https://via.placeholder.com/200x100?text=减脂专项'
    },
    {
      id: '3',
      name: '增肌强化模板',
      description: '针对增肌目标，包含大重量训练和营养建议',
      goal: '增肌',
      duration: '12周',
      createdAt: '2026-04-03',
      image: 'https://via.placeholder.com/200x100?text=增肌强化'
    },
    {
      id: '4',
      name: '全身塑形模板',
      description: '塑造全身线条，提升整体体态',
      goal: '塑形',
      duration: '6周',
      createdAt: '2026-04-04',
      image: 'https://via.placeholder.com/200x100?text=全身塑形'
    }
  ]

  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">模板管理</h1>
        <p className="text-gray-600">管理健身模板，查看模板详情</p>
      </div>

      {/* 搜索和添加 */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-between items-start md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="搜索模板..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
          <Plus size={18} />
          <span>添加模板</span>
        </button>
      </div>

      {/* 模板列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="relative">
              <img src={template.image} alt={template.name} className="w-full h-48 object-cover" />
              <div className="absolute top-4 right-4 flex space-x-2">
                <button className="bg-white/80 backdrop-blur-sm p-2 rounded-full text-gray-600 hover:text-blue-600 transition-colors">
                  <Edit size={16} />
                </button>
                <button className="bg-white/80 backdrop-blur-sm p-2 rounded-full text-gray-600 hover:text-red-600 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{template.description}</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="text-xs font-medium text-blue-800 mb-1">目标</h4>
                  <p className="font-medium">{template.goal}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="text-xs font-medium text-green-800 mb-1">时长</h4>
                  <p className="font-medium">{template.duration}</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar size={14} className="mr-1" />
                <span>创建于 {template.createdAt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-1">总模板数</h3>
          <p className="text-2xl font-bold text-gray-900">{templates.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-1">减脂模板</h3>
          <p className="text-2xl font-bold text-orange-600">{templates.filter(t => t.goal === '减脂').length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-1">增肌模板</h3>
          <p className="text-2xl font-bold text-blue-600">{templates.filter(t => t.goal === '增肌').length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-1">塑形模板</h3>
          <p className="text-2xl font-bold text-purple-600">{templates.filter(t => t.goal === '塑形').length}</p>
        </div>
      </div>
    </div>
  )
}

export default Templates
