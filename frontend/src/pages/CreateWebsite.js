import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { websiteAPI, templateAPI } from '../services/api';
import { ArrowLeft, Eye } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import './CreateWebsite.css';

const CreateWebsite = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [config, setConfig] = useState({});
  const [previewHTML, setPreviewHTML] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await templateAPI.getAll();
      console.log('📋 Templates fetched:', response.data.templates);
      setTemplates(response.data.templates || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      alert('Không thể tải danh sách templates');
    }
  };

  const handleConfigChange = (key, value) => {
    setConfig({ ...config, [key]: value });
  };

  const handlePreview = async () => {
    if (!title || !selectedTemplate) {
      alert('Vui lòng điền tiêu đề và chọn template');
      return;
    }

    try {
      setLoading(true);
      
      // GỌI API PREVIEW (không lưu vào Firebase)
      const response = await websiteAPI.preview({
        title,
        description,
        template: selectedTemplate,
        config
      });
      
      setPreviewHTML(response.data.previewHTML);
      setShowPreview(true);
    } catch (error) {
      console.error('Error creating preview:', error);
      alert('Có lỗi xảy ra khi tạo preview');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title || !selectedTemplate) {
      alert('Vui lòng điền tiêu đề và chọn template');
      return;
    }

    try {
      setLoading(true);
      
      // GỌI API CREATE (CÓ lưu vào Firebase)
      await websiteAPI.create({
        userId: currentUser.uid,
        title,
        description,
        template: selectedTemplate,
        config
      });
      
      alert('Tạo website thành công!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving website:', error);
      alert('Có lỗi xảy ra khi lưu website');
    } finally {
      setLoading(false);
    }
  };

  const renderConfigForm = () => {
    if (!selectedTemplate) return null;

    // Tìm template được chọn
    const template = templates.find(t => t.id === selectedTemplate);
    if (!template || !template.configSchema) {
      return <p className="help-text">Template này không có config.</p>;
    }

    const schema = template.configSchema;

    return (
      <div className="config-form">
        {Object.entries(schema).map(([key, field]) => (
          <div key={key} className="form-group">
            <label>
              {field.label} {field.required && <span className="required">*</span>}
            </label>
            {renderField(key, field)}
          </div>
        ))}
      </div>
    );
  };

  const renderField = (key, field) => {
    const value = config[key] || field.defaultValue || '';

    switch (field.type) {
      case 'text':
      case 'url':
      case 'email':
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) => handleConfigChange(key, e.target.value)}
            placeholder={field.defaultValue}
            required={field.required}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleConfigChange(key, e.target.value)}
            placeholder={field.defaultValue}
            rows="4"
            required={field.required}
          />
        );

      case 'color':
        return (
          <input
            type="color"
            value={value}
            onChange={(e) => handleConfigChange(key, e.target.value)}
            required={field.required}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleConfigChange(key, e.target.value)}
            placeholder={field.defaultValue}
            required={field.required}
          />
        );

      case 'image':
        return (
          <ImageUpload
            label=""
            currentImage={value}
            onUploadSuccess={(url) => handleConfigChange(key, url)}
          />
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleConfigChange(key, e.target.value)}
            placeholder={field.defaultValue}
          />
        );
    }
  };

  return (
    <div className="create-website">
      <header className="page-header-create">
        <div className="container">
          <button onClick={() => navigate('/dashboard')} className="btn-back">
            <ArrowLeft size={20} /> Quay lại
          </button>
          <h1>Tạo Website Mới</h1>
        </div>
      </header>

      <main className="create-content">
        <div className="container">
          <div className="create-layout">
            {/* Form bên trái */}
            <div className="form-section">
              <div className="form-card">
                <h2>Thông tin cơ bản</h2>
                
                <div className="form-group">
                  <label>Tiêu đề website *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="My Awesome Website"
                    required
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
                  <label>Chọn Template *</label>
                  <div className="template-grid">
                    {templates.length === 0 ? (
                      <div style={{ 
                        gridColumn: '1 / -1', 
                        textAlign: 'center',
                        padding: '40px',
                        color: '#999'
                      }}>
                        <p>Không có template nào. Admin cần tạo templates trước.</p>
                      </div>
                    ) : (
                      templates.map((template) => (
                        <div
                          key={template.id}
                          className={`template-item ${selectedTemplate === template.id ? 'selected' : ''}`}
                          onClick={() => setSelectedTemplate(template.id)}
                        >
                          {template.thumbnail ? (
                            <img 
                              src={template.thumbnail} 
                              alt={template.name}
                              className="template-thumbnail"
                            />
                          ) : (
                            <div className="template-icon">🎨</div>
                          )}
                          <h4>{template.name}</h4>
                          <p>{template.description}</p>
                          {template.category && (
                            <span className="template-category">{template.category}</span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {selectedTemplate && (
                  <>
                    <h3>Tùy chỉnh</h3>
                    {renderConfigForm()}
                  </>
                )}

                <div className="form-actions">
                  <button
                    onClick={handlePreview}
                    disabled={loading || !title || !selectedTemplate}
                    className="btn-preview"
                  >
                    <Eye size={18} /> Xem trước
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading || !title || !selectedTemplate}
                    className="btn-save"
                  >
                    {loading ? 'Đang lưu...' : 'Lưu website'}
                  </button>
                </div>
              </div>
            </div>

            {/* Preview bên phải */}
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
                    <p>Nhấn "Xem trước" để xem website của bạn</p>
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

export default CreateWebsite;