import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../store'
import { cn } from '../utils/cn'
import { Mail, Lock, User, MessageSquare } from 'lucide-react'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const { signUp, signIn, signInWithWechat, error, isLoading } = useUserStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [name, setName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return
    
    let success = false
    if (isRegistering) {
      success = await signUp(email, password, name)
    } else {
      success = await signIn(email, password)
    }
    
    if (success) {
      navigate('/')
    }
  }

  const handleWechatLogin = async () => {
    if (isLoading) return
    
    const mockWechatInfo = {
      openid: 'mock_openid_123',
      nickname: '微信用户',
      avatarUrl: 'https://via.placeholder.com/150'
    }
    const success = await signInWithWechat(mockWechatInfo)
    
    if (success) {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-green-400 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-green-500 py-6 px-8">
          <h2 className="text-2xl font-bold text-white text-center">
            {isRegistering ? '注册账号' : '用户登录'}
          </h2>
        </div>
        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegistering && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  用户名
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="请输入用户名"
                    required
                  />
                </div>
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                邮箱
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入邮箱"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入密码"
                  required
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading || isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-2 px-4 rounded-md hover:from-blue-700 hover:to-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {(isLoading || isSubmitting) ? '处理中...' : isRegistering ? '注册' : '登录'}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {isRegistering ? '已有账号？去登录' : '没有账号？去注册'}
              </button>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-800">
                忘记密码？
              </a>
            </div>
          </form>
          <div className="mt-8">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">其他登录方式</span>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={handleWechatLogin}
                disabled={isLoading || isSubmitting}
                className="w-full flex items-center justify-center space-x-2 bg-green-100 text-green-700 py-2 px-4 rounded-md hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageSquare size={18} />
                <span>{(isLoading || isSubmitting) ? '处理中...' : '微信登录'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
