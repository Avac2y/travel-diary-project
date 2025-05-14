import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchRegister } from '../../store/modules/user';
import logo from '../../assets/travel-icon.png';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            await dispatch(fetchRegister({
                username: values.username,
                password: values.password
            })).unwrap();
            message.success('注册成功！');
            navigate('/login');
        } catch (error) {
            message.error(error.response?.data?.message || '注册失败，请重试');
        }
    };

    return (
        <div className="register-page">
            <div className="app-icon">
                <img src={logo} alt="Travel Diary" className="logo" />
            </div>
            <div className="register-wrapper">
                <Card className="register-card">
                    <div className="register-header">
                        <h2>注册账号</h2>
                        <p>加入旅行日记，开始记录你的旅程</p>
                    </div>
                    <Form
                        form={form}
                        name="register"
                        onFinish={onFinish}
                        autoComplete="off"
                        size="large"
                        validateTrigger={"onBlur"}
                    >
                        <Form.Item
                            name="username"
                            rules={[
                                { required: true, message: '请输入用户名！' },
                                { min: 3, message: '用户名至少3个字符！' }
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="用户名"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                { required: true, message: '请输入密码！' },
                                { min: 6, message: '密码至少6个字符！' }
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="密码"
                            />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: '请确认密码！' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('两次输入的密码不一致！'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="确认密码"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                注册
                            </Button>
                        </Form.Item>

                        <div className="register-footer">
                            已有账号？ <a onClick={() => navigate('/login')}>立即登录</a>
                        </div>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default Register; 