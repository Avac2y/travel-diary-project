const express = require('express');
const router = express.Router();
const travelDiaryController = require('../controllers/travelController');

// 创建新的旅行日记
router.post('/post', travelDiaryController.createTravel);
// 根据用户ID查询所有旅行日记
router.get('/author/:authorId', travelDiaryController.getTravelsByAuthorId);

// 获取所有旅行日记
//router.get('/travels', travelDiaryController.getAllTravels);

// 获取公开的旅行日记(审核通过的)
router.get('/public', travelDiaryController.getPublicTravels);

// 获取单个旅行日记
router.get('/:id', travelDiaryController.getTravelById);

// 更新旅行日记
router.put('/:id', travelDiaryController.updateTravel);

// 删除旅行日记
router.delete('/delete', travelDiaryController.deleteTravel);
//重新发布日记
router.put('/republish/:id', travelDiaryController.rePublishTravel);
module.exports = router;