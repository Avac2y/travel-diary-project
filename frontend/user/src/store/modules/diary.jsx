// src/store.js
import { createSlice } from '@reduxjs/toolkit';
import { request, fetchPublicPosts } from '../../services/request';


// 从localStorage获取草稿
const getLocalDrafts = () => {
    const drafts = localStorage.getItem('diaryDrafts');
    return drafts ? JSON.parse(drafts) : [];
};

const diaryStore = createSlice({
    name: 'diary',
    initialState: {
        posts: [], // 已发布的帖子
        publicPosts: [], // 所有公开的帖子
        drafts: getLocalDrafts(), // 草稿
        loading: false,
        error: null,
        pagination: {
            total: 0,
            current: 1,
            pageSize: 10
        }
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setPosts: (state, action) => {
            state.posts = action.payload;
        },
        setPublicPosts: (state, action) => {
            state.publicPosts = action.payload.data;
            state.pagination = action.payload.pagination;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        // 草稿相关操作
        addDraft: (state, action) => {
            state.drafts.push(action.payload);
            // 保存到localStorage
            localStorage.setItem('diaryDrafts', JSON.stringify(state.drafts));
        },
        updateDraft: (state, action) => {
            const index = state.drafts.findIndex(draft => draft.id === action.payload.id);
            if (index !== -1) {
                state.drafts[index] = action.payload;
                // 保存到localStorage
                localStorage.setItem('diaryDrafts', JSON.stringify(state.drafts));
            }
        },
        deleteDraft: (state, action) => {
            state.drafts = state.drafts.filter(draft => draft.id !== action.payload);
            // 保存到localStorage
            localStorage.setItem('diaryDrafts', JSON.stringify(state.drafts));
        },
        // 已发布帖子相关操作
        addPost: (state, action) => {
            state.posts.push(action.payload);
        },
        updatePost: (state, action) => {
            const index = state.posts.findIndex(post => post.id === action.payload.id);
            if (index !== -1) {
                state.posts[index] = action.payload;
            }
        },
        deletePost: (state, action) => {
            state.posts = state.posts.filter(post => post.id !== action.payload);
        }
    }
});

const {
    setLoading,
    setPosts,
    setPublicPosts,
    setError,
    addDraft,
    updateDraft,
    deleteDraft,
    addPost,
    updatePost,
    deletePost
} = diaryStore.actions;

// 获取reducer函数
const diaryReducer = diaryStore.reducer;

// 封装异步代码
const fetchPosts = (authorId) => {
    return async (dispatch) => {
        try {
            dispatch(setLoading(true));
            const res = await request.get(`/api/travels/author/${authorId}`);
            dispatch(setPosts(res.data));
            dispatch(setLoading(false));
            return res.data;
        } catch (error) {
            dispatch(setError(error.message));
            dispatch(setLoading(false));
            throw error;
        }
    }
}

// 获取公开游记列表
const fetchPublicPostList = (page = 1, limit = 10, searchQuery = '') => {
    return async (dispatch) => {
        try {
            dispatch(setLoading(true));
            const res = await fetchPublicPosts(page, limit, searchQuery);
            dispatch(setPublicPosts(res));
            dispatch(setLoading(false));
            return res;
        } catch (error) {
            dispatch(setError(error.message));
            dispatch(setLoading(false));
            throw error;
        }
    }
}

// 创建草稿
const createDraft = (draftData) => {
    return async (dispatch) => {
        try {
            // 生成临时ID
            const draft = {
                ...draftData,
                id: Date.now().toString(),
                isDraft: true,
                createdAt: new Date().toISOString()
            };
            dispatch(addDraft(draft));
            return draft;
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        }
    }
}

// 更新草稿
const editDraft = (draftId, draftData) => {
    return async (dispatch) => {
        try {
            const updatedDraft = {
                ...draftData,
                id: draftId,
                isDraft: true,
                updatedAt: new Date().toISOString()
            };
            dispatch(updateDraft(updatedDraft));
            return updatedDraft;
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        }
    }
}

// 删除草稿
const removeDraft = (draftId) => {
    return async (dispatch) => {
        try {
            dispatch(deleteDraft(draftId));
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        }
    }
}

// 发布草稿
const publishDraft = (draftId) => {
    return async (dispatch, getState) => {
        try {
            // 从localStorage获取草稿
            const drafts = getLocalDrafts();
            const draft = drafts.find(d => d.id === draftId);

            if (!draft) {
                throw new Error('草稿不存在');
            }

            // 获取当前登录用户信息
            const { userInfo } = getState().user;

            const completeDraft = {
                ...draft,
                status: draft.status || 'pending', // 默认值为 'pending'
                isDeleted: draft.isDeleted || false, // 默认值为 false
                author: { nickname: '默认用户名', id: userInfo.username, avatar: '' },
                images: draft.images || [], // 默认值为空数组
                updatedAt: new Date().toISOString() // 当前时间的 ISO8601 格式
            };

            // 发送到服务器
            const res = await request.post('/api/travels/post', completeDraft);

            // 删除本地草稿
            dispatch(deleteDraft(draftId));

            // 添加到已发布列表
            dispatch(addPost(res.data));

            return res.data;
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        }
    }
}

// 编辑已发布的帖子
const editPost = (postId, postData) => {
    return async (dispatch, getState) => {
        try {
            const { userInfo } = getState().user;
            const completePostData = {
                ...postData,
                author: { nickname: '默认用户名', id: userInfo.username, avatar: '' },
            }
            const stringPostId = postId.toString();
            const res = await request.put(`/api/travels/${stringPostId}`, completePostData);
            dispatch(updatePost(res.data));
            return res.data;
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        }
    }
}
//重新上传
const rePublish = (postId, postData) => {
    return async (dispatch, getState) => {
        try {
            const { userInfo } = getState().user;
            const completePostData = {
                ...postData,
                author: { nickname: '默认用户名', id: userInfo.username, avatar: '' },
                status: 'pending',
            }
            const stringPostId = postId.toString();
            const res = await request.put(`/api/travels/republish/${stringPostId}`, completePostData);
            dispatch(updatePost(res.data));
            return res.data;
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        }
    }
}

// 删除已发布的帖子
const removePost = (postId) => {
    return async (dispatch, getState) => {
        try {
            const { userInfo } = getState().user;
            // 发送到服务器
            const res = await request.delete(`/api/travels/delete`, {
                data: {
                    _id: postId,
                    author: {
                        id: userInfo.username
                    }
                }
            });
            dispatch(deletePost(postId));
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        }
    }
}

export {
    setLoading,
    setPosts,
    setPublicPosts,
    setError,
    addDraft,
    updateDraft,
    deleteDraft,
    addPost,
    updatePost,
    deletePost,
    fetchPosts,
    fetchPublicPostList,
    createDraft,
    editDraft,
    removeDraft,
    publishDraft,
    editPost,
    removePost,
    rePublish
}

export default diaryReducer;