const express = require('express');
const cors = require('cors');
// const mongoose = require('mongoose');
const connectDB = require('./config/db'); 

// const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const diaryRoutes=require('./routes/diaryRoutes');
const postRoutes = require('./routes/post');
const bodyParser = require('body-parser');

const app = express();
// 连接数据库
connectDB();


// 中间件
app.use('/uploads', express.static('uploads'));
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// 路由
app.use('/api/users', userRoutes);
app.use('/api/travels',diaryRoutes);
app.use('/api/posts', postRoutes);

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;

