const { db } = require('../config/firebase');

// Lấy tất cả template ACTIVE (cho user)
exports.getAllTemplates = async (req, res) => {
  try {
    console.log('📋 Fetching active templates...');
    
    const snapshot = await db
      .collection('templates')
      .where('isActive', '==', true)
      .get();

    const templates = [];
    snapshot.forEach(doc => {
      templates.push({ id: doc.id, ...doc.data() });
    });

    console.log(`✅ Found ${templates.length} active templates`);
    console.log('Templates:', templates.map(t => ({ id: t.id, name: t.name, isActive: t.isActive })));

    res.status(200).json({ 
      success: true, 
      templates 
    });
  } catch (error) {
    console.error('❌ Error fetching templates:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// Lấy template theo ID
exports.getTemplateById = async (req, res) => {
  try {
    const { templateId } = req.params;
    
    const doc = await db.collection('templates').doc(templateId).get();

    if (!doc.exists) {
      return res.status(404).json({ 
        success: false,
        error: 'Template not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      template: { id: doc.id, ...doc.data() }
    });
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};