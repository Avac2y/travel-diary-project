// const Post = require('../models/Post');
const Post = require('../models/diary');


exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find();  // 显示全部，不加 isDeleted 条件
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: '获取游记失败' });
  }
};


// 获取指定游记
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: '获取游记失败' });
  }
};

// 创建新游记
exports.createPost = async (req, res) => {
  try {
    const newPost = new Post({
      ...req.body,
      status: 'pending',
      isDeleted: false
    });
    const saved = await newPost.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: '创建失败' });
  }
};

// 更新游记通过、拒绝、逻辑删除
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: '更新失败' });
  }
};

// 真正删除未使用
exports.deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: '删除失败' });
  }
};
