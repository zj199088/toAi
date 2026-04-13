import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useUserStore } from '../store'
import { cn } from '../utils/cn'
import { Menu, X, User, Home, Calendar, BarChart3, Utensils, Settings, LogOut, UserPlus, Shield, Activity } from 'lucide-react'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin, checkAuth, signOut, error, isLoading } = useUserStore()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  useEffect(() => {
    checkAuth()
  }, [])
  
  const navItems = [
    { name: '首页', path: '/', icon: <Home className="h-5 w-5" /> },
    { name: '生成计划', path: '/plan/generate', icon: <Calendar className="h-5 w-5" /> },
    { name: '模板选择', path: '/plan/templates', icon: <Shield className="h-5 w-5" /> },
    { name: '锻炼跟踪', path: '/track', icon: <Activity className="h-5 w-5" /> },
    { name: '饮食计划', path: '/diet', icon: <Utensils className="h-5 w-5" /> }
  ]

  const adminNavItems = [
    { name: '用户管理', path: '/admin/users', icon: <User className="h-5 w-5" /> },
    { name: '模板管理', path: '/admin/templates', icon: <Settings className="h-5 w-5" /> },
    { name: '数据统计', path: '/admin/stats', icon: <BarChart3 className="h-5 w-5" /> }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* 侧边栏导航 */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 border-r border-cyan-500/20 relative">
          {/* 侧边栏头部 */}
          <div className="p-6 border-b border-cyan-500/20 relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-cyan-500 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-purple-500 rounded-full blur-3xl" />
            </div>
            <Link to="/" className="relative z-10 text-2xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent flex items-center space-x-3">
              <Activity className="h-6 w-6 text-cyan-400 animate-pulse" />
              <span>久坐赎罪健身</span>
            </Link>
          </div>
          
          {/* 导航菜单 */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden group',
                  location.pathname === item.path 
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/40 text-cyan-300' 
                    : 'bg-slate-800/50 border border-slate-700/50 text-gray-300 hover:bg-slate-700/50 hover:border-cyan-500/30 hover:text-cyan-300'
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="relative z-10">
                  {item.icon}
                </div>
                <span className="relative z-10 font-medium">{item.name}</span>
                {location.pathname === item.path && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 animate-pulse" />
                )}
              </Link>
            ))}
            
            {isAdmin && (
              <div className="mt-6 pt-6 border-t border-slate-700/50">
                <p className="px-4 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">管理选项</p>
                {adminNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 bg-slate-800/50 border border-slate-700/50 text-gray-300 hover:bg-slate-700/50 hover:border-purple-500/30 hover:text-purple-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </nav>
          
          {/* 用户信息 */}
          <div className="p-4 border-t border-cyan-500/20">
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  {user.user_metadata?.avatar ? (
                    <img 
                      src={user.user_metadata.avatar} 
                      alt="用户头像" 
                      className="w-10 h-10 rounded-full object-cover border-2 border-cyan-400"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center border-2 border-cyan-400">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-white">{user.user_metadata?.displayName || user.user_metadata?.name || user.email.split('@')[0] || '用户'}</p>
                    <p className="text-xs text-gray-400">{user.email || 'user@example.com'}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    signOut()
                    setIsMenuOpen(false)
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 text-red-300 rounded-xl hover:bg-gradient-to-r from-red-500/30 to-orange-500/30 hover:border-red-400/40 transition-all duration-300"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="font-medium">退出</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 text-cyan-300 rounded-xl hover:bg-gradient-to-r from-cyan-500/30 to-purple-500/30 hover:border-cyan-400/40 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <UserPlus className="h-4 w-4" />
                <span className="font-medium">登录</span>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* 遮罩层 */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* 主内容 */}
      <div className="md:ml-64 min-h-screen">
        {/* 顶部栏 */}
        <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-cyan-500/20">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <button
              className="md:hidden text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex-1 md:hidden">
              <Link to="/" className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                久坐赎罪健身
              </Link>
            </div>
            <div className="hidden md:block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                {navItems.find(item => location.pathname === item.path)?.name || '久坐赎罪健身'}
              </h1>
            </div>
          </div>
        </header>
        
        {/* 内容区域 */}
        <main className="container mx-auto px-4 py-8">
          {/* 错误信息 */}
          {error && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="text-red-400">⚠️</div>
                <div className="text-red-300">{error}</div>
              </div>
            </div>
          )}
          {children}
        </main>
        
        {/* 页脚 */}
        <footer className="bg-slate-900 border-t border-cyan-500/20 py-6">
          <div className="container mx-auto px-4 text-center text-gray-400">
            <p>© 2026 久坐赎罪健身. 保留所有权利.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Layout
