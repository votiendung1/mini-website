const express = require('express');
const router = express.Router();
const adminTemplateController = require('../controllers/adminTemplateController');
const { authenticateUser, requireAdmin } = require('../middleware/authMiddleware');

// Tất cả routes dưới đây yêu cầu admin
router.use(authenticateUser);
router.use(requireAdmin);

// Template Management
router.get('/templates', adminTemplateController.getAllTemplatesAdmin);
router.post('/templates', adminTemplateController.createTemplate);
router.put('/templates/:templateId', adminTemplateController.updateTemplate);
router.delete('/templates/:templateId', adminTemplateController.deleteTemplate);
router.patch('/templates/:templateId/toggle', adminTemplateController.toggleTemplateStatus);

module.exports = router;