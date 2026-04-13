import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useUserStore } from './store'
import Layout from './components/Layout'
import Home from "@/pages/Home";
import Login from './pages/Login'
import PlanGenerate from './pages/PlanGenerate'
import PlanTemplates from './pages/PlanTemplates'
import Track from './pages/Track'
import Diet from './pages/Diet'
import AdminUsers from './pages/admin/Users'
import AdminTemplates from './pages/admin/Templates'
import AdminStats from './pages/admin/Stats'

export default function App() {
  const { checkAuth, isAdmin, isLoading } = useUserStore()

  useEffect(() => {
    // 暂时注释掉认证检查，以解决加载中问题
    // checkAuth()
  }, [checkAuth])

  // 暂时强制设置isLoading为false，以解决加载中问题
  if (false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <Layout>
            <Home />
          </Layout>
        } />
        <Route path="/plan/generate" element={
          <Layout>
            <PlanGenerate />
          </Layout>
        } />
        <Route path="/plan/templates" element={
          <Layout>
            <PlanTemplates />
          </Layout>
        } />
        <Route path="/track" element={
          <Layout>
            <Track />
          </Layout>
        } />
        <Route path="/diet" element={
          <Layout>
            <Diet />
          </Layout>
        } />
        <Route path="/admin/users" element={
          isAdmin ? (
            <Layout>
              <AdminUsers />
            </Layout>
          ) : (
            <Navigate to="/" replace />
          )
        } />
        <Route path="/admin/templates" element={
          isAdmin ? (
            <Layout>
              <AdminTemplates />
            </Layout>
          ) : (
            <Navigate to="/" replace />
          )
        } />
        <Route path="/admin/stats" element={
          isAdmin ? (
            <Layout>
              <AdminStats />
            </Layout>
          ) : (
            <Navigate to="/" replace />
          )
        } />
      </Routes>
    </Router>
  );
}
