// Script để seed templates ban đầu vào Firestore
// Chạy: node scripts/seedTemplates.js

const { db } = require('../config/firebase');

const initialTemplates = [
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Mẫu website giới thiệu bản thân, dự án cá nhân',
    category: 'personal',
    thumbnail: '',
    features: ['Hero Section', 'About', 'Projects Gallery', 'Contact Form'],
    htmlTemplate: '',
    cssTemplate: '',
    configSchema: {
      logo: { type: 'image', label: 'Logo' },
      backgroundImage: { type: 'image', label: 'Ảnh nền' },
      backgroundColor: { type: 'color', label: 'Màu nền', default: '#ffffff' },
      textColor: { type: 'color', label: 'Màu chữ', default: '#333333' },
      primaryColor: { type: 'color', label: 'Màu chủ đạo', default: '#007bff' },
      heroText: { type: 'text', label: 'Text Hero', default: 'Welcome to my portfolio' },
      aboutText: { type: 'textarea', label: 'Giới thiệu', default: 'About me section' }
    },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'landing-page',
    name: 'Landing Page',
    description: 'Trang đích cho sản phẩm, dịch vụ',
    category: 'business',
    thumbnail: '',
    features: ['Hero Banner', 'Features', 'Pricing', 'CTA Button'],
    htmlTemplate: '',
    cssTemplate: '',
    configSchema: {
      heroImage: { type: 'image', label: 'Ảnh Hero' },
      primaryColor: { type: 'color', label: 'Màu chủ đạo', default: '#ff6b6b' },
      ctaText: { type: 'text', label: 'Text CTA', default: 'Bắt đầu ngay' },
      ctaLink: { type: 'text', label: 'Link CTA', default: '#' }
    },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'blog',
    name: 'Blog Cá Nhân',
    description: 'Blog đơn giản, dễ quản lý bài viết',
    category: 'content',
    thumbnail: '',
    features: ['Post List', 'Single Post', 'Categories', 'Search'],
    htmlTemplate: '',
    cssTemplate: '',
    configSchema: {
      primaryColor: { type: 'color', label: 'Màu chủ đạo', default: '#2ecc71' }
    },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'business-card',
    name: 'Business Card',
    description: 'Danh thiếp online chuyên nghiệp',
    category: 'personal',
    thumbnail: '',
    features: ['Profile Info', 'Social Links', 'Contact', 'QR Code'],
    htmlTemplate: '',
    cssTemplate: '',
    configSchema: {
      avatar: { type: 'image', label: 'Ảnh đại diện' },
      name: { type: 'text', label: 'Tên', default: '' },
      jobTitle: { type: 'text', label: 'Chức danh', default: '' },
      phone: { type: 'text', label: 'Số điện thoại', default: '' },
      email: { type: 'email', label: 'Email', default: '' },
      address: { type: 'text', label: 'Địa chỉ', default: '' },
      website: { type: 'text', label: 'Website', default: '' }
    },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

async function seedTemplates() {
  console.log('🌱 Starting template seeding...');

  try {
    for (const template of initialTemplates) {
      console.log(`📝 Creating template: ${template.name}`);
      
      await db.collection('templates').doc(template.id).set(template);
      
      console.log(`✅ Created: ${template.name}`);
    }

    console.log('🎉 All templates seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding templates:', error);
    process.exit(1);
  }
}

seedTemplates();