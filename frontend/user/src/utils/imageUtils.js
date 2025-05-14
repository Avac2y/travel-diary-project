import { STATIC_URL } from '../config/apiConfig';

/**
 * 处理图片URL，将相对路径转换为绝对路径
 * @param {string} src - 图片源URL
 * @param {string} fallback - 备用图片URL
 * @returns {string} 处理后的URL
 */
export const processImageUrl = (src, fallback = "https://via.placeholder.com/300x200?text=暂无图片") => {
  if (!src) return fallback;
  
  // 如果是绝对URL，直接返回
  if (src.startsWith('http://') || src.startsWith('https://')) {
    // 修复可能错误指向3000端口的URL
    if (src.includes('localhost:3000')) {
      return src.replace('localhost:3000', 'localhost:3001');
    }
    return src;
  }
  
  // 如果是相对路径，并且以/uploads开头
  if (src.startsWith('/uploads')) {
    return `${STATIC_URL}${src}`;
  }
  
  // 如果是相对路径，并且以uploads开头
  if (src.startsWith('uploads')) {
    return `${STATIC_URL}/${src}`;
  }
  
  // 其他情况，按原样返回
  return src;
};

/**
 * 检查URL是否为有效的图片
 * @param {string} url - 要检查的URL
 * @returns {Promise<boolean>} 是否为有效图片
 */
export const isValidImage = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

/**
 * 从游记数据中获取封面图片
 * @param {Object} post - 游记数据
 * @returns {string} 封面图片URL
 */
export const getCoverImage = (post) => {
  if (!post || !post.images || post.images.length === 0) {
    return null;
  }
  
  return processImageUrl(post.images[0]);
}; 