const express = require('express');
const router = express.Router();
const { getPosts, getPostById, createPost, deletePost, updatePost } = require('../controllers/postController');
const upload = require('../middleware/upload');

router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/', upload.fields([{ name: 'images' }, { name: 'video' }]), createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

module.exports = router;
