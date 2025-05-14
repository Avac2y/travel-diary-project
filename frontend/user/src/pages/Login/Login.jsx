import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDispatch } from 'react-redux';
import { fetchLogin } from '../../store/modules/user';
import logo from '../../assets/travel-icon.png';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { login } = useAuth();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const res = await dispatch(fetchLogin(values));
      if (res && res.token) {
        login(); // 更新认证状态
        message.success('登录成功！');
        // 使用 setTimeout 确保状态更新后再跳转
        setTimeout(() => {
          navigate('/home', { replace: true });
        }, 100);
      } else {
        message.error('登录失败：返回数据格式不正确');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error(error.response?.data?.message || '登录失败，请重试');
    }
  };

  return (
    <div className="login-page">
      <div className="app-icon">
        <img src={logo} alt="Travel Diary" className="logo" />
      </div>
      <div className="login-wrapper">
        <Card className="login-card">
          <div className="login-header">
            <h2>旅行日记</h2>
            <p>记录你的每一次旅行</p>
          </div>
          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
            validateTrigger={"onBlur"}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名！' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="用户名"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码！' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                登录
              </Button>
            </Form.Item>

            <div className="login-footer">
              还没有账号？ <a onClick={() => navigate('/register')}>立即注册</a>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
