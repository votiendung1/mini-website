import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import { websiteAPI } from '../services/api';
import { Plus, LogOut, Globe, Edit, Trash2, Settings } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, logout } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWebsites();
  }, [currentUser]);

  const fetchWebsites = async () => {
    try {
      setLoading(true);
      const response = await websiteAPI.getUserWebsites(currentUser.uid);
      setWebsites(response.data.websites || []);
    } catch (error) {
      console.error('Error fetching websites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleDelete = async (websiteId) => {
    if (!window.confirm('Bạn có chắc muốn xóa website này?')) return;

    try {
      await websiteAPI.delete(websiteId);
      fetchWebsites();
    } catch (error) {
      console.error('Error deleting website:', error);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="container">
          <h1><Globe size={32} /> Mini Website Builder</h1>
          <div className="header-actions">
            <span className="user-email">{currentUser?.email}</span>
            {isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="btn-admin"
                title="Admin Dashboard"
              >
                <Settings size={18} /> Admin
              </button>
            )}
            <button onClick={handleLogout} className="btn-logout">
              <LogOut size={18} /> Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="container">
          {/* THÊM ĐOẠN NÀY */}
          {/* <div style={{
            background: '#e3f2fd',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '0.9rem'
          }}>
            <strong>Your User ID:</strong>
            <code style={{
              background: 'white',
              padding: '5px 10px',
              borderRadius: '4px',
              marginLeft: '10px',
              userSelect: 'all'
            }}>
              {currentUser?.uid}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(currentUser?.uid);
                alert('UID đã copy!');
              }}
              style={{
                marginLeft: '10px',
                padding: '5px 15px',
                background: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Copy UID
            </button>
          </div> */}
          {/* HẾT ĐOẠN THÊM */}
          <div className="content-header">
            <h2>Website của tôi</h2>
            <button
              onClick={() => navigate('/create')}
              className="btn-create"
            >
              <Plus size={20} /> Tạo website mới
            </button>
          </div>

          {loading ? (
            <div className="loading">Đang tải...</div>
          ) : websites.length === 0 ? (
            <div className="empty-state">
              <Globe size={64} />
              <h3>Chưa có website nào</h3>
              <p>Bắt đầu tạo website đầu tiên của bạn!</p>
              <button
                onClick={() => navigate('/create')}
                className="btn-create"
              >
                <Plus size={20} /> Tạo ngay
              </button>
            </div>
          ) : (
            <div className="websites-grid">
              {websites.map((website) => (
                <div key={website.id} className="website-card">
                  {/* Click vào card để xem website */}
                  <div
                    className="card-content"
                    onClick={() => navigate(`/view/${website.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="card-header">
                      <h3>{website.title}</h3>
                      <span className="template-badge">{website.template}</span>
                    </div>
                    <p className="card-description">{website.description}</p>
                    <div className="card-meta">
                      <span className="date">
                        {new Date(website.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="card-footer">
                    <div className="card-actions">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/edit/${website.id}`);
                        }}
                        className="btn-icon"
                        title="Chỉnh sửa"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(website.id);
                        }}
                        className="btn-icon btn-danger"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;