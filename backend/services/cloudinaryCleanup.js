const cloudinary = require('../config/cloudinary');

/**
 * Trích xuất public_id từ Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string|null} - Public ID hoặc null
 */
function extractPublicIdFromUrl(url) {
  if (!url || typeof url !== 'string') return null;
  
  try {
    // URL format: https://res.cloudinary.com/[cloud_name]/image/upload/v[version]/[folder]/[public_id].[format]
    const matches = url.match(/\/v\d+\/(.+)\.\w+$/);
    if (matches && matches[1]) {
      return matches[1]; // Returns: folder/public_id
    }
    return null;
  } catch (error) {
    console.error('Error extracting public_id:', error);
    return null;
  }
}

/**
 * Xóa ảnh từ Cloudinary
 * @param {string} imageUrl - URL ảnh Cloudinary
 * @returns {Promise<boolean>} - true nếu xóa thành công
 */
async function deleteImageFromCloudinary(imageUrl) {
  if (!imageUrl) return false;
  
  try {
    const publicId = extractPublicIdFromUrl(imageUrl);
    
    if (!publicId) {
      console.log('⚠️ Cannot extract public_id from:', imageUrl);
      return false;
    }
    
    console.log('🗑️ Deleting from Cloudinary:', publicId);
    
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      console.log('✅ Deleted successfully:', publicId);
      return true;
    } else {
      console.log('⚠️ Delete failed:', result);
      return false;
    }
  } catch (error) {
    console.error('❌ Error deleting from Cloudinary:', error);
    return false;
  }
}

/**
 * Xóa nhiều ảnh từ Cloudinary
 * @param {Array<string>} imageUrls - Mảng URLs
 * @returns {Promise<Object>} - Kết quả xóa
 */
async function deleteMultipleImages(imageUrls) {
  if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
    return { deleted: 0, failed: 0 };
  }
  
  const results = await Promise.allSettled(
    imageUrls.map(url => deleteImageFromCloudinary(url))
  );
  
  const deleted = results.filter(r => r.status === 'fulfilled' && r.value === true).length;
  const failed = results.length - deleted;
  
  return { deleted, failed, total: results.length };
}

/**
 * Tìm tất cả URLs ảnh trong object
 * @param {Object} obj - Object chứa data
 * @returns {Array<string>} - Mảng URLs ảnh Cloudinary
 */
function findCloudinaryUrls(obj) {
  const urls = [];
  
  function traverse(current) {
    if (!current) return;
    
    if (typeof current === 'string' && current.includes('res.cloudinary.com')) {
      urls.push(current);
    } else if (Array.isArray(current)) {
      current.forEach(item => traverse(item));
    } else if (typeof current === 'object') {
      Object.values(current).forEach(value => traverse(value));
    }
  }
  
  traverse(obj);
  return [...new Set(urls)]; // Remove duplicates
}

/**
 * Cleanup ảnh từ template khi xóa
 * @param {Object} templateData - Template data
 * @returns {Promise<Object>} - Kết quả cleanup
 */
async function cleanupTemplateImages(templateData) {
  const urls = [];
  
  // Thumbnail
  if (templateData.thumbnail) {
    urls.push(templateData.thumbnail);
  }
  
  console.log(`🧹 Cleaning up ${urls.length} images from template`);
  return await deleteMultipleImages(urls);
}

/**
 * Cleanup ảnh từ website khi xóa
 * @param {Object} websiteData - Website data
 * @returns {Promise<Object>} - Kết quả cleanup
 */
async function cleanupWebsiteImages(websiteData) {
  // Tìm tất cả URLs trong config
  const urls = findCloudinaryUrls(websiteData.config || {});
  
  console.log(`🧹 Cleaning up ${urls.length} images from website`);
  return await deleteMultipleImages(urls);
}

module.exports = {
  deleteImageFromCloudinary,
  deleteMultipleImages,
  findCloudinaryUrls,
  cleanupTemplateImages,
  cleanupWebsiteImages,
  extractPublicIdFromUrl
};