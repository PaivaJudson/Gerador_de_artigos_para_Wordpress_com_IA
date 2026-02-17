import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { DemoProvider } from './context/DemoContext'
import Layout from './components/Layout'
import DemoLayout from './components/DemoLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Generate from './pages/Generate'
import ArticleDetail from './pages/ArticleDetail'
import DashboardDemo from './pages/DashboardDemo'
import GenerateDemo from './pages/GenerateDemo'
import ArticleDetailDemo from './pages/ArticleDetailDemo'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  return children
}

function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="spinner-border text-primary" role="status" />
      </div>
    )
  }
  if (user) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={
        <PublicOnlyRoute>
          <Login />
        </PublicOnlyRoute>
      } />
      <Route path="/register" element={
        <PublicOnlyRoute>
          <Register />
        </PublicOnlyRoute>
      } />
      {/* Demonstração: ver páginas sem login */}
      <Route path="/demo" element={
        <DemoProvider>
          <DemoLayout />
        </DemoProvider>
      }>
        <Route index element={<DashboardDemo />} />
        <Route path="gerar" element={<GenerateDemo />} />
        <Route path="artigo/:id" element={<ArticleDetailDemo />} />
      </Route>
      <Route path="/" element={
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="gerar" element={<Generate />} />
        <Route path="artigo/:id" element={<ArticleDetail />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
