import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { message } from 'antd';
import { request } from '../../services/request';
import { 
  UserOutlined, 
  HeartOutlined, 
  StarOutlined, 
  LogoutOutlined,
  RightOutlined,
  BulbOutlined,
  BulbFilled
} from '@ant-design/icons';
import './PersonalInfo.css';

const PersonalInfo = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [userInfo, setUserInfo] = useState(null);

  // 获取用户信息
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('请先登录');
        navigate('/login');
        return;
      }

      try {
        // 从 JWT token 中解析用户 ID
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const userId = tokenData.userId;

        // 获取用户信息
        const response = await request.get(`/api/users/${userId}`, {
          baseURL: 'http://localhost:3001'
        });
        setUserInfo(response.data);
      } catch (error) {
        console.error('获取用户信息失败:', error);
        message.error('获取用户信息失败');
      }
    };

    fetchUserInfo();
  }, [navigate]);

  // 处理修改用户信息
  const handleEditUserInfo = () => {
    // 跳转到用户信息编辑页面
    navigate('/edit-profile');
  };

  // 处理查看我的喜欢
  const handleViewLikes = () => {
    navigate('/my-likes');
  };

  // 处理查看我的收藏
  const handleViewFavorites = () => {
    // 这里可以添加跳转到用户收藏列表页面的逻辑
    console.log('查看我的收藏');
  };

  // 处理切换深色模式
  const handleToggleDarkMode = () => {
    toggleDarkMode();
  };

  // 处理退出登录
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="personal-info-container">
      <div className="personal-info-header">
        <h1>设置</h1>
      </div>

      <div className="personal-info-content">
        {userInfo && (
          <div className="user-profile-card">
            <div className="user-avatar">
              <img 
                src={userInfo.avatar || 'https://via.placeholder.com/100'} 
                alt="用户头像" 
              />
            </div>
            <div className="user-details">
              <h2>{userInfo.username}</h2>
            </div>
          </div>
        )}

        <div className="info-section">
          <div className="info-item" onClick={handleEditUserInfo}>
            <div className="item-left">
              <UserOutlined className="item-icon" />
              <span className="item-text">账号与安全</span>
            </div>
            <RightOutlined className="item-arrow" />
          </div>

          <div className="info-item" onClick={handleViewLikes}>
            <div className="item-left">
              <HeartOutlined className="item-icon" />
              <span className="item-text">我的喜欢</span>
            </div>
            <RightOutlined className="item-arrow" />
          </div>

          <div className="info-item" onClick={handleViewFavorites}>
            <div className="item-left">
              <StarOutlined className="item-icon" />
              <span className="item-text">我的收藏</span>
            </div>
            <RightOutlined className="item-arrow" />
          </div>

          <div className="info-item">
            <div className="item-left">
              {darkMode ? (
                <BulbFilled className="item-icon" />
              ) : (
                <BulbOutlined className="item-icon" />
              )}
              <span className="item-text">深色模式</span>
            </div>
            <div className="toggle-switch">
              <input 
                type="checkbox" 
                id="darkModeToggle" 
                checked={darkMode} 
                onChange={handleToggleDarkMode} 
              />
              <label htmlFor="darkModeToggle"></label>
            </div>
          </div>
        </div>

        <div className="info-section">
          <div className="info-item logout-button" onClick={handleLogout}>
            <div className="item-left">
              <LogoutOutlined className="item-icon" />
              <span className="item-text">退出登录</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo; 