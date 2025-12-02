const { db } = require('../config/firebase');
const { cleanupTemplateImages } = require('../services/cloudinaryCleanup');

// Lấy tất cả templates (dành cho Admin)
exports.getAllTemplatesAdmin = async (req, res) => {
  try {
    const snapshot = await db
      .collection('templates')
      .orderBy('createdAt', 'desc')
      .get();

    const templates = [];
    snapshot.forEach(doc => {
      templates.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({ 
      success: true, 
      templates 
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// Tạo template mới
exports.createTemplate = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      category, 
      thumbnail,
      features,
      htmlTemplate,
      cssTemplate,
      configSchema
    } = req.body;

    // Validate
    if (!name || !description || !category) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields' 
      });
    }

    // Tạo template ID từ name (slug)
    const templateId = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check template ID đã tồn tại chưa
    const existingDoc = await db.collection('templates').doc(templateId).get();
    if (existingDoc.exists) {
      return res.status(400).json({ 
        success: false,
        error: 'Template ID already exists' 
      });
    }

    const templateData = {
      id: templateId,
      name,
      description,
      category,
      thumbnail: thumbnail || '',
      features: features || [],
      htmlTemplate: htmlTemplate || '',
      cssTemplate: cssTemplate || '',
      configSchema: configSchema || {},
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.collection('templates').doc(templateId).set(templateData);

    res.status(201).json({
      success: true,
      template: templateData
    });
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// Cập nhật template
exports.updateTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const updateData = req.body;

    // Không cho phép update id
    delete updateData.id;
    delete updateData.createdAt;

    updateData.updatedAt = new Date().toISOString();

    await db.collection('templates').doc(templateId).update(updateData);

    const doc = await db.collection('templates').doc(templateId).get();

    res.status(200).json({
      success: true,
      template: { id: doc.id, ...doc.data() }
    });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// Xóa template
exports.deleteTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;

    // Lấy template data trước khi xóa
    const templateDoc = await db.collection('templates').doc(templateId).get();
    
    if (!templateDoc.exists) {
      return res.status(404).json({ 
        success: false,
        error: 'Template not found' 
      });
    }

    // Check xem có website nào đang dùng template này không
    const websitesSnapshot = await db
      .collection('websites')
      .where('template', '==', templateId)
      .limit(1)
      .get();

    if (!websitesSnapshot.empty) {
      return res.status(400).json({ 
        success: false,
        error: 'Cannot delete template: It is being used by websites' 
      });
    }

    // Xóa ảnh từ Cloudinary
    console.log('🗑️ Deleting template images from Cloudinary...');
    const cleanupResult = await cleanupTemplateImages(templateDoc.data());
    console.log('✅ Cleanup result:', cleanupResult);

    // Xóa template từ Firestore
    await db.collection('templates').doc(templateId).delete();

    res.status(200).json({
      success: true,
      message: 'Template deleted successfully',
      imagesDeleted: cleanupResult.deleted
    });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// Toggle active status
exports.toggleTemplateStatus = async (req, res) => {
  try {
    const { templateId } = req.params;

    const doc = await db.collection('templates').doc(templateId).get();
    
    if (!doc.exists) {
      return res.status(404).json({ 
        success: false,
        error: 'Template not found' 
      });
    }

    const currentStatus = doc.data().isActive;

    await db.collection('templates').doc(templateId).update({
      isActive: !currentStatus,
      updatedAt: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      isActive: !currentStatus
    });
  } catch (error) {
    console.error('Error toggling template status:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};