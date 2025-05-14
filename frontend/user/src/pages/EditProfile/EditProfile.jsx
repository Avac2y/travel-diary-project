import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Upload, message, Spin } from 'antd';
import { LeftOutlined, UserOutlined, LockOutlined, UploadOutlined } from '@ant-design/icons';
import { request } from '../../services/request';
import './EditProfile.css';

const EditProfile = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');

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
        
        // 设置头像URL
        if (response.data.avatar) {
          setAvatarUrl(response.data.avatar);
        }
        
        // 设置表单初始值
        form.setFieldsValue({
          username: response.data.username,
        });
        
        setLoading(false);
      } catch (error) {
        console.error('获取用户信息失败:', error);
        message.error('获取用户信息失败');
        navigate('/personal-info');
      }
    };

    fetchUserInfo();
  }, [navigate, form]);

  // 处理返回
  const handleGoBack = () => {
    navigate('/personal-info');
  };

  // 处理头像预览
  const handleAvatarChange = (info) => {
    if (info.file.status === 'done') {
      // 获取上传的文件
      setAvatar(info.file.originFileObj);
      // 生成预览URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarUrl(e.target.result);
      };
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  // 处理表单提交
  const handleSubmit = async (values) => {
    const token = localStorage.getItem('token');
    if (!token || !userInfo) {
      message.error('请先登录');
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      // 准备表单数据
      const formData = new FormData();
      
      // 添加用户名
      if (values.username && values.username !== userInfo.username) {
        formData.append('username', values.username);
      }
      
      // 添加密码（如果有）
      if (values.password && values.confirmPassword && values.password === values.confirmPassword) {
        formData.append('password', values.password);
      }
      
      // 添加头像（如果有）
      if (avatar) {
        formData.append('avatar', avatar);
      }

      // 发送更新请求
      const response = await request.put(`/api/users/${userInfo._id}`, formData, {
        baseURL: 'http://localhost:3001',
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      message.success('用户信息更新成功');
      
      // 如果修改了用户名或密码，可能需要重新登录
      if (values.password || (values.username && values.username !== userInfo.username)) {
        message.info('请使用新的凭据重新登录');
        localStorage.removeItem('token');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        // 返回个人信息页面
        setTimeout(() => {
          navigate('/personal-info');
        }, 1000);
      }
    } catch (error) {
      console.error('更新用户信息失败:', error);
      message.error('更新用户信息失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-header">
        <Button 
          type="text" 
          icon={<LeftOutlined />} 
          onClick={handleGoBack}
          className="back-button"
        />
        <h1>编辑个人资料</h1>
      </div>

      <div className="edit-profile-content">
        <div className="avatar-upload-section">
          <div className="current-avatar">
            <img src={avatarUrl || 'https://via.placeholder.com/100'} alt="用户头像" />
          </div>
          <Upload
            name="avatar"
            showUploadList={false}
            customRequest={({ file, onSuccess }) => {
              setTimeout(() => {
                onSuccess("ok");
              }, 0);
            }}
            onChange={handleAvatarChange}
          >
            <Button icon={<UploadOutlined />}>更换头像</Button>
          </Upload>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="edit-profile-form"
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>

          <Form.Item
            name="password"
            label="新密码"
            rules={[
              { min: 6, message: '密码至少6个字符' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="留空则不修改" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            dependencies={['password']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="确认新密码" />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block
              loading={submitting}
              className="submit-button"
            >
              保存修改
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default EditProfile; 