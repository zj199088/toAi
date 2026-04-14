import React, { useState, useEffect } from 'react'
import { useUserStore } from '../store'
import { cn } from '../utils/cn'
import { Mail, Lock, User, MessageSquare, Loader2, Activity, Zap, Shield, ChevronRight } from 'lucide-react'

const Login: React.FC = () => {
  const { signUp, signIn, signInWithWechat, error, isLoading } = useUserStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [name, setName] = useState('')
  const [isRedirecting, setIsRedirecting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading || isRedirecting) return
    
    let success = false
    if (isRegistering) {
      success = await signUp(email, password, name)
    } else {
      success = await signIn(email, password)
    }
    
    if (success) {
      setIsRedirecting(true)
      setTimeout(() => {
        window.location.href = '/'
      }, 100)
    }
  }

  const handleWechatLogin = async () => {
    if (isLoading || isRedirecting) return
    
    const mockWechatInfo = {
      openid: 'mock_openid_123',
      nickname: '微信用户',
      avatarUrl: 'https://via.placeholder.com/150'
    }
    const success = await signInWithWechat(mockWechatInfo)
    
    if (success) {
      setIsRedirecting(true)
      setTimeout(() => {
        window.location.href = '/'
      }, 100)
    }
  }

  // 添加背景动画效果
  useEffect(() => {
    const interval = setInterval(() => {
      const container = document.querySelector('.login-container') as HTMLElement
      if (container) {
        const randomX = Math.random() * 100
        const randomY = Math.random() * 100
        container.style.setProperty('--cursor-x', `${randomX}%`)
        container.style.setProperty('--cursor-y', `${randomY}%`)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden login-container" style={{
      '--cursor-x': '50%',
      '--cursor-y': '50%'
    } as React.CSSProperties}>
      {/* 科幻背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-blue-900">
        {/* 网格背景 */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNi02IDIuNjg2LTYgNiAyLjY4NiA2IDYgNnptMC00YzUuNTI3IDAgMTAtNC40NzMgMTAtMTBTNDEuNTI3IDAgMzYgMCAzNiA0LjQ3MyAzNiAxMCA0MS40NzMgMTAgNTAgMTAgNTAtNC40NzMgNTAtMTAgNDUuNTI3LTEwIDM2LTEweiIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        {/* 发光效果 */}
        <div className="absolute inset-0 bg-gradient-radial from-cyan-500/30 via-transparent to-transparent" style={{ 
          backgroundPosition: 'var(--cursor-x) var(--cursor-y)',
          backgroundSize: '800px 800px',
          backgroundRepeat: 'no-repeat'
        }}></div>
        
        {/* 动态线条 */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="absolute h-px bg-cyan-500/30 animate-pulse"
              style={{
                left: 0,
                right: 0,
                top: `${(i + 1) * 20}%`,
                animationDelay: `${i * 0.5}s`
              }}
            ></div>
          ))}
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="absolute w-px bg-cyan-500/30 animate-pulse"
              style={{
                top: 0,
                bottom: 0,
                left: `${(i + 1) * 20}%`,
                animationDelay: `${i * 0.5}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* 跳转中的全屏加载状态 */}
      {isRedirecting && (
        <div className="absolute inset-0 bg-slate-900/95 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 relative">
              <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-4 border-cyan-400 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
              <Activity className="absolute inset-0 flex items-center justify-center text-cyan-400" size={32} />
            </div>
            <p className="text-xl font-semibold text-cyan-300 mb-2">登录成功！</p>
            <p className="text-cyan-100">正在进入健身空间...</p>
          </div>
        </div>
      )}

      {/* 登录卡片 */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-cyan-500/30">
          {/* 头部 */}
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 py-8 px-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNi02IDIuNjg2LTYgNiAyLjY4NiA2IDYgNnptMC00YzUuNTI3IDAgMTAtNC40NzMgMTAtMTBTNDEuNTI3IDAgMzYgMCAzNiA0LjQ3MyAzNiAxMCA0MS40NzMgMTAgNTAgMTAgNTAtNC40NzMgNTAtMTAgNDUuNTI3LTEwIDM2LTEweiIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center border-2 border-cyan-400 shadow-lg shadow-cyan-500/50">
                  <Zap className="text-cyan-400" size={32} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white text-center mb-2">
                久坐赎罪健身
              </h2>
              <p className="text-cyan-200 text-center text-sm">
                {isRegistering ? '创建你的健身账号' : '登录进入健身空间'}
              </p>
            </div>
          </div>

          {/* 表单 */}
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300">
                <div className="flex items-center">
                  <Shield className="mr-3 h-5 w-5" />
                  <span>{error}</span>
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              {isRegistering && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-cyan-200 mb-2">
                    用户名
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-cyan-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 bg-slate-700/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder:text-cyan-300/50"
                      placeholder="请输入用户名"
                      required
                    />
                  </div>
                </div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-cyan-200 mb-2">
                  邮箱
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-cyan-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 bg-slate-700/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder:text-cyan-300/50"
                    placeholder="请输入邮箱"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-cyan-200 mb-2">
                  密码
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-cyan-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 bg-slate-700/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder:text-cyan-300/50"
                    placeholder="请输入密码"
                    required
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isLoading || isRedirecting}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 transform hover:scale-105 hover:shadow-cyan-500/50"
                >
                  {(isLoading || isRedirecting) ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      {isRedirecting ? '进入空间...' : '验证身份...'}
                    </>
                  ) : (
                    <>
                      {isRegistering ? '创建账号' : '登录'}
                      <ChevronRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                >
                  {isRegistering ? '已有账号？去登录' : '没有账号？去注册'}
                </button>
                <a href="#" className="text-sm text-cyan-400/70 hover:text-cyan-300 transition-colors">
                  忘记密码？
                </a>
              </div>
            </form>
            
            {/* 其他登录方式 */}
            <div className="mt-10">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-cyan-500/30"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-slate-800 text-cyan-300">快速登录</span>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={handleWechatLogin}
                  disabled={isLoading || isRedirecting}
                  className="w-full flex items-center justify-center space-x-3 bg-slate-700/50 border border-cyan-500/30 text-cyan-200 py-3 px-4 rounded-lg hover:bg-slate-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  {(isLoading || isRedirecting) ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>{isRedirecting ? '进入空间...' : '验证身份...'}</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-5 w-5" />
                      <span>微信一键登录</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* 底部信息 */}
        <div className="mt-6 text-center">
          <p className="text-cyan-300/70 text-xs">
            © 2026 久坐赎罪健身 | 科技健身未来
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
