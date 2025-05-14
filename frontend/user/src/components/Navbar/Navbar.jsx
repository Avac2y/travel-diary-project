import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HomeOutlined, FileTextOutlined, UserOutlined } from '@ant-design/icons';
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();
    const { isAuthenticated } = useAuth();

    // 如果用户未认证或当前在登录/注册页，不显示导航栏
    if (!isAuthenticated || location.pathname === '/login' || location.pathname === '/register') {
        return null;
    }

    return (
        <nav className="navbar">
            <Link to="/home" className={`nav-item ${location.pathname === '/home' ? 'active' : ''}`}>
                <HomeOutlined className="nav-icon" />
                <span className="nav-text">游记列表</span>
            </Link>
            <Link to="/myposts" className={`nav-item ${location.pathname === '/myposts' ? 'active' : ''}`}>
                <FileTextOutlined className="nav-icon" />
                <span className="nav-text">我的游记</span>
            </Link>
            <Link to="/personal-info" className={`nav-item ${location.pathname.includes('/personal-info') || location.pathname.includes('/edit-profile') ? 'active' : ''}`}>
                <UserOutlined className="nav-icon" />
                <span className="nav-text">个人信息</span>
            </Link>
        </nav>
    );
};

export default Navbar; 