import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AdminProvider, useAdmin } from './contexts/AdminContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateWebsite from './pages/CreateWebsite';
import EditWebsite from './pages/EditWebsite';
import ViewWebsite from './pages/ViewWebsite';
import AdminDashboard from './pages/AdminDashboard';
import CreateTemplate from './pages/CreateTemplate';
import './App.css';

// Component bảo vệ route yêu cầu đăng nhập
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

// Component redirect nếu đã đăng nhập
const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/dashboard" /> : children;
};

// Component bảo vệ route yêu cầu Admin
const AdminRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const { isAdmin, loading } = useAdmin();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Đang kiểm tra quyền...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AdminProvider>
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicRoute>
                    <Signup />
                  </PublicRoute>
                }
              />

              {/* Private routes - User */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/create"
                element={
                  <PrivateRoute>
                    <CreateWebsite />
                  </PrivateRoute>
                }
              />
              <Route
                path="/edit/:websiteId"
                element={
                  <PrivateRoute>
                    <EditWebsite />
                  </PrivateRoute>
                }
              />
              <Route
                path="/view/:websiteId"
                element={
                  <PrivateRoute>
                    <ViewWebsite />
                  </PrivateRoute>
                }
              />

              {/* Admin routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/templates/create"
                element={
                  <AdminRoute>
                    <CreateTemplate />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/templates/edit/:templateId"
                element={
                  <AdminRoute>
                    <CreateTemplate />
                  </AdminRoute>
                }
              />

              {/* Default route */}
              <Route path="/" element={<Navigate to="/dashboard" />} />
              
              {/* 404 - Not Found */}
              <Route 
                path="*" 
                element={
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    gap: '20px'
                  }}>
                    <h1 style={{ color: '#667eea' }}>404</h1>
                    <p>Trang không tồn tại</p>
                    <button 
                      onClick={() => window.location.href = '/dashboard'}
                      style={{
                        padding: '12px 24px',
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      Về Dashboard
                    </button>
                  </div>
                } 
              />
            </Routes>
          </div>
        </AdminProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;