const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');

// Lấy danh sách tất cả template (cho user)
router.get('/', templateController.getAllTemplates);

// Lấy chi tiết một template
router.get('/:templateId', templateController.getTemplateById);

module.exports = router;