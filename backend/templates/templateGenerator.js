const { renderDynamicTemplate } = require('./dynamicTemplateRenderer');

// Hàm sinh HTML từ template và config
exports.generateWebsiteHTML = async (websiteData) => {
  const { title, description, template, config } = websiteData;

  try {
    // TRY DYNAMIC TEMPLATE FIRST
    const dynamicHtml = await renderDynamicTemplate(template, websiteData);
    return dynamicHtml;
  } catch (error) {
    console.log('⚠️ Dynamic template failed, using hardcoded fallback:', error.message);
    
    // FALLBACK to hardcoded templates
    switch (template) {
      case 'portfolio':
        return generatePortfolioHTML(title, description, config);
      case 'landing-page':
        return generateLandingPageHTML(title, description, config);
      case 'blog':
        return generateBlogHTML(title, description, config);
      case 'business-card':
        return generateBusinessCardHTML(title, description, config);
      default:
        return generateDefaultHTML(title, description, config);
    }
  }
};

// ============================================
// TEMPLATE 1: PORTFOLIO
// ============================================
function generatePortfolioHTML(title, description, config) {
  const {
    logo,
    backgroundImage,
    backgroundColor = '#ffffff',
    textColor = '#333333',
    primaryColor = '#007bff',
    heroText = 'Welcome to my portfolio',
    aboutText = 'About me section',
    projects = []
  } = config;

  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: ${backgroundColor};
      color: ${textColor};
      line-height: 1.6;
      ${backgroundImage ? `
        background-image: url('${backgroundImage}');
        background-size: cover;
        background-attachment: fixed;
        background-position: center;
      ` : ''}
    }
    .container { 
      max-width: 1200px; 
      margin: 0 auto; 
      padding: 0 20px; 
    }
    
    /* Header */
    header {
      background: linear-gradient(135deg, ${primaryColor}, #0056b3);
      color: white;
      padding: 80px 0;
      text-align: center;
      ${backgroundImage ? 'backdrop-filter: blur(5px); background: linear-gradient(135deg, rgba(0, 123, 255, 0.9), rgba(0, 86, 179, 0.9));' : ''}
    }
    .logo { 
      max-width: 150px; 
      max-height: 150px;
      margin-bottom: 20px; 
      border-radius: 10px;
      object-fit: contain;
    }
    header h1 { 
      font-size: 3rem; 
      margin-bottom: 10px; 
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }
    header p { 
      font-size: 1.2rem; 
      opacity: 0.9; 
    }
    
    /* Sections */
    section { 
      padding: 60px 0; 
      background: ${backgroundImage ? 'rgba(255, 255, 255, 0.95)' : 'transparent'};
      margin: 20px 0;
      border-radius: 10px;
    }
    section h2 {
      font-size: 2.5rem;
      margin-bottom: 30px;
      text-align: center;
      color: ${primaryColor};
    }
    
    /* About */
    .about-content {
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
      font-size: 1.1rem;
      padding: 20px;
    }
    
    /* Projects */
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
      margin-top: 40px;
    }
    .project-card {
      background: #f8f9fa;
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .project-card:hover { 
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.15);
    }
    .project-card h3 {
      color: ${primaryColor};
      margin-bottom: 10px;
      font-size: 1.5rem;
    }
    
    /* Footer */
    footer {
      background: #2c3e50;
      color: white;
      text-align: center;
      padding: 30px 0;
      margin-top: 60px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      header h1 { font-size: 2rem; }
      section h2 { font-size: 2rem; }
      .projects-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <header>
    <div class="container">
      ${logo ? `<img src="${logo}" alt="Logo" class="logo">` : ''}
      <h1>${title}</h1>
      <p>${heroText}</p>
    </div>
  </header>

  <section id="about">
    <div class="container">
      <h2>Về tôi</h2>
      <div class="about-content">
        <p>${aboutText}</p>
      </div>
    </div>
  </section>

  <section id="projects">
    <div class="container">
      <h2>Dự án</h2>
      <div class="projects-grid">
        ${projects.length > 0 ? projects.map(p => `
          <div class="project-card">
            <h3>${p.name || 'Dự án'}</h3>
            <p>${p.description || 'Mô tả dự án'}</p>
          </div>
        `).join('') : `
          <div class="project-card">
            <h3>Dự án 1</h3>
            <p>Thêm dự án của bạn ở đây</p>
          </div>
          <div class="project-card">
            <h3>Dự án 2</h3>
            <p>Mô tả dự án của bạn</p>
          </div>
          <div class="project-card">
            <h3>Dự án 3</h3>
            <p>Showcase các công việc đã làm</p>
          </div>
        `}
      </div>
    </div>
  </section>

  <footer>
    <div class="container">
      <p>&copy; 2025 ${title}. Created with Mini Website Builder.</p>
    </div>
  </footer>
</body>
</html>`;
}

// ============================================
// TEMPLATE 2: LANDING PAGE
// ============================================
function generateLandingPageHTML(title, description, config) {
  const {
    heroImage,
    backgroundColor = '#ffffff',
    primaryColor = '#ff6b6b',
    ctaText = 'Bắt đầu ngay',
    ctaLink = '#',
    features = []
  } = config;

  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: ${backgroundColor};
      color: #333;
    }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    
    /* Hero Section */
    .hero {
      background: linear-gradient(135deg, ${primaryColor}, #ee5a6f);
      color: white;
      padding: 100px 0;
      text-align: center;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .hero-content {
      max-width: 800px;
    }
    .hero-image { 
      max-width: 400px; 
      width: 100%;
      margin-bottom: 30px; 
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      object-fit: cover;
    }
    .hero h1 { 
      font-size: 3.5rem; 
      margin-bottom: 20px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }
    .hero p { 
      font-size: 1.3rem; 
      margin-bottom: 30px; 
      opacity: 0.95;
      line-height: 1.8;
    }
    .cta-button {
      display: inline-block;
      background: white;
      color: ${primaryColor};
      padding: 18px 50px;
      border-radius: 50px;
      text-decoration: none;
      font-size: 1.2rem;
      font-weight: bold;
      transition: all 0.3s;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    .cta-button:hover { 
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.3);
    }
    
    /* Features Section */
    .features {
      padding: 100px 0;
      background: #f8f9fa;
    }
    .features h2 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 60px;
      color: ${primaryColor};
    }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 40px;
    }
    .feature-item {
      text-align: center;
      padding: 40px 30px;
      background: white;
      border-radius: 15px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: all 0.3s;
    }
    .feature-item:hover {
      transform: translateY(-10px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    }
    .feature-icon {
      font-size: 3.5rem;
      margin-bottom: 20px;
    }
    .feature-item h3 {
      color: ${primaryColor};
      margin-bottom: 15px;
      font-size: 1.5rem;
    }
    .feature-item p {
      color: #666;
      line-height: 1.6;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .hero h1 { font-size: 2.5rem; }
      .hero p { font-size: 1.1rem; }
      .hero-image { max-width: 300px; }
      .features h2 { font-size: 2rem; }
    }
  </style>
</head>
<body>
  <div class="hero">
    <div class="container">
      <div class="hero-content">
        ${heroImage ? `<img src="${heroImage}" alt="Hero" class="hero-image">` : ''}
        <h1>${title}</h1>
        <p>${description}</p>
        <a href="${ctaLink}" class="cta-button">${ctaText}</a>
      </div>
    </div>
  </div>

  <section class="features">
    <div class="container">
      <h2>Tính năng nổi bật</h2>
      <div class="features-grid">
        ${features.length > 0 ? features.map(f => `
          <div class="feature-item">
            <div class="feature-icon">✨</div>
            <h3>${f.title || 'Tính năng'}</h3>
            <p>${f.description || 'Mô tả tính năng'}</p>
          </div>
        `).join('') : `
          <div class="feature-item">
            <div class="feature-icon">⚡</div>
            <h3>Nhanh chóng</h3>
            <p>Tạo website trong vài phút với giao diện đơn giản</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🎨</div>
            <h3>Dễ tùy chỉnh</h3>
            <p>Thay đổi màu sắc, nội dung dễ dàng theo ý thích</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📱</div>
            <h3>Responsive</h3>
            <p>Hoạt động mượt mà trên mọi thiết bị và màn hình</p>
          </div>
        `}
      </div>
    </div>
  </section>
</body>
</html>`;
}

