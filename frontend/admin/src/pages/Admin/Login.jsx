import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import users from './users.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Button, Card, Image } from 'react-bootstrap';
import logo from './logo.png';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    const user = users.find(u => u.username === username && u.password === password);
       if (user) {
          const roleMap = {
            admin: '管理员',
            auditor: '审核员'
          };
          alert(`登录成功，${user.username}（${roleMap[user.role] || '用户'}），欢迎来到游记后台！`);
          // 保存角色和用户名
          localStorage.setItem('role', user.role);
          localStorage.setItem('username', user.username);
          // 跳转
          navigate('/admin/review');
    } else {
      alert('用户名或密码错误');
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <Card style={{ width: '24rem' }} className="shadow p-4">
        <Card.Body>
          <div className="text-center mb-4">
            <Image src={logo} alt="logo" style={{ height: 200,marginBottom: -20}} />
            <h3 className="mt-1">旅游日记后台登录</h3>
          </div>
          <Form>
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>用户名</Form.Label>
              <Form.Control
                type="text"
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>密码</Form.Label>
              <Form.Control
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" className="w-100" onClick={handleLogin}>
              登录
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login;
