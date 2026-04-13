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
          user ? (
            <Layout>
              <Home />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        <Route path="/plan/generate" element={
          user ? (
            <Layout>
              <PlanGenerate />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        <Route path="/plan/templates" element={
          user ? (
            <Layout>
              <PlanTemplates />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        <Route path="/track" element={
          user ? (
            <Layout>
              <Track />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        <Route path="/diet" element={
          user ? (
            <Layout>
              <Diet />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        <Route path="/records" element={
          user ? (
            <Layout>
              <WorkoutRecords />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
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
