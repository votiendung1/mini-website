import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { adminAPI } from '../services/api';
import { Plus, Edit, Trash2, Power, PowerOff, ArrowLeft } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const token = await currentUser.getIdToken();
      const response = await adminAPI.getAllTemplates(token);
      setTemplates(response.data.templates || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      if (error.response?.status === 403) {
        alert('Bạn không có quyền truy cập trang này');
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (templateId, currentStatus) => {
    try {
      const token = await currentUser.getIdToken();
      await adminAPI.toggleTemplateStatus(templateId, token);
      
      // Update local state
      setTemplates(templates.map(t => 
        t.id === templateId ? { ...t, isActive: !currentStatus } : t
      ));
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Có lỗi xảy ra');
    }
  };

  const handleDelete = async (templateId) => {
    if (!window.confirm('Bạn có chắc muốn xóa template này?')) return;

    try {
      const token = await currentUser.getIdToken();
      await adminAPI.deleteTemplate(templateId, token);
      
      alert('Xóa template thành công');
      fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      alert(error.response?.data?.error || 'Có lỗi xảy ra khi xóa');
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="container">
          <div className="header-left">
            <button onClick={() => navigate('/dashboard')} className="btn-back">
              <ArrowLeft size={20} /> Quay lại
            </button>
            <h1>🔧 Admin Dashboard</h1>
          </div>
          <button 
            onClick={() => navigate('/admin/templates/create')}
            className="btn-create-template"
          >
            <Plus size={20} /> Tạo Template Mới
          </button>
        </div>
      </header>

      <main className="admin-content">
        <div className="container">
          <div className="section-header">
            <h2>Quản lý Templates</h2>
            <span className="count-badge">{templates.length} templates</span>
          </div>

          {loading ? (
            <div className="loading">Đang tải...</div>
          ) : templates.length === 0 ? (
            <div className="empty-state">
              <p>Chưa có template nào</p>
              <button 
                onClick={() => navigate('/admin/templates/create')}
                className="btn-create-template"
              >
                <Plus size={20} /> Tạo Template Đầu Tiên
              </button>
            </div>
          ) : (
            <div className="templates-table">
              <table>
                <thead>
                  <tr>
                    <th>Template</th>
                    <th>Category</th>
                    <th>Trạng thái</th>
                    <th>Ngày tạo</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {templates.map((template) => (
                    <tr key={template.id}>
                      <td>
                        <div className="template-info">
                          <strong>{template.name}</strong>
                          <span className="template-desc">{template.description}</span>
                        </div>
                      </td>
                      <td>
                        <span className="category-badge">{template.category}</span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleToggleStatus(template.id, template.isActive)}
                          className={`status-btn ${template.isActive ? 'active' : 'inactive'}`}
                        >
                          {template.isActive ? (
                            <><Power size={16} /> Active</>
                          ) : (
                            <><PowerOff size={16} /> Inactive</>
                          )}
                        </button>
                      </td>
                      <td>
                        {new Date(template.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => navigate(`/admin/templates/edit/${template.id}`)}
                            className="btn-icon btn-edit"
                            title="Chỉnh sửa"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(template.id)}
                            className="btn-icon btn-delete"
                            title="Xóa"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;