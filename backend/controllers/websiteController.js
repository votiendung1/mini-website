const { db } = require('../config/firebase');
const { generateWebsiteHTML } = require('../templates/templateGenerator');
const { cleanupWebsiteImages } = require('../services/cloudinaryCleanup');

// XEM TRƯỚC website (KHÔNG lưu vào Firebase)
exports.previewWebsite = async (req, res) => {
  try {
    const { title, description, template, config } = req.body;

    console.log('👁️ Preview request:', { title, template });

    // Validate
    if (!title || !template) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields: title or template' 
      });
    }

    // Tạo data tạm để sinh HTML (không lưu database)
    const websiteData = {
      title,
      description: description || '',
      template,
      config: config || {}
    };

    // Sinh HTML preview
    const htmlContent = await generateWebsiteHTML(websiteData);

    console.log('✅ Preview generated successfully');

    res.status(200).json({
      success: true,
      previewHTML: htmlContent
    });
  } catch (error) {
    console.error('❌ Error creating preview:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// TẠO website mới (LƯU vào Firebase)
exports.createWebsite = async (req, res) => {
  try {
    const { userId, title, description, template, config } = req.body;

    console.log('💾 Creating website:', { userId, title, template });

    // Validate dữ liệu đầu vào
    if (!userId || !title || !template) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields: userId, title, or template' 
      });
    }

    // Tạo website data
    const websiteData = {
      userId,
      title,
      description: description || '',
      template,
      config: config || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublished: false
    };

    // Lưu vào Firestore
    const docRef = await db.collection('websites').add(websiteData);

    console.log('✅ Website saved with ID:', docRef.id);

    // Sinh HTML preview
    const htmlContent = await generateWebsiteHTML(websiteData);

    res.status(201).json({
      success: true,
      websiteId: docRef.id,
      previewHTML: htmlContent,
      data: websiteData
    });
  } catch (error) {
    console.error('❌ Error creating website:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// Lấy danh sách website của user (BỎ orderBy để không cần index)
exports.getUserWebsites = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log('📋 Fetching websites for user:', userId);

    const snapshot = await db
      .collection('websites')
      .where('userId', '==', userId)
      .get();

    const websites = [];
    snapshot.forEach(doc => {
      websites.push({ id: doc.id, ...doc.data() });
    });

    // Sort trong code thay vì query
    websites.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    console.log('✅ Found', websites.length, 'websites');

    res.status(200).json({ 
      success: true, 
      websites 
    });
  } catch (error) {
    console.error('❌ Error fetching websites:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// Lấy chi tiết website
exports.getWebsiteById = async (req, res) => {
  try {
    const { websiteId } = req.params;

    const doc = await db.collection('websites').doc(websiteId).get();

    if (!doc.exists) {
      return res.status(404).json({ 
        success: false,
        error: 'Website not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      website: { id: doc.id, ...doc.data() } 
    });
  } catch (error) {
    console.error('Error fetching website:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// Cập nhật website
exports.updateWebsite = async (req, res) => {
  try {
    const { websiteId } = req.params;
    const updateData = req.body;

    console.log('📝 Updating website:', websiteId);

    updateData.updatedAt = new Date().toISOString();

    await db.collection('websites').doc(websiteId).update(updateData);

    // Sinh lại HTML preview
    const doc = await db.collection('websites').doc(websiteId).get();
    const websiteData = doc.data();
    const htmlContent = await generateWebsiteHTML(websiteData);

    console.log('✅ Website updated successfully');

    res.status(200).json({ 
      success: true, 
      previewHTML: htmlContent,
      message: 'Website updated successfully' 
    });
  } catch (error) {
    console.error('❌ Error updating website:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// Xóa website
exports.deleteWebsite = async (req, res) => {
  try {
    const { websiteId } = req.params;

    console.log('🗑️ Deleting website:', websiteId);

    // Lấy website data trước khi xóa
    const websiteDoc = await db.collection('websites').doc(websiteId).get();
    
    if (!websiteDoc.exists) {
      return res.status(404).json({ 
        success: false,
        error: 'Website not found' 
      });
    }

    // Xóa ảnh từ Cloudinary
    console.log('🗑️ Deleting website images from Cloudinary...');
    const cleanupResult = await cleanupWebsiteImages(websiteDoc.data());
    console.log('✅ Cleanup result:', cleanupResult);

    // Xóa website từ Firestore
    await db.collection('websites').doc(websiteId).delete();

    console.log('✅ Website deleted successfully');

    res.status(200).json({ 
      success: true, 
      message: 'Website deleted successfully',
      imagesDeleted: cleanupResult.deleted
    });
  } catch (error) {
    console.error('❌ Error deleting website:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};