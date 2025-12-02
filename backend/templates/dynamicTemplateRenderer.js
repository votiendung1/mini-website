const { db } = require('../config/firebase');

/**
 * Render dynamic template từ HTML template string và config data
 * @param {string} templateId - ID của template
 * @param {object} websiteData - Data từ user (title, description, config)
 * @returns {string} - HTML đã render
 */
async function renderDynamicTemplate(templateId, websiteData) {
  try {
    // Lấy template từ Firestore
    const templateDoc = await db.collection('templates').doc(templateId).get();
    
    if (!templateDoc.exists) {
      throw new Error(`Template ${templateId} not found`);
    }

    const template = templateDoc.data();
    
    // Nếu template có htmlTemplate tự định nghĩa, dùng nó
    if (template.htmlTemplate) {
      return renderCustomTemplate(template, websiteData);
    }
    
    // Nếu không có, dùng fallback template
    return renderFallbackTemplate(websiteData);
    
  } catch (error) {
    console.error('Error rendering dynamic template:', error);
    throw error;
  }
}

/**
 * Render template từ htmlTemplate string với placeholders
 */
function renderCustomTemplate(template, websiteData) {
  let html = template.htmlTemplate;
  let css = template.cssTemplate || '';
  
  const { title, description, config } = websiteData;
  
  // Tạo data object để replace placeholders
  const data = {
    title,
    description,
    ...config // Merge tất cả config vào data
  };
  
  // Replace CSS placeholders trước
  Object.entries(data).forEach(([key, value]) => {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    css = css.replace(placeholder, value || '');
  });
  
  // Inject CSS vào HTML nếu có {{css}} placeholder
  html = html.replace('{{css}}', css);
  
  // Replace HTML placeholders
  Object.entries(data).forEach(([key, value]) => {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    
    // Handle different value types
    if (value === null || value === undefined) {
      html = html.replace(placeholder, '');
    } else if (typeof value === 'object') {
      html = html.replace(placeholder, JSON.stringify(value));
    } else {
      html = html.replace(placeholder, escapeHtml(String(value)));
    }
  });
  
  // Clean up any remaining placeholders
  html = html.replace(/{{.*?}}/g, '');
  
  return html;
}

/**
 * Fallback template khi không có htmlTemplate
 */
function renderFallbackTemplate(websiteData) {
  const { title, description, config } = websiteData;
  
  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: ${config.backgroundColor || '#f5f7fa'};
      color: ${config.textColor || '#333'};
      padding: 40px 20px;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      max-width: 800px;
      background: white;
      padding: 60px;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      text-align: center;
    }
    h1 {
      color: ${config.primaryColor || '#667eea'};
      font-size: 3rem;
      margin-bottom: 20px;
    }
    p {
      font-size: 1.2rem;
      line-height: 1.8;
      color: #666;
    }
    ${config.logoUrl ? `
      .logo {
        max-width: 150px;
        margin-bottom: 30px;
      }
    ` : ''}
  </style>
</head>
<body>
  <div class="container">
    ${config.logoUrl ? `<img src="${escapeHtml(config.logoUrl)}" alt="Logo" class="logo">` : ''}
    <h1>${escapeHtml(config.heroTitle || title)}</h1>
    <p>${escapeHtml(config.heroDescription || description)}</p>
  </div>
</body>
</html>`;
}

/**
 * Escape HTML để tránh XSS
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

module.exports = {
  renderDynamicTemplate,
  renderCustomTemplate,
  renderFallbackTemplate
};