// ============================================
// TEMPLATE 3: BLOG
// ============================================
function generateBlogHTML(title, description, config) {
  const {
    primaryColor = '#2ecc71',
    posts = []
  } = config;

  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Georgia, 'Times New Roman', serif;
      background: #f4f4f4;
      color: #333;
      line-height: 1.8;
    }
    .container { max-width: 900px; margin: 0 auto; padding: 0 20px; }
    
    /* Header */
    header {
      background: ${primaryColor};
      color: white;
      padding: 60px 0;
      text-align: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    header h1 { 
      font-size: 3rem;
      margin-bottom: 10px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
    }
    header p { 
      font-size: 1.2rem; 
      margin-top: 10px; 
      opacity: 0.95;
    }
    
    /* Main Content */
    main { 
      padding: 60px 0;
      min-height: 60vh;
    }
    
    /* Post Styles */
    .post {
      background: white;
      padding: 40px;
      margin-bottom: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: all 0.3s;
    }
    .post:hover {
      box-shadow: 0 5px 20px rgba(0,0,0,0.15);
      transform: translateY(-2px);
    }
    .post h2 {
      color: ${primaryColor};
      margin-bottom: 15px;
      font-size: 2rem;
      line-height: 1.4;
    }
    .post-meta {
      color: #888;
      font-size: 0.95rem;
      margin-bottom: 20px;
      font-family: 'Segoe UI', Arial, sans-serif;
    }
    .post-content { 
      font-size: 1.1rem;
      color: #444;
      line-height: 1.8;
    }
    .post-content p {
      margin-bottom: 15px;
    }

    /* Footer */
    footer {
      background: #2c3e50;
      color: white;
      text-align: center;
      padding: 30px 0;
      margin-top: 40px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      header h1 { font-size: 2rem; }
      .post { padding: 30px 20px; }
      .post h2 { font-size: 1.5rem; }
    }
  </style>
</head>
<body>
  <header>
    <div class="container">
      <h1>${title}</h1>
      <p>${description}</p>
    </div>
  </header>

  <main>
    <div class="container">
      ${posts.length > 0 ? posts.map(p => `
        <article class="post">
          <h2>${p.title || 'Tiêu đề bài viết'}</h2>
          <div class="post-meta">
            📅 Đăng ngày ${p.date || new Date().toLocaleDateString('vi-VN')}
          </div>
          <div class="post-content">
            <p>${p.excerpt || p.content || 'Nội dung bài viết...'}</p>
          </div>
        </article>
      `).join('') : `
        <article class="post">
          <h2>Chào mừng đến với blog của tôi</h2>
          <div class="post-meta">📅 Đăng ngày ${new Date().toLocaleDateString('vi-VN')}</div>
          <div class="post-content">
            <p>Đây là bài viết đầu tiên trên blog của tôi. Tôi sẽ chia sẻ những suy nghĩ, kiến thức và kinh nghiệm của mình ở đây.</p>
            <p>Hãy quay lại thường xuyên để đọc những bài viết mới nhất!</p>
          </div>
        </article>
        <article class="post">
          <h2>Bắt đầu viết blog như thế nào?</h2>
          <div class="post-meta">📅 Đăng ngày ${new Date().toLocaleDateString('vi-VN')}</div>
          <div class="post-content">
            <p>Viết blog là một cách tuyệt vời để chia sẻ kiến thức và kết nối với mọi người. Bạn có thể thêm các bài viết của mình vào đây.</p>
          </div>
        </article>
      `}
    </div>
  </main>

  <footer>
    <div class="container">
      <p>&copy; 2025 ${title}. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>`;
}

// ============================================
// TEMPLATE 4: BUSINESS CARD
// ============================================
function generateBusinessCardHTML(title, description, config) {
  const {
    avatar,
    name = title,
    jobTitle = description,
    phone = '',
    email = '',
    address = '',
    website = '',
    backgroundColor = '#1a1a2e',
    textColor = '#ffffff',
    accentColor = '#0f3460'
  } = config;

  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Arial', sans-serif;
      background: ${backgroundColor};
      color: ${textColor};
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }
    .card {
      background: ${accentColor};
      max-width: 500px;
      width: 100%;
      padding: 60px 40px;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      text-align: center;
      animation: fadeIn 0.6s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .avatar-container {
      width: 150px;
      height: 150px;
      background: ${backgroundColor};
      border-radius: 50%;
      margin: 0 auto 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 4rem;
      overflow: hidden;
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    }
    .avatar-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 10px;
      color: ${textColor};
    }
    .job-title {
      font-size: 1.3rem;
      opacity: 0.85;
      margin-bottom: 35px;
      color: ${textColor};
    }
    .contact-info {
      text-align: left;
      margin-top: 30px;
    }
    .contact-item {
      padding: 15px 0;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      display: flex;
      align-items: center;
      gap: 15px;
      transition: all 0.3s;
    }
    .contact-item:hover {
      padding-left: 10px;
      background: rgba(255,255,255,0.05);
      border-radius: 5px;
    }
    .contact-item:last-child { 
      border-bottom: none; 
    }
    .contact-item .icon {
      font-size: 1.3rem;
      opacity: 0.8;
      min-width: 25px;
    }
    .contact-item .text {
      flex: 1;
    }
    .contact-item strong { 
      opacity: 0.7; 
      display: block;
      font-size: 0.85rem;
      margin-bottom: 3px;
    }
    .contact-item a {
      color: ${textColor};
      text-decoration: none;
    }
    .contact-item a:hover {
      text-decoration: underline;
    }

    /* Responsive */
    @media (max-width: 600px) {
      .card { padding: 40px 30px; }
      h1 { font-size: 2rem; }
      .avatar-container { width: 120px; height: 120px; }
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="avatar-container">
      ${avatar ? `<img src="${avatar}" alt="${name}">` : '👤'}
    </div>
    <h1>${name}</h1>
    <div class="job-title">${jobTitle}</div>
    
    <div class="contact-info">
      ${phone ? `
        <div class="contact-item">
          <span class="icon">📞</span>
          <div class="text">
            <strong>Điện thoại</strong>
            <a href="tel:${phone}">${phone}</a>
          </div>
        </div>
      ` : ''}
      
      ${email ? `
        <div class="contact-item">
          <span class="icon">📧</span>
          <div class="text">
            <strong>Email</strong>
            <a href="mailto:${email}">${email}</a>
          </div>
        </div>
      ` : ''}
      
      ${address ? `
        <div class="contact-item">
          <span class="icon">📍</span>
          <div class="text">
            <strong>Địa chỉ</strong>
            ${address}
          </div>
        </div>
      ` : ''}
      
      ${website ? `
        <div class="contact-item">
          <span class="icon">🌐</span>
          <div class="text">
            <strong>Website</strong>
            <a href="${website}" target="_blank">${website}</a>
          </div>
        </div>
      ` : ''}
    </div>
  </div>
</body>
</html>`;
}

// ============================================
// TEMPLATE MẶC ĐỊNH
// ============================================
function generateDefaultHTML(title, description, config) {
  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      animation: fadeIn 0.8s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    h1 {
      font-size: 3.5rem;
      margin-bottom: 20px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }
    p {
      font-size: 1.3rem;
      line-height: 1.8;
      opacity: 0.95;
    }

    @media (max-width: 600px) {
      h1 { font-size: 2.5rem; }
      p { font-size: 1.1rem; }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${title}</h1>
    <p>${description}</p>
  </div>
</body>
</html>`;
}