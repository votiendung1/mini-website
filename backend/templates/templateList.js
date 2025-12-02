// Danh sách template có sẵn
const templates = [
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Mẫu website giới thiệu bản thân, dự án cá nhân',
    thumbnail: '/assets/templates/portfolio-thumb.png',
    category: 'personal',
    features: ['Hero Section', 'About', 'Projects Gallery', 'Contact Form']
  },
  {
    id: 'landing-page',
    name: 'Landing Page',
    description: 'Trang đích cho sản phẩm, dịch vụ',
    thumbnail: '/assets/templates/landing-thumb.png',
    category: 'business',
    features: ['Hero Banner', 'Features', 'Pricing', 'CTA Button']
  },
  {
    id: 'blog',
    name: 'Blog Cá Nhân',
    description: 'Blog đơn giản, dễ quản lý bài viết',
    thumbnail: '/assets/templates/blog-thumb.png',
    category: 'content',
    features: ['Post List', 'Single Post', 'Categories', 'Search']
  },
  {
    id: 'business-card',
    name: 'Business Card',
    description: 'Danh thiếp online chuyên nghiệp',
    thumbnail: '/assets/templates/card-thumb.png',
    category: 'personal',
    features: ['Profile Info', 'Social Links', 'Contact', 'QR Code']
  }
];

module.exports = templates;