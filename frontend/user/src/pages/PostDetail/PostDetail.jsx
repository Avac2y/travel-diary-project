import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTravelDetail } from '../../services/request';
import { Card, Avatar, Button, Carousel, Spin, Image, Typography, message, Modal, Tooltip, Divider, Drawer, Row, Col } from 'antd';
import { UserOutlined, LeftOutlined, ShareAltOutlined, QrcodeOutlined, CopyOutlined, WeiboOutlined, QqOutlined, WechatOutlined, HeartOutlined, HeartFilled, StarOutlined, StarFilled } from '@ant-design/icons';
import { processImageUrl } from '../../utils/imageUtils';
import './PostDetail.css';

const { Title, Paragraph, Text } = Typography;

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [isImagePreviewVisible, setIsImagePreviewVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await fetchTravelDetail(id);
        setDetail(data);
        setLoading(false);
      } catch (error) {
        console.error('获取游记详情失败:', error);
        message.error('获取游记详情失败，请重试');
        setLoading(false);
      }
    };

    if (id) {
      fetchDetail();
    }
    
    // 隐藏底部导航栏
    document.body.classList.add('hide-navbar');
    
    // 组件卸载时恢复导航栏
    return () => {
      document.body.classList.remove('hide-navbar');
    };
  }, [id]);

  const goBack = () => {
    navigate(-1);
  };

  const openShareModal = () => {
    setIsShareModalVisible(true);
  };

  const closeShareModal = () => {
    setIsShareModalVisible(false);
  };

  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(
      () => {
        message.success('链接已复制到剪贴板');
        closeShareModal();
      },
      () => {
        message.error('复制失败，请手动复制');
      }
    );
  };

  const shareToWechat = () => {
    message.info('请打开微信扫一扫，扫描二维码分享');
    // 实际项目中应该调用微信分享API或展示二维码
  };

  const shareToWechatMoments = () => {
    message.info('请打开微信扫一扫，扫描二维码分享到朋友圈');
    // 实际项目中应该调用微信分享API或展示二维码
  };

  const shareToQQ = () => {
    // 实际项目中应该调用QQ分享API
    message.info('分享到QQ功能待实现');
    closeShareModal();
  };

  const shareToWeibo = () => {
    // 实际项目中应该调用微博分享API
    message.info('分享到微博功能待实现');
    closeShareModal();
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setIsImagePreviewVisible(true);
  };

  const handleVideoClick = (videoUrl) => {
    setCurrentVideoUrl(videoUrl);
    setIsVideoPlaying(true);
  };

  const closeVideoPlayer = () => {
    setIsVideoPlaying(false);
    setCurrentVideoUrl('');
  };

  // 判断图片链接列表中是否包含视频
  const hasVideo = (images) => {
    if (!images || images.length === 0) return false;
    const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv'];
    return images.some(url => videoExtensions.some(ext => url.toLowerCase().includes(ext)));
  };

  // 获取视频URL
  const getVideoUrl = (images) => {
    if (!images || images.length === 0) return '';
    const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv'];
    const videoUrl = images.find(url => videoExtensions.some(ext => url.toLowerCase().includes(ext)));
    return videoUrl || '';
  };

  // 获取图片列表（不包含视频）
  const getImageUrls = (images) => {
    if (!images || images.length === 0) return [];
    const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv'];
    return images.filter(url => !videoExtensions.some(ext => url.toLowerCase().includes(ext)));
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // 这里可以添加与后端交互的逻辑，如果需要的话
    if (!isLiked) {
      message.success('点赞成功');
    } else {
      message.info('已取消点赞');
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    // 这里可以添加与后端交互的逻辑，如果需要的话
    if (!isFavorite) {
      message.success('收藏成功');
    } else {
      message.info('已取消收藏');
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      );
    }

    if (!detail) {
      return (
        <div className="error-container">
          <p>游记不存在或已被删除</p>
          <Button type="primary" onClick={goBack}>返回</Button>
        </div>
      );
    }

    const videoUrl = hasVideo(detail.images) ? getVideoUrl(detail.images) : '';
    const imageUrls = getImageUrls(detail.images).map(url => processImageUrl(url));

    return (
      <div className="travel-detail">
        <div className="travel-header">
          <Button 
            type="text" 
            icon={<LeftOutlined />} 
            onClick={goBack}
            className="back-button"
          />
          <Title level={3} className="travel-title">{detail.title}</Title>
        </div>

        <div className="author-info">
          <Avatar 
            size={40} 
            icon={<UserOutlined />} 
            src={detail.author?.avatar} 
          />
          <div className="author-text">
            <Text strong>{detail.author?.nickname || '匿名用户'}</Text>
            <Text type="secondary">
              {new Date(detail.updatedAt).toLocaleDateString()}
            </Text>
          </div>
        </div>

        <div className="media-container">
          {videoUrl && (
            <div className="video-thumbnail" onClick={() => handleVideoClick(processImageUrl(videoUrl))}>
              <div className="play-button">
                <i className="play-icon">▶</i>
              </div>
              <img 
                src={imageUrls[0] || "https://via.placeholder.com/300x200?text=视频封面"} 
                alt="视频封面" 
                className="video-cover"
              />
            </div>
          )}

          {imageUrls.length > 0 && (
            <Carousel className="image-carousel">
              {imageUrls.map((image, index) => (
                <div key={index}>
                  <div className="carousel-item">
                    <img 
                      src={image} 
                      alt={`图片${index + 1}`} 
                      onClick={() => handleImageClick(index)}
                      className="carousel-image"
                    />
                  </div>
                </div>
              ))}
            </Carousel>
          )}
        </div>

        <Divider />

        <div className="travel-content">
          <Paragraph>
            {detail.content}
          </Paragraph>
        </div>

        {/* 图片预览 */}
        {imageUrls.length > 0 && (
          <div style={{ display: 'none' }}>
            <Image.PreviewGroup
              preview={{
                visible: isImagePreviewVisible,
                onVisibleChange: (vis) => setIsImagePreviewVisible(vis),
                current: currentImageIndex,
              }}
            >
              {imageUrls.map((image, index) => (
                <Image key={index} src={image} />
              ))}
            </Image.PreviewGroup>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="post-detail-container">
      {renderContent()}

      {/* 底部操作按钮 */}
      <div className="bottom-action-buttons">
        <Row gutter={8}>
          <Col span={8}>
            <Button 
              type="text" 
              icon={isLiked ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
              onClick={handleLike}
              block
              className="action-button"
            >
              点赞
            </Button>
          </Col>
          <Col span={8}>
            <Button 
              type="text" 
              icon={isFavorite ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
              onClick={handleFavorite}
              block
              className="action-button"
            >
              收藏
            </Button>
          </Col>
          <Col span={8}>
            <Button 
              type="text" 
              icon={<ShareAltOutlined />} 
              onClick={openShareModal}
              block
              className="action-button"
            >
              分享
            </Button>
          </Col>
        </Row>
      </div>

      {/* 底部弹出分享菜单 */}
      <Drawer
        placement="bottom"
        closable={false}
        onClose={closeShareModal}
        open={isShareModalVisible}
        height={220}
        className="share-drawer"
        style={{ borderRadius: '16px 16px 0 0' }}
      >
        <div className="share-drawer-header">
          <div className="drawer-title">分享到</div>
          <Button type="text" onClick={closeShareModal} className="cancel-button">取消</Button>
        </div>
        <div className="share-options-scroll">
          <div className="share-options">
            <div className="share-item" onClick={shareToWechat}>
              <div className="share-icon-wrapper wechat">
                <WechatOutlined className="share-icon" />
              </div>
              <div className="share-text">微信好友</div>
            </div>
            <div className="share-item" onClick={shareToWechatMoments}>
              <div className="share-icon-wrapper moments">
                <div className="moments-icon">朋友圈</div>
              </div>
              <div className="share-text">朋友圈</div>
            </div>
            <div className="share-item" onClick={shareToQQ}>
              <div className="share-icon-wrapper qq">
                <QqOutlined className="share-icon" />
              </div>
              <div className="share-text">QQ好友</div>
            </div>
            <div className="share-item" onClick={shareToWeibo}>
              <div className="share-icon-wrapper weibo">
                <WeiboOutlined className="share-icon" />
              </div>
              <div className="share-text">微博</div>
            </div>
            <div className="share-item" onClick={copyLink}>
              <div className="share-icon-wrapper copy">
                <CopyOutlined className="share-icon" />
              </div>
              <div className="share-text">复制链接</div>
            </div>
            <div className="share-item">
              <div className="share-icon-wrapper qrcode">
                <QrcodeOutlined className="share-icon" />
              </div>
              <div className="share-text">二维码</div>
            </div>
          </div>
        </div>
      </Drawer>

      {/* 视频播放器 */}
      <Modal
        title="视频播放"
        open={isVideoPlaying}
        onCancel={closeVideoPlayer}
        footer={null}
        width="80%"
        className="video-modal"
      >
        <div className="video-player">
          <video
            controls
            autoPlay
            width="100%"
            className="video-element"
          >
            <source src={currentVideoUrl} type="video/mp4" />
            您的浏览器不支持视频播放
          </video>
        </div>
      </Modal>
    </div>
  );
}

export default PostDetail;