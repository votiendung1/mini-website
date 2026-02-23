import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Website APIs
export const websiteAPI = {
  // Xem trước (KHÔNG lưu vào database)
  preview: (data) => api.post('/websites/preview', data),
  
  // Tạo mới (CÓ lưu vào database)
  create: (data) => api.post('/websites/create', data),
  
  // Lấy danh sách websites của user
  getUserWebsites: (userId) => api.get(`/websites/user/${userId}`),
  
  // Lấy chi tiết 1 website
  getById: (websiteId) => api.get(`/websites/${websiteId}`),
  
  // Cập nhật website
  update: (websiteId, data) => api.put(`/websites/${websiteId}`, data),
  
  // Xóa website
  delete: (websiteId) => api.delete(`/websites/${websiteId}`),
};

// Template APIs
export const templateAPI = {
  getAll: () => api.get('/templates'),
  getById: (templateId) => api.get(`/templates/${templateId}`),
};

// Upload APIs
export const uploadAPI = {
  uploadImage: (formData) => api.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteImage: (publicId) => api.delete(`/upload/image/${publicId}`),
};

// Admin APIs
export const adminAPI = {
  // Templates
  getAllTemplates: (token) => api.get('/admin/templates', {
    headers: { 'Authorization': `Bearer ${token}` }
  }),
  getTemplateById: (templateId, token) => api.get(`/templates/${templateId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }),
  createTemplate: (data, token) => api.post('/admin/templates', data, {
    headers: { 'Authorization': `Bearer ${token}` }
  }),
  updateTemplate: (templateId, data, token) => api.put(`/admin/templates/${templateId}`, data, {
    headers: { 'Authorization': `Bearer ${token}` }
  }),
  deleteTemplate: (templateId, token) => api.delete(`/admin/templates/${templateId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }),
  toggleTemplateStatus: (templateId, token) => api.patch(`/admin/templates/${templateId}/toggle`, {}, {
    headers: { 'Authorization': `Bearer ${token}` }
  }),
};

export default api;