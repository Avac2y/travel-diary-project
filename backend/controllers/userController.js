const User = require('../models/user');
const jwt = require('jsonwebtoken');

// JWT密钥
const JWT_SECRET = 'your-secret-key';  // 在实际生产环境中应该使用环境变量
// 创建新用户
exports.createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        const savedUser = await user.save();

        // 生成token
        const token = jwt.sign(
            { userId: savedUser._id },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            user: {
                _id: savedUser._id,
                username: savedUser.username,
                avatar: savedUser.avatar
            },
            token
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 用户登录
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 查找用户
        const user = await User.findOne({ username });

        // 检查用户是否存在
        if (!user) {
            return res.status(401).json({ message: '用户名或密码错误' });
        }

        // 检查密码是否匹配
        if (user.password !== password) {
            return res.status(401).json({ message: '用户名或密码错误' });
        }

        // 生成token
        const token = jwt.sign(
            { userId: user._id },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // 登录成功，返回用户信息和token
        res.status(200).json({
            user: {
                _id: user._id,
                username: user.username,
                avatar: user.avatar
            },
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 获取所有用户
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // 不返回密码字段
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 获取单个用户
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 更新用户信息
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 删除用户
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 