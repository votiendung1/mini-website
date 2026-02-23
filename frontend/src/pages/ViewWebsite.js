import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { websiteAPI } from '../services/api';
import { ArrowLeft, Edit } from 'lucide-react';
import './ViewWebsite.css';

const ViewWebsite = () => {
  const { websiteId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [website, setWebsite] = useState(null);
  const [previewHTML, setPreviewHTML] = useState('');

  useEffect(() => {
    fetchWebsite();
  }, [websiteId]);

  const fetchWebsite = async () => {
    try {
      setLoading(true);
      
      console.log('🔍 Fetching website:', websiteId);
      
      // Lấy thông tin website
      const response = await websiteAPI.getById(websiteId);
      console.log('✅ Website data:', response.data);
      
      const websiteData = response.data.website;
      setWebsite(websiteData);
      
      // Sinh HTML để preview
      console.log('🎨 Generating preview...');
      const previewResponse = await websiteAPI.preview({
        title: websiteData.title,
        description: websiteData.description,
        template: websiteData.template,
        config: websiteData.config
      });
      
      console.log('✅ Preview generated');
      setPreviewHTML(previewResponse.data.previewHTML);
    } catch (error) {
      console.error('❌ Error fetching website:', error);
      console.error('Error details:', error.response?.data);
      alert('Không thể tải website: ' + (error.response?.data?.error || error.message));
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="view-loading">
        <div className="spinner"></div>
        <p>Đang tải website...</p>
      </div>
    );
  }

  return (
    <div className="view-website">
      <header className="view-header">
        <div className="container">
          <button onClick={() => navigate('/dashboard')} className="btn-back">
            <ArrowLeft size={20} /> Quay lại Dashboard
          </button>
          
          <div className="header-info">
            <h1>{website?.title}</h1>
            <span className="template-badge">{website?.template}</span>
          </div>

          <div className="header-actions">
            <button 
              onClick={() => navigate(`/edit/${websiteId}`)}
              className="btn-edit"
            >
              <Edit size={18} /> Chỉnh sửa
            </button>
          </div>
        </div>
      </header>

      <main className="view-content">
        <div className="preview-container">
          {previewHTML ? (
            <iframe
              srcDoc={previewHTML}
              title="Website Preview"
              className="website-iframe"
            />
          ) : (
            <div className="no-preview">
              <p>Không thể tải preview</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ViewWebsite;