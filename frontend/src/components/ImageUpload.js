import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import axios from 'axios';

const ImageUpload = ({ onUploadSuccess, label = "Upload Image" }) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File quá lớn. Tối đa 5MB');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(
        'http://localhost:5000/api/upload/image',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      setImageUrl(response.data.url);
      onUploadSuccess(response.data.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload thất bại');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setImageUrl('');
    onUploadSuccess('');
  };

  return (
    <div className="image-upload">
      <label>{label}</label>
      
      {imageUrl ? (
        <div className="image-preview">
          <img src={imageUrl} alt="Preview" />
          <button onClick={handleRemove} className="btn-remove">
            <X size={16} /> Xóa
          </button>
        </div>
      ) : (
        <div className="upload-area">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            id="file-input"
            style={{ display: 'none' }}
          />
          <label htmlFor="file-input" className="upload-label">
            <Upload size={32} />
            <p>{uploading ? 'Đang upload...' : 'Click để chọn ảnh'}</p>
            <span>PNG, JPG, GIF (Max 5MB)</span>
          </label>
        </div>
      )}

      <style jsx>{`
        .image-upload {
          margin-bottom: 20px;
        }

        .image-upload label {
          display: block;
          margin-bottom: 8px;
          color: #555;
          font-weight: 500;
        }

        .upload-area {
          border: 2px dashed #ddd;
          border-radius: 8px;
          padding: 30px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.3s;
        }

        .upload-area:hover {
          border-color: #667eea;
        }

        .upload-label {
          cursor: pointer;
          display: block;
        }

        .upload-label svg {
          color: #999;
          margin-bottom: 10px;
        }

        .upload-label p {
          color: #666;
          margin-bottom: 5px;
        }

        .upload-label span {
          color: #999;
          font-size: 0.85rem;
        }

        .image-preview {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #ddd;
        }

        .image-preview img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .btn-remove {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          padding: 8px 12px;
          border-radius: 5px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          color: #f44336;
          font-weight: 600;
        }

        .btn-remove:hover {
          background: white;
        }
      `}</style>
    </div>
  );
};

export default ImageUpload;