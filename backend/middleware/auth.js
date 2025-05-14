const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your-secret-key';  // 应该与userController中的密钥相同

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: '请先登录' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: '认证失败' });
    }
};

module.exports = auth; 