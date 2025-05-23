const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 用户登录
router.post('/login', userController.login);

// 创建新用户
router.post('/register', userController.createUser);

// 获取所有用户
router.get('/', userController.getAllUsers);

// 获取单个用户
router.get('/:id', userController.getUserById);

// 更新用户信息
router.put('/:id', userController.updateUser);

// 删除用户
router.delete('/:id', userController.deleteUser);


module.exports = router; 