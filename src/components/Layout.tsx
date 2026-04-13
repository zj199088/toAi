import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useUserStore } from '../store'
import { cn } from '../utils/cn'
import { Menu, X, User } from 'lucide-react'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, checkAuth, signOut } = useUserStore()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const navItems = [
    { name: '首页', path: '/' },
    { name: '生成计划', path: '/plan/generate' },
    { name: '模板选择', path: '/plan/templates' },
    { name: '锻炼跟踪', path: '/track' },
    { name: '饮食计划', path: '/diet' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm shadow-sm z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            健身计划系统
          </Link>
          
          {/* 桌面导航 */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'font-medium transition-colors hover:text-blue-600',
                  location.pathname === item.path ? 'text-blue-600' : 'text-gray-700'
                )}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">{user.user_metadata?.name || user.email}</span>
                <button
                  onClick={signOut}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  退出
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                登录
              </Link>
            )}
          </div>

          {/* 移动端菜单按钮 */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* 移动端导航 */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'font-medium py-2 transition-colors hover:text-blue-600',
                    location.pathname === item.path ? 'text-blue-600' : 'text-gray-700'
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {user ? (
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <User size={18} />
                    <span className="text-gray-700">{user.user_metadata?.name || user.email}</span>
                  </div>
                  <button
                    onClick={() => {
                      signOut()
                      setIsMenuOpen(false)
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    退出
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  登录
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* 主内容 */}
      <main className="container mx-auto px-4 pt-24 pb-12">
        {children}
      </main>

      {/* 页脚 */}
      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2026 健身计划系统. 保留所有权利.</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
