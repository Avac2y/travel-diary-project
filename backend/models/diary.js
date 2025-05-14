
const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  content: {
    type: String,
    required: true,
    maxlength: 5000
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectReason: {
    type: String,
    maxlength: 200
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  images: {
    type: [String],
    default: []
  },
  author: {
    nickname: {
      type: String,
      required: true,
      maxlength: 50
    },
    id: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      default: ''
    }
  }
}, {
  timestamps: true // 自动添加 createdAt 和 updatedAt
});

// 可选：你仍然可以添加 pre-save 钩子自定义更新时间（但 timestamps 已覆盖）
module.exports = mongoose.model('Diary', diarySchema, 'diary'); // 第三个参数为集合名
