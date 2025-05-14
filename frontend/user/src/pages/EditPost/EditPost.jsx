import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Button, message, DatePicker, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import {
    createDraft,
    editDraft,
    editPost,
    publishDraft
} from '../../store/modules/diary';
import { useTheme } from '../../context/ThemeContext';
import './EditPost.css';
import dayjs from 'dayjs';

const { TextArea } = Input;

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const { posts, drafts } = useSelector(state => state.diary);
    const [isNewDraft, setIsNewDraft] = useState(id === 'new');
    const [currentItem, setCurrentItem] = useState(null);
    const [fileList, setFileList] = useState([]);
    const { darkMode } = useTheme();

    useEffect(() => {
        if (!isNewDraft) {
            // 查找当前编辑的项目
            const post = posts.find(p => p._id === id);
            const draft = drafts.find(d => d.id === id);
            const item = post || draft;

            if (item) {
                setCurrentItem(item);
                form.setFieldsValue({
                    title: item.title,
                    content: item.content,
                    date: item.date ? dayjs(item.date) : null
                });
                // 设置文件列表
                if (item.images) {
                    setFileList(item.images.map((url, index) => ({
                        uid: `-${index}`,
                        name: `image-${index}`,
                        status: 'done',
                        url: url
                    })));
                }
            } else {
                message.error('未找到要编辑的内容');
                navigate('/myposts');
            }
        }
    }, [id, posts, drafts, form, isNewDraft, navigate]);

    const handleSubmit = async (values) => {
        try {
            const formData = {
                ...values,
                date: values.date ? values.date.format('YYYY-MM-DD') : null,
                images: fileList.map(file => file.url || file.thumbUrl)
            };

            if (isNewDraft) {
                // 创建新草稿
                await dispatch(createDraft(formData));
                message.success('草稿已创建');
            } else if (currentItem) {
                if (currentItem.isDraft) {
                    // 更新草稿
                    await dispatch(editDraft(currentItem.id, formData));
                    message.success('草稿已更新');
                } else {
                    // 更新已发布的帖子
                    await dispatch(editPost(currentItem._id, formData));
                    message.success('日记已更新');
                }
            }
            navigate('/myposts');
        } catch (error) {
            message.error('保存失败');
        }
    };

    const handlePublish = async () => {
        try {
            if (currentItem && currentItem.isDraft) {
                const values = await form.validateFields();
                const formData = {
                    ...values,
                    date: values.date ? values.date.format('YYYY-MM-DD') : null,
                    images: fileList.map(file => file.url || file.thumbUrl)
                };
                await dispatch(publishDraft(currentItem.id, formData));
                message.success('日记已发布');
                navigate('/myposts');
            }
        } catch (error) {
            message.error('发布失败');
        }
    };

    const handleUpload = ({ file, fileList }) => {
        setFileList(fileList);
        if (file.status === 'done') {
            message.success(`${file.name} 上传成功`);
        } else if (file.status === 'error') {
            message.error(`${file.name} 上传失败`);
        }
    };

    return (
        <div className={`edit-post-container ${darkMode ? 'dark-mode' : ''}`}>
            <div className="edit-post-header">
                <h1>{isNewDraft ? '新建草稿' : '编辑日记'}</h1>
            </div>
            <Form
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
                className="edit-post-form"
            >
                <Form.Item
                    name="title"
                    label="标题"
                    rules={[{ required: true, message: '请输入标题' }]}
                >
                    <Input placeholder="请输入标题" />
                </Form.Item>

                <Form.Item
                    name="date"
                    label="日期"
                    rules={[{ required: true, message: '请选择日期' }]}
                >
                    <DatePicker
                        style={{ width: '100%' }}
                        placeholder="请选择日期"
                    />
                </Form.Item>

                <Form.Item
                    label="图片或视频"
                    name="images"
                >
                    <Upload
                        listType="picture"
                        fileList={fileList}
                        onChange={handleUpload}
                        beforeUpload={() => false}
                        multiple
                    >
                        <Button icon={<UploadOutlined />}>选择文件</Button>
                    </Upload>
                </Form.Item>

                <Form.Item
                    name="content"
                    label="内容"
                    rules={[{ required: true, message: '请输入内容' }]}
                >
                    <TextArea
                        rows={10}
                        placeholder="请输入内容"
                        className="edit-post-content"
                    />
                </Form.Item>

                <Form.Item className="edit-post-actions">
                    <Button onClick={() => navigate('/myposts')}>
                        取消
                    </Button>
                    {currentItem?.isDraft && (
                        <Button
                            type="primary"
                            onClick={handlePublish}
                            style={{ marginLeft: 8 }}
                        >
                            发布
                        </Button>
                    )}
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{ marginLeft: 8 }}
                        onClick={handleSubmit}
                    >
                        保存
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditPost;