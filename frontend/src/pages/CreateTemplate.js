import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { adminAPI } from '../services/api';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import './CreateTemplate.css';

const CreateTemplate = () => {
  const { templateId } = useParams();
  const isEditMode = !!templateId;
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'personal',
    thumbnail: '',
    features: [],
    htmlTemplate: '',
    cssTemplate: '',
    configSchema: {} // Dynamic fields
  });

  const [featureInput, setFeatureInput] = useState('');
  
  // State cho dynamic config fields
  const [newField, setNewField] = useState({
    key: '',
    type: 'text',
    label: '',
    defaultValue: '',
    required: false
  });
  const [editingFieldKey, setEditingFieldKey] = useState(null); // Đang edit field nào

  useEffect(() => {
    if (isEditMode) {
      fetchTemplate();
    }
  }, [templateId]);

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      const token = await currentUser.getIdToken();
      const response = await adminAPI.getTemplateById(templateId, token);
      const templateData = response.data.template;
      
      console.log('📥 Template loaded:', templateData);
      
      setFormData(templateData);
    } catch (error) {
      console.error('Error fetching template:', error);
      alert('Không thể tải template');
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    
    setFormData({
      ...formData,
      features: [...formData.features, featureInput.trim()]
    });
    setFeatureInput('');
  };

  const handleRemoveFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  // Thêm config field mới
  const handleAddConfigField = () => {
    if (!newField.key || !newField.label) {
      alert('Vui lòng điền Key và Label');
      return;
    }

    // Check duplicate key (nếu không phải đang edit)
    if (!editingFieldKey && formData.configSchema[newField.key]) {
      alert('Key này đã tồn tại');
      return;
    }

    // Nếu đang edit và key thay đổi, xóa key cũ
    if (editingFieldKey && editingFieldKey !== newField.key) {
      const newSchema = { ...formData.configSchema };
      delete newSchema[editingFieldKey];
      setFormData({
        ...formData,
        configSchema: {
          ...newSchema,
          [newField.key]: {
            type: newField.type,
            label: newField.label,
            defaultValue: newField.defaultValue,
            required: newField.required
          }
        }
      });
    } else {
      setFormData({
        ...formData,
        configSchema: {
          ...formData.configSchema,
          [newField.key]: {
            type: newField.type,
            label: newField.label,
            defaultValue: newField.defaultValue,
            required: newField.required
          }
        }
      });
    }

    // Reset form
    setNewField({
      key: '',
      type: 'text',
      label: '',
      defaultValue: '',
      required: false
    });
    setEditingFieldKey(null);
  };

  // Edit config field
  const handleEditConfigField = (key) => {
    const field = formData.configSchema[key];
    setNewField({
      key: key,
      type: field.type,
      label: field.label,
      defaultValue: field.defaultValue || '',
      required: field.required || false
    });
    setEditingFieldKey(key);
    
    // Scroll to form
    window.scrollTo({ top: document.querySelector('.config-field-form').offsetTop + 1000, behavior: 'smooth' });
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setNewField({
      key: '',
      type: 'text',
      label: '',
      defaultValue: '',
      required: false
    });
    setEditingFieldKey(null);
  };

  // Xóa config field
  const handleRemoveConfigField = (key) => {
    const newSchema = { ...formData.configSchema };
    delete newSchema[key];
    setFormData({ ...formData, configSchema: newSchema });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (!formData.htmlTemplate) {
      alert('Vui lòng nhập HTML Template');
      return;
    }

    try {
      setLoading(true);
      const token = await currentUser.getIdToken();

      if (isEditMode) {
        await adminAPI.updateTemplate(templateId, formData, token);
        alert('Cập nhật template thành công!');
      } else {
        await adminAPI.createTemplate(formData, token);
        alert('Tạo template thành công!');
      }

      navigate('/admin');
    } catch (error) {
      console.error('Error saving template:', error);
      alert(error.response?.data?.error || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <div className="loading-page">Đang tải...</div>;
  }

  return (
    <div className="create-template-page">
      <header className="page-header">
        <div className="container">
          <button onClick={() => navigate('/admin')} className="btn-back">
            <ArrowLeft size={20} /> Quay lại
          </button>
          <h1>{isEditMode ? 'Chỉnh sửa Template' : 'Tạo Template Mới'}</h1>
        </div>
      </header>

      <main className="page-content">
        <div className="container">
          <form onSubmit={handleSubmit} className="template-form">
            
            {/* SECTION 1: Thông tin cơ bản */}
            <div className="form-section">
              <h2>📋 Thông tin cơ bản</h2>

              <div className="form-group">
                <label>Tên Template *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="VD: Modern Portfolio"
                  required
                />
                <small>Tên hiển thị cho user khi chọn template</small>
              </div>

              <div className="form-group">
                <label>Mô tả *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Mô tả về template này..."
                  rows="3"
                  required
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  required
                >
                  <option value="personal">Personal</option>
                  <option value="business">Business</option>
                  <option value="content">Content</option>
                  <option value="creative">Creative</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="education">Education</option>
                </select>
              </div>

              <ImageUpload
                label="Thumbnail (Preview cho user)"
                currentImage={formData.thumbnail || ''}
                onUploadSuccess={(url) => handleChange('thumbnail', url)}
              />
            </div>

            {/* SECTION 2: Features */}
            <div className="form-section">
              <h2>✨ Features</h2>
              <p className="help-text">Các tính năng nổi bật của template</p>
              
              <div className="features-input">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder="VD: Responsive Design, SEO Optimized..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                />
                <button type="button" onClick={handleAddFeature} className="btn-add">
                  Thêm
                </button>
              </div>

              <div className="features-list">
                {formData.features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <span>{feature}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="btn-remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3: Config Schema - QUAN TRỌNG */}
            <div className="form-section">
              <h2>⚙️ Config Schema (Dynamic Fields)</h2>
              <p className="help-text">
                Định nghĩa các trường user sẽ nhập khi tạo website. 
                Ví dụ: title, backgroundColor, logo, etc.
                {editingFieldKey && (
                  <span style={{ color: '#f59e0b', fontWeight: 'bold', marginLeft: '10px' }}>
                    ✏️ Đang chỉnh sửa: {editingFieldKey}
                  </span>
                )}
              </p>

              {/* Form thêm field mới */}
              <div className="config-field-form">
                <div className="form-row">
                  <div className="form-col">
                    <label>Key (variable name) *</label>
                    <input
                      type="text"
                      value={newField.key}
                      onChange={(e) => setNewField({...newField, key: e.target.value})}
                      placeholder="VD: heroTitle, logoUrl, mainColor"
                    />
                    <small>Tên biến (không dấu, không space)</small>
                  </div>

                  <div className="form-col">
                    <label>Type *</label>
                    <select
                      value={newField.type}
                      onChange={(e) => setNewField({...newField, type: e.target.value})}
                    >
                      <option value="text">Text</option>
                      <option value="textarea">Textarea</option>
                      <option value="color">Color Picker</option>
                      <option value="image">Image Upload</option>
                      <option value="number">Number</option>
                      <option value="url">URL</option>
                      <option value="email">Email</option>
                    </select>
                  </div>

                  <div className="form-col">
                    <label>Label (hiển thị) *</label>
                    <input
                      type="text"
                      value={newField.label}
                      onChange={(e) => setNewField({...newField, label: e.target.value})}
                      placeholder="VD: Tiêu đề chính, Logo, Màu nền"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-col">
                    <label>Default Value</label>
                    <input
                      type="text"
                      value={newField.defaultValue}
                      onChange={(e) => setNewField({...newField, defaultValue: e.target.value})}
                      placeholder="Giá trị mặc định"
                    />
                  </div>

                  <div className="form-col">
                    <label>
                      <input
                        type="checkbox"
                        checked={newField.required}
                        onChange={(e) => setNewField({...newField, required: e.target.checked})}
                      />
                      {' '}Bắt buộc nhập
                    </label>
                  </div>

                  <div className="form-col">
                    <button 
                      type="button" 
                      onClick={handleAddConfigField} 
                      className="btn-add-field"
                    >
                      <Plus size={16} /> {editingFieldKey ? 'Cập nhật Field' : 'Thêm Field'}
                    </button>
                    {editingFieldKey && (
                      <button 
                        type="button" 
                        onClick={handleCancelEdit}
                        className="btn-cancel-edit"
                      >
                        Hủy
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Danh sách fields đã thêm */}
              <div className="config-fields-list">
                <h3>Fields đã định nghĩa:</h3>
                {Object.keys(formData.configSchema).length === 0 ? (
                  <p className="empty-message">Chưa có field nào. Thêm field ở trên.</p>
                ) : (
                  <table className="fields-table">
                    <thead>
                      <tr>
                        <th>Key</th>
                        <th>Type</th>
                        <th>Label</th>
                        <th>Default</th>
                        <th>Required</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(formData.configSchema).map(([key, field]) => (
                        <tr key={key} className={editingFieldKey === key ? 'editing-row' : ''}>
                          <td><code>{key}</code></td>
                          <td><span className="type-badge">{field.type}</span></td>
                          <td>{field.label}</td>
                          <td>{field.defaultValue || '-'}</td>
                          <td>{field.required ? '✅' : '-'}</td>
                          <td>
                            <div className="action-btns">
                              <button
                                type="button"
                                onClick={() => handleEditConfigField(key)}
                                className="btn-icon-small btn-edit"
                                title="Chỉnh sửa"
                              >
                                ✏️
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveConfigField(key)}
                                className="btn-icon-small btn-danger"
                                title="Xóa"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* SECTION 4: HTML Template */}
            <div className="form-section">
              <h2>📄 HTML Template *</h2>
              <p className="help-text">
                Viết HTML template với placeholders. Dùng <code>{'{{key}}'}</code> để chèn giá trị động.
                <br />
                VD: <code>{'<h1>{{heroTitle}}</h1>'}</code>, <code>{'<div style="background: {{mainColor}}>"'}</code>
              </p>
              
              <textarea
                value={formData.htmlTemplate}
                onChange={(e) => handleChange('htmlTemplate', e.target.value)}
                placeholder={`<!DOCTYPE html>
<html>
<head>
  <title>{{title}}</title>
  <style>{{css}}</style>
</head>
<body>
  <h1 style="color: {{mainColor}}">{{heroTitle}}</h1>
  <p>{{description}}</p>
</body>
</html>`}
                rows="15"
                className="code-textarea"
                required
              />
            </div>

            {/* SECTION 5: CSS Template */}
            <div className="form-section">
              <h2>🎨 CSS Template (Optional)</h2>
              <p className="help-text">
                CSS sẽ được inject vào HTML. Có thể dùng placeholders như: <code>{'{{primaryColor}}'}</code>
              </p>
              
              <textarea
                value={formData.cssTemplate}
                onChange={(e) => handleChange('cssTemplate', e.target.value)}
                placeholder={`body {
  font-family: Arial, sans-serif;
  background: {{backgroundColor}};
  color: {{textColor}};
}

.header {
  background: {{primaryColor}};
}`}
                rows="10"
                className="code-textarea"
              />
            </div>

            {/* SUBMIT BUTTONS */}
            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="btn-cancel"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-save"
              >
                <Save size={18} />
                {loading ? 'Đang lưu...' : isEditMode ? 'Cập nhật' : 'Tạo Template'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateTemplate;