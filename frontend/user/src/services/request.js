import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

const request = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});

// 请求拦截器
request.interceptors.request.use(config => {
  // 从 localStorage 获取 token
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// 响应拦截器
request.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // token 过期或无效，清除本地存储并跳转到登录页
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 获取公开帖子列表（审核通过的）
const fetchPublicPosts = async (page = 1, limit = 10, searchQuery = '') => {
  try {
    const response = await request.get('/api/travels/public', {
      params: { page, limit, search: searchQuery }
    });
    return response.data;
  } catch (error) {
    console.error('获取公开帖子列表失败:', error);
    throw error;
  }
};

// 获取单个游记详情
const fetchTravelDetail = async (id) => {
  try {
    const response = await request.get(`/api/travels/${id}`);
    return response.data;
  } catch (error) {
    console.error('获取游记详情失败:', error);
    throw error;
  }
};

export { request, fetchPublicPosts, fetchTravelDetail };