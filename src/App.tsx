import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useUserStore } from './store'
import Layout from './components/Layout'
import Home from "@/pages/Home";
import Login from './pages/Login'
import PlanGenerate from './pages/PlanGenerate'
import PlanTemplates from './pages/PlanTemplates'
import Track from './pages/Track'
import Diet from './pages/Diet'
import WorkoutRecords from './pages/WorkoutRecords'
import AdminUsers from './pages/admin/Users'
import AdminTemplates from './pages/admin/Templates'
import AdminStats from './pages/admin/Stats'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUserStore()
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

export default function App() {
  const { isAdmin, isLoading, user } = useUserStore()

  // 防止无限加载：如果isLoading超过10秒，强制设置为false
  React.useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        // 这里我们无法直接修改useUserStore的状态
        // 但可以在控制台输出警告
        console.warn('加载时间过长，可能是Supabase连接问题')
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
          <p className="text-sm text-gray-400 mt-2">如果长时间无响应，请检查网络连接</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout>
              <Home />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/plan/generate" element={
          <ProtectedRoute>
            <Layout>
              <PlanGenerate />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/plan/templates" element={
          <ProtectedRoute>
            <Layout>
              <PlanTemplates />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/track" element={
          <ProtectedRoute>
            <Layout>
              <Track />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/diet" element={
          <ProtectedRoute>
            <Layout>
              <Diet />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/records" element={
          <ProtectedRoute>
            <Layout>
              <WorkoutRecords />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute>
            <Layout>
              <AdminUsers />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/templates" element={
          <ProtectedRoute>
            <Layout>
              <AdminTemplates />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/stats" element={
          <ProtectedRoute>
            <Layout>
              <AdminStats />
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}
