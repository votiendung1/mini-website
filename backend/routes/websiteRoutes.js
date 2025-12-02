const express = require('express');
const router = express.Router();
const websiteController = require('../controllers/websiteController');

// Tạo preview (KHÔNG lưu vào database)
router.post('/preview', websiteController.previewWebsite);

// Tạo website mới (LÀM LƯU vào database)
router.post('/create', websiteController.createWebsite);

// Lấy danh sách website của user
router.get('/user/:userId', websiteController.getUserWebsites);

// Lấy chi tiết website
router.get('/:websiteId', websiteController.getWebsiteById);

// Cập nhật website
router.put('/:websiteId', websiteController.updateWebsite);

// Xóa website
router.delete('/:websiteId', websiteController.deleteWebsite);

module.exports = router;