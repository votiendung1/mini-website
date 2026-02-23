import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { websiteAPI } from '../services/api';
import { ArrowLeft, Eye, Save } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import './CreateWebsite.css';

const EditWebsite = () => {
  const { websiteId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [website, setWebsite] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [config, setConfig] = useState({});
  const [previewHTML, setPreviewHTML] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchWebsite();
  }, [websiteId]);

  const fetchWebsite = async () => {
    try {
      setLoading(true);
      const response = await websiteAPI.getById(websiteId);
      const data = response.data.website;

      setWebsite(data);
      setTitle(data.title);
      setDescription(data.description || '');
      setConfig(data.config || {});
    } catch (error) {
      console.error('Error fetching website:', error);
      alert('Không thể tải thông tin website');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (key, value) => {
    setConfig({ ...config, [key]: value });
  };

  const handlePreview = async () => {
    try {
      // GỌI API PREVIEW (KHÔNG lưu vào database)
      const response = await websiteAPI.preview({
        title,
        description,
        template: website.template,
        config
      });

      setPreviewHTML(response.data.previewHTML);
      setShowPreview(true);
    } catch (error) {
      console.error('Error creating preview:', error);
      alert('Có lỗi xảy ra khi tạo preview');
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await websiteAPI.update(websiteId, {
        title,
        description,
        config
      });

      alert('Cập nhật website thành công!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving website:', error);
      alert('Có lỗi xảy ra khi lưu website');
    } finally {
      setSaving(false);
    }
  };

  const renderConfigForm = () => {
    if (!website) return null;

    switch (website.template) {
      case 'portfolio':
        return (
          <div className="config-form">
            <div className="form-group">
              <label>Màu nền</label>
              <input
                type="color"
                value={config.backgroundColor || '#ffffff'}
                onChange={(e) => handleConfigChange('backgroundColor', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Màu chữ</label>
              <input
                type="color"
                value={config.textColor || '#333333'}
                onChange={(e) => handleConfigChange('textColor', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Màu chủ đạo</label>
              <input
                type="color"
                value={config.primaryColor || '#007bff'}
                onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Text Hero</label>
              <input
                type="text"
                value={config.heroText || ''}
                onChange={(e) => handleConfigChange('heroText', e.target.value)}
                placeholder="Welcome to my portfolio"
              />
            </div>
            <div className="form-group">
              <label>Giới thiệu</label>
              <textarea
                value={config.aboutText || ''}
                onChange={(e) => handleConfigChange('aboutText', e.target.value)}
                placeholder="Giới thiệu về bản thân..."
                rows="4"
              />
            </div>
          </div>
        );

      case 'landing-page':
        return (
          <div className="config-form">
            <div className="form-group">
              <label>Màu chủ đạo</label>
              <input
                type="color"
                value={config.primaryColor || '#ff6b6b'}
                onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Text nút CTA</label>
              <input
                type="text"
                value={config.ctaText || ''}
                onChange={(e) => handleConfigChange('ctaText', e.target.value)}
                placeholder="Bắt đầu ngay"
              />
            </div>
            <div className="form-group">
              <label>Link nút CTA</label>
              <input
                type="text"
                value={config.ctaLink || ''}
                onChange={(e) => handleConfigChange('ctaLink', e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
        );

      case 'blog':
        return (
          <div className="config-form">
            <div className="form-group">
              <label>Màu chủ đạo</label>
              <input
                type="color"
                value={config.primaryColor || '#2ecc71'}
                onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
              />
            </div>
          </div>
        );

      case 'business-card':
        return (
          <div className="config-form">
            <div className="form-group">
              <label>Tên</label>
              <input
                type="text"
                value={config.name || ''}
                onChange={(e) => handleConfigChange('name', e.target.value)}
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div className="form-group">
              <label>Chức danh</label>
              <input
                type="text"
                value={config.jobTitle || ''}
                onChange={(e) => handleConfigChange('jobTitle', e.target.value)}
                placeholder="Web Developer"
              />
            </div>
            <div className="form-group">
              <label>Điện thoại</label>
              <input
                type="tel"
                value={config.phone || ''}
                onChange={(e) => handleConfigChange('phone', e.target.value)}
                placeholder="0123456789"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={config.email || ''}
                onChange={(e) => handleConfigChange('email', e.target.value)}
                placeholder="email@example.com"
              />
            </div>
            <div className="form-group">
              <label>Địa chỉ</label>
              <input
                type="text"
                value={config.address || ''}
                onChange={(e) => handleConfigChange('address', e.target.value)}
                placeholder="Hà Nội, Việt Nam"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        Đang tải...
      </div>
    );
  }

  return (
    <div className="create-website">
      <header className="page-header">
        <div className="container">
          <button onClick={() => navigate('/dashboard')} className="btn-back">
            <ArrowLeft size={20} /> Quay lại
          </button>
          <h1>Chỉnh sửa Website</h1>
        </div>
      </header>

      <main className="create-content">
        <div className="container">
          <div className="create-layout">
            <div className="form-section">
              <div className="form-card">
                <h2>Thông tin cơ bản</h2>

                <div className="form-group">
                  <label>Tiêu đề website</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="My Awesome Website"
                  />
                </div>

                <div className="form-group">
                  <label>Mô tả</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Mô tả ngắn về website..."
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Template</label>
                  <div style={{
                    padding: '12px',
                    background: '#f5f5f5',
                    borderRadius: '5px',
                    fontWeight: '600',
                    color: '#667eea'
                  }}>
                    {website?.template}
                  </div>
                </div>

                <h3>Tùy chỉnh</h3>
                {renderConfigForm()}

                <div className="form-actions">
                  <button
                    onClick={handlePreview}
                    disabled={saving}
                    className="btn-preview"
                  >
                    <Eye size={18} /> Xem trước
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-save"
                  >
                    <Save size={18} /> {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                </div>
              </div>
            </div>

            <div className="preview-section">
              <div className="preview-card">
                <h3>Preview</h3>
                {showPreview && previewHTML ? (
                  <iframe
                    srcDoc={previewHTML}
                    title="Website Preview"
                    className="preview-iframe"
                  />
                ) : (
                  <div className="preview-placeholder">
                    <p>Nhấn "Xem trước" để xem thay đổi</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditWebsite;