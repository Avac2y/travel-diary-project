import React, { useState, useEffect, useRef } from 'react';
import { processImageUrl } from '../../utils/imageUtils';
import './LazyImage.css';

/**
 * 懒加载图片组件
 * 处理图片URL路径，支持响应式加载
 */
const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  onClick, 
  fallback = "https://via.placeholder.com/300x200?text=加载中" 
}) => {
  const imgRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [error, setError] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  // 处理图片URL，支持相对路径和绝对路径
  useEffect(() => {
    // 修复可能的端口问题
    let finalUrl = '';
    
    if (src) {
      // 如果URL包含localhost:3000，替换为localhost:3001
      if (src.includes('localhost:3000')) {
        finalUrl = src.replace('localhost:3000', 'localhost:3001');
      } else {
        finalUrl = processImageUrl(src);
      }
    } else {
      finalUrl = fallback;
    }
    
    // 打印调试信息
    console.log('图片URL处理:', { 原始URL: src, 最终URL: finalUrl });
    
    setImageUrl(finalUrl);
  }, [src, fallback]);

  // 使用IntersectionObserver实现懒加载
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  // 图片加载成功处理
  const handleImageLoad = () => {
    console.log('图片加载成功:', imageUrl);
    setIsLoaded(true);
  };

  // 图片加载失败处理
  const handleImageError = () => {
    console.error('图片加载失败:', imageUrl);
    setError(true);
    setIsLoaded(true);
  };

  return (
    <div 
      ref={imgRef} 
      className={`${className || ''} lazy-image-container ${isLoaded ? 'loaded' : 'loading'}`}
      onClick={onClick}
    >
      {!isLoaded && <div className="image-placeholder"></div>}
      {isInView && (
        <img
          src={error ? fallback : imageUrl}
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ opacity: isLoaded ? 1 : 0 }}
        />
      )}
    </div>
  );
};

export default React.memo(LazyImage); 