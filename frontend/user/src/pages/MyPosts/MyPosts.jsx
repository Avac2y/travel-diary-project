import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './MyPosts.css';
import {
    fetchPosts,
    createDraft,
    editDraft,
    removeDraft,
    publishDraft,
    editPost,
    removePost,
    rePublish
} from '../../store/modules/diary';
import { useTheme } from '../../context/ThemeContext';
import { Card, Button, message, Modal, Form, Input, Space, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, SendOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const MyPosts = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { posts, drafts, loading, } = useSelector(state => state.diary);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form] = Form.useForm();
    const username = useSelector(state => state.user.userInfo.username);
    const { darkMode } = useTheme();

    useEffect(() => {
        dispatch(fetchPosts(username));
    }, [dispatch]);

    const handleCreateDraft = () => {
        navigate('/edit-post/new');
    };

    const handleEdit = (item) => {
        if (item.isDraft) {
            navigate(`/edit-post/${item.id}`);
        } else {
            navigate(`/edit-post/${item._id}`);
        }

    };

    const handleDelete = async (item) => {
        try {
            if (item.isDraft) {
                await dispatch(removeDraft(item.id));
                message.success('草稿已删除');
            } else {
                await dispatch(removePost(item._id));
                message.success('日记已删除');
            }
        } catch (error) {
            message.error('删除失败');
        }
    };

    const handlePublish = async (draft) => {
        try {
            await dispatch(publishDraft(draft.id));
            message.success('日记已发布');
        } catch (error) {
            message.error('发布失败');
        }
    };
    const handleRePublish = async (item) => {
        try {
            await dispatch(rePublish(item._id, item));
            message.success('日记已重新发布');
        } catch (error) {
            message.error('发布失败');
        }
    };

    const handleSubmit = async (values) => {
        try {
            if (editingItem) {
                if (editingItem.isDraft) {
                    await dispatch(editDraft(editingItem.id, values));
                    message.success('草稿已更新');
                } else {
                    await dispatch(editPost(editingItem.id, values));
                    message.success('日记已更新');
                }
            } else {
                await dispatch(createDraft(values));
                message.success('草稿已创建');
            }
            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            message.error('操作失败');
        }
    };

    const statusColorMap = {
        pending: 'orange',
        approved: 'green',
        rejected: 'red',
    };
    const statuWordMap = {
        pending: '待审核',
        approved: '审核通过',
        rejected: '已拒绝',
    };

    const renderPostCard = (item) => (

        <Card
            key={item.id}
            className="post-card"
            title={item.title}
            extra={

                <Space>
                    {item.isDraft && (
                        <Button
                            type="primary"
                            icon={<SendOutlined />}
                            onClick={() => handlePublish(item)}
                        >
                            发布
                        </Button>
                    )}
                    {item.status === 'rejected' && (
                        <Button
                            type="primary"
                            icon={<SendOutlined />}
                            onClick={() => handleRePublish(item)}
                        >
                            重新发布
                        </Button>
                    )}
                    {(item.status === 'rejected' || item.isDraft) && ( // 只有状态为 rejected 时才显示编辑按钮
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(item)}
                        >
                            编辑
                        </Button>
                    )}
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(item)}
                    >
                        删除
                    </Button>
                </Space>
            }
        >
            <div className="post-tag">
                {item.isDraft ? (
                    <Tag color="orange">草稿</Tag>
                ) : (
                    <div>
                        <Tag color="green">已发布</Tag>
                        <Tag color={statusColorMap[item.status]}>{statuWordMap[item.status]}</Tag>
                    </div>
                )}
            </div>
            <p className="post-content">{item.content}</p>
            <div className="post-time">
                创建时间：{new Date(item.createdAt).toLocaleString()}
                {item.updatedAt && ` | 更新时间：${new Date(item.updatedAt).toLocaleString()}`}
            </div>
        </Card>
    );

    return (
        <div className={`myposts-container ${darkMode ? 'dark-mode' : ''}`}>
            <div className="myposts-header">
                <h1 className="myposts-title">我的日记</h1>
                <Button type="primary" onClick={handleCreateDraft}>
                    新建草稿
                </Button>
            </div>

            {loading && <div>加载中...</div>}

            {/* 草稿列表 */}
            {drafts && drafts.length > 0 && (
                <div className="myposts-section">
                    <h2 className="myposts-section-title">草稿箱</h2>
                    {drafts.map(renderPostCard)}
                </div>
            )}

            {/* 已发布列表 */}
            {posts && posts.length > 0 && (
                <div className="myposts-section">
                    <h2 className="myposts-section-title">已发布的日记</h2>
                    {posts
                        .filter(item => !item.isDeleted)   // 过滤掉已删除的日记
                        .map(renderPostCard)}
                </div>
            )}

            {/* 空状态 */}
            {(!drafts || drafts.length === 0) && (!posts || posts.length === 0) && (
                <div className="empty-state">
                    <p className="empty-state-text">暂无日记，点击"新建草稿"开始写作吧！</p>
                </div>
            )}

            <Modal
                title={editingItem ? '编辑' : '新建草稿'}
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                }}
                footer={null}
            >
                <Form
                    form={form}
                    onFinish={handleSubmit}
                    layout="vertical"
                >
                    <Form.Item
                        name="title"
                        label="标题"
                        rules={[{ required: true, message: '请输入标题' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="content"
                        label="内容"
                        rules={[{ required: true, message: '请输入内容' }]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button onClick={() => {
                                setIsModalVisible(false);
                                form.resetFields();
                            }}>
                                取消
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default MyPosts; 