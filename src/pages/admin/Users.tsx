import React, { useState } from 'react'
import { cn } from '../../utils/cn'
import { User, Search, Filter, Edit, Trash2 } from 'lucide-react'

const Users: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')

  // 模拟用户数据
  const users = [
    {
      id: '1',
      name: '张三',
      email: 'zhangsan@example.com',
      role: 'admin',
      avatar: 'https://via.placeholder.com/50',
      createdAt: '2026-04-01'
    },
    {
      id: '2',
      name: '李四',
      email: 'lisi@example.com',
      role: 'user',
      avatar: 'https://via.placeholder.com/50',
      createdAt: '2026-04-02'
    },
    {
      id: '3',
      name: '王五',
      email: 'wangwu@example.com',
      role: 'user',
      avatar: 'https://via.placeholder.com/50',
      createdAt: '2026-04-03'
    },
    {
      id: '4',
      name: '赵六',
      email: 'zhaoliu@example.com',
      role: 'user',
      avatar: 'https://via.placeholder.com/50',
      createdAt: '2026-04-04'
    }
  ]

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || user.role === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">用户管理</h1>
        <p className="text-gray-600">管理系统用户，查看用户信息</p>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="搜索用户..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="text-gray-400" size={18} />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">所有用户</option>
            <option value="admin">管理员</option>
            <option value="user">普通用户</option>
          </select>
        </div>
      </div>

      {/* 用户列表 */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">用户</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">邮箱</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">角色</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">创建时间</th>
                <th className="py-3 px-4 text-right text-sm font-medium text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">{user.email}</td>
                  <td className="py-4 px-4">
                    <span className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    )}>
                      {user.role === 'admin' ? '管理员' : '普通用户'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">{user.createdAt}</td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-gray-500 hover:text-blue-600">
                        <Edit size={18} />
                      </button>
                      <button className="text-gray-500 hover:text-red-600">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-1">总用户数</h3>
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-1">管理员数</h3>
          <p className="text-2xl font-bold text-purple-600">{users.filter(u => u.role === 'admin').length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-1">普通用户数</h3>
          <p className="text-2xl font-bold text-blue-600">{users.filter(u => u.role === 'user').length}</p>
        </div>
      </div>
    </div>
  )
}

export default Users
