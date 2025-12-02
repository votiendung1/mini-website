const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');

// Cấu hình multer để lưu file vào memory (không lưu vào disk)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
  },
  fileFilter: (req, file, cb) => {
    // Chỉ chấp nhận file ảnh
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh'), false);
    }
  }
});

// POST /api/upload/image - Upload ảnh lên Cloudinary
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'Không có file được upload' 
      });
    }

    // Convert buffer thành base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // Upload lên Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'mini-website-builder', // Tạo folder riêng
      resource_type: 'auto',
      transformation: [
        { quality: 'auto' }, // Auto optimize
        { fetch_format: 'auto' } // Auto format (WebP khi browser hỗ trợ)
      ]
    });

    // Trả về URL và thông tin
    res.status(200).json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height
    });

  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Upload thất bại: ' + error.message 
    });
  }
});

// DELETE /api/upload/image/:publicId - Xóa ảnh từ Cloudinary
router.delete('/image/:publicId', async (req, res) => {
  try {
    const publicId = req.params.publicId.replace(/,/g, '/'); // Convert back slashes
    
    const result = await cloudinary.uploader.destroy(publicId);
    
    res.status(200).json({ 
      success: true,
      message: 'Xóa ảnh thành công',
      result 
    });
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Xóa ảnh thất bại: ' + error.message 
    });
  }
});

module.exports = router;