import axios from 'axios';

// 创建 Axios 实例
const request = axios.create({
  baseURL: 'http://localhost:3001/api', //  与后端一致
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
request.interceptors.request.use(
  config => {
    return config;
  },
  error => Promise.reject(error)
);

// 响应拦截器
request.interceptors.response.use(
  response => {
    // 
    return response.data;
  },
  error => {
    console.error('请求错误：', error);
    return Promise.reject(error);
  }
);

export default request;
