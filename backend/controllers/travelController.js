const Travel = require('../models/diary');

// 创建新的旅行日记
exports.createTravel = async (req, res) => {
    try {
        const travel = new Travel(req.body);
        const savedTravel = await travel.save();
        res.status(201).json(savedTravel);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 获取所有旅行日记
exports.getAllTravels = async (req, res) => {
    try {
        const travels = await Travel.find({ isDeleted: false });
        res.status(200).json(travels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 获取公开的旅行日记(审核通过的)
exports.getPublicTravels = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const skip = (page - 1) * limit;
        
        // 构建查询条件
        const query = {
            isDeleted: false,
            status: 'approved'
        };
        
        // 如果有搜索关键词，添加搜索条件
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { 'author.nickname': { $regex: search, $options: 'i' } }
            ];
        }
        
        // 查询总数
        const total = await Travel.countDocuments(query);
        
        // 查询数据
        const travels = await Travel.find(query)
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(Number(limit));
        
        res.status(200).json({
            data: travels,
            pagination: {
                total,
                current: Number(page),
                pageSize: Number(limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 根据用户ID查询所有旅行日记
exports.getTravelsByAuthorId = async (req, res) => {
    try {
        const { authorId } = req.params;
        const travels = await Travel.find({
            'author.id': authorId,
            isDeleted: false
        });
        if (travels.length === 0) {
            return res.status(404).json({ message: 'No travel diaries found for this author' });
        }
        res.status(200).json(travels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 获取单个旅行日记
exports.getTravelById = async (req, res) => {
    try {
        const travel = await Travel.findById(req.params.id);
        if (!travel || travel.isDeleted) {
            return res.status(404).json({ message: 'Travel diary not found' });
        }
        res.status(200).json(travel);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 更新旅行日记
exports.updateTravel = async (req, res) => {
    try {
        const travel = await Travel.findById(req.params.id);
        // 检查日记是否存在
        if (!travel || travel.isDeleted) {
            return res.status(404).json({ message: 'Travel diary not found' });
        }
        // 检查是否是作者
        if (travel.author.id !== req.body.author.id) {
            return res.status(403).json({ message: 'You are not authorized to update this diary' });
        }
        // 更新日记
        const updatedTravel = await Travel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedTravel);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
//重新上传
exports.rePublishTravel = async (req, res) => {
    try {
        const travel = await Travel.findById(req.params.id);
        // 检查日记是否存在
        if (!travel || travel.isDeleted) {
            return res.status(404).json({ message: 'Travel diary not found' });
        }
        // 检查是否是作者
        if (travel.author.id !== req.body.author.id) {
            return res.status(403).json({ message: 'You are not authorized to update this diary' });
        }
        // 更新日记
        const updatedTravel = await Travel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.status(200).json(updatedTravel);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 删除旅行日记（软删除）
exports.deleteTravel = async (req, res) => {
    try {
        const travel = await Travel.findById(req.body._id);

        // 检查日记是否存在
        if (!travel || travel.isDeleted) {
            return res.status(404).json({ message: 'Travel diary not found' });
        }

        // 检查是否是作者
        if (travel.author.id !== req.body.author.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this diary' });
        }

        // 软删除日记
        const deletedTravel = await Travel.findByIdAndUpdate(
            req.body._id,
            { isDeleted: true },
            { new: true }
        );

        res.status(200).json({ message: 'Travel diary deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 