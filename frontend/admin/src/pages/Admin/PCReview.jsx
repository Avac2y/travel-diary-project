import React, { useEffect, useState } from 'react';
import request from '../../services/request';
import ReviewCard from './ReviewCard';
import RejectModal from './RejectModal';
import './review.css';
import { Container, Row, Col, Button, Form, Image, InputGroup } from 'react-bootstrap';
import logo from './logo.png';

function PCReview() {
  const [posts, setPosts] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const role = localStorage.getItem('role');


useEffect(() => {
  request.get('/posts').then(posts => {
    setPosts(posts); //  后端返回数组
  });
}, []);
      
   const fetchPosts = () => {
      request.get('/posts').then(posts => {
      setPosts(Array.isArray(posts) ? posts : []);
  })
    .catch(err => {
      console.error('加载失败', err);
      setPosts([]); // 防止加载失败后依然是 undefined
    });
  };

  const handleApprove = async (id) => {
    await request.put(`/posts/${id}`, { status: 'approved' });
    fetchPosts();
  };

  const handleReject = (post) => {
    setSelectedPost(post);
    setShowRejectModal(true);
  };

  const confirmReject = async (id, reason) => {
    await request.put(`/posts/${id}`, { status: 'rejected', rejectReason: reason });
    setShowRejectModal(false);
    fetchPosts();
  };

  const handleToggleDelete = async (id, isCurrentlyDeleted) => {
    await request.put(`/posts/${id}`, { isDeleted: !isCurrentlyDeleted });
    fetchPosts();
  };

  const statusTextMap = {
    all: '全部',
    approved: '已通过',
    rejected: '未通过',
    pending: '待审核'
  };

  const filtered = Array.isArray(posts)
  ? posts.filter(post =>
      (statusFilter === 'all' || post.status === statusFilter) &&
      (post.title?.includes(searchKeyword) || post.author?.id?.includes(searchKeyword))
    )
  : [];

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Image src={logo} alt="logo" style={{ height: 180,marginBottom: -20}} />
        <h2 style={{ marginBottom: -20}}>旅游日记审核后台</h2>
      </div>
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="搜索标题或用户ID"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <Button variant="primary" onClick={() => fetchPosts()}>搜索</Button>
      </InputGroup>
      <div className="mb-3">
        {Object.keys(statusTextMap).map(st => (
          <Button
            key={st}
            variant={statusFilter === st ? 'primary' : 'outline-primary'}
            className="me-2"
            onClick={() => setStatusFilter(st)}
          >
            {statusTextMap[st]}
          </Button>
        ))}
      </div>
      <Row>
        {filtered.map(post => (
          <Col md={12} key={post._id} className="mb-4">
            <ReviewCard
              post={post}
              role={role}
              onApprove={handleApprove}
              onReject={handleReject}
              onToggleDelete={handleToggleDelete}
            />
          </Col>
        ))}
      </Row>
      <RejectModal
        show={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={confirmReject}
        post={selectedPost}
      />
    </Container>
  );
}

export default PCReview;